import { useMutation, useQueryClient } from '@tanstack/react-query';
import { OIDC_CONFIG } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

interface DeleteServerCertificateParams {
  date_uploaded: string;
}

const useMutateDeleteServerCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ date_uploaded }: DeleteServerCertificateParams) =>
      API.delete(`/configurations/oidc/server_certificate`, {
        params: {
          date_uploaded
        }
      }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OIDC_CONFIG] });
    }
  });
};

export default useMutateDeleteServerCertificate;
