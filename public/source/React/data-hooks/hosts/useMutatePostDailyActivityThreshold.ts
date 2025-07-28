import { API } from 'utils/helpers/api';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { DAILY_ACTIVITY } from 'constants/queryKeys';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';

interface Params {
  fedid: string | undefined;
  indexid: number | undefined;
  session: string;
}

const useMutatePostDailyActivityThreshold = ({
  session,
  fedid,
  indexid
}: Params) => {
  const queryClient = useQueryClient();
  const { showSuccessSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: ({ payload }: { payload: any }) => {
      return API.post(
        `/federations/${fedid}/indexes/${indexid}/activity_alert_levels`,
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
    }
  });
};
export default useMutatePostDailyActivityThreshold;
