import { useQuery } from '@tanstack/react-query';
import { STOREDQUERIES } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

type GetStoredQueryParams = {
  session: string;
  fedid: string | undefined;
  indexid: number | undefined;
  qname: string;
};

const getStoredQuery = async ({
  session,
  fedid,
  indexid,
  qname
}: GetStoredQueryParams) =>
  API.get(`/federations/${fedid}/indexes/${indexid}/storedqueries/${qname}`, {
    headers: {
      sessionId: session
    }
  });

const useStoredQueriesGet = ({
  session,
  fedid,
  indexid,
  qname
}: GetStoredQueryParams) => {
  return useQuery({
    queryKey: [STOREDQUERIES, fedid, indexid, qname],
    queryFn: () =>
      getStoredQuery({
        session,
        fedid,
        indexid,
        qname
      }),
    enabled: !!session && !!fedid && indexid !== undefined && !!qname,
    refetchInterval: 120000
  });
};

export default useStoredQueriesGet;
export { getStoredQuery };
