import qs from 'qs';
import { useQuery } from '@tanstack/react-query';
import { SESSION_INFO } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

export interface SessionInfoResponse {
  clientip: string;
  engine: {
    engineID: number;
    host: string;
    indexid: number;
    roles: number;
    serial: string;
    version: unknown;
  };
  iesessid: string;
  indexID: number;
  logintime: number;
  project: {
    indexID: number;
    projectID: number;
    projectname: string;
    tag: unknown;
  };
  role: {
    privmask: number;
    readonly: number;
    roleID: number;
    rolename: string;
  };
  resttouchtime: number;
  system_time: number;
  touchtime: number;
  user: {
    active: number;
    adauth_usr: any;
    expires: number;
    isblocked: number | null;
    mustchange: boolean;
    oath_password: unknown;
    password: unknown;
    readonly: number;
    userID: number;
    username: string;
    usertype: number;
    expiry_warning_days: number;
  };
}

export const getSessionInfo =
  <T extends keyof SessionInfoResponse>(sessionId: string, filter: T[]) =>
  () =>
    API.get<Pick<SessionInfoResponse, T>>(`/sessions/${sessionId}`, {
      headers: {
        sessionId
      },
      params: {
        filter
      },
      paramsSerializer: (params) => {
        if (params.filter.length) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        }
        const base = 'filter=';
        const rest = Object.fromEntries(
          Object.entries(params).filter((k) => k[0] !== 'filter')
        );
        return base + qs.stringify(rest);
      }
    });

interface Params<T> {
  session: string;
  filter: T[];
  refetchInterval?: false | number;
  refetchOnWindowFocus?: 'always' | boolean | undefined;
  enforceRefetch?: boolean;
}

export const sessionInfoQuery = <T extends keyof SessionInfoResponse>({
  session,
  filter,
  refetchInterval = false,
  refetchOnWindowFocus = undefined,
  enforceRefetch = false
}: Params<T>) => ({
  queryKey: [
    SESSION_INFO,
    session,
    ...filter,
    enforceRefetch ? new Date().getSeconds().toString() : ''
  ],
  queryFn: getSessionInfo(session, filter),
  enabled: session !== '',
  refetchInterval,
  refetchOnWindowFocus
});

const useSessionInfo = <T extends keyof SessionInfoResponse>({
  session,
  filter,
  refetchInterval = false,
  refetchOnWindowFocus = undefined,
  enforceRefetch = false
}: Params<T>) => {
  return useQuery(
    sessionInfoQuery({
      session,
      filter,
      refetchInterval,
      refetchOnWindowFocus,
      enforceRefetch
    })
  );
};

export default useSessionInfo;
