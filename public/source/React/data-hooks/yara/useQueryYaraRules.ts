import { useQuery } from '@tanstack/react-query';
import { YARA_RULES } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';
import { YaraRules } from './yara.types';

interface Params {
  fedId?: string;
  indexId?: number;
}

const queryYaraRules =
  ({ indexId, fedId }: Params) =>
  () =>
    API.get<YaraRules>(
      `/federations/${fedId}/indexes/${indexId}/yara_rules`,
      {}
    ).then(({ data }) => data);

const useQueryYaraRules = ({ indexId, fedId }: Params) => {
  return useQuery({
    queryKey: [YARA_RULES, indexId, fedId],
    queryFn: queryYaraRules({
      indexId,
      fedId
    }),
    refetchInterval: 60000,
    enabled: !!indexId && !!fedId
  });
};

export default useQueryYaraRules;
