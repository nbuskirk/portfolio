import {
  GridFilterItem,
  GridPaginationModel,
  GridSortModel
} from '@mui/x-data-grid-premium';
import { useUser } from 'utils/context/UserContext';
import usePolicies from 'data-hooks/policies/usePolicies';
import {
  AlertFlags,
  BSCompletedWorkload,
  isJobPhase,
  isJobState,
  isPolicyType,
  JobPhase,
  jobPhaseTypeMap2,
  JobState,
  PolicyType
} from 'data-hooks/policies/useJobs';
import { validateGetDuration2 } from 'components/configure/jobs/helpers/setParams';
import { getCurPhaseName } from 'components/configure/jobs/helpers/getJobs';
import { format } from 'date-fns';
import { useIeSystem, ieTimezone } from 'data-hooks/useIeSystem';
import changeTimezone, { compDuration } from 'utils/helpers/timezone';

import {
  currentPhaseFilterOp,
  durationFilterOp,
  jobStateFilterOp,
  policyTypeFilterOp,
  jobAlertStateFilterOp,
  policyFilterOp,
  sortOp,
  sortOrderOp,
  startTimeFilterOp
} from 'components/configure/jobs/components/JobsTable/JobsTableColumnOps';

export interface Policy {
  id: number;
  policy: string;
  display_name: string;
  policy_type: string;
  status: string;
  current_phase?: string;
  lastrun: string;
  last_job_total_duration: number;
  deltablock: string;
  active: string;
  action: number;
  name: string;
  storage_connector_name: string;
  last_bscompleted_workload: Array<BSCompletedWorkload>;
  last_job_number: number;
  last_job_state: string;
  last_job_alert_flags: AlertFlags;
  last_job_phases: Array<JobPhase>;
}

interface Dictionary<T> {
  [key: string]: T;
}

const setParams = (
  paginationModel: GridPaginationModel,
  sortModel: GridSortModel,
  filters: Array<GridFilterItem>
) => {
  const params: Dictionary<number | string | Array<string>> = {};
  if (paginationModel) {
    params.cursor = paginationModel.page * paginationModel.pageSize;
    params.howmany = paginationModel.pageSize;
  }
  if (filters && filters?.length !== 0) {
    filters.forEach((item: any) => {
      if (item.value === undefined) {
        return;
      }
      if (item.field === 'last_job_state') {
        if (Array.isArray(item.value)) {
          const value2 = item.value.filter(
            (value: string) =>
              isJobState(value as JobState) && value !== 'Alert'
          );
          if (value2) {
            params[jobStateFilterOp(item.operator)] = value2;
          }
          const value3 = item.value.filter(
            (value: string) =>
              isJobState(value as JobState) && value === 'Alert'
          );
          if (value3) {
            [params[jobAlertStateFilterOp(item.operator)]] = 'AnyAlerts';
          }
        } else if (isJobState(item.value as JobState)) {
          if (item.value === 'Alert') {
            if (item.operator === 'is') {
              params[jobAlertStateFilterOp(item.operator)] = 'AnyAlerts';
            }
          } else {
            params[jobStateFilterOp(item.operator)] = item.value;
          }
        }
      } else if (item.field === 'current_phase') {
        if (Array.isArray(item.value)) {
          const value2 = item.value.filter((value: string) =>
            isJobPhase(value)
          );
          if (value2) {
            params[currentPhaseFilterOp(item.operator)] = value2.map(
              (value: string) => {
                return jobPhaseTypeMap2.get(value);
              }
            );
          }
        } else if (isJobPhase(item.value)) {
          const value = jobPhaseTypeMap2.get(item.value);
          if (value) {
            params[currentPhaseFilterOp(item.operator)] = value;
          }
        }
      } else if (item.field === 'lastrun') {
        if (item.operator === 'between') {
          const value2 = item.value.map(
            (dt: string) => new Date(dt).toISOString().split('T')[0]
          );
          params[startTimeFilterOp(item.operator)] = value2;
        } else {
          [params[startTimeFilterOp(item.operator)]] = new Date(item.value)
            .toISOString()
            .split('T');
        }
      } else if (item.field === 'last_job_total_duration') {
        const value = validateGetDuration2(durationFilterOp, item);
        if (value === undefined) {
          return;
        }
        params[durationFilterOp(item.operator)] = value;
      } else if (item.field === 'display_name') {
        params[policyFilterOp(item.operator)] = encodeURI(item.value);
      } else if (item.field === 'policy_type') {
        if (Array.isArray(item.value)) {
          const value2 = item.value.filter((value: string) =>
            isPolicyType(value as PolicyType)
          );
          if (value2) {
            params[policyTypeFilterOp(item.operator)] = value2;
          }
        } else if (isPolicyType(item.value)) {
          params[policyTypeFilterOp(item.operator)] = item.value;
        }
      }
    });
  }
  if (sortModel && sortModel.length !== 0) {
    let sortOrder = '';
    sortModel.forEach((item: any) => {
      if (sortOrder) {
        sortOrder += ',';
      }
      sortOrder += sortOrderOp(item.field);
      params[sortOp(item.field)] = item.sort;
    });
    params.job_sort_order = sortOrder;
  }
  return params;
};

const usePolicyData = (
  paginationModel: GridPaginationModel,
  sortModel: GridSortModel,
  filterModelItems: Array<GridFilterItem>
) => {
  // Run Queries
  const { session } = useUser();
  const ieSystemQuery = useIeSystem({ session });
  const params = setParams(paginationModel, sortModel, filterModelItems);
  const policiesQuery = usePolicies({ session, params });

  // Exract System Time
  // Fallback: use server timezone aproximate time
  const systemTime =
    policiesQuery.data?.systemTime ??
    (() => {
      const curdt = new Date();
      const curdtIeTz = changeTimezone(curdt, ieTimezone(ieSystemQuery.data));
      return Math.floor(curdtIeTz.getTime() / 1000);
    })();

  // Policies Count
  const totalPolicies = policiesQuery.data?.totalPolicies;

  // Format the data for the PoliciesTable
  const formattedData = policiesQuery.data?.policies.map((policy, index) => {
    let duration;
    if (policy.last_job_start_time <= 0) {
      duration = -1;
    } else {
      duration = compDuration(
        systemTime,
        policy.last_job_start_time,
        policy.last_job_end_time
      );
    }
    const formattedPolicy: Policy = {
      id: index,
      name: policy.policy_name_encoded,
      policy: policy.policy,
      display_name: policy.display_name,
      policy_type: policy.policy_type,
      storage_connector_name: policy.storage_connector_name,
      last_bscompleted_workload: policy.last_bscompleted_workload,
      last_job_number: policy.last_job_number,
      last_job_state: policy.last_job_state,
      last_job_alert_flags: policy.last_job_alert_flags,
      status:
        policy.policy_state === 'Execute' ? 'Running' : policy.policy_state,
      current_phase: getCurPhaseName(policy.last_job_phases),
      lastrun:
        policy.last_job_start_time > 0
          ? format(
              changeTimezone(
                new Date(policy.last_job_start_time * 1000),
                ieTimezone(ieSystemQuery.data)
              ),
              'yyyy-MM-dd HH:mm:ss'
            )
          : ' NA',
      last_job_total_duration: duration,
      last_job_phases: policy.last_job_phases ?? [],
      active: index % 2 === 0 ? 'Yes' : 'No',
      deltablock:
        policy.dba_disabled === true ? 'Force Full Scan' : 'Use CR Setting',
      action: index
    };
    return formattedPolicy;
  });

  return {
    formattedData: formattedData ?? [],
    totalPolicies,
    systemTime,
    loading: ieSystemQuery.isLoading || policiesQuery.isLoading
  } as const;
};

export default usePolicyData;
