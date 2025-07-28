import usePolicies from 'data-hooks/policies/usePolicies';
import { useUser } from 'utils/context/UserContext';

const usePolicyNames = () => {
  const { session } = useUser();

  const { data, isLoading, isError, error } = usePolicies({ session });

  const policyNames = data?.policies.map((policy) => policy.display_name.toLowerCase()) ?? [];

  return {
    policyNames,
    policyNamesIsLoading: isLoading,
    policyNamesIsError: isError,
    policyNamesError: error
  } as const;
};

export default usePolicyNames;
