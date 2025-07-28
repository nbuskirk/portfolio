import { UseQueryResult, useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { POLICIES } from 'constants/queryKeys';
import { baseURL } from 'utils/helpers/api';
import qs from 'qs';
import {
  AlertFlags,
  BSCompletedWorkload,
  JobPhase,
  JobState,
  PolicyType
} from './useJobs';

export interface PolicyDataResponse {
  List_of_email_addresses: string[];
  hostname: string;
  last_bscompleted_workload: Array<BSCompletedWorkload>;
  last_job_end_time: number;
  last_job_number: number;
  last_job_start_time: number;
  last_job_state: JobState;
  last_job_alert_flags: AlertFlags;
  last_job_phases: Array<JobPhase>;
  nfs_export: string;
  policy: string;
  policy_name_encoded: string;
  policy_type: PolicyType;
  policy_state: string;
  policy_url: string;
  queued_job: boolean;
  storage_cont_fmt: string;
  dba_disabled: boolean;
  display_name: string;
  storage_connector_name: string;
  storage_connector_description: string;
  inactive_time: number;
  inactive: boolean;
  total_policies?: number;
}

type PoliciesWithTotal = {
  policies: Array<PolicyDataResponse>;
  totalPolicies: number;
  systemTime: number;
};

interface Dictionary<T> {
  [key: string]: T;
}

export const getPolicies = async (
  sessionid: string,
  params: Dictionary<number | string | Array<string>> | undefined,
  policy_status?: string
): Promise<PoliciesWithTotal> => {
  const params2 = params;
  if (params2 && 'policy_eq' in params2) {
    params2.policy_displayname = params2.policy_eq;
    delete params2.policy_eq;
  }
  const axiosConfig = {
    method: 'get' as const,
    baseURL: `${baseURL}/policies`,
    headers: {
      sessionid
    },
    responseType: 'json' as const,
    params: params2 || { policy_status },
    paramsSerializer: (
      ps: Dictionary<number | string | Array<string>> | undefined
    ) => {
      return qs.stringify(ps, { arrayFormat: 'repeat' });
    }
  };
  const { data, headers } = await axios(axiosConfig);
  const systemTimeDt = new Date(headers.date);
  const systemTime = Math.floor(systemTimeDt.getTime() / 1000);
  const policiesWithTotal: PoliciesWithTotal = {
    policies: data,
    totalPolicies: headers['x-total-count'],
    systemTime
  };
  return policiesWithTotal;
};

interface Params {
  session: string;
  params?: Dictionary<number | string | Array<string>> | undefined;
  policy_status?: string;
  enabled?: boolean;
}

const usePolicies = ({
  session,
  params,
  policy_status,
  enabled = true
}: Params): UseQueryResult<PoliciesWithTotal, AxiosError> => {
  return useQuery({
    queryKey: [POLICIES, session, params, policy_status],
    queryFn: () => getPolicies(session, params, policy_status),
    refetchInterval: 30000,
    enabled
  });
};

export default usePolicies;
