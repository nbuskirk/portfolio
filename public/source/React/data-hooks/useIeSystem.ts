import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { IESYSTEM } from 'constants/queryKeys';
import { API } from '../utils/helpers/api';

// import { mockNetworkError } from '_mocks_/iesystem_error';
// import { MOCKAPI } from 'utils/helpers/apiMockup';

export interface IeSystemResponse {
  system_setup_complete: number;
  ie_release: string;
  system_time: number;
  system_timezone: string | undefined;
}

// mockNetworkError();

const getIeSystem = (sessionid: string) => () =>
  API.get<IeSystemResponse>('/iesystem', {
    headers: {
      sessionid
    }
  }).then((res) => res.data);

interface Params {
  session: string;
  refetchOnWindowFocus?: boolean;
  refetchInterval?: number;
}

export const useIeSystem = ({
  session,
  refetchOnWindowFocus = false,
  refetchInterval = 30000
}: Params): UseQueryResult<IeSystemResponse, AxiosError> => {
  return useQuery({
    queryKey: [IESYSTEM, session],
    queryFn: getIeSystem(session),
    refetchOnWindowFocus,
    refetchInterval
  });
};

export const ieTimezone = (ie: IeSystemResponse | undefined) =>
  ie?.system_timezone;
