const jobStateFilterMap = {
  'is': 'job_state_eq',
  'isAnyOf': 'job_state_in'
} as const;
export type JobStateFilterOp = keyof typeof jobStateFilterMap;
export function jobStateFilterOp(op: JobStateFilterOp) {
  return jobStateFilterMap[op];
}
export const jobStateInOp = jobStateFilterMap.isAnyOf;

const policyTypeFilterMap = {
  'is': 'policy_type_eq',
  'isAnyOf': 'policy_type_in'
} as const;
export type PolicyTypeFilterOp = keyof typeof policyTypeFilterMap;
export function policyTypeFilterOp(op: PolicyTypeFilterOp) {
  return policyTypeFilterMap[op];
}
const jobAlertStateFilterMap = {
  'is': 'job_alert_state_eq'
} as const;

export type JobAlertStateFilterOp = keyof typeof jobAlertStateFilterMap;
export function jobAlertStateFilterOp(op: JobAlertStateFilterOp) {
  return jobAlertStateFilterMap[op];
}

const currentPhaseFilterMap = {
  'is': 'job_phase_eq',
  'isAnyOf': 'job_phase_in'
} as const;
export type CurrentPhaseFilterOp = keyof typeof currentPhaseFilterMap;
export function currentPhaseFilterOp(op: CurrentPhaseFilterOp) {
  return currentPhaseFilterMap[op];
}

const jobIdFilterMap = {
  '=': 'job_id_eq',
  '!=': 'job_id_ne',
  '>': 'job_id_gt',
  '>=': 'job_id_ge',
  '<': 'job_id_lt',
  '<=': 'job_id_le',
  'isAnyOf': 'job_id_in'
} as const;
export type JobIdFilterOp = keyof typeof jobIdFilterMap;
export function jobIdFilterOp(op: JobIdFilterOp) {
  return jobIdFilterMap[op];
}

const startTimeFilterMap = {
  'is': 'start_time_eq',
  'after': 'start_time_gt',
  'before': 'start_time_lt',
  'between': 'start_time_between'
} as const;
export type StartTimeFilterOp = keyof typeof startTimeFilterMap;
export function startTimeFilterOp(op: StartTimeFilterOp) {
  return startTimeFilterMap[op];
}

const durationFilterMap = {
  '=': 'duration_eq',
  '>': 'duration_gt',
  '<': 'duration_lt'
} as const;
export type DurationFilterOp = keyof typeof durationFilterMap;
export function durationFilterOp(op: DurationFilterOp) {
  return durationFilterMap[op];
}

const policyFilterMap = {
  'contains': 'policy_has',
  'equals': 'policy_eq',
  'startsWith': 'policy_start',
  'endsWith': 'policy_end',
  'isAnyOf': 'policy_in'
} as const;
export type PolicyFilterOp = keyof typeof policyFilterMap;
export function policyFilterOp(op: PolicyFilterOp) {
  return policyFilterMap[op];
}

const sortMap = {
  'job_state': 'job_state_sort',
  'last_job_state': 'job_state_sort',
  'policy_type': 'policy_type_sort',
  'job_id': 'job_id_sort',
  'start_time_fmt': 'start_time_sort',
  'lastrun': 'start_time_sort',
  'policy': 'policy_sort',
  'display_name': 'policy_sort',
  'current_phase': 'job_phase_sort',
  'duration': 'duration_sort',
  'last_job_total_duration': 'duration_sort'
} as const;
export type SortOp = keyof typeof sortMap;
export function sortOp(op: SortOp) {
  return sortMap[op];
}

const sortOrderMap = {
  'display_name': 'policy',
  'last_job_state': 'job_state',
  'policy_type': 'policy_type',
  'current_phase': 'current_phase',
  'lastrun': 'start_time_fmt',
  'last_job_total_duration': 'duration'
} as const;
export type SortOrderOp = keyof typeof sortOrderMap;
export function sortOrderOp(op: SortOrderOp) {
  return sortOrderMap[op];
}
