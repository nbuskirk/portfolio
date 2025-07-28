import { useQuery, useMutation } from '@tanstack/react-query';
import {
  DIAGNOSTICS_CONFIG,
  SECURITY_CONFIG,
  CONNECTION_CONFIG
} from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

export interface DiagnosticsInterface {
  heartbeat: string;
  cybersense: string;
}

export interface SecurityInterface {
  start_time: string;
  end_time: string;
  issuer: string;
}

export interface ConnectionInterface {
  security: number;
}

export const getConnectionConfig = (sessionid: string) => async () =>
  API.get<ConnectionInterface>('/configurations/connection', {
    headers: {
      sessionid
    }
  });

export const useConnectionConfig = (session: string) => {
  return useQuery({
    queryKey: [CONNECTION_CONFIG, session],
    queryFn: getConnectionConfig(session),
    enabled: session !== ''
  });
};

export const getDiagnosticsConfig = (sessionid: string) => async () =>
  API.get<DiagnosticsInterface>('/configurations/diagnostics', {
    headers: {
      sessionid
    }
  });

export const useDiagnosticsConfig = (session: string) => {
  return useQuery({
    queryKey: [DIAGNOSTICS_CONFIG, session],
    queryFn: getDiagnosticsConfig(session),
    enabled: session !== ''
  });
};

export const getSecurityConfig = (sessionid: string) => async () =>
  API.get<SecurityInterface>('/configurations/security', {
    headers: {
      'Content-Type': 'multipart/form-data',
      sessionid
    }
  });

export const useSecurityConfig = (session: string) => {
  return useQuery({
    queryKey: [SECURITY_CONFIG, session],
    queryFn: getSecurityConfig(session),
    enabled: session !== ''
  });
};

export const useMutationConnection = (session: string) => {
  return useMutation({
    mutationFn: (body: ConnectionInterface) =>
      API.post('/configurations/connection', body, {
        headers: { sessionid: session }
      })
  });
};

export const useMutationDiagnostics = (session: string) => {
  return useMutation({
    mutationFn: (body: DiagnosticsInterface) =>
      API.put('/configurations/diagnostics', body, {
        headers: { sessionid: session }
      })
  });
};

export const useMutationSecurity = (session: string) => {
  return useMutation({
    mutationFn: (body: any) =>
      API.post('/configurations/security', body, {
        headers: { sessionid: session }
      })
  });
};
