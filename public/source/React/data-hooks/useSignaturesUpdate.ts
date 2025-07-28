import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';

interface SignaturesPayload {
  signatures: string[];
  version: number;
  sigset_name: string;
  sigtype?: string;
}

const useSignaturesUpdate = (
  sessionId: string,
  fedId: string,
  indexId: number
) => {
  return useMutation({
    mutationFn: (payload: SignaturesPayload) =>
      API.put(
        `/federations/${fedId}/indexes/${indexId}/signature_sets`,
        payload,
        {
          headers: {
            sessionId
          }
        }
      )
  });
};

export default useSignaturesUpdate;
export type { SignaturesPayload };
