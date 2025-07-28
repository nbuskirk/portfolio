import { useIeSystem } from 'data-hooks/useIeSystem';
import { useUser } from 'utils/context/UserContext';
import { useEula } from './useEula';

const useShowEulaOnly = () => {
  const { session } = useUser();
  const {
    data: eula,
    isLoading: isEulaLoading,
    isSuccess: isEulaSuccess
  } = useEula(session);
  const {
    data: ieSystem,
    isLoading: isIeSystemLoading,
    isSuccess: isIeSystemSuccess
  } = useIeSystem({ session });

  const isLoading = isEulaLoading || isIeSystemLoading;
  const isSuccess = isEulaSuccess && isIeSystemSuccess;

  // If system setup has already been completed but the EULA has not been accepted,
  // the setup wizard will just show the EULA page.
  const showEulaOnly =
    !eula?.data?.accepted_statement &&
    eula?.data?.required === 1 &&
    ieSystem?.system_setup_complete === 1;

  return {
    showEulaOnly,
    isLoading,
    isSuccess
  };
};

export default useShowEulaOnly;
