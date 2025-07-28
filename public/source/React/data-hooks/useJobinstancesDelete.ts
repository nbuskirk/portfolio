import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';

export const deleteJobInstance = async (
  qjobinstid: number,
  sessionId: string
) =>
  API.delete(`/queries/jobinstances/${qjobinstid}`, {
    headers: {
      sessionId
    }
  });
const useJobinstancesDelete = (sessionId: string) => {
  return useMutation({
    mutationFn: (qjobinstid: number) => deleteJobInstance(qjobinstid, sessionId)
  });
};
export default useJobinstancesDelete;
