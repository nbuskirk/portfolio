import useQueryStorageConnectors from 'data-hooks/policies/useQueryStorageConnectors';
import { useUser } from 'utils/context/UserContext';

export type StorageConnectors = Array<{
  displayName: string;
  name: string;
}>;

const useStorageConnectors = () => {
  const { session } = useUser();
  return useQueryStorageConnectors<StorageConnectors>({
    session,
    select: (storageConnectorsData) => {
      const pm = storageConnectorsData.map((storageConnectors) => ({
        displayName: storageConnectors.display_name,
        name: storageConnectors.name
      }));
      return pm;
    }
  });
};

export default useStorageConnectors;
