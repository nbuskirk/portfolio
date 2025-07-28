import { useQuery } from '@tanstack/react-query';
import { IECS_API } from 'utils/helpers/apiIecs';
import { JobState } from 'data-hooks/policies/useJobs';

// import { mockNetworkError, mockTimeout } from '_mocks_/jobstatus_error';
// import { MOCKAPI } from 'utils/helpers/apiMockup';

// mockTimeout();

type EnabledDisabled = 'enabled' | 'disabled';

export interface JobStatus {
  policy: string;
  state: JobState;
  total_bytes_in_backups: number;
  nfs_export: string;
  cifs_share: string;
  directory: string;
  index_as_path: string;
  indexing_mode: string;
  wordstyle: number;
  ocr: EnabledDisabled;
  cs_data_collection: EnabledDisabled;
  use_change_time_for_incremental_indexing: EnabledDisabled;
  exceptions: Array<any>;
}

async function getJobStatus(session: string, cmd: string, dataJobId: number) {
  const res = await IECS_API.get(`${cmd}?job_id=${dataJobId}`, {
    headers: {
      sessionId: session
    }
  });
  return res.data;
}

interface Params {
  session: string;
  dataJobId: number;
  mtype: string | undefined;
}

export function useJobStatus({ session, dataJobId, mtype }: Params) {
  const cmd = mtype === 'Local' ? '/JobStatusLocal' : '/JobStatus';
  return useQuery({
    queryKey: [`jobstatus-${dataJobId}}`],
    queryFn: async () => getJobStatus(session, cmd, dataJobId),
    enabled: dataJobId !== 0,
    staleTime: 5000,
    refetchOnWindowFocus: true,
    refetchInterval: 30000
  });
}
