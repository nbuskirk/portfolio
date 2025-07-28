import { useQueries } from '@tanstack/react-query';
import { ALERTS_INFO } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';
import { BackupsetAlert } from './reports/useBackupsetReports';

export interface AlertResponse {
  alert_data: AlertData;
  engine: string;
  hide: number;
  id: number;
  index: number;
  service: string;
  severity: string;
  starttime: number;
  status: string;
  type: string;
  update_sequence: number;
  updatetime: number;
}

export interface AlertData {
  crjobids: number[];
  crpolicy: string;
  infection_classes: string[];
  message: string;
  nadded: number;
  ndeleted: number;
  nhosts_infected: number;
  nmodified: number;
  nsuspect: number;
}

const getAlertInfo = (sessionid: string, alertId: number) => () =>
  API.get<AlertResponse>(`/alerts/${alertId.toString()}`, {
    headers: {
      sessionid
    }
  });

interface Params {
  session: string;
  alerts: BackupsetAlert[];
}

const useAlertsInfo = ({ session, alerts }: Params) => {
  return useQueries({
    queries: alerts.map((alert) => ({
      queryKey: [ALERTS_INFO, session, alert.alert_id],
      queryFn: getAlertInfo(session, alert.alert_id),
      staleTime: Infinity,
      refetchInterval: 60000
    }))
  });
};

export default useAlertsInfo;
