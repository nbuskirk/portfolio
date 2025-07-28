import { useQueryClient } from '@tanstack/react-query';
import { INDEXES } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

interface FederationIndex {
  capacity: number;
  ctime: number;
  flags: string;
  indexid: number;
  istate: string;
  licenseqjobdefid: number;
  licenseqjobinstid: number;
  mngdbifs: number;
  mngdbytes: number;
  mngdtapes: number;
  mtime: number;
  name: string;
  tapedb: {
    uuid: string;
  };
}

type IndexesResponse = Array<FederationIndex>;

const getIndexs = (params: Params) => () =>
  API.get<IndexesResponse>(`/federations/${params.fedid}/indexes`, {
    headers: {
      sessionId: params.session
    }
  }).then((res) => res.data);

interface Params {
  session: string;
  fedid: string;
}

const useFetchQueryIndexes = () => {
  const queryClient = useQueryClient();
  return (params: Params) =>
    queryClient.fetchQuery({
      queryKey: [INDEXES, params.session, params.fedid],
      queryFn: getIndexs(params)
    });
};

export default useFetchQueryIndexes;
