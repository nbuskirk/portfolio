import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';

interface StoredQueryPayload {
  author: string;
  description: string;
  global: number;
  graphmode: string;
  kftmode: string;
  production: string;
  qname: string;
  query: string;
  regexlang: string;
  user_query: string;
  view: string;
  orderby: string;
}

export const getStoredQueryPayload = (
  query: string,
  qname: string
): StoredQueryPayload => {
  return {
    author: 'Index Engines Inc.',
    description: 'This query aims to locate malware-infected files.',
    global: 1,
    graphmode: 'together',
    kftmode: 'all',
    production: 'Both',
    qname,
    query,
    regexlang: 'simple',
    user_query: query,
    view: 'responsive',
    orderby: 'unsorted'
  };
};

const useStoredqueries = (
  session: string,
  fedid: string | undefined,
  index: number | undefined
) => {
  return useMutation({
    mutationFn: (queryPayload: StoredQueryPayload) =>
      API.post(
        `/federations/${fedid}/indexes/${index}/storedqueries`,
        queryPayload,
        {
          headers: {
            sessionId: session
          }
        }
      )
  });
};

export default useStoredqueries;
export type { StoredQueryPayload };
