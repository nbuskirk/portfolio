import {
  getBackupsetCounters,
  BackupsetCountersType
} from '../../helpers/getJobStatusBackupsetCounters';

const isAnyCounterNonZero = (counters: BackupsetCountersType) => {
  return Object.values(counters).some((val) => val !== 0);
};

export const isLanBackupsetCounterNonZero = (jobStatus: any) => {
  if (!jobStatus?.lan_backupset_counters) {
    return false;
  }
  const counters = jobStatus.lan_backupset_counters;
  return isAnyCounterNonZero(counters);
};

export const isOffloadedBackupsetCounterNonZero = (jobStatus: any) => {
  if (!jobStatus?.offloaded_backupset_counters) {
    return false;
  }
  const counters = jobStatus.offloaded_backupset_counters;
  return isAnyCounterNonZero(counters);
};

export const getLanBackupsetCounters = (jobStatus: any) => {
  return getBackupsetCounters({ jobStatus, countersType: 'lan' });
};

export const getOffloadedBackupsetCounters = (jobStatus: any) => {
  return getBackupsetCounters({ jobStatus, countersType: 'offloaded' });
};
