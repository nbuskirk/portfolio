import { UseQueryResult, useQuery } from '@tanstack/react-query';
import { AxiosError, AxiosResponse } from 'axios';
import { ALERTS } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';
import { typeMapping } from 'utils/helpers/thresholdHelpers';

export interface Alert {
  alert_data?: AlertData;
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
  type_number: number;
}

export interface AlertData {
  crjobids: number[];
  crossed_thresholds: CrossedThreshold[];
  crpolicy?: string;
  fedid: string;
  indexid: number;
  message?: string;
  nnew_thresholds: number;
  infection_classes: string[];
}

export interface CrossedThreshold {
  stats_id: number;
  thresholds: Threshold[];
  time: number;
}

export interface Threshold {
  id: number;
  locations: Location[];
  name: string;
  severity: string;
  threshold_type: keyof typeof typeMapping;
  threshold_value_1: number;
  threshold_value_2: number;
  version: number;
}

export interface Location {
  host: string;
  locid: number;
  path: string;
  recursive: boolean;
}

type Alerts = Array<Alert>;

const getAlerts = (sessionid: string, types: number[]) => () =>
  API.get<Alerts>('/alerts', {
    headers: {
      sessionid
    },
    params: {
      types: types.toString()
    }
  });

interface Params {
  session: string;
  types: number[];
}

const useAlerts = ({
  session,
  types
}: Params): UseQueryResult<AxiosResponse<Alerts>, AxiosError> => {
  return useQuery({
    queryKey: [ALERTS, session, types],
    queryFn: getAlerts(session, types),
    refetchInterval: 60000
  });
};

export default useAlerts;
