import { API } from 'utils/helpers/api';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { THRESHOLDS } from 'constants/queryKeys';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';

interface Params {
  fedid: string | undefined;
  indexid: number | undefined;
  session: string;
}

const useMutatePostThreshold = ({ session, fedid, indexid }: Params) => {
  const queryClient = useQueryClient();
  const { showSuccessSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: ({ payload }: { payload: any }) =>
      API.post(`/federations/${fedid}/indexes/${indexid}/thresholds`, payload, {
        headers: {
          sessionId: session
        }
      }),
    onSuccess: () => {
      showSuccessSnackbar('Threshold successfully created!');
      queryClient.invalidateQueries({ queryKey: [THRESHOLDS] });
    }
  });
};
export default useMutatePostThreshold;
