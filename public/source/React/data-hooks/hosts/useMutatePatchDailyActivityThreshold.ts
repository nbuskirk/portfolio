import { API } from 'utils/helpers/api';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { DAILY_ACTIVITY, THRESHOLD } from 'constants/queryKeys';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';

interface Params {
  fedid: string | undefined;
  indexid: number | undefined;
  session: string;
}

const useMutatePatchDailyActivityThreshold = ({
  session,
  fedid,
  indexid
}: Params) => {
  const queryClient = useQueryClient();
  const { showSuccessSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => {
      return API.patch(
        `/federations/${fedid}/indexes/${indexid}/activity_alert_levels/${id}`,
        payload,
        {
          headers: {
            sessionId: session
          }
        }
      );
    },
    onSuccess: () => {
      showSuccessSnackbar('Threshold successfully updated!');
      queryClient.invalidateQueries({ queryKey: [DAILY_ACTIVITY] });
      queryClient.invalidateQueries({ queryKey: [THRESHOLD] });
    }
  });
};
export default useMutatePatchDailyActivityThreshold;
