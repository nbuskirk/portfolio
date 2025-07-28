import {
  AlertFlags,
  JobPhase,
  JobPhaseType,
  JobState
} from 'data-hooks/policies/useJobs';

export const jobPhaseTypeMap = new Map<JobPhaseType, string>();
jobPhaseTypeMap.set(JobPhaseType.initializing, 'Initializing');
jobPhaseTypeMap.set(JobPhaseType.scanning, 'Scanning');
jobPhaseTypeMap.set(JobPhaseType.scanning_and_indexing, 'Scanning & Indexing');
jobPhaseTypeMap.set(JobPhaseType.indexing, 'Indexing');
jobPhaseTypeMap.set(JobPhaseType.postprocessing, 'Postprocessing');
jobPhaseTypeMap.set(JobPhaseType.generating_stats, 'Generating Statistics');
jobPhaseTypeMap.set(JobPhaseType.analyzing_stats, 'Analyzing Statistics');
jobPhaseTypeMap.set(JobPhaseType.canceling, 'Canceling');

export const isTermJobState = (state: JobState) =>
  state === 'Done' ||
  state === 'Failed' ||
  state === 'Partial' ||
  state === 'Canceled' ||
  state === 'Alert';

export const isJobWithAlert = (alertFlags: AlertFlags | undefined) =>
  alertFlags
    ? alertFlags?.infection ||
      alertFlags?.database_corruption ||
      alertFlags?.custom_threshold ||
      alertFlags?.malware
    : false;

export const getCurPhaseName = (phases: Array<JobPhase>) => {
  return phases?.reduce((accumulator: string | undefined, phase) => {
    if (!phase.endtm) {
      if (accumulator === 'Canceling') {
        return accumulator;
      }
      const phaseName = jobPhaseTypeMap.get(phase.job_phase_type);
      if (
        (accumulator === 'Scanning' && phaseName === 'Indexing') ||
        (accumulator === 'Indexing' && phaseName === 'Scanning')
      ) {
        return 'Scanning & Indexing';
      }
      return phaseName;
    }
    return accumulator;
  }, '');
};
