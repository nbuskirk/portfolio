import { useQuery } from '@tanstack/react-query';
import {
  ExecJobType,
  ExecLocalState,
  ExecNfsState,
  ExecSharedState,
  PolicyDescription,
  VirtualMachine
} from 'components/Policies/components/PolicyEditor/types';
import { POLICY_JOB_STATE } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

type PolicyJobState =
  | 'Idle'
  | 'Pending'
  | 'Running'
  | 'Done'
  | 'Execute'
  | 'Failed'
  | 'Partial'
  | 'Canceling'
  | 'Canceled'
  | 'Unknown';

export interface PolicyData {
  dba_disabled: boolean;
  display_name: string;
  fullscan_period_days: number;
  inactive: boolean;
  inactive_time: number;
  last_job_end_time: number;
  last_job_number: number;
  last_job_start_time: number;
  last_job_state: PolicyJobState;
  storage_connector_name: string;
  nfs_export: string;
  job_type: ExecJobType;
  policy: string;
  policy_context: Record<any, any>;
  policy_description: PolicyDescription;
  policy_name_encoded: string;
  policy_state: PolicyJobState;
  policy_url: string;
  queued_job: boolean;
  // Shared State
  List_of_email_addresses?: ExecSharedState['List_of_email_addresses'];
  filter?: ExecSharedState['filter'];
  // Local State
  index_as?: ExecLocalState['index_as'];
  // NFS State
  storage_cont_fmt?: ExecNfsState['storage_cont_fmt'];
  btime_delta_start?: ExecNfsState['btime_delta_start'];
  // VMFS State
  virtual_machines?: Array<VirtualMachine>;
  excluded_virtual_machines?: Array<VirtualMachine>;
}

interface GetPolicyParams {
  policyId: string;
  sessionId: string;
}

const queryPolicyJobState =
  ({ policyId, sessionId }: GetPolicyParams) =>
  () =>
    API.get<PolicyData>(`/policies/${policyId}`, {
      headers: {
        sessionId
      }
    }).then(({ data }) => data);

interface Params {
  session: string;
  policyId?: string;
}

const useQueryPolicyJobState = ({ session, policyId }: Params) => {
  return useQuery({
    queryKey: [POLICY_JOB_STATE, session, policyId],
    queryFn: queryPolicyJobState({ sessionId: session, policyId: policyId! }),
    enabled: policyId !== undefined,
    refetchInterval: 10 * 1000
  });
};

export default useQueryPolicyJobState;
