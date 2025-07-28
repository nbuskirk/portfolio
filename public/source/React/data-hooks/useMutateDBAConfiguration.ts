import { API } from 'utils/helpers/api';
import { useMutation } from '@tanstack/react-query';

interface DBAConfiguration {
  allow_dba_disable: boolean;
}

const postUpdateDba = (sessionId: string) => (payload: DBAConfiguration) =>
  API.post('/configurations/dba', payload, {
    headers: {
      sessionId
    }
  });

const useMutateDBAConfiguration = ({ session }: { session: string }) => {
  return useMutation({
    mutationFn: postUpdateDba(session)
  });
};
export default useMutateDBAConfiguration;
