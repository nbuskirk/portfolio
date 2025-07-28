import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';
import { YARA_RULES } from 'constants/queryKeys';
import { YaraRule } from './yara.types';

interface CreateYaraRuleParams {
  compile_only?: boolean;
  yaraRule: YaraRule;
}

interface Params {
  fedId?: string;
  indexId?: number;
}

const useMutateCreateYaraRule = ({ fedId, indexId }: Params) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ compile_only, yaraRule }: CreateYaraRuleParams) =>
      API.post(
        `/federations/${fedId}/indexes/${indexId}/yara_rules`,
        yaraRule,
        {
          params: {
            compile_only
          }
        }
      ).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [YARA_RULES] });
    }
  });
};

export default useMutateCreateYaraRule;
