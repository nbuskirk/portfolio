import { useQuery } from '@tanstack/react-query';
import { RESTORE } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

export interface RestorePathInterface {
  path?: string;
}

export const getRestorePath = (sessionid: string) => async () =>
  API.get<RestorePathInterface>('/backup/path', {
    headers: {
      sessionid
    }
  });

export const useRestorePath = (session: string) => {
  return useQuery({
    queryKey: [RESTORE, session],
    queryFn: getRestorePath(session),
    enabled: session !== ''
  });
};
