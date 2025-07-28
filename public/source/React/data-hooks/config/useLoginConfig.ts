import { useQuery, useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';
import { FED_LOGIN_CONFIG } from 'constants/queryKeys';

export interface LoginConfigResponse {
  failed_login_limits: FailedLoginLimit[];
  password_change_policy: {};
  session_inactivity_timeout?: number;
}

export interface FailedLoginLimit {
  attempts: string;
  within: string;
}

export interface LoginConfigPatchResponse {
  result: Result;
}

export interface Result {
  message: string;
}

export interface FLARule {
  attempts: string;
  within: string;
  unit: string;
}

export interface ErrResponse {
  detail: string;
  status: number;
  title: string;
  type: string;
}

export function isErrResp(
  res: LoginConfigResponse | ErrResponse
): res is ErrResponse {
  return (<ErrResponse>res).detail !== undefined;
}

const getFedLoginConfig = async (session: string) => {
  try {
    const {
      data: { fedid }
    } = await API.get('/configinfo', {
      headers: {
        sessionId: session
      }
    });

    const { data } = await API.get(
      `/federations/${fedid}/configurations/login`,
      {
        headers: {
          sessionId: session
        }
      }
    );
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      'An error occurred when retrieving fed login configurations.',
      error
    );
    return [];
  }
};

export const useFedLoginConfig = (session: string) => {
  return useQuery({
    queryFn: () => getFedLoginConfig(session),
    queryKey: [FED_LOGIN_CONFIG, session]
  });
};

export function useUpdateFedLoginConfigMutation(
  session: string,
  fedid: string
) {
  return useMutation({
    mutationFn: (payload: LoginConfigResponse) =>
      API.patch(`/federations/${fedid}/configurations/login`, payload, {
        headers: {
          sessionId: session
        }
      })
  });
}
