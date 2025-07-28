import { useQuery } from '@tanstack/react-query';
import { OIDC_CONFIG } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';
import { OidcConfig } from './oidcConfig.types';

export const queryOidcConfig = () =>
  API.get<OidcConfig>('/configurations/oidc').then(({ data }) => {
    const publicKeys = data.public_keys?.map((publicKey) => {
      return {
        ...publicKey,
        // convert json string to object
        value: JSON.parse(publicKey.value)
      };
    });

    // eslint-disable-next-line no-param-reassign
    data.public_keys = publicKeys;
    return data;
  });

interface QueryOidcConfigParams {
  initialData?: OidcConfig;
}

const useQueryOidcConfig = ({ initialData }: QueryOidcConfigParams) => {
  return useQuery({
    queryKey: [OIDC_CONFIG],
    queryFn: queryOidcConfig,
    initialData
  });
};

export default useQueryOidcConfig;
