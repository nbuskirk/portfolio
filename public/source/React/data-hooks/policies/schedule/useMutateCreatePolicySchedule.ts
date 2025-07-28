import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';
import { ScheduleData } from './schedule.types';

interface CreateScheduleParams {
  policyId: string;
  scheduleData: ScheduleData;
}

interface CreateScheduleResponse {
  result: {
    error: {
      code: number;
      text: string;
    };
    schedid: number;
    warnings: Array<unknown>;
  };
}

const createSchedule =
  (sessionId: string) =>
  ({ scheduleData, policyId }: CreateScheduleParams) =>
    API.post<CreateScheduleResponse>(
      `/policies/${policyId}/schedules`,
      scheduleData,
      {
        headers: { sessionId }
      }
    ).then((res) => res.data);

interface Params {
  session: string;
}

const useMutateCreatePolicySchedule = ({ session }: Params) => {
  return useMutation({
    mutationFn: createSchedule(session)
  });
};

export default useMutateCreatePolicySchedule;
