import { useQuery } from '@tanstack/react-query';
import { EULA } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

export interface EulaInterface {
  eula_html?: string;
  accepted_statement?: string;
  required?: number;
  email?: string;
  name?: string;
  engine?: string;
  remote_ip?: string;
  timestamp?: number;
}

export const getEula = (sessionid: string) => async () =>
  API.get<EulaInterface>('/eula', {
    headers: {
      sessionid
    }
  });

export const useEula = (session: string) => {
  return useQuery({
    queryKey: [EULA, session],
    queryFn: getEula(session),
    enabled: session !== ''
  });
};
