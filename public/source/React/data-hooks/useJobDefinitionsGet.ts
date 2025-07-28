import { useQueryClient } from '@tanstack/react-query';
import { JOB_DEFINITIONS } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

const getJobdefinitions = (sessionId: string, qjobdefid: number) => () =>
  API.get(`/queries/jobdefinitions/${qjobdefid}`, {
    headers: {
      sessionId
    }
  }).then((res) => res.data);

const useJobDefinitionsGet = (session: string) => {
  const queryClient = useQueryClient();
  return (qjobdefid: number) =>
    queryClient.fetchQuery({
      queryKey: [JOB_DEFINITIONS],
      queryFn: getJobdefinitions(session, qjobdefid)
    });
};

export default useJobDefinitionsGet;
