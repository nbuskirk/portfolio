import {
  UseQueryResult,
  keepPreviousData,
  useQuery
} from '@tanstack/react-query';
import { ALERT_FILES } from 'constants/queryKeys';
import { ANALYZE_TABLE_HOWMANY_COUNT } from 'constants/constants';
import { ConfigInfo } from 'data-hooks/useConfigInfo';
import { CSEvent } from 'data-hooks/useEvents';
import { BuiltFilter } from 'components/Alerts/hooks/useFilterBuilder';
import useCustomization from 'data-hooks/config/useCustomization';
import { runFilesQuery } from './alertFilesUtils';

// This is not accurate, its just a guess at what the return type is
export interface FileData {
  suspects: Suspect[];
  totalResults: any;
  isComplete: boolean;
}

interface Suspect {
  accessed: string;
  backupid: string;
  backuptime: string;
  entropy: string;
  entropydelta: string;
  filetype: string;
  flags: string | string[];
  host: string;
  indexowner: string;
  modified: string;
  name: string;
  owner: string;
  path: string;
  policy: string;
  resultid: string;
  signature: string;
  size: string;
  software: string;
  trusted: string;
}

interface Params {
  session: string;
  selectedEvent?: CSEvent;
  config?: ConfigInfo;
  fileType?: string;
  builtFilter: BuiltFilter;
  keepPreviousData?: boolean;
}

const useAlertFiles = ({
  session,
  selectedEvent,
  config,
  fileType,
  builtFilter,
  keepPreviousData: shouldKeepPreviousData
}: Params): UseQueryResult<FileData, Error> => {
  const { data: customizations } = useCustomization();
  return useQuery({
    queryKey: [
      ALERT_FILES,
      builtFilter,
      selectedEvent?.event_details?.id,
      config,
      fileType
    ],
    queryFn: (): Promise<FileData> =>
      runFilesQuery({
        alert: selectedEvent,
        cursor: 0,
        howmany: ANALYZE_TABLE_HOWMANY_COUNT, // move this constant
        sessionId: session,
        config: config!,
        filter: builtFilter,
        filetype: fileType!,
        customizations
      }),
    enabled:
      config !== undefined &&
      builtFilter !== undefined &&
      selectedEvent !== undefined &&
      fileType !== undefined,
    placeholderData: shouldKeepPreviousData ? keepPreviousData : undefined
  });
};

export default useAlertFiles;
