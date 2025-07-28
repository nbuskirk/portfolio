import { useMutation } from '@tanstack/react-query';
import { useUser } from 'utils/context/UserContext';
import { API } from 'utils/helpers/api';

export const logout = (sessionId: string) => () =>
  API.delete<void>(`/sessions/${sessionId}`, {
    headers: {
      sessionId
    }
  });

export const useLogout = () => {
  const { session } = useUser();
  return useMutation({
    mutationFn: logout(session)
  });
};
