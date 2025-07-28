import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';

const useStoredqueriesDelete = (
  session: string,
  fedid: string | undefined,
  index: number | undefined
) => {
  return useMutation({
    mutationFn: (qname: string) =>
      API.delete(
        `/federations/${fedid}/indexes/${index}/storedqueries/${qname}`,
        {
          headers: {
            sessionId: session
          }
        }
      )
  });
};

export default useStoredqueriesDelete;
