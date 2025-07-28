import { useQuery } from '@tanstack/react-query';
import { YARA_RULE } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

import { YaraRule } from './yara.types';

interface Params {
  enableQuery?: boolean;
  fedId?: string;
  indexId?: number;
  yaraRuleId?: string;
}

const queryYaraRule =
  ({ indexId, fedId, yaraRuleId }: Params) =>
  () =>
    API.get<YaraRule>(
      `/federations/${fedId}/indexes/${indexId}/yara_rules/${yaraRuleId}`
    ).then(({ data }) => data);

const useQueryYaraRule = ({
  enableQuery,
  indexId,
  fedId,
  yaraRuleId
}: Params) => {
  return useQuery({
    queryKey: [YARA_RULE, indexId, fedId, yaraRuleId],
    queryFn: queryYaraRule({
      indexId,
      fedId,
      yaraRuleId
    }),
    enabled: enableQuery && !!indexId && !!fedId && !!yaraRuleId
  });
};

export default useQueryYaraRule;
