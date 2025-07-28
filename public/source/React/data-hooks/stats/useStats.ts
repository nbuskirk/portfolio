import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { API } from 'utils/helpers/api';
import { STATS } from 'constants/queryKeys';

export interface ScanStats {
  bkuphosts_count: number;
  bkupctypes: string[];
  total_new_changed_files: number;
  total_policies: number;
  daily_total_new_changed_files_per_bkupctype: [
    {
      bclienttype: string;
      date: number;
      nfiles_created_changed: number;
    }
  ];
}

export interface Stats {
  license_stats: {
    active_data_current_count: number;
    active_data_overdraft_count: number;
    active_data_overdraft_expire_time: number;
    system_license_expire_time: number;
  };
  scan_stats: ScanStats;
}

const getStats =
  (
    sessionid: string,
    fedId: string | undefined,
    indexId: number | undefined,
    startTime: number,
    endTime: number
  ) =>
  async () => {
    const { data } = await API.get<Stats>(
      // `/stats?fed_id=${fedId}&index_id=${indexId}`,
      `/stats?fed_id=${fedId}&index_id=${indexId}&start_date=${startTime}&end_date=${endTime}`,
      {
        headers: {
          sessionid
        }
      }
    );
    return data;
  };

interface Params {
  session: string;
  fedId: string | undefined;
  indexId: number | undefined;
  startTime: number;
  endTime: number;
}

const useStats = ({
  session,
  fedId,
  indexId,
  startTime,
  endTime
}: Params): UseQueryResult<Stats, AxiosError> => {
  return useQuery({
    queryKey: [STATS, session, fedId, indexId, startTime, endTime],
    queryFn: getStats(session, fedId, indexId, startTime, endTime),
    refetchInterval: 60000,
    refetchOnMount: true,
    enabled:
      !Number.isNaN(startTime) &&
      !Number.isNaN(endTime) &&
      fedId !== undefined &&
      indexId !== undefined
  });
};

export default useStats;
