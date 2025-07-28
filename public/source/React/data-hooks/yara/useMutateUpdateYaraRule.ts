import { useMutation, useQueryClient } from '@tanstack/react-query';
import { YARA_RULE, YARA_RULES } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

export interface UpdateYaraRuleRequest {
  display_name?: string;
  enabled?: boolean;
  rule?: string;
  severity?: string;
}

interface UpdateYaraRuleParams {
  id: string;
  compile_only?: boolean;
  yaraRule: UpdateYaraRuleRequest;
}

interface Params {
  fedId?: string;
  indexId?: number;
}

const useMutateUpdateYaraRule = ({ fedId, indexId }: Params) => {
  const queryClient = useQueryClient();
  let resetQuery = false;

  return useMutation({
    mutationFn: ({ id, compile_only, yaraRule }: UpdateYaraRuleParams) => {
      if (!compile_only) {
        resetQuery = true;
      }
      return API.patch(
        `/federations/${fedId}/indexes/${indexId}/yara_rules/${id}`,
        yaraRule,
        {
          params: {
            compile_only
          }
        }
      ).then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [YARA_RULES] });
      queryClient.invalidateQueries({ queryKey: [YARA_RULE] });
      if (resetQuery) {
        queryClient.resetQueries({ queryKey: [YARA_RULE] });
      }
    }
  });
};

export default useMutateUpdateYaraRule;
