import { useQuery, useMutation } from '@tanstack/react-query';
import { SESSION_CONFIG } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

interface SessionConfigResponse {
  max_idle_minutes?: number;
  same_index_acess?: boolean;
  same_ip_access?: boolean;
  session_inactivity_timeout: number;
}

export const getSessionConfig = (sessionId: string) => () =>
  API.get<SessionConfigResponse>('/configurations/session', {
    headers: {
      sessionId
    }
  });

export const useSessionConfig = (session: string) => {
  return useQuery({
    queryKey: [SESSION_CONFIG, session],
    queryFn: getSessionConfig(session),
    enabled: session !== ''
  });
};

export function useUpdateSessionConfigMutation(session: string) {
  return useMutation({
    mutationFn: (payload: SessionConfigResponse) =>
      API.patch('/configurations/session', payload, {
        headers: {
          sessionId: session
        }
      })
  });
}
