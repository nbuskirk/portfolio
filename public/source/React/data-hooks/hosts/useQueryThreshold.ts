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
  indexId?: number;
  thresholdId: number | null;
}

const queryThreshold =
  ({ indexId, fedId, thresholdId }: GetThresholdParams) =>
  () =>
    API.get<ThresholdResponse>(
      `/federations/${fedId}/indexes/${indexId}/thresholds/${thresholdId}`
    ).then(({ data }) => data);

const useQueryThreshold = ({ indexId, fedId, thresholdId }: Params) => {
  return useQuery({
    queryKey: [THRESHOLD, thresholdId, indexId, fedId],
    queryFn: queryThreshold({
      indexId,
      fedId,
      thresholdId: thresholdId!
    }),
    enabled:
      thresholdId !== undefined &&
      indexId !== undefined &&
      fedId !== undefined &&
      thresholdId !== null
  });
};

export default useQueryThreshold;
