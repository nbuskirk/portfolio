export const ScheduleType = {
  default: 0,
  RunOnce: 1,
  Hourly: 2,
  Daily: 3,
  Weekly: 4,
  Monthly: 5,
  Yearly: 6
} as const;

export type STType = typeof ScheduleType;

export interface ScheduleData {
  endtime?: number;
  hour?: number;
  jobid?: string;
  jobtype?: number;
  minutes?: number;
  month?: number;
  monthday?: number;
  repeat_count?: number;
  repeat_interval?: number;
  schedtype?: STType[keyof STType];
  starttime?: number;
  userflags?: number;
  weekday_flags?: number;
}

export interface PolicyScheduleData {
  auth: {
    client_ip: string;
    principal: string;
    projectID: number;
    type: number;
  };
  count: number;
  endtime: number;
  flags: number;
  flags_failurecause: unknown;
  hour: number;
  jobdefid: number;
  jobdefname: unknown;
  jobmsg: unknown;
  jobtype: number;
  lastruntime: number;
  minutes: number;
  month: number;
  monthday: number;
  nextruntime: number;
  repeat_cound: number;
  repeat_interval: number;
  sched_policy_detail_id: number;
  sched_policy_id: number;
  sched_policy_name: unknown;
  schedid: number;
  schedtype: number;
  starttime: number;
  weekday_flags: number;
}
