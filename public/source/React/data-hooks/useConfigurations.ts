import { useQuery } from '@tanstack/react-query';
import { CONFIGURATIONS } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

interface Configurations {
  dba: {
    allow_dba_disable: '1' | '0';
  };
  yara: {
    enable_all: '1' | '0';
  };
}

const getConfigurations = (sessionId: string) => () =>
  API.get<Configurations>('/configurations', {
    headers: {
      sessionId
    }
  }).then((res) => res.data);

interface Params {
  session: string;
}

const useConfigurations = ({ session }: Params) => {
  return useQuery({
    queryKey: [CONFIGURATIONS, session],
    queryFn: getConfigurations(session),
    enabled: session !== ''
  });
};

export default useConfigurations;
