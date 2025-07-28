import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';
import { PasswordComplexityPayload } from './types';

const updateConfig =
  (sessionId: string, fedid: string | undefined) =>
  (data: PasswordComplexityPayload) =>
    API.patch(`/federations/${fedid}/configurations/password`, data, {
      headers: {
        sessionId
      }
    });

const usePasswordConfigPatch = (session: string, fedid: string | undefined) => {
  return useMutation({
    mutationKey: ['PASSWORD_CONFIG_PATCH', session],
    mutationFn: updateConfig(session, fedid),
    meta: {
      skipGlobalErrorHandler: true
    }
  });
};

export default usePasswordConfigPatch;
