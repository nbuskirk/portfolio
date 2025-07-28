import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';
import { ScheduleData } from './schedule.types';

interface UpdatePolicyParams {
  policyId: string;
  scheduleId: number;
  scheduleData: ScheduleData;
}

type UpdateResponse = number;

const updatePolicySchedule =
  (sessionId: string) =>
  ({ policyId, scheduleId, scheduleData }: UpdatePolicyParams) =>
    API.patch<UpdateResponse>(
      `/policies/${policyId}/schedules/${scheduleId}`,
      scheduleData,
      {
        headers: {
          sessionId
        }
      }
    ).then((res) => res.data);

interface Params {
  session: string;
}

const useMutateUpdatePolicySchedule = ({ session }: Params) => {
  return useMutation({
    mutationFn: updatePolicySchedule(session)
  });
};

export default useMutateUpdatePolicySchedule;
