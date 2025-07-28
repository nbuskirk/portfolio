import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';
import { YARA_RULES, YARA_RULE } from 'constants/queryKeys';
import { AxiosError } from 'axios';

interface ResetYaraRulesParams {
  fedId?: string;
  indexId?: number;
}

class YaraRulesetsResetError extends Error {
  endpoint: string;

  originalError: AxiosError;

  constructor(endpoint: string, error: AxiosError, message: string) {
    super(message);
    this.name = 'YaraRulesetsResetError';
    this.endpoint = endpoint;
    this.originalError = error;
  }
}

const useResetYaraRules = ({ fedId, indexId }: ResetYaraRulesParams) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return API.delete(`/federations/${fedId}/indexes/${indexId}/yara_rules`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [YARA_RULES] });
      queryClient.invalidateQueries({ queryKey: [YARA_RULE] });
    },
    onError: (error: YaraRulesetsResetError) => {
      return error;
    }
  });
};

export default useResetYaraRules;
