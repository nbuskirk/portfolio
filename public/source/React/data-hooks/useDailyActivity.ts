import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from 'utils/context/UserContext';
import { DAILY_ACTIVITY } from 'constants/queryKeys';
import { API } from '../utils/helpers/api';

export interface Host {
  fed_id: string;
  hostname: string;
  index_id: number;
}

export interface HostResponse {
  activity_alert_levels: ActivityAlertLevel[];
  fed_id: string;
  hostname: string;
  index_id: number;
  delta_block_analysis_scores: TableData[];
  custom_thresholds: {
    name: string;
    path: string;
    id: number;
    points: TableData[];
    severity_levels: {
      critical: {
        enabled: boolean;
        value: number;
      };
      high: {
        enabled: boolean;
        value: number;
      };
      medium: {
        enabled: boolean;
        value: number;
      };
      low: {
        enabled: boolean;
        value: number;
      };
      enabled: boolean;
    };
    type: string;
  }[];
}

export interface ActivityAlertLevel {
  activity_type: string;
  alert_level_value_1: number;
  enabled_state: string;
  fed_id: string;
  index_id: number;
  name: string;
  host?: string | null;
  id: number | null;
  severity?: string;
  severity_levels?: {
    critical: {
      enabled: boolean;
      value: number;
    };
    high: {
      enabled: boolean;
      value: number;
    };
    medium: {
      enabled: boolean;
      value: number;
    };
    low: {
      enabled: boolean;
      value: number;
    };
    enabled: boolean;
  };
  points: TableData[];
}

export interface TableData {
  time_date: number;
  value: number;
}

export interface PostResponse {
  payload: {
    activity_type?: string;
    alert_level_value_1?: number;
    severity?: string;
  };
}
export interface PatchResponse {
  payload: {
    alert_level_value_1?: number;
    enabled_state?: string;
    severity?: string;
  };
  id?: number;
}

const validateHost = (host?: Host) => {
  return Boolean(host?.fed_id && host?.hostname && host?.index_id);
};

const useDailyActivity = (host?: Host) => {
  const { session } = useUser();
  const queryClient = useQueryClient();
  const getDailyActivity = useQuery({
    queryKey: [DAILY_ACTIVITY, host],
    enabled: validateHost(host),
    refetchOnMount: 'always',
    queryFn: async () => {
      const data = await API.get<HostResponse>(
        `/federations/${host?.fed_id}/indexes/${host?.index_id}/hosts/${host?.hostname}`,
        {
          headers: {
            sessionId: session,
            entropy: 'ppm'
          }
        }
      ).then((res) => res.data);
      return data;
    },
    refetchInterval: 60000
  });

  // POST
  const postDailyActivityAlertLevel = useMutation({
    mutationFn: async (payload: PostResponse) => {
      const payloadToPost = {
        ...payload.payload,
        host: host?.hostname
      };
      return API.post<PostResponse>(
        `/federations/${host?.fed_id}/indexes/${host?.index_id}/activity_alert_levels`,
        payloadToPost,
        {
          headers: {
            sessionId: session
          }
        }
      ).then(() => {
        queryClient.invalidateQueries({ queryKey: [DAILY_ACTIVITY] });
      });
    }
  });

  // POST RSS THRESHOLDS
  const postRSSActivityAlertLevel = useMutation({
    mutationFn: async (payload: PostResponse) => {
      const payloadToPost = {
        ...payload.payload,
        host: host?.hostname
      };
      return API.post<PostResponse>(
        `/federations/${host?.fed_id}/indexes/${host?.index_id}/rss_thresholds`,
        payloadToPost,
        {
          headers: {
            sessionId: session
          }
        }
      ).then(() => {
        queryClient.invalidateQueries({ queryKey: [DAILY_ACTIVITY] });
      });
    }
  });

  // PATCH
  const patchDailyActivityAlertLevel = useMutation({
    mutationFn: async ({ payload, id }: PatchResponse) => {
      const payloadToPatch = {
        ...payload
      };
      return API.patch<PatchResponse>(
        `/federations/${host?.fed_id}/indexes/${host?.index_id}/activity_alert_levels/${id}`,
        payloadToPatch,
        {
          headers: {
            sessionId: session
          }
        }
      ).then(() => {
        queryClient.invalidateQueries({ queryKey: [DAILY_ACTIVITY] });
      });
    }
  });

  // PATCH RSS THRESHOLDS
  const patchRSSActivityAlertLevel = useMutation({
    mutationFn: async ({ payload, id }: PatchResponse) => {
      const payloadToPatch = {
        ...payload
      };
      return API.patch<PatchResponse>(
        `/federations/${host?.fed_id}/indexes/${host?.index_id}/rss_thresholds/${id}`,
        payloadToPatch,
        {
          headers: {
            sessionId: session
          }
        }
      ).then(() => {
        queryClient.invalidateQueries({ queryKey: [DAILY_ACTIVITY] });
      });
    }
  });

  return {
    getDailyActivity,
    postDailyActivityAlertLevel,
    patchDailyActivityAlertLevel,
    postRSSActivityAlertLevel,
    patchRSSActivityAlertLevel
  };
};

export default useDailyActivity;
