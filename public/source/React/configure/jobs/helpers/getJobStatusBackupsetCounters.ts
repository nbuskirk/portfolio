export interface BackupsetCountersType {
  ncorrupt: number;
  nunsuppt: number;
  nencrypt: number;
  ninternalerr: number;
  nwarning: number;
  naborted: number;
  ndisabled: number;
  nmissing: number;
  ncancelled: number;
}

export function getBackupsetCounters({
  jobStatus,
  countersType
}: {
  jobStatus: any;
  countersType: 'lan' | 'offloaded';
}): BackupsetCountersType {
  if (countersType === 'lan') {
    return jobStatus?.lan_backupset_counters;
  }
  return jobStatus?.offloaded_backupset_counters;
}
