import { useMutation, useQueryClient } from '@tanstack/react-query';
import { YARA_RULES } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

interface UploadYaraRuleFileCreateParams {
  compile_only?: boolean;
  formData: FormData;
}

interface Params {
  fedId?: string;
  indexId?: number;
}

const useMutateUploadYaraRuleFileCreate = ({ fedId, indexId }: Params) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ compile_only, formData }: UploadYaraRuleFileCreateParams) =>
      API.post(
        `/federations/${fedId}/indexes/${indexId}/yara_rules`,
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
    },
    meta: {
      skipGlobalErrorHandler: true
    }
  });
};

export default useMutateUploadYaraRuleFileCreate;
