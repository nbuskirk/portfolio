import { useUser } from 'utils/context/UserContext';

const useHasEditYaraRulesPermission = () => {
  const { canAccess } = useUser();
  return canAccess('admin') || canAccess('alertmgmt');
};

export default useHasEditYaraRulesPermission;
