import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';
import { CONFIG_INFO } from 'constants/queryKeys';
import { AxiosError } from 'axios';

export interface ConfigInfo {
  engineid: string;
  fedid: string;
  indexid: number;
  tdbuuid: string;
}

export const getConfigInfo = () =>
  API.get<ConfigInfo>('/configinfo').then((res) => res.data);

export const configInfoQuery = (enabled = true) =>
  ({
    queryKey: [CONFIG_INFO],
    queryFn: getConfigInfo,
    enabled,
    refetchOnMount: true
  }) as const;

const useConfigInfo = (
  enabled = true
): UseQueryResult<ConfigInfo, AxiosError> => {
  return useQuery(configInfoQuery(enabled));
};

export default useConfigInfo;
