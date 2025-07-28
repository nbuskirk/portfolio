import { useMutation } from '@tanstack/react-query';
import { PolicyDescription } from 'components/Policies/components/PolicyEditor/types';
import { API } from 'utils/helpers/api';
import { JobTypeData } from './policy.types';

interface UpdatePolicyParams {
  policyId: string;
  policyData: {
    display_name: string;
    storage_connector_name: string;
    policy_description: PolicyDescription;
    policy_context: any;
    job_type_data: JobTypeData;
  };
}

const updatePolicy =
  (sessionId: string) =>
  ({ policyId, policyData }: UpdatePolicyParams) =>
    API.patch(`/policies/${policyId}`, policyData, {
      headers: {
        sessionId
      }
    }).then((res) => res.data);

interface Params {
  session: string;
}

const useMutateUpdatePolicy = ({ session }: Params) => {
  return useMutation({
    mutationFn: updatePolicy(session)
  });
};

export default useMutateUpdatePolicy;
