import { useQuery } from '@tanstack/react-query';
import { MFA_ENABLED } from 'constants/queryKeys';
import { useUser } from 'utils/context/UserContext';
import { API } from '../utils/helpers/api';

const OTP_SETTING_OPTIONS = ['never', 'always', 'ifset'] as const;

interface MfaResponse {
  fedid?: string;
  otp_setting: (typeof OTP_SETTING_OPTIONS)[number];
}

export const getMfaConfiguration = (session: string) => () =>
  API.get<MfaResponse>('/configurations/mfa', {
    headers: {
      sessionId: session
    }
  });

const useMfa = () => {
  const { session } = useUser();
  return useQuery({
    queryKey: [MFA_ENABLED, session],
    queryFn: getMfaConfiguration(session),
    select: (res) => {
      const { data } = res;
      return {
        ...res,
        data: {
          ...data,
          enabled: data.otp_setting === 'always' || data.otp_setting === 'ifset'
        }
      };
    }
  });
};

export default useMfa;
