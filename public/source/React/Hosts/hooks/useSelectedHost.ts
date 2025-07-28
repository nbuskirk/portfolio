import { Host } from 'data-hooks/useDailyActivity';
import useLocalStorage from 'hooks/useLocalstorage';
import { LocalStorageKeys } from 'constants/constants';

const { SELECTED_HOST } = LocalStorageKeys;

// Manage host selection, ensuring the selected host exists in the provided list of avaiable hosts.
const useSelectedHost = (backupHostList: Host[] | undefined) => {
  const [storedHost, setStoredHost] = useLocalStorage<Host | undefined>(
    SELECTED_HOST,
    undefined
  );

  if (backupHostList && backupHostList.length > 0) {
    // If there's a stored host, check if it still exists in the backupHostList.
    if (storedHost) {
      const hostExists = backupHostList.some(
        (h) =>
          h.hostname === storedHost.hostname &&
          h.fed_id === storedHost.fed_id &&
          h.index_id === storedHost.index_id
      );

      // If the stored host doesn't exist in the list, use the first host.
      if (!hostExists) {
        setStoredHost(backupHostList[0]);
        return [backupHostList[0], setStoredHost] as const;
      }

      // Stored host exists in list, use it.
      return [storedHost, setStoredHost] as const;
    }

    // No stored host, use the first one available in the list.
    setStoredHost(backupHostList[0]);
    return [backupHostList[0], setStoredHost] as const;
  }

  // Backup host list not available, wait until it is
  return [];
};

export default useSelectedHost;
