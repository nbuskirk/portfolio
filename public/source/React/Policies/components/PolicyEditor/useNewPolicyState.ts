import { useReducer } from 'react';
import { useUser } from 'utils/context/UserContext';
import useMutateCreatePolicy from 'data-hooks/policies/policy/useMutateCreatePolicy';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { POLICIES } from 'constants/queryKeys';
import usePolicyNames from 'components/Policies/hooks/usePolicyNames';
import useMutateCreatePolicySchedule from 'data-hooks/policies/schedule/useMutateCreatePolicySchedule';
import { AxiosError, isAxiosError } from 'axios';
import useFetchQueryStorageConnector from 'data-hooks/policies/useFetchQueryStorageConnector';
import useMutateStorageConnectorStep from 'data-hooks/policies/useMutateStorageConnectorStep';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import useCustomization from 'data-hooks/config/useCustomization';
import { isValidEmail } from 'utils/helpers/helpers';
import {
  AllExecSpecificStateParts,
  ExecSharedState,
  MemberData,
  NewPolicyAction,
  NewPolicyState,
  PolicySchedule
} from './types';
import {
  buildExecSharedFormData,
  buildExecSpecificFormData,
  buildMemberDataStructureFromTemplate,
  buildPolicyScheduleData,
  formMembersIsValid,
  scheduleIsValid,
  splitOffTransitionMembers,
  transformExecStateIntoJobTypeData
} from './util';

const DEFAULT_STATE: NewPolicyState = {
  initialLoad: false,
  step: 0,
  noTemplateConfig: false,
  policyName: '',
  storageConnector: '',
  loading: false,
  policySchedule: {
    scheduleEnabled: false,
    frequency: 'hourly',
    hourly: {
      hours: 1,
      mins: 0
    },
    daily: {
      days: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      },
      hour: 0,
      min: 0
    }
  },
  modalTransitionState: {
    open: false,
    state: 'transition'
  }
};

const reducer = (
  state: NewPolicyState,
  action: NewPolicyAction
): NewPolicyState => {
  switch (action.type) {
    case 'loading': {
      return {
        ...state,
        loading: true
      };
    }
    case 'criticalError': {
      return { ...state, criticalError: action.criticalError, loading: false };
    }
    case 'policyError': {
      return {
        ...state,
        policyError: action.policyError,
        loading: false
      };
    }
    case 'policyName': {
      return {
        ...state,
        policyName: action.policyName,
        policyNameError: undefined
      };
    }
    case 'storageConnector': {
      return {
        ...state,
        storageConnector: action.storageConnector,
        storageConnectorError: undefined
      };
    }
    case 'step0error': {
      return {
        ...state,
        policyNameError: action.policyNameError,
        storageConnectorError: action.storageConnectorError
      };
    }
    case 'changeMemberData': {
      return {
        ...state,
        policyError: undefined,
        payload: {
          ...state.payload,
          [action.memberName]: action.memberValue
        }
      };
    }
    case 'changeExecSpecificState': {
      return {
        ...state,
        policyError: undefined,
        execSpecificState: {
          ...state.execSpecificState!,
          [action.memberName]: action.memberValue
        }
      };
    }
    case 'changeExecSharedState': {
      return {
        ...state,
        policyError: undefined,
        execSharedState: {
          ...state.execSharedState!,
          [action.memberName]: action.memberValue
        }
      };
    }
    case 'nextStep1': {
      return { ...state, step: 1, initialLoad: true };
    }
    case 'nextStep2': {
      return { ...state, step: 2 };
    }
    case 'nextStep3': {
      return {
        ...state,
        step: 3
      };
    }
    case 'policyConfig': {
      const { jsonTemplateSchema, transitionMembers } =
        splitOffTransitionMembers(action.template);
      return {
        ...state,
        template: jsonTemplateSchema,
        policyContext: action.policyContext,
        formError: action.formError,
        loading: false,
        initialLoad: false,
        payload: action.payload,
        prepedTransitionModalSchema: transitionMembers?.[0]
      };
    }
    case 'finalContext': {
      const nextState: NewPolicyState = {
        ...state,
        policyContext: action.policyContext,
        policyDescription: action.policyDescription,
        loading: false,
        initialLoad: false,
        noTemplateConfig: action.noTemplateConfig,
        step: action.noTemplateConfig ? 1 : 2
      };

      if (state.execSharedState === undefined) {
        nextState.execSharedState = buildExecSharedFormData();
      }

      if (
        state.execSpecificState === undefined ||
        state.execSpecificState.job_type !== action.jobType
      ) {
        nextState.execSpecificState = buildExecSpecificFormData(action.jobType);
      }

      return nextState;
    }
    case 'changePolicySchedule': {
      return {
        ...state,
        policySchedule: {
          ...state.policySchedule,
          [action.memberName]: action.memberValue
        }
      };
    }
    case 'changeModalTransitionState': {
      const out: NewPolicyState = {
        ...state,
        modalTransitionState: {
          state: action.state,
          open:
            action.open !== undefined
              ? action.open
              : state.modalTransitionState.open,
          errorMsg:
            action.errorMsg !== undefined
              ? action.errorMsg
              : state.modalTransitionState.errorMsg
        }
      };
      // Move the preped transition modal into staging, so it can be displayed
      if (action.stageTransitionModal) {
        out.stagedTransitionModalSchema = state.prepedTransitionModalSchema;
        out.prepedTransitionModalSchema = undefined;
      }
      return out;
    }
    case 'backStep1': {
      return {
        ...state,
        template: undefined,
        step: 0
      };
    }
    case 'backStep2': {
      return {
        ...state,
        step: 1,
        initialLoad: true
      };
    }
    case 'backStep3': {
      return {
        ...state,
        step: 2
      };
    }
    default: {
      return state;
    }
  }
};

const step0IsValid = (
  state: NewPolicyState,
  dispatch: React.Dispatch<NewPolicyAction>,
  policyNames: Array<string>,
  policyNameLengthValidation?: string,
  policyNameLengthValidationMessage?: string
): boolean => {
  let policyNameError;
  let storageConnectorError;
  if (state.policyName.trim() === '') {
    policyNameError = new Error('Please enter a unique Policy Name');
  } else if (policyNames.includes(state.policyName.toLowerCase())) {
    policyNameError = new Error(
      `Policy name '${state.policyName}' is already taken`
    );
  } else if (
    policyNameLengthValidation &&
    new RegExp(policyNameLengthValidation).test(state.policyName) === false
  ) {
    const errorMessage =
      policyNameLengthValidationMessage ||
      'Specified policy name is invalid. Please check the documentation for valid naming conventions.';
    policyNameError = new Error(errorMessage);
  }
  if (state.storageConnector === '') {
    storageConnectorError = new Error('Please select a Storage Connector');
  }
  if (policyNameError || storageConnectorError) {
    dispatch({ type: 'step0error', policyNameError, storageConnectorError });
    return false;
  }
  return true;
};

const useNewPolicyState = () => {
  const { policyNames } = usePolicyNames();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { session } = useUser();
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);
  const fetchQueryStorageConnector = useFetchQueryStorageConnector();
  const { data: customizationData } = useCustomization();
  const { mutateAsync: mutateStorageConnectorStep } =
    useMutateStorageConnectorStep({
      session
    });
  const { mutateAsync: mutateCreatePolicy } = useMutateCreatePolicy({
    session
  });
  const { mutateAsync: mutateCreatePolicySchedule } =
    useMutateCreatePolicySchedule({ session });
  const { showSuccessSnackbar, showWarningSnackbar, showAxiosErrorSnackbar, showErrorSnackbar } =
    useSnackbarContext();

  const setPolicyName = (policyName: NewPolicyState['policyName']) => {
    dispatch({ type: 'policyName', policyName });
  };

  const setStorageConnector = (
    storageConnector: NewPolicyState['storageConnector']
  ) => {
    dispatch({ type: 'storageConnector', storageConnector });
  };

  /*

    TransitionModal Behavior
  
    The transition modal comes in as a template member, but gets split off
    into its own section with its own state to manage its behavior.

    When a new template comes in, we check for a transitionmodalmember and
    split it off into a preped schema section.

    On a form submit, we check to see if a preped transition modal schema
    exists. If it exists, we move the schema to staged area and open it.

    When the form submit call returns with data, the new template is loaded,
    and the next transition member is 'prepped'

    This leaves the staged transition schema open until the user closes it.

    Upon next submit, the cycle restarts...
    1. check if there is preped schema
    2. move it to staged schema
    3. open
    4. store the next in preped.

    The whole purpose of the two schema sections is to prevent an incoming
    template from overwriting an existing modal. Its a persistance model
    
  */
  const startModalTransition = () => {
    dispatch({
      type: 'changeModalTransitionState',
      state: 'transition',
      open: true,
      stageTransitionModal: true
    });
  };
  const errorModalTransition = (error: Error) => {
    dispatch({
      type: 'changeModalTransitionState',
      state: 'error',
      errorMsg: error.message
    });
  };
  const successModalTransition = () => {
    dispatch({
      type: 'changeModalTransitionState',
      state: 'success'
    });
  };
  const closeTransitionModal = () => {
    dispatch({
      type: 'changeModalTransitionState',
      state: 'transition',
      open: false
    });
  };

  const validateIndexAs = (): boolean => {
    const execSpecificState = state.execSpecificState;
    if (!execSpecificState) {
      return false;
    }

    const { job_type } = execSpecificState;

    if ('index_as' in execSpecificState) {
      const { index_as } = execSpecificState;

      const isLocalInvalid = job_type === 'local' && (!index_as || !index_as.includes('/'));
      const isScsiInvalid = job_type === 'scsi' && (!index_as || index_as.includes('/'));

      if (isLocalInvalid || isScsiInvalid) {
        showErrorSnackbar('Invalid original data location.');
        return false;
      }
    }

    return true;
  };

  const next = async () => {
    if (
      state.step === 0 &&
      step0IsValid(
        state,
        dispatch,
        policyNames,
        customizationData?.policy_name_length_validation,
        customizationData?.policy_name_length_validation_message
      )
    ) {
      dispatch({ type: 'nextStep1' });
      try {
        let res;
        if (state.policyContext === undefined) {
          // ask for the first template
          res = await fetchQueryStorageConnector({
            display_name: state.policyName,
            session,
            storageConnector: state.storageConnector
          });
        } else {
          res = await mutateStorageConnectorStep({
            display_name: state.policyName,
            storageConnector: state.storageConnector,
            policyContext: state.policyContext,
            action: 'next'
          });
        }
        // If the template is not defined, policy is in its final form
        if (res.template === undefined) {
          // Enforce the required parts (description, policy_context, job_type)
          if (res.description === undefined) {
            throw new Error('Missing value "description"');
          }
          if (res.policy_context === undefined) {
            throw new Error('Missing value "policy_context"');
          }
          if (res.job_type === undefined) {
            throw new Error('Missing value "job_type"');
          }
          // Since no template was defined for the first iteration
          // We set the noTemplateConfig flag
          // This way we can show a notification to the user that this 'step'
          // doesn't require any input.
          dispatch({
            type: 'finalContext',
            policyContext: res.policy_context,
            policyDescription: res.description,
            jobType: res.job_type,
            noTemplateConfig: true
          });
        } else {
          // Enforce the required parts (policy_context)
          if (res.policy_context === undefined) {
            throw new Error('Missing value "policy_context"');
          }
          // Show the template and gather user input
          dispatch({
            type: 'policyConfig',
            template: res.template,
            policyContext: res.policy_context,
            formError: res.error,
            payload: buildMemberDataStructureFromTemplate(res.template)
          });
        }
      } catch (e) {
        // Show critical errors
        dispatch({ type: 'criticalError', criticalError: e as Error });
      }
    } else if (state.step === 1) {
      // If they have the noTemplateConfig from the first iteration call
      // Just advanced them to the next step.
      if (state.noTemplateConfig) {
        dispatch({ type: 'nextStep2' });
        return;
      }
      // Validate form data
      const formIsValid = formMembersIsValid(state.template!, state.payload!);
      if (!formIsValid) {
        return;
      }
      // Submit the current template payload and ask for the next one
      dispatch({ type: 'loading' });
      const hasTransitionModal =
        state.prepedTransitionModalSchema !== undefined;
      if (hasTransitionModal) {
        startModalTransition();
      }
      try {
        const res = await mutateStorageConnectorStep({
          display_name: state.policyName,
          storageConnector: state.storageConnector,
          action: 'next',
          policyContext: state.policyContext!,
          payload: {
            name: state.template!.name,
            data: state.payload!
          }
        });
        // If the template is not defined, policy_context is in its final form
        if (res.template === undefined) {
          // Enforce the required parts (description, policy_context, job_type)
          if (res.description === undefined) {
            throw new Error('Missing value "description"');
          }
          if (res.policy_context === undefined) {
            throw new Error('Missing value "policy_context"');
          }
          if (res.job_type === undefined) {
            throw new Error('Missing value "job_type"');
          }
          // Save data and advance to the next step
          dispatch({
            type: 'finalContext',
            policyContext: res.policy_context,
            policyDescription: res.description,
            noTemplateConfig: false,
            jobType: res.job_type
          });
        } else {
          // Enforce the required parts (policy_context)
          if (res.policy_context === undefined) {
            throw new Error('Missing value "policy_context"');
          }
          // Show the template and gather user input
          let skipFormError = hasTransitionModal && res.error !== undefined;
          dispatch({
            type: 'policyConfig',
            template: res.template,
            policyContext: res.policy_context,
            formError: skipFormError ? undefined : res.error,
            payload: buildMemberDataStructureFromTemplate(res.template)
          });
          if (hasTransitionModal) {
            if (res.error !== undefined) {
              errorModalTransition(res.error as Error);
            } else {
              successModalTransition();
            }
          }
        }
      } catch (e) {
        // Show critical errors
        if (hasTransitionModal) {
          errorModalTransition(e as Error);
        }
        dispatch({ type: 'criticalError', criticalError: e as Error });
      }
    } else if (state.step === 2) {
      if (!validateIndexAs()) {
        return;
      }
      // This is the placeholder for step
      // It will be the job type step
      const invalidEmail: string[] = [];
      const emailList = state.execSharedState?.List_of_email_addresses || [];
      if (emailList.length !== 0) {
        Object.values(emailList).forEach((email) => {
          if (!isValidEmail(email)) {
            invalidEmail.push(email as string);
          }
        });
        if (invalidEmail.length > 0) {
          showAxiosErrorSnackbar({
            message: `Invalid emails: "${invalidEmail.join(', ')}"`
          } as AxiosError);
          return;
        }
      }
      dispatch({
        type: 'nextStep3'
      });
    } else if (state.step === 3) {
      if (
        state.policySchedule.scheduleEnabled &&
        !scheduleIsValid(state.policySchedule)
      ) {
        showWarningSnackbar(
          'Schedule Invalid: Please select days for the daily schedule.'
        );
        return;
      }
      dispatch({ type: 'loading' });
      try {
        const jobTypeData = transformExecStateIntoJobTypeData(
          state.execSpecificState!,
          state.execSharedState!
        );
        const policyData = await mutateCreatePolicy({
          display_name: state.policyName,
          storage_connector_name: state.storageConnector,
          policy_context: state.policyContext!,
          policy_description: state.policyDescription!,
          job_type_data: jobTypeData
        });
        if (state.policySchedule.scheduleEnabled) {
          const scheduleData = buildPolicyScheduleData(state.policySchedule);
          await mutateCreatePolicySchedule({
            policyId: policyData.policy,
            scheduleData
          });
        }
        queryClient.invalidateQueries({ queryKey: [POLICIES] });
        showSuccessSnackbar(`Success: Created policy '${state.policyName}'`);
        navigate(`/dashboard/policies/${policyData.policy}`);
      } catch (e) {
        if (
          isAxiosError(e) &&
          e.response?.data.errormsg &&
          typeof e.response.data.errormsg === 'string' &&
          e.response.data.errormsg !== ''
        ) {
          const policyError = new Error(e.response.data.errormsg);
          dispatch({ type: 'policyError', policyError });
        } else {
          dispatch({ type: 'criticalError', criticalError: e as Error });
        }
      }
    }
  };

  const back = async () => {
    if (state.step === 1) {
      // If there is a template, and its the origin
      // Or there are no template steps in the selected storage connector
      // Go back to step 0
      if (
        (state.template !== undefined && state.template.origin) ||
        state.noTemplateConfig
      ) {
        dispatch({ type: 'backStep1' });
        return;
      }
      dispatch({ type: 'loading' });
      try {
        // Ask for the previous template
        // The name of the current template is passed in the payload
        const res = await mutateStorageConnectorStep({
          display_name: state.policyName,
          storageConnector: state.storageConnector,
          action: 'back',
          policyContext: state.policyContext!,
          payload: {
            name: state.template!.name
          }
        });
        // We should always get a previous template in this instance
        // Enforce the required parts (template, policy_context)
        if (res.template === undefined) {
          throw new Error('Missing value "template"');
        }
        if (res.policy_context === undefined) {
          throw new Error('Missing value "policy_context"');
        }
        // Show the template
        dispatch({
          type: 'policyConfig',
          template: res.template,
          policyContext: res.policy_context,
          formError: res.error,
          payload: buildMemberDataStructureFromTemplate(res.template)
        });
      } catch (e) {
        dispatch({ type: 'criticalError', criticalError: e as Error });
      }
    } else if (state.step === 2) {
      // Go back to the iterative configuration
      dispatch({ type: 'backStep2' });
      try {
        // Ask for the last template 'back' from the final policy_context
        // No payload is required since there is no name to go with it
        const res = await mutateStorageConnectorStep({
          display_name: state.policyName,
          storageConnector: state.storageConnector,
          action: 'back',
          policyContext: state.policyContext!
        });
        // If the template is not defined, policy is in its final form
        if (res.template === undefined) {
          // Enforce the required parts (description, policy_context, job_type)
          if (res.description === undefined) {
            throw new Error('Missing value "description"');
          }
          if (res.policy_context === undefined) {
            throw new Error('Missing value "policy_context"');
          }
          if (res.job_type === undefined) {
            throw new Error('Missing value "job_type"');
          }
          // Since no template was defined for the first iteration
          // We set the noTemplateConfig flag
          // This way we can show a notification to the user that this 'step'
          // doesn't require any input and they proceed.
          dispatch({
            type: 'finalContext',
            policyContext: res.policy_context,
            policyDescription: res.description,
            noTemplateConfig: true,
            jobType: res.job_type
          });
        } else {
          // Enforce the required parts (policy_context)
          if (res.policy_context === undefined) {
            throw new Error('Missing value "policy_context"');
          }
          // Show the template and gather user input
          dispatch({
            type: 'policyConfig',
            template: res.template,
            policyContext: res.policy_context,
            formError: res.error,
            payload: buildMemberDataStructureFromTemplate(res.template)
          });
        }
      } catch (e) {
        dispatch({ type: 'criticalError', criticalError: e as Error });
      }
    } else if (state.step === 3) {
      // From the review page, go back to the job type details page
      dispatch({ type: 'backStep3' });
    }
  };

  const changeMemberData = (
    memberName: string,
    memberValue: MemberData[string]
  ) => {
    dispatch({ type: 'changeMemberData', memberName, memberValue });
  };

  const changeExecSpecificState = (
    memberName: keyof AllExecSpecificStateParts,
    memberValue: AllExecSpecificStateParts[keyof AllExecSpecificStateParts]
  ) => {
    dispatch({ type: 'changeExecSpecificState', memberName, memberValue });
  };

  const changeExecSharedState = (
    memberName: keyof ExecSharedState,
    memberValue: ExecSharedState[keyof ExecSharedState]
  ) => dispatch({ type: 'changeExecSharedState', memberName, memberValue });

  const changePolicySchedule = (
    memberName: keyof PolicySchedule,
    memberValue: PolicySchedule[keyof PolicySchedule]
  ) => {
    dispatch({ type: 'changePolicySchedule', memberName, memberValue });
  };

  return {
    state,
    setPolicyName,
    setStorageConnector,
    changeMemberData,
    changeExecSpecificState,
    changeExecSharedState,
    changePolicySchedule,
    next,
    back,
    closeTransitionModal,
    validateIndexAs
  };
};

export default useNewPolicyState;
