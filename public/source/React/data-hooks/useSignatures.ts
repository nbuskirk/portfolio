import { useQuery } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';
import { SIGNATURES } from 'constants/queryKeys';

interface SignatureParams {
  sigset_name: string;
  sigtype?: string;
}

const getSignatures = async (
  sessionId: string,
  fedId: string,
  indexId: number,
  params: SignatureParams
) => {
  try {
    const { data } = await API.get(
      `/federations/${fedId}/indexes/${indexId}/signature_sets`,
      {
        params,
        headers: {
          sessionId
        }
      }
    );
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('An error occurred when retrieving signatures.', error);
    return [];
  }
};

const useSignatures = (
  session: string,
  fedId: string,
  indexId: number,
  params: SignatureParams
) => {
  return useQuery({
    queryKey: [SIGNATURES, session],
    queryFn: () => getSignatures(session, fedId, indexId, params),
    enabled: fedId !== '' && indexId >= 0
  });
};

export default useSignatures;
export type { SignatureParams };
