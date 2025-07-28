import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';

const useMutateDeltaBlock = ({ session }: { session: string }) => {
  return useMutation({
    mutationFn: ({
      name,
      payloadToPatch
    }: {
      name: string;
      payloadToPatch: { dba_disabled: boolean | string };
    }) => {
      return API.patch(`/policies/${name}`, payloadToPatch, {
        headers: {
          sessionId: session
        }
      });
    }
  });
};
export default useMutateDeltaBlock;
