import { useMutation, useQueryClient } from '@tanstack/react-query';
import { YARA_RULES } from 'constants/queryKeys';
import qs from 'qs';
import { API } from 'utils/helpers/api';

interface DeleteYaraRuleParams {
  ids: string[];
}

interface Params {
  fedId?: string;
  indexId?: number;
}

const useMutateDeleteYaraRule = ({ fedId, indexId }: Params) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids }: DeleteYaraRuleParams) =>
      API.delete(`/federations/${fedId}/indexes/${indexId}/yara_rules`, {
        params: {
          ids
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        }
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [YARA_RULES] });
    }
  });
};

export default useMutateDeleteYaraRule;
