import { useMutation, useQueryClient } from '@tanstack/react-query';
import { YARA_RULE, YARA_RULES } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

interface UpdateYaraRulesParams {
  enabled?: boolean;
}

interface Params {
  fedId?: string;
  indexId?: number;
}

const useMutateUpdateYaraRules = ({ fedId, indexId }: Params) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ enabled }: UpdateYaraRulesParams) =>
      API.patch(`/federations/${fedId}/indexes/${indexId}/yara_rules`, {
        enabled
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [YARA_RULES] });
      queryClient.invalidateQueries({ queryKey: [YARA_RULE] });
    }
  });
};

export default useMutateUpdateYaraRules;
