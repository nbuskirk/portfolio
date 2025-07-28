import { API } from 'utils/helpers/api';
import { useMutation } from '@tanstack/react-query';

interface DBAConfiguration {
  enable_all: boolean;
}

const postUpdateYara = (sessionId: string) => (payload: DBAConfiguration) =>
  API.post('/configurations/yara', payload, {
    headers: {
      sessionId
    }
  });

const useMutateYARAConfiguration = ({ session }: { session: string }) => {
  return useMutation({
    mutationFn: postUpdateYara(session)
  });
};
export default useMutateYARAConfiguration;
