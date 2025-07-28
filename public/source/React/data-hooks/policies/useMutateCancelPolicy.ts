import { API } from 'utils/helpers/api';
import { useMutation } from '@tanstack/react-query';

const useMutateCancelPolicy = ({ session }: { session: string }) => {
  return useMutation({
    mutationFn: ({
      payloadToPatch,
      id,
      jobid
    }: {
      payloadToPatch: { cancel: boolean };
      id: string;
      jobid: number;
    }) => {
      return API.patch(`/policies/${id}/jobs/${jobid}`, payloadToPatch, {
        headers: {
          sessionId: session
        }
      });
    }
  });
};
export default useMutateCancelPolicy;
