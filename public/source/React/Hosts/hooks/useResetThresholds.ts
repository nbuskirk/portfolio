import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';
import { THRESHOLDS, THRESHOLD, DAILY_ACTIVITY } from 'constants/queryKeys';
import { AxiosError } from 'axios';

interface ResetThresholdsParams {
  fedId?: string;
  indexId?: number;
}

class ThresholdsResetError extends Error {
  endpoint: string;

  originalError: AxiosError;

  constructor(endpoint: string, error: AxiosError, message: string) {
    super(message);
    this.name = 'ThresholdsResetError';
    this.endpoint = endpoint;
    this.originalError = error;
  }
}

const useResetThresholds = ({ fedId, indexId }: ResetThresholdsParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        // Delete all/custom thresholds
        await API.delete(`/federations/${fedId}/indexes/${indexId}/thresholds`);

        // Delete ransomware signal strength (RSS) - CyberSensitivity Index thresholds
        await API.delete(
          `/federations/${fedId}/indexes/${indexId}/rss_thresholds`
        );

        // Delete activity alert level thresholds
        await API.delete(
          `/federations/${fedId}/indexes/${indexId}/activity_alert_levels`
        );

        return { success: true };
      } catch (error) {
        if (error instanceof AxiosError) {
          const endpoint = error.config?.url || 'unknown endpoint';
          throw new ThresholdsResetError(
            endpoint,
            error,
            error.response?.data?.message ||
              error.message ||
              'An error occurred while resetting thresholds'
          );
        }
        throw new ThresholdsResetError(
          'unknown',
          new AxiosError('Unknown error occurred'),
          'An unexpected error occurred while resetting thresholds'
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [THRESHOLDS] });
      queryClient.invalidateQueries({ queryKey: [THRESHOLD] });
      queryClient.invalidateQueries({ queryKey: [DAILY_ACTIVITY] });
    },
    onError: (error: ThresholdsResetError) => {
      return error;
    }
  });
};

export default useResetThresholds;
