import { API } from 'utils/helpers/api';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { THRESHOLDS, THRESHOLD } from 'constants/queryKeys';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';

interface Params {
  fedid: string | undefined;
  indexid: number | undefined;
  session: string;
}

const useMutatePatchThreshold = ({ session, fedid, indexid }: Params) => {
  const queryClient = useQueryClient();
  const { showSuccessSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) => {
      return API.put(
        `/federations/${fedid}/indexes/${indexid}/thresholds/${id}`,
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
      queryClient.invalidateQueries({ queryKey: [THRESHOLD] });
      queryClient.invalidateQueries({ queryKey: [THRESHOLDS] });
    }
  });
};
export default useMutatePatchThreshold;
