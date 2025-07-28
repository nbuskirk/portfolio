import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';

interface DeleteScheduleParams {
  policyId: string;
  scheduleId: number;
}

interface DeleteScheduleResponse {
  detail: string;
  error: unknown;
  status: number;
  title: string;
}

const deleteSchedule =
  (sessionId: string) =>
  ({ policyId, scheduleId }: DeleteScheduleParams) =>
    API.delete<DeleteScheduleResponse>(
      `/policies/${policyId}/schedules/${scheduleId}`,
      {
        headers: {
          sessionId
        }
      }
    ).then((res) => res.data);

interface Params {
  session: string;
}

const useMutateDeletePolicySchedule = ({ session }: Params) => {
  return useMutation({
    mutationFn: deleteSchedule(session)
  });
};

export default useMutateDeletePolicySchedule;
