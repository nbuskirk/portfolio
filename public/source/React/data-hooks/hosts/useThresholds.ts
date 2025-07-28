import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { THRESHOLDS } from 'constants/queryKeys';
import { baseURL } from 'utils/helpers/api';

export interface ThresholdLocation {
  host: string;
  path: string;
  recursive: boolean;
}

export interface ThresholdResponse {
  fed_id: string;
  id: number;
  index_id: number;
  locations: ThresholdLocation[];
  name: string;
  severity: string;
  threshold_type: string;
  update_time: number;
  alert_level_value_2: number;
  version: number;
  activity_type?: string;
  alert_level_value_1?: number;
  enabled_state: string;
  host: string;
  severity_levels: {
    critical: {
      value: number;
      enabled: boolean;
    };
    high: {
      value: number;
      enabled: boolean;
    };
    medium: {
      value: number;
      enabled: boolean;
    };
    low: {
      value: number;
      enabled: boolean;
    };
  };
  threshold_value_2: number;
}

interface Params {
  fed_id: string | undefined;
  index_id: number | undefined;
  sessionid: string;
  enabled?: boolean;
}
type Thresholds = Array<ThresholdResponse>;

export const getThresholds = async (
  sessionid: string | undefined,
  fed_id: string | undefined,
  index_id: number | undefined
): Promise<Thresholds> => {
  const axiosConfig = {
    method: 'get' as const,
    baseURL: `${baseURL}/federations/${fed_id}/indexes/${index_id}/thresholds`,
    headers: {
      sessionid
    },
    responseType: 'json' as const
  };
  const { data } = await axios(axiosConfig);
  return data;
};

const useThresholds = ({
  fed_id,
  index_id,
  sessionid
}: Params): UseQueryResult<Thresholds, AxiosError> => {
  return useQuery({
    queryKey: [THRESHOLDS, sessionid, fed_id, index_id],
    queryFn: () => getThresholds(sessionid, fed_id, index_id),
    refetchInterval: 60000,
    enabled: !!sessionid && !!fed_id && !!index_id
  });
};

export default useThresholds;
