import { baseURL } from 'utils/helpers/api';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { USER_PREFERENCES } from 'constants/queryKeys';
import axios, { AxiosError } from 'axios';

export const getPreferences = async (
  fedid: string | undefined,
  id: number | undefined,
  sessionid: string | undefined
) => {
  const axiosConfig = {
    method: 'get' as const,
    baseURL: `${baseURL}/federations/${fedid}/users/${id}/preferences`,
    headers: {
      sessionid
    },
    responseType: 'json' as const
  };
  const { data } = await axios(axiosConfig);
  return data;
};

interface Params {
  fed_id: string | undefined;
  id: number | undefined;
  sessionid: string;
  enabled?: boolean;
}

interface PreferencesResult {
  name: string;
  value: string;
}

const useQueryPreferences = ({
  fed_id,
  id,
  sessionid
}: Params): UseQueryResult<PreferencesResult[], AxiosError> => {
  return useQuery({
    queryKey: [USER_PREFERENCES, fed_id, id],
    queryFn: () => getPreferences(fed_id, id, sessionid),
    refetchInterval: 60000,
    enabled: !!sessionid && !!fed_id && !!id
  });
};

export default useQueryPreferences;
