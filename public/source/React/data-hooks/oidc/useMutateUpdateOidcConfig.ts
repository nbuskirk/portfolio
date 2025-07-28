import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';
import { OIDC_CONFIG } from 'constants/queryKeys';
import { OidcConfig } from './oidcConfig.types';

const useMutateUpdateOidcConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ oidc_enabled, realm, base_url }: OidcConfig) =>
      API.patch('/configurations/oidc', {
        oidc_enabled,
        realm,
        base_url
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OIDC_CONFIG] });
    }
  });
};

export default useMutateUpdateOidcConfig;
