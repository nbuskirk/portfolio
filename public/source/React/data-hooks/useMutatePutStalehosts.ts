import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';

interface PutStalehosts {
  interval_seconds: number;
}

const putStalehosts = (payload: PutStalehosts) =>
  API.put('/configurations/stalehosts', payload).then((res) => res.data);

const useMutatePutStalehosts = () => {
  return useMutation({
    mutationFn: putStalehosts
  });
};

export default useMutatePutStalehosts;
