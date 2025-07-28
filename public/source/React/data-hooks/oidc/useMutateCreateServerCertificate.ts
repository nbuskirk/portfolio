import { useMutation, useQueryClient } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';
import { OIDC_CONFIG } from 'constants/queryKeys';

interface ServerCertificationRequest {
  server_certificate: { certificate: string };
}

const useMutateCreateServerCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ server_certificate }: ServerCertificationRequest) =>
      API.patch('/configurations/oidc', {
        server_certificate
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [OIDC_CONFIG] });
    }
  });
};

export default useMutateCreateServerCertificate;
