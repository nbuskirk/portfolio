import { Policy } from '../../hooks/usePolicyData';

const preprocessPolicies = (policies: Policy[]) => {
  const policiesMap: Record<string, number> = {};
  /* const policiesMap: { [policy_name: string] : 1; } = {}; */
  policies.map((item) => {
    policiesMap[item.policy] = 1;
    return false;
  });
  return policiesMap;
};

export default preprocessPolicies;
