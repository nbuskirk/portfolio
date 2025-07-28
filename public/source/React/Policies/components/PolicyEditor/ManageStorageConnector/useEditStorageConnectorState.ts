import { PolicyData } from 'data-hooks/policies/useQueryPolicy';
import { useReducer } from 'react';
import { useUser } from 'utils/context/UserContext';
import useMutateUpdatePolicy from 'data-hooks/policies/policy/useMutateUpdatePolicy';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { POLICIES, POLICY, POLICY_SCHEDULE } from 'constants/queryKeys';
import useMutateStorageConnectorStep from 'data-hooks/policies/useMutateStorageConnectorStep';
import { StorageConnectorStepResponse } from 'data-hooks/policies/useQueryEditStorageConnectorStep';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import {
  EditStorageConnectorAction,
  EditStorageConnectorState,
  MemberData
} from '../types';
import {
  buildEditStorageConnectorInitialState,
  buildExecSpecificFormData,
  buildMemberDataStructureFromTemplate,
  formMembersIsValid,
  splitOffTransitionMembers,
  transformExecStateIntoJobTypeData
} from '../util';

const reducer = (
  state: EditStorageConnectorState,
  action: EditStorageConnectorAction
): EditStorageConnectorState => {
  switch (action.type) {
    case 'loading': {
      return {
        ...state,
        loading: action.loading
      };
    }
    case 'criticalError': {
      return {
        ...state,
        criticalError: action.criticalError,
        loading: false
      };
    }
    case 'nextStep1': {
      return {
        ...state,
        step: 1
      };
    }
    case 'backStep1': {
      return {
        ...state,
        step: 0,
        loading: true
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
        payload: action.payload,
        prepedTransitionModalSchema: transitionMembers?.[0]
      };
    }
    case 'finalContext': {
      return {
        ...state,
        policyContext: action.policyContext,
        policyDescription: action.policyDescription,
        execSpecificState:
          state.execSpecificState.job_type !== action.jobType
            ? buildExecSpecificFormData(action.jobType)
            : state.execSpecificState,
        loading: false,
        noTemplateConfig: action.noTemplateConfig,
        step: 1
      };
    }
    case 'changeMemberData': {
      return {
        ...state,
        payload: {
          ...state.payload,
          [action.memberName]: action.memberValue
        }
      };
    }
    case 'changeModalTransitionState': {
      const out: EditStorageConnectorState = {
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
    default: {
      return state;
    }
  }
};

const useEditStorageConnectorState = (
  policyData: PolicyData,
  editStorageConnectorStepData: StorageConnectorStepResponse
) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { session } = useUser();
  const [state, dispatch] = useReducer(
    reducer,
    buildEditStorageConnectorInitialState(
      policyData,
      editStorageConnectorStepData
    )
  );

  const { mutateAsync: mutateStorageConnectorStep } =
    useMutateStorageConnectorStep({
      session
    });
  const { mutateAsync: mutateUpdatePolicy } = useMutateUpdatePolicy({
    session
  });
  const { showSuccessSnackbar } = useSnackbarContext();

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

  const next = async () => {
    if (state.step === 0) {
      // If they have the noTemplateConfig from the first iteration call
      // Just advanced them to the next step.
      if (state.noTemplateConfig) {
        dispatch({ type: 'nextStep1' });
        return;
      }
      // Validate form data
      const formIsValid = formMembersIsValid(state.template!, state.payload!);
      if (!formIsValid) {
        return;
      }
      // Submit the current template payload and ask for the next one
      const hasTransitionModal =
        state.prepedTransitionModalSchema !== undefined;
      if (hasTransitionModal) {
        startModalTransition();
      }
      dispatch({ type: 'loading', loading: true });
      try {
        const res = await mutateStorageConnectorStep({
          display_name: policyData.display_name,
          storageConnector: policyData.storage_connector_name,
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
    } else if (state.step === 1) {
      dispatch({ type: 'loading', loading: true });
      try {
        const jobTypeData = transformExecStateIntoJobTypeData(
          state.execSpecificState,
          state.execSharedState!
        );
        await mutateUpdatePolicy({
          policyId: policyData.policy,
          policyData: {
            display_name: policyData.display_name,
            storage_connector_name: policyData.storage_connector_name,
            policy_description: state.policyDescription,
            policy_context: state.policyContext,
            job_type_data: jobTypeData
          }
        });
        showSuccessSnackbar(
          `Success: Updated storage connector for ${policyData.display_name} policy`
        );
        queryClient.invalidateQueries({ queryKey: [POLICY] });
        queryClient.invalidateQueries({ queryKey: [POLICY_SCHEDULE] });
        queryClient.invalidateQueries({ queryKey: [POLICIES] });
        navigate(`/dashboard/policies/${policyData.policy}?updated=1`);
      } catch (e) {
        dispatch({ type: 'criticalError', criticalError: e as Error });
      }
    }
  };

  const back = async () => {
    if (state.step === 0) {
      dispatch({ type: 'loading', loading: true });
      try {
        // Ask for the previous template
        // The name of the current template is passed in the payload
        const res = await mutateStorageConnectorStep({
          display_name: policyData.display_name,
          storageConnector: policyData.storage_connector_name,
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
    } else if (state.step === 1) {
      // Go back to the iterative configuration
      dispatch({ type: 'backStep1' });
      try {
        // Ask for the last template 'back' from the final policy_context
        // No payload is required since there is no name to go with it
        const res = await mutateStorageConnectorStep({
          display_name: policyData.display_name,
          storageConnector: policyData.storage_connector_name,
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
    }
  };

  const changeMemberData = (
    memberName: string,
    memberValue: MemberData[string]
  ) => {
    dispatch({ type: 'changeMemberData', memberName, memberValue });
  };

  return {
    state,
    next,
    back,
    changeMemberData,
    closeTransitionModal
  } as const;
};

export default useEditStorageConnectorState;
