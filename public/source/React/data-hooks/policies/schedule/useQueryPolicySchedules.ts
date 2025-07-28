import { useQuery } from '@tanstack/react-query';
import { POLICY_SCHEDULE } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';
import { PolicyScheduleData } from './schedule.types';

type PolicySchedules = Array<PolicyScheduleData>;

const getPolicySchedules = (sessionId: string, policyId: string) => () =>
  API.get<PolicySchedules>(`/policies/${policyId}/schedules`, {
    headers: {
      sessionId
    }
  }).then((res) => res.data);

interface Params {
  session: string;
  policyId?: string;
}

const useQueryPolicySchedules = ({ session, policyId }: Params) => {
  return useQuery({
    queryKey: [POLICY_SCHEDULE, session, policyId],
    queryFn: getPolicySchedules(session, policyId!),
    enabled: policyId !== undefined
  });
};

export default useQueryPolicySchedules;
