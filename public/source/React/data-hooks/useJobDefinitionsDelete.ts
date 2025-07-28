import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';

const useJobDefinitionsDelete = (session: string) => {
  return useMutation({
    mutationFn: (qjobdefid: number) =>
      API.delete(`/queries/jobdefinitions/${qjobdefid}`, {
        headers: {
          sessionId: session
        }
      })
  });
};

export default useJobDefinitionsDelete;
