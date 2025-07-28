import { useMutation } from '@tanstack/react-query';
import { PolicyDescription } from 'components/Policies/components/PolicyEditor/types';
import { CREATE_POLICY } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';
import { JobTypeData } from './policy.types';
import { PolicyData } from '../useQueryPolicy';

interface CreatePolicyParams {
  display_name: string;
  storage_connector_name: string;
  policy_description: PolicyDescription;
  policy_context: any;
  job_type_data: JobTypeData;
}

const createPolicy =
  (sessionId: string) => (createPolicyParams: CreatePolicyParams) =>
    API.post<PolicyData>('/policies', createPolicyParams, {
      headers: {
        sessionId
      }
    }).then((res) => res.data);

interface Params {
  session: string;
}

const useMutateCreatePolicy = ({ session }: Params) => {
  return useMutation({
    mutationKey: [CREATE_POLICY, session],
    mutationFn: createPolicy(session)
  });
};

export default useMutateCreatePolicy;
