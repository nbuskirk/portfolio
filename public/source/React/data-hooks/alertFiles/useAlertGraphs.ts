import {
  UseQueryResult,
  useQuery,
  keepPreviousData
} from '@tanstack/react-query';
import { ALERT_GRAPHS } from 'constants/queryKeys';
import { ConfigInfo } from 'data-hooks/useConfigInfo';
import { BuiltFilter } from 'components/Alerts/hooks/useFilterBuilder';
import { CSEvent } from 'data-hooks/useEvents';
import { runChartQuery } from './alertFilesUtils';
import { GraphData } from './graphData.types';

interface Params {
  session: string;
  selectedEvent?: CSEvent;
  builtFilter: BuiltFilter;
  config?: ConfigInfo;
  fileType?: string;
  keepPreviousData?: boolean;
}

const useAlertGraphs = ({
  session,
  selectedEvent,
  config,
  builtFilter,
  fileType,
  keepPreviousData: shouldKeepPreviousData
}: Params): UseQueryResult<GraphData, Error> => {
  return useQuery({
    queryKey: [
      ALERT_GRAPHS,
      builtFilter,
      selectedEvent?.event_details?.id,
      config,
      fileType
    ],
    queryFn: (): Promise<GraphData> =>
      runChartQuery({
        alert: selectedEvent,
        filter: builtFilter,
        sessionId: session,
        config,
        filetype: fileType
      }),
    enabled:
      config !== undefined &&
      builtFilter !== undefined &&
      selectedEvent !== undefined &&
      fileType !== undefined,
    placeholderData: shouldKeepPreviousData ? keepPreviousData : undefined
  });
};

export default useAlertGraphs;
