import { useQuery, UseQueryResult } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { DAILY_ACTIVITY } from 'constants/queryKeys';
import { baseURL } from 'utils/helpers/api';

export interface ThresholdLocation {
  host: string;
  path: string;
  recursive: boolean;
}

export interface ThresholdResponse {
  activity_type?: string | undefined;
  alert_level_value_1?: number;
  enabled_state: string;
  fed_id: string;
  host: string | undefined;
  id: number;
  index_id: number;
  name: string;
  severity: string;
  severity_levels?: {
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
  version: number;
  threshold_type: string;
  locations: ThresholdLocation[];
  t_name?: string;
  update_time?: number;
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
    baseURL: `${baseURL}/federations/${fed_id}/indexes/${index_id}/activity_alert_levels`,
    headers: {
      sessionid
    },
    responseType: 'json' as const
  };
  const { data } = await axios(axiosConfig);

  return data;
};

const useDailyActivityAlertLevels = ({
  fed_id,
  index_id,
  sessionid
}: Params): UseQueryResult<Thresholds, AxiosError> => {
  return useQuery({
    queryKey: [DAILY_ACTIVITY, sessionid, fed_id, index_id],
    queryFn: () => getThresholds(sessionid, fed_id, index_id),
    // Filter out built-in daily alerts not exposed to the customer yet still in the API
    // while allowing customized daily configurations to show (includes host after edit)
    select: (data) =>
      data.filter(
        (activityAlertLevel): activityAlertLevel is ThresholdResponse =>
          activityAlertLevel?.host !== undefined
      ),
    refetchInterval: 60000,
    enabled: !!sessionid && !!fed_id && !!index_id
  });
};

export default useDailyActivityAlertLevels;
