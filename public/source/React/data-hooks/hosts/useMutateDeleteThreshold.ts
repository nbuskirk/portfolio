import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { API } from 'utils/helpers/api';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import { THRESHOLDS } from 'constants/queryKeys';

interface Params {
  id: string | undefined;
  fedid: string | undefined;
  indexid: number | undefined;
  session: string;
}

const useMutateDeleteThreshold = ({ session, fedid, indexid }: Params) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccessSnackbar } = useSnackbarContext();

  return useMutation({
    mutationFn: ({ id }: { id: string | undefined }) => {
      return API.delete(
        `/federations/${fedid}/indexes/${indexid}/thresholds/${id}`,
        {
          headers: {
            sessionId: session
          }
        }
      );
    },
    onSuccess: () => {
      showSuccessSnackbar('Threshold successfully deleted!');
      queryClient.invalidateQueries({ queryKey: [THRESHOLDS] });
      navigate('/dashboard/settings/customthresholds');
    }
  });
};
export default useMutateDeleteThreshold;
