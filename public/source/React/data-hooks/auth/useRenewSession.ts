import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';

interface UpdateTouchTime {
  action: 'touch';
}

interface RenewSession {
  action: 'renew';
  username: string;
  password: string;
  otp?: string;
}

type RenewParams = RenewSession | UpdateTouchTime;

export const renew = (sessionId: string) => (params: RenewParams) =>
  API.patch(
    `/sessions/${sessionId}`,
    params.action === 'renew'
      ? {
          update_ui_touchtime: true,
          user_name: params.username,
          password: params.password,
          otp: params.otp
        }
      : {
          update_ui_touchtime: true
        },
    {
      headers: {
        sessionId
      }
    }
  );

export const useRenewSession = (session: string) => {
  return useMutation({
    mutationFn: renew(session)
  });
};
