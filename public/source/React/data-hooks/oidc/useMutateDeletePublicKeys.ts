import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OIDC_CONFIG } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';
import qs from 'qs';

interface DeletePublicKeyParams {
  keys: string[];
}

const useMutateDeletePublicKeys = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ keys }: DeletePublicKeyParams) =>
      API.delete('/configurations/oidc/public_keys', {
        params: {
          keys
        },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        }
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OIDC_CONFIG] });
    }
  });
};

export default useMutateDeletePublicKeys;
