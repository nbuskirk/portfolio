import changeTimezone, { compDuration } from 'utils/helpers/timezone';
import {
  BSCompletedWorkload,
  ExpandedJob,
  JobPhase,
  JobPhaseDurations,
  JobPhaseType,
  WorkloadCompletedDisplay
} from 'data-hooks/policies/useJobs';
import { jobPhaseTypeMap } from '../../helpers/getJobs';

// Create sequence of Scanning, Scanning & Indexing and Indexing phases, when applicable
// Increment endtm when endtm is the same as starttm
const finalizeJobPhases = (jobPhases: Array<JobPhase>) => {
  let scanningPhase: JobPhase = {
    job_phase_type: JobPhaseType.scanning,
    starttm: 0,
    endtm: 0
  };
  let indexingPhase: JobPhase = {
    job_phase_type: JobPhaseType.indexing,
    starttm: 0,
    endtm: 0
  };
  const scanningAndIndexingPhase: JobPhase = {
    job_phase_type: JobPhaseType.scanning_and_indexing,
    starttm: 0,
    endtm: 0
  };
  jobPhases.forEach((jobPhase) => {
    if (jobPhase.job_phase_type === JobPhaseType.scanning) {
      scanningPhase = jobPhase;
    } else if (jobPhase.job_phase_type === JobPhaseType.indexing) {
      indexingPhase = jobPhase;
    }
  });
  if (
    scanningPhase &&
    scanningPhase.endtm !== 0 &&
    indexingPhase &&
    indexingPhase.endtm !== 0 &&
    scanningPhase.endtm > indexingPhase.starttm
  ) {
    const scanningEndtm = indexingPhase.starttm;

    // Scanning & Indexing phase begins when original Indexing phase begins
    // and ends when original Scanning phase ends
    scanningAndIndexingPhase.starttm = indexingPhase.starttm;
    scanningAndIndexingPhase.endtm = scanningPhase.endtm;
    if (
      scanningAndIndexingPhase.endtm === scanningAndIndexingPhase.starttm &&
      scanningAndIndexingPhase.starttm !== 0
    ) {
      scanningAndIndexingPhase.endtm += 1;
    }

    // Scanning phase ends when original Indexing phase begins
    scanningPhase.endtm = scanningEndtm;
    if (
      scanningPhase.endtm === scanningPhase.starttm &&
      scanningPhase.starttm !== 0
    ) {
      scanningPhase.endtm += 1;
    }

    // Indexing phase begins when Scanning & Indexing phase ends
    indexingPhase.starttm = scanningAndIndexingPhase.endtm;
    if (
      indexingPhase.endtm === indexingPhase.starttm &&
      indexingPhase.starttm !== 0
    ) {
      indexingPhase.endtm += 1;
    }
  }
  const phases = jobPhases.flatMap((jobPhase) => {
    if (scanningAndIndexingPhase.starttm !== 0) {
      if (jobPhase.job_phase_type === JobPhaseType.scanning) {
        return [scanningPhase, scanningAndIndexingPhase];
      }
      if (jobPhase.job_phase_type === JobPhaseType.indexing) {
        return indexingPhase;
      }
    }
    if (jobPhase.endtm === jobPhase.starttm) {
      return { ...jobPhase, endtm: jobPhase.endtm + 1 };
    }
    return jobPhase;
  });
  return phases.filter((jobPhase) => jobPhase.starttm !== 0);
};

const convJobPhaseTypeToPhaseName = (jobPhase: JobPhaseType) =>
  jobPhaseTypeMap.has(jobPhase) ? jobPhaseTypeMap.get(jobPhase) : jobPhase;

export const formatWorkloadCompleted = (
  workloadCompleted: Array<BSCompletedWorkload>
) => {
  const workloadCompletedFormatted: Array<WorkloadCompletedDisplay> = [];

  // First compute totals. There may be multiple entries for the same
  // bkup_format and client_type, so we need to sum them up.
  workloadCompleted.forEach((workloadCompletedObj: BSCompletedWorkload) => {
    const existingBackupFormat = workloadCompletedFormatted.find(
      (workloadCompletedFormattedItem) =>
        workloadCompletedFormattedItem.label ===
        `${workloadCompletedObj.bkup_format_displayname} ${workloadCompletedObj.client_type_displayname}`
    );
    if (existingBackupFormat) {
      existingBackupFormat.count += workloadCompletedObj.count;
    } else {
      workloadCompletedFormatted.push({
        label: `${workloadCompletedObj.bkup_format_displayname} ${workloadCompletedObj.client_type_displayname}`,
        count: workloadCompletedObj.count
      });
    }
  });

  // then display any with dba = true as a separate item (using DBA)
  const usingDba = workloadCompleted
    .filter((item: BSCompletedWorkload) => item.dba)
    .map((item: BSCompletedWorkload) => {
      return {
        label: `${item.bkup_format_displayname} ${item.client_type_displayname} using DBA`,
        count: item.count
      };
    });
  workloadCompletedFormatted.push(...usingDba);

  return workloadCompletedFormatted;
};

const getJobPhaseDurations = (
  ieTimezone: string | undefined,
  systemTime: number | undefined,
  expandedJob: ExpandedJob
): Array<JobPhaseDurations> => {
  const curtm = systemTime;
  let curtm2: number = 0;
  if (!systemTime) {
    const curdt = new Date();
    const curdtIeTz = changeTimezone(curdt, ieTimezone);
    curtm2 = Math.floor(curdtIeTz.getTime() / 1000);
  }
  if (expandedJob.job_phases === undefined) {
    return [];
  }
  const phases = finalizeJobPhases(expandedJob.job_phases);
  return phases.map((item, index) => {
    const newJobPhase = JSON.parse(JSON.stringify(item));
    newJobPhase.id = index;
    newJobPhase.job_id = expandedJob.job_id;
    newJobPhase.phase = convJobPhaseTypeToPhaseName(item.job_phase_type);
    newJobPhase.duration = compDuration(
      curtm || curtm2,
      item.starttm,
      item.endtm
    );
    return newJobPhase;
  });
};

const preprocessExpandedJob = (
  ieTimezone: string | undefined,
  systemTime: number | undefined,
  expandedJob: ExpandedJob
): ExpandedJob => {
  return {
    ...expandedJob,
    job_phase_durations: getJobPhaseDurations(
      ieTimezone,
      systemTime,
      expandedJob
    )
  };
};

export default preprocessExpandedJob;
