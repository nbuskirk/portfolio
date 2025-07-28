import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';
import { useNavigate } from 'react-router-dom';

const useMutateDeletePolicy = ({
  session
}: {
  session: string;
  setModalOpen: (value: boolean) => void;
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ policyId }: { policyId: string }) => {
      return API.delete(`/policies/${policyId}`, {
        headers: {
          sessionId: session
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['POLICIES'] });
      navigate('/dashboard/policies');
    }
  });
};
export default useMutateDeletePolicy;
