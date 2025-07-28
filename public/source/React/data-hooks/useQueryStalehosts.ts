import { useQuery } from '@tanstack/react-query';
import { STALEHOSTS } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

interface GetStalehostsResponse {
  interval_seconds: number;
}

const getStalehosts = () =>
  API.get<GetStalehostsResponse>('/configurations/stalehosts').then(
    (res) => res.data
  );

const queryStalehosts = () =>
  ({
    queryKey: [STALEHOSTS],
    queryFn: getStalehosts
  }) as const;

const useQueryStalehosts = () => {
  return useQuery(queryStalehosts());
};

export default useQueryStalehosts;
