import { GridFilterItem, GridSortItem } from '@mui/x-data-grid-premium';

import {
  CurrentPhaseFilterOp,
  DurationFilterOp,
  JobIdFilterOp,
  JobStateFilterOp,
  jobStateInOp,
  JobAlertStateFilterOp,
  PolicyFilterOp,
  SortOp,
  StartTimeFilterOp
} from 'components/configure/jobs/components/JobsTable/JobsTableColumnOps';

import {
  isJobPhase,
  isJobState,
  jobPhaseTypeMap2,
  JobState
} from 'data-hooks/policies/useJobs';

interface Dictionary<T> {
  [key: string]: T;
}

type ParamType = number | string | Array<string> | Array<number>;

type ParamsType =
  | Dictionary<number | string | Array<string> | Array<number>>
  | undefined;

const validateGetJobId = (
  jobIdFilterOp: (op: JobIdFilterOp) => string,
  item: GridFilterItem
) => {
  if (jobIdFilterOp(item.operator as JobIdFilterOp) === 'job_id_in') {
    if (item.value.some((value: string) => !/^[-]?\d+$/.test(value))) {
      return undefined;
    }
  } else if (!/^[-]?\d+$/.test(item.value)) {
    return undefined;
  }
  return item.value;
};

export const validateGetDuration = (value: string) => {
  if (/^\d\d:\d\d:\d\d$/.test(value)) {
    const vals = value.split(/:/);
    return Number(vals[0]) * 3600 + Number(vals[1]) * 60 + Number(vals[2]);
  }
  return undefined;
};

export const validateGetDuration2 = (
  durationFilterOp: (op: DurationFilterOp) => string,
  item: GridFilterItem
) => {
  let durationVal;
  if (durationFilterOp(item.operator as DurationFilterOp) === 'duration_in') {
    if (item.value.some((value: string) => !/^\d\d:\d\d:\d\d$/.test(value))) {
      return undefined;
    }
    durationVal = item.value.map((value: string) => {
      const vals = value.split(/:/);
      const duration =
        Number(vals[0]) * 3600 + Number(vals[1]) * 60 + Number(vals[2]);
      return duration;
    });
  } else if (/^\d\d:\d\d:\d\d$/.test(item.value)) {
    const vals = item.value.split(/:/);
    durationVal =
      Number(vals[0]) * 3600 + Number(vals[1]) * 60 + Number(vals[2]);
  } else {
    return undefined;
  }
  return durationVal;
};

export const setParams = (
  paginationModel: { page: number; pageSize: number },
  sortModel: any,
  jobStateFilterOp: (op: JobStateFilterOp) => string,
  jobAlertStateFilterOp: (op: JobAlertStateFilterOp) => string,
  currentPhaseFilterOp: (op: CurrentPhaseFilterOp) => string,
  jobIdFilterOp: (op: JobIdFilterOp) => string,
  startTimeFilterOp: (op: StartTimeFilterOp) => string,
  durationFilterOp: (op: DurationFilterOp) => string,
  policyFilterOp: (op: PolicyFilterOp) => string,
  sortOp: (op: SortOp) => string,
  filterModelItems: Array<GridFilterItem>
) => {
  const params: ParamsType = {};
  if (paginationModel) {
    params.offset = paginationModel.page * paginationModel.pageSize;
    params.limit = paginationModel.pageSize;
  }
  if (filterModelItems.length !== 0) {
    filterModelItems.forEach((item: GridFilterItem) => {
      if (item.value === undefined) {
        return;
      }
      if (item.field === 'job_state') {
        if (Array.isArray(item.value)) {
          const value2 = item.value.filter(
            (value: string) =>
              isJobState(value as JobState) && value !== 'Alert'
          );
          if (value2) {
            params[jobStateFilterOp(item.operator as JobStateFilterOp)] =
              value2;
          }
          const value3 = item.value.filter(
            (value: string) =>
              isJobState(value as JobState) && value === 'Alert'
          );
          if (value3) {
            [
              params[
                jobAlertStateFilterOp(item.operator as JobAlertStateFilterOp)
              ]
            ] = 'AnyAlerts';
          }
        } else if (isJobState(item.value as JobState)) {
          if (item.value === 'Alert') {
            if (item.operator === 'is') {
              params[
                jobAlertStateFilterOp(item.operator as JobAlertStateFilterOp)
              ] = 'AnyAlerts';
            }
          } else {
            params[jobStateFilterOp(item.operator as JobStateFilterOp)] =
              item.value;
          }
        }
      } else if (item.field === 'current_phase') {
        if (Array.isArray(item.value)) {
          const value2 = item.value.filter((value: string) =>
            isJobPhase(value)
          );
          if (value2) {
            params[
              currentPhaseFilterOp(item.operator as CurrentPhaseFilterOp)
            ] = value2.map((value: string) => {
              return jobPhaseTypeMap2.get(value);
            }) as ParamType;
          }
        } else if (isJobPhase(item.value)) {
          const value = jobPhaseTypeMap2.get(item.value);
          if (value) {
            params[
              currentPhaseFilterOp(item.operator as CurrentPhaseFilterOp)
            ] = value;
          }
        }
      } else if (item.field === 'job_id') {
        const value = validateGetJobId(jobIdFilterOp, item);
        if (value === undefined) {
          return;
        }
        params[jobIdFilterOp(item.operator as JobIdFilterOp)] = value;
      } else if (item.field === 'start_time_fmt') {
        if (item.operator === 'between') {
          const value2 = item.value.map(
            (dt: string) => new Date(dt).toISOString().split('T')[0]
          );
          params[startTimeFilterOp(item.operator)] = value2;
        } else {
          [params[startTimeFilterOp(item.operator as StartTimeFilterOp)]] =
            new Date(item.value).toISOString().split('T');
        }
      } else if (item.field === 'duration') {
        const value = validateGetDuration2(durationFilterOp, item);
        if (value === undefined) {
          return;
        }
        params[durationFilterOp(item.operator as DurationFilterOp)] = value;
      } else if (item.field === 'policy') {
        params[policyFilterOp(item.operator as PolicyFilterOp)] = encodeURI(
          item.value
        );
      }
    });
  }

  // Limit jobs to completed
  const terminalJobStates = ['Done', 'Failed', 'Partial', 'Canceled'];
  if (!(jobStateInOp in params)) {
    params[jobStateInOp] = terminalJobStates;
  }

  if (sortModel && sortModel.length !== 0) {
    let sortOrder = '';
    sortModel.forEach((item: GridSortItem) => {
      if (sortOrder) {
        sortOrder += ',';
      }
      sortOrder += item.field;
      params[sortOp(item.field as SortOp)] = item.sort as ParamType;
    });
    params.job_sort_order = sortOrder;
  }
  params.policy_inactive_state = 'all';
  return params;
};

export default setParams;
