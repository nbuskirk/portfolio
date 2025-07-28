import { API } from 'utils/helpers/api';
import { useMutation } from '@tanstack/react-query';

const useMutateRunPolicy = ({ session }: { session: string }) => {
  return useMutation({
    mutationFn: async ({
      payloadToPatch,
      id
    }: {
      payloadToPatch: { start: boolean };
      id: string;
    }) => {
      return API.post(`/policies/${id}/jobs`, payloadToPatch, {
        headers: {
          sessionId: session
        }
      }).then((res) => res.data);
    }
  });
};
export default useMutateRunPolicy;
