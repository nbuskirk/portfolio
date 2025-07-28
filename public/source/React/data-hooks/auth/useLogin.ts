import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';

interface LoginParams {
  username: string;
  password: string;
  newpassword?: string;
  otp?: string;
}

interface LoginResponse {
  expires: number;
  sessionid: string;
}

export const login = ({ username, password, newpassword, otp }: LoginParams) =>
  API.post<LoginResponse>('/sessions', {
    user_name: username,
    password,
    newpassword,
    otp
  });

export const useLogin = (skipErrorHandler: boolean) => {
  return useMutation({
    mutationFn: login,
    meta: {
      skipGlobalErrorHandler: skipErrorHandler
    }
  });
};
