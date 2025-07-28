import { useMutation, useQuery } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';
import { EMAIL_ALERT_LIST } from 'constants/queryKeys';

export interface AlertDataPayload {
  alert_category_list: AlertCategory[];
  alert_email_address_list: string[];
}

export interface AlertCategory {
  alertCategory: string;
  alert_types: string[];
}

const getEmailAlerts = async (session: string) => {
  try {
    const { data } = await API.get('/configurations/emailalerts', {
      headers: {
        sessionId: session
      }
    });
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('An error occurred when retrieving email alerts.', error);
    return [];
  }
};

export function useUpdateEmailMutation(session: string, url: string) {
  return useMutation({
    mutationFn: (payload: AlertDataPayload) =>
      API.patch(url, payload, {
        headers: {
          sessionId: session
        }
      })
  });
}

export function useDeleteEmailMutation(session: string) {
  return useMutation({
    mutationFn: (url: string) =>
      API.delete(url, {
        headers: {
          sessionId: session
        }
      })
  });
}

export function useEmailAlerts({ session }: { session: string }) {
  return useQuery({
    queryKey: [EMAIL_ALERT_LIST, session],
    queryFn: () => getEmailAlerts(session)
  });
}
