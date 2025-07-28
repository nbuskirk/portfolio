import { API } from 'utils/helpers/api';
import { useMutation } from '@tanstack/react-query';

const useMutatePolicies = ({ session }: { session: string }) => {
  return useMutation({
    mutationFn: ({
      payloadToPatch
    }: {
      payloadToPatch: { dba_disabled: boolean };
    }) => {
      return API.patch(`/policies`, payloadToPatch, {
        headers: {
          sessionId: session
        }
      });
    }
  });
};
export default useMutatePolicies;
