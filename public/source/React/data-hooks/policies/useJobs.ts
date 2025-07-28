import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { IECS_API } from 'utils/helpers/apiIecs';

// import '_mocks_/policyjobs'; // comment out when going to production, used to mock api
// import { MOCKAPI } from 'utils/helpers/apiMockup';

import qs from 'qs';

import { POLICYJOBS } from 'constants/queryKeys';

export interface JobPhase {
  job_phase_type: JobPhaseType;
  starttm: number;
  endtm: number;
}

export enum JobPhaseType {
  initializing = 'initializing',
  scanning = 'scanning',
  scanning_and_indexing = 'scanning_and_indexing',
  indexing = 'indexing',
  postprocessing = 'postprocessing',
  generating_stats = 'generating_stats',
  analyzing_stats = 'analyzing_stats',
  canceling = 'canceling'
}

export const jobPhaseTypeMap2 = new Map<string, JobPhaseType>();
jobPhaseTypeMap2.set('Initializing', JobPhaseType.initializing);
jobPhaseTypeMap2.set('Scanning', JobPhaseType.scanning);
jobPhaseTypeMap2.set('Scanning & Indexing', JobPhaseType.scanning_and_indexing);
jobPhaseTypeMap2.set('Indexing', JobPhaseType.indexing);
jobPhaseTypeMap2.set('Postprocessing', JobPhaseType.postprocessing);
jobPhaseTypeMap2.set('Generating Statistics', JobPhaseType.generating_stats);
jobPhaseTypeMap2.set('Analyzing Statistics', JobPhaseType.analyzing_stats);
jobPhaseTypeMap2.set('Canceling', JobPhaseType.canceling);

export const isJobPhase = (val: string) =>
  jobPhaseTypeMap2.get(val) !== undefined;

export enum Mtype {
  NFS_EXPORT = 'NFS Export',
  CIFS_SHARE = 'CIFS Share',
  LOCAL = 'Local',
  VMFS = 'VMFS',
  UNDEFINED = 'Undefined'
}

export type JobState =
  | 'Idle'
  | 'Pending'
  | 'Running'
  | 'Done'
  | 'Failed'
  | 'Partial'
  | 'Canceling'
  | 'Canceled'
  | 'Unknown'
  | 'Alert';

export const isJobState = (val: JobState) =>
  val === 'Idle' ||
  val === 'Pending' ||
  val === 'Running' ||
  val === 'Done' ||
  val === 'Failed' ||
  val === 'Partial' ||
  val === 'Canceling' ||
  val === 'Canceled' ||
  val === 'Unknown' ||
  val === 'Alert';

export type PolicyType = 'Local' | 'NFS' | 'SMB' | 'VMFS' | 'SCSI';

export const isPolicyType = (val: PolicyType) =>
  val === 'Local' ||
  val === 'NFS' ||
  val === 'SMB' ||
  val === 'VMFS' ||
  val === 'SCSI';

export type AlertFlags = {
  infection: boolean;
  database_corruption: boolean;
  custom_threshold: boolean;
  malware: boolean;
};

export type Job = {
  job_id: number;
  job_state: JobState;
  job_phases: Array<JobPhase>;
  start_time: string;
  start_time_unix: number;
  end_time: string;
  end_time_unix: number;
  policy: string;
  mtype: Mtype;
  ie_idx_job_uuid: string;
  alert_flags: AlertFlags;
};
type JobsArray = Array<Job>;

export type PolicyInfo = {
  policy_name: string;
};
type PolicyInfoArray = Array<PolicyInfo>;

// PoliciesTable and Log (Jobs) tables create ExpandedJob from results of policies and policy_jobs_info GET commands,
// combined with JobStatus GET results.
// TODO Make JobStatus return, as a part of bsprogress array items, host, backup type and indexing duration
// and display them in "backups open for indexing" table in job expanded view
export type ExpandedJob = {
  job_id: number;
  job_state: JobState;
  job_phases: Array<JobPhase>;
  job_phase_durations?: Array<JobPhaseDurations>;
  bscompleted_workload?: BSCompletedWorkload;
};

export type JobPhaseDurations = {
  phase: string;
  duration: number;
};

export type BSCompletedWorkload = {
  bkup_format_displayname: string;
  client_type_displayname: string;
  count: number;
  dba?: boolean;
};

export type WorkloadCompletedDisplay = {
  label: string;
  count: number;
};

export type PolicyJobsInfo = {
  total_jobs: number;
  system_time: number;
  policies: PolicyInfoArray;
  jobs: JobsArray;
};

interface Dictionary<T> {
  [key: string]: T;
}

type ParamsType =
  | Dictionary<number | string | Array<string> | Array<number>>
  | undefined;

async function getJobs(session: string, params: ParamsType) {
  // console.log(
  //   `useJobs is sending /policy_jobs_info with ${JSON.stringify(params)}`
  // );
  const { data } = await IECS_API.get('/policy_jobs_info', {
    headers: {
      sessionId: session
    },
    params,
    paramsSerializer: (ps) => {
      return qs.stringify(ps, { arrayFormat: 'repeat' });
    }
  });
  return data;
}

interface Params {
  session: string;
  params: ParamsType;
}
export const useJobs = ({ session, params }: Params) => {
  return useQuery({
    queryKey: [POLICYJOBS, params],
    queryFn: async () => getJobs(session, params),
    staleTime: 5000,
    refetchOnWindowFocus: false,
    refetchInterval: 30000,
    placeholderData: keepPreviousData
  });
};

export default useJobs;
