import useConfigInfo from 'data-hooks/useConfigInfo';
import useThresholds from 'data-hooks/hosts/useThresholds';
import { useUser } from 'utils/context/UserContext';
import { CustomThresholdSeverityLevels } from '../components/Forms/types';

export interface FormattedThreshold {
  id: string;
  name: string;
  type?: string;
  alert_level_value_2?: number;
  t_name: string;
  host: string;
  severity: string;
  locations?: any;
  enabled_state: boolean;
  severity_levels?: CustomThresholdSeverityLevels;
  update_time?: number;
  graphEnabled?: string;
}

const useThresholdTableData = () => {
  const { session } = useUser();
  const { data: configInfo } = useConfigInfo();
  const fedId: string | undefined = configInfo?.fedid;
  const indexId: number | undefined = configInfo?.indexid;

  /* "thresholds" are a combination of custom thresholds and daily activity alert levels */
  /* Fetch both of them, and then combine them into one array for the threshold table */

  const { data: dataCustomThresholds, isLoading } = useThresholds({
    fed_id: fedId,
    index_id: indexId,
    sessionid: session
  });

  const formattedCustomThresholdData = dataCustomThresholds?.map(
    (threshold): FormattedThreshold => {
      return {
        id: `custom ${threshold.id}`,
        name: threshold.name,
        type: threshold.threshold_type,
        alert_level_value_2: threshold.alert_level_value_2,
        t_name: 'Custom',
        host: threshold.locations[0].host,
        severity: threshold.severity,
        locations: threshold.locations,
        enabled_state: threshold.enabled_state === 'enabled',
        severity_levels: threshold.severity_levels,
        update_time: threshold.update_time
      };
    }
  );

  const filteredThresholds = formattedCustomThresholdData || [];

  return {
    thresholds: filteredThresholds,
    thresholdsIsLoading: isLoading
  };
};

export default useThresholdTableData;
