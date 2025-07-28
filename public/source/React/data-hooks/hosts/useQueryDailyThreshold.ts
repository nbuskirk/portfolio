import { useQuery } from '@tanstack/react-query';
import { THRESHOLD } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';
import { ThresholdResponse } from './useThresholds';

interface Params {
  thresholdId?: number | null;
  fedId?: string;
  indexId?: number;
}

interface GetThresholdParams {
  fedId?: string;
  indexId?: number | null;
  thresholdId: number;
}

const queryThreshold =
  ({ indexId, fedId, thresholdId }: GetThresholdParams) =>
  () =>
    API.get<ThresholdResponse>(
      `/federations/${fedId}/indexes/${indexId}/activity_alert_levels/${thresholdId}`
    ).then(({ data }) => data);

const useQueryDailyThreshold = ({ indexId, fedId, thresholdId }: Params) => {
  return useQuery({
    queryKey: [THRESHOLD, thresholdId, indexId, fedId],
    queryFn: queryThreshold({
      indexId,
      fedId,
      thresholdId: thresholdId!
    }),
    enabled:
      thresholdId !== undefined &&
      indexId !== null &&
      fedId !== undefined &&
      thresholdId !== null
  });
};

export default useQueryDailyThreshold;
