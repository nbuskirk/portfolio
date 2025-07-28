import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';

const useJobinstances = (sessionId: string) => {
  return useMutation({
    mutationFn: (qjobdefid) =>
      API.post(
        '/queries/jobinstances',
        { qjobdefid },
        {
          headers: {
            sessionId
          }
        }
      )
  });
};
export default useJobinstances;
