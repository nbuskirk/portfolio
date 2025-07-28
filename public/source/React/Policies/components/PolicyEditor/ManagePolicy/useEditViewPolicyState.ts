import { PolicyData } from 'data-hooks/policies/useQueryPolicy';
import { useReducer } from 'react';
import usePolicyNames from 'components/Policies/hooks/usePolicyNames';
import { useUser } from 'utils/context/UserContext';
import { PolicyScheduleData } from 'data-hooks/policies/schedule/schedule.types';
import useMutateCreatePolicySchedule from 'data-hooks/policies/schedule/useMutateCreatePolicySchedule';
import useMutateUpdatePolicySchedule from 'data-hooks/policies/schedule/useMutateUpdatePolicySchedule';
import useMutateDeletePolicySchedule from 'data-hooks/policies/schedule/useMutateDeletePolicySchedule';
import useMutateUpdatePolicy from 'data-hooks/policies/policy/useMutateUpdatePolicy';
import { useQueryClient } from '@tanstack/react-query';
import { POLICIES, POLICY, POLICY_SCHEDULE } from 'constants/queryKeys';
import { isAxiosError } from 'axios';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import useCustomization from 'data-hooks/config/useCustomization';

import {
  AllExecSpecificStateParts,
  EditViewAction,
  EditViewPolicyState,
  ExecSharedState,
  PolicySchedule
} from '../types';
import {
  buildEditViewPolicyInitialState,
  buildPolicyScheduleData,
  scheduleIsValid,
  transformExecStateIntoJobTypeData
} from '../util';

const reducer = (
  state: EditViewPolicyState,
  action: EditViewAction
): EditViewPolicyState => {
  switch (action.type) {
    case 'changePolicyDisplayName': {
      return {
        ...state,
        policyChanged: true,
        policyError: undefined,
        policyDisplayName: action.policyDisplayName
      };
    }
    case 'changeExecSpecificState': {
      return {
        ...state,
        policyChanged: true,
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
        policyChanged: true,
        policyError: undefined,
        execSharedState: {
          ...state.execSharedState!,
          [action.memberName]: action.memberValue
        }
      };
    }
    case 'changePolicySchedule': {
      return {
        ...state,
        scheduleChanged: true,
        policyScheduleError: undefined,
        policySchedule: {
          ...state.policySchedule,
          [action.memberName]: action.memberValue
        }
      };
    }
    case 'updateError': {
      return {
        ...state,
        loading: false,
        policyScheduleError: action.scheduleError,
        policyError: action.policyError
      };
    }
    case 'loading': {
      return {
        ...state,
        loading: action.loading
      };
    }
    case 'resetState': {
      return action.initialState;
    }
    default: {
      return state;
    }
  }
};

const useEditViewPolicyState = (
  policyData: PolicyData,
  policyScheduleData?: PolicyScheduleData
) => {
  const { session } = useUser();
  const queryClient = useQueryClient();
  const { policyNamesIsLoading } = usePolicyNames();
  const { showSuccessSnackbar, showWarningSnackbar, showErrorSnackbar } =
    useSnackbarContext();
  const { data: customizationData } = useCustomization();
  const [state, dispatch] = useReducer(
    reducer,
    buildEditViewPolicyInitialState(policyData, policyScheduleData)
  );

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

  const updatePolicy = useMutateUpdatePolicy({ session });

  const createPolicySchedule = useMutateCreatePolicySchedule({ session });
  const updatePolicySchedule = useMutateUpdatePolicySchedule({ session });
  const deletePolicySchedule = useMutateDeletePolicySchedule({ session });

  const changeExecSpecificState = (
    memberName: keyof AllExecSpecificStateParts,
    memberValue: AllExecSpecificStateParts[keyof AllExecSpecificStateParts]
  ) => {
    dispatch({ type: 'changeExecSpecificState', memberName, memberValue });
  };

  const changeExecSharedState = (
    memberName: keyof ExecSharedState,
    memberValue: ExecSharedState[keyof ExecSharedState]
  ) => {
    dispatch({ type: 'changeExecSharedState', memberName, memberValue });
  };

  const changePolicyDisplayName = (
    policyDisplayName: EditViewPolicyState['policyDisplayName']
  ) => {
    dispatch({ type: 'changePolicyDisplayName', policyDisplayName });
  };

  const changePolicySchedule = (
    memberName: keyof PolicySchedule,
    memberValue: PolicySchedule[keyof PolicySchedule]
  ) => {
    dispatch({ type: 'changePolicySchedule', memberName, memberValue });
  };

  const resetState = () => {
    dispatch({
      type: 'resetState',
      initialState: buildEditViewPolicyInitialState(
        policyData,
        policyScheduleData
      )
    });
  };

  const saveChanges = async () => {
    if (!validateIndexAs()) {
      return;
    }
    if (
      state.scheduleChanged &&
      state.policySchedule.scheduleEnabled &&
      !scheduleIsValid(state.policySchedule)
    ) {
      showWarningSnackbar(
        'Schedule Invalid: Please select days for the daily schedule.'
      );
      return;
    }
    if (
      customizationData?.policy_name_length_validation &&
      new RegExp(customizationData.policy_name_length_validation).test(
        state.policyDisplayName
      ) === false
    ) {
      const errorMessage =
        customizationData.policy_name_length_validation_message ||
        'Specified policy name is invalid. Please check the documentation for valid naming conventions.';
      showErrorSnackbar(errorMessage);
      return;
    }

    dispatch({ type: 'loading', loading: true });
    let scheduleError;
    let policyError;
    if (state.scheduleChanged) {
      if (state.policySchedule.scheduleEnabled) {
        if (state.policySchedule.scheduleId === undefined) {
          // If there is no scheduleId, then no schedule exists
          // So we create one
          try {
            const scheduleData = buildPolicyScheduleData(state.policySchedule);
            const response = await createPolicySchedule.mutateAsync({
              policyId: state.policyId,
              scheduleData
            });
            if (response.result.error.code !== 0) {
              throw new Error(response.result.error.text);
            }
          } catch (e) {
            scheduleError = e as Error;
          }
        } else {
          // If we have a schedule ID and the schedule is enabled
          // Update the existing schedule
          try {
            const scheduleData = buildPolicyScheduleData(state.policySchedule);
            await updatePolicySchedule.mutateAsync({
              policyId: state.policyId,
              scheduleId: state.policySchedule.scheduleId,
              scheduleData
            });
          } catch (e) {
            scheduleError = e as Error;
          }
        }
      } else if (state.policySchedule.scheduleId !== undefined) {
        // If we have a schedule ID and the schedule is disabled
        // Remove the existing schedule
        try {
          await deletePolicySchedule.mutateAsync({
            policyId: state.policyId,
            scheduleId: state.policySchedule.scheduleId
          });
        } catch (e) {
          scheduleError = e as Error;
        }
      }
    }
    if (state.policyChanged) {
      try {
        dispatch({ type: 'loading', loading: true });
        const jobTypeData = transformExecStateIntoJobTypeData(
          state.execSpecificState,
          state.execSharedState
        );
        await updatePolicy.mutateAsync({
          policyId: state.policyId,
          policyData: {
            display_name: state.policyDisplayName,
            job_type_data: jobTypeData,
            storage_connector_name: policyData.storage_connector_name,
            policy_description: policyData.policy_description,
            policy_context: policyData.policy_context
          }
        });
      } catch (e) {
        if (
          isAxiosError(e) &&
          e.response?.data.errormsg &&
          typeof e.response.data.errormsg === 'string' &&
          e.response.data.errormsg !== ''
        ) {
          policyError = new Error(e.response.data.errormsg);
        } else {
          policyError = e as Error;
        }
      }
    }
    if (scheduleError !== undefined || policyError !== undefined) {
      dispatch({ type: 'updateError', scheduleError, policyError });
    } else {
      showSuccessSnackbar(
        `Success: Updated policy '${state.policyDisplayName}'`
      );
      queryClient.invalidateQueries({ queryKey: [POLICIES] });
      queryClient.invalidateQueries({ queryKey: [POLICY] });
      queryClient.invalidateQueries({ queryKey: [POLICY_SCHEDULE] });
    }
  };

  return {
    state,
    policyNamesIsLoading,
    validateIndexAs,
    changeExecSpecificState,
    changeExecSharedState,
    changePolicyDisplayName,
    changePolicySchedule,
    saveChanges,
    resetState
  } as const;
};

export default useEditViewPolicyState;
