import { useQuery } from '@tanstack/react-query';
import { CONFIGURATIONS_LICENSE } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

interface ConfigurationsLicense {
  hostname: string | null;
}

const getConfigurationsLicense = (sessionId: string) => () =>
  API.get<ConfigurationsLicense>('/configurations/license', {
    headers: {
      sessionId
    }
  }).then((res) => res.data);

interface Params {
  session: string;
}

const useConfigurationsLicense = ({ session }: Params) => {
  return useQuery({
    queryKey: [CONFIGURATIONS_LICENSE, session],
    queryFn: getConfigurationsLicense(session)
  });
};

export default useConfigurationsLicense;
