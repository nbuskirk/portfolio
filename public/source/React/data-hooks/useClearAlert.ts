import { useMutation } from '@tanstack/react-query';
import { CLEAR_ALERT } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

interface ClearAlertPatchParams {
  alertId: number;
  data: {
    update_sequence: number;
    hide: number;
    stop_reporting: number;
    cr_policy?: string;
  };
}

const clearAlert =
  (sessionId: string) =>
  ({ alertId, data }: ClearAlertPatchParams) =>
    API.patch(`/alerts/${alertId}`, data, {
      headers: {
        sessionId
      }
    });

interface Params {
  session: string;
}

const useClearAlert = ({ session }: Params) => {
  return useMutation({
    mutationKey: [CLEAR_ALERT, session],
    mutationFn: clearAlert(session)
  });
};

export default useClearAlert;
