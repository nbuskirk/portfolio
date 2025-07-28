import { useQuery } from '@tanstack/react-query';
import { GET_STORAGE_CONNECTORS } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

type StorageConnectorsData = Array<{
  display_name: string;
  name: string;
  version: number | string;
}>;

const getStorageConnectors = (sessionId: string) => () =>
  API.get<StorageConnectorsData>('storage_connectors', {
    headers: {
      sessionId
    }
  }).then((res) => res.data);

interface Params<TResult = StorageConnectorsData> {
  session: string;
  select?: (data: StorageConnectorsData) => TResult;
}

const useQueryStorageConnectors = <TResult = StorageConnectorsData>({
  session,
  select
}: Params<TResult>) => {
  return useQuery({
    queryKey: [GET_STORAGE_CONNECTORS, session],
    queryFn: getStorageConnectors(session),
    select
  });
};

export default useQueryStorageConnectors;
