import { useMutation, useQueryClient } from '@tanstack/react-query';
import { YARA_RULE, YARA_RULES } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

interface UploadYaraRuleFileUpdateParams {
  compile_only?: boolean;
  formData: FormData;
  id: string;
}

interface Params {
  fedId?: string;
  indexId?: number;
}

const useMutateUploadYaraRuleFileUpdate = ({ fedId, indexId }: Params) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      compile_only,
      formData,
      id
    }: UploadYaraRuleFileUpdateParams) =>
      API.patch(
        `/federations/${fedId}/indexes/${indexId}/yara_rules/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          params: {
            compile_only
          }
        }
      ).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [YARA_RULES] });
      queryClient.invalidateQueries({ queryKey: [YARA_RULE] });
    },
    meta: {
      skipGlobalErrorHandler: true
    }
  });
};

export default useMutateUploadYaraRuleFileUpdate;
