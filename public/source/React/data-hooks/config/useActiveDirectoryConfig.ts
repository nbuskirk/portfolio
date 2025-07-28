import { useQuery, useMutation } from '@tanstack/react-query';
import { AD_CONFIG } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

export interface DomainInterface {
  dnsname: string;
  domid: number;
  flags: number;
  name: string;
  type: number;
  queryable: number;
}

export interface ADInterface {
  domain: string;
  enabled: string;
  joined: string;
  ldaptimeout: string;
  svcpasswd: string;
  svcusername: string;
  usemachinepass: string;
  username: string;
  workgroup: string;
  all_domains: DomainInterface[];
}

export const getADConfig = (sessionid: string) => async () =>
  API.get<ADInterface>('/configurations/active_directory', {
    headers: {
      sessionid
    }
  });

export const useADConfig = (session: string) => {
  return useQuery({
    queryKey: [AD_CONFIG, session],
    queryFn: getADConfig(session),
    enabled: session !== ''
  });
};

export const useMutationActiveDirectory = (session: string) => {
  return useMutation({
    mutationFn: (body: any) => {
      return API.post('/configurations/active_directory', body, {
        headers: { sessionid: session }
      });
    },
    meta: {
      skipGlobalErrorHandler: true
    }
  });
};

export const useMutationActiveDirectoryDomain = (session: string) => {
  return useMutation({
    mutationFn: (body: any) =>
      API.patch('/configurations/active_directory/domains', body.body, {
        headers: { sessionid: session }
      })
  });
};
