import { useQueryClient } from '@tanstack/react-query';
import { POLICIES, POLICY } from 'constants/queryKeys';
import useMutateCancelPolicy from 'data-hooks/policies/useMutateCancelPolicy';
import useMutateRunPolicy from 'data-hooks/policies/useMutateRunPolicy';
import { PolicyData } from 'data-hooks/policies/useQueryPolicy';
import { useUser } from 'utils/context/UserContext';

interface Params {
  policyData: PolicyData;
}

const usePolicyActions = ({ policyData }: Params) => {
  const { session } = useUser();
  // TODO: Combine Queries Below into 1
  const mutateRunPolicy = useMutateRunPolicy({ session });
  const mutateCancelPolicy = useMutateCancelPolicy({ session });
  const queryClient = useQueryClient();

  const runPolicy = () =>
    mutateRunPolicy
      .mutateAsync({
        payloadToPatch: {
          start: true
        },
        id: policyData.policy
      })
      .finally(() => {
        queryClient.invalidateQueries({ queryKey: [POLICIES] });
        queryClient.invalidateQueries({ queryKey: [POLICY] });
      });

  const cancelPolicy = () =>
    mutateCancelPolicy
      .mutateAsync({
        payloadToPatch: {
          cancel: true
        },
        id: policyData.policy,
        jobid: policyData.last_job_number
      })
      .finally(() => {
        queryClient.invalidateQueries({ queryKey: [POLICIES] });
        queryClient.invalidateQueries({ queryKey: [POLICY] });
      });

  return {
    runPolicy,
    cancelPolicy,
    mutateRunPolicy,
    mutateCancelPolicy
  } as const;
};

export default usePolicyActions;
