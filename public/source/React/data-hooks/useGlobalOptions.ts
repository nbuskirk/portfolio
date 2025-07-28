import { useQuery } from '@tanstack/react-query';
import { GLOBAL_OPTIONS } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

export interface GlobalOptionsInterface {
  dba_enabled?: boolean;
}

export const getGlobalOptions = (sessionid: string) => async () =>
  API.get<GlobalOptionsInterface>('/backup/path', {
    headers: {
      sessionid
    }
  });

export const useGlobalOptions = (session: string) => {
  return useQuery({
    queryKey: [GLOBAL_OPTIONS, session],
    queryFn: getGlobalOptions(session),
    enabled: session !== ''
  });
};
