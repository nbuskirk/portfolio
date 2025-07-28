import {
  UseMutationResult,
  UseQueryResult,
  useQuery
} from '@tanstack/react-query';
import { CS_EVENTS } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';
import { AxiosResponse, AxiosError } from 'axios';
import {
  EVENT_DAILY_THRESHOLD,
  EVENT_DB_CORRUPTION,
  EVENT_INFECTION_FOUND,
  EVENT_MALWARE_DETECTED,
  EVENT_THRESHOLD,
  EVENT_YARA_MATCH,
  LocalStorageKeys,
  MALWARE_CLEAR_TAG
} from 'constants/constants';
import useStoredqueriesDelete from 'data-hooks/useStoredqueriesDelete';
import {
  JobDefinitionsPayload,
  getJobDefinitionsPayload
} from './useJobDefinitions';
import { StoredQueryPayload, getStoredQueryPayload } from './useStoredqueries';
import { getStoredQuery } from './useStoredqueriesGet';
import useJobDefinitionsDelete from './useJobDefinitionsDelete';

type JobInsDelResult = UseMutationResult<AxiosResponse, unknown, number>;
type JobInsPostResult = UseMutationResult<AxiosResponse, unknown, void>;
type JobDefPostResult = UseMutationResult<
  AxiosResponse,
  unknown,
  JobDefinitionsPayload
>;
type StoredQueriesPostResult = UseMutationResult<
  AxiosResponse,
  unknown,
  StoredQueryPayload
>;
type StoredQueryDeleteResult = ReturnType<typeof useStoredqueriesDelete>;
type JobDefinitionDeleteResult = ReturnType<typeof useJobDefinitionsDelete>;

export interface CSLocation {
  host: string;
  locid?: number;
  path: string;
  recursive?: boolean;
}

interface AlertYaraRuleInfo {
  rule_name: string;
  ruleset_name: string;
  ruleset_id: string;
}

export interface CSEventDetails {
  backupset_id?: string;
  job_id?: string;
  severity?: string;
  isPolicyDeleted?: boolean;
  backup_time?: number;
  backupset_name?: string;
  cleartime?: number;
  cleared: boolean;
  cr_policy?: string;
  policy_name?: string;
  engineid?: string;
  id: string;
  timedate?: number;
  type: string;
  file?: string;
  signature?: string;
  displayValue?: string;
  host?: string;
  file_path?: string;
  yara_rules?: AlertYaraRuleInfo[];
  index?: number;
  isNotification?: boolean;
  statistics_id?: number;
  message?: string;
  corruption_class?: string;
  corruption_class_number?: number;
  infection_class?: string;
  infection_class_number?: number;
  infection_second_class_number?: number;
  threshold_name?: string;
  threshold_type?: string;
  threshold_version?: number;
}

export interface CSEvent {
  locations?: CSLocation;
  event_details: CSEventDetails;
  severity: string;
}

interface Notification {
  backupset_id?: string;
  job_id?: string;
  backuptime?: number;
  cleartime?: number;
  corruption_class?: string;
  corruption_class_number?: number;
  engine?: string;
  file_path?: string;
  host?: string;
  id: number;
  index?: number;
  infection_class?: string;
  infection_class_number?: number;
  infection_second_class_number?: number;
  message?: string;
  policyname?: string;
  service?: string;
  service_number?: number;
  severity?: string;
  severity_number?: number;
  signature?: string;
  starttime?: number;
  statistics_id?: number;
  status?: string;
  status_number?: number;
  threshold_name?: string;
  threshold_type?: string;
  threshold_version?: number;
  type?: string;
  type_number?: number;
  updatetime?: number;
  yara_rules?: AlertYaraRuleInfo[];
}

type CSEvents = Array<CSEvent>;
interface Params {
  session: string;
  fedid: string | undefined;
  indexid: number | undefined;
  tapedb?: string | undefined;
  sortColumn?: string | undefined;
  sortOrder?: string | undefined;
  filterColumn?: string | undefined;
  filterValue?: string | undefined;
  jobid?: number | undefined;
  idxJobUuid?: string | undefined;
  enabled?: boolean;
}

const FORMATSTRING = JSON.stringify([
  {
    report_values: [
      { property: 25, sum_function: 2 },
      { property: 87, sum_function: 2 },
      { property: 26, sum_function: 2 },
      { property: 160, sum_function: 2 },
      { property: 62, sum_function: 2 }
    ],
    axes: [
      {
        property: 89,
        user_expression: "path+'::'+filename+'::'+contsig+'::'+malwaredisctime"
      }
    ]
  }
]);

const getEventDetailsObject = (): CSEventDetails => {
  return {
    backup_time: -1,
    backupset_name: '',
    cleared: false,
    cleartime: -1,
    engineid: '',
    id: '',
    timedate: -1,
    isPolicyDeleted: false,
    type: EVENT_MALWARE_DETECTED,
    displayValue: EVENT_MALWARE_DETECTED
  };
};

const getEventDetails = (bins: any[]): CSEvent[] => {
  const events: CSEvent[] = [];

  bins.forEach((bin: any) => {
    const [hostpath, file, signature, mltime] = (bin.range.exactly || []).split(
      '::'
    );
    const splitPath = hostpath.split('/');
    const host = splitPath[0];
    const path = splitPath.slice(1).join('/');
    const locations: CSLocation = { host, path };
    const details: CSEventDetails = getEventDetailsObject();

    if (bin.values && bin.values.length > 4) {
      const { s: backupsetName } = bin.values[1];
      const { t: backupTime } = bin.values[2];
      const { t: malewareDetectionTime } = bin.values[3];
      const { s: tags } = bin.values[4];

      details.backupset_name = backupsetName;
      details.backup_time = backupTime;
      details.timedate = malewareDetectionTime;
      details.file = file;
      details.signature = signature;
      details.cleared = tags?.split(',').includes(MALWARE_CLEAR_TAG);
    }
    details.id = `ML::${hostpath}::${file}::${signature}::${mltime}`;

    events.push({ event_details: details, locations, severity: 'Critical' });
  });
  return events;
};

export const getMalwareFiles = async (
  { session, fedid, indexid, tapedb, jobid, enabled = true }: Params,
  storedqueries: StoredQueriesPostResult,
  jobDefinitions: JobDefPostResult,
  jobDefinitionsGet: (qjobdefid: number) => void,
  jobDefinitionsDelete: JobDefinitionDeleteResult,
  jobInstances: JobInsPostResult,
  jobInstancesDelete: JobInsDelResult,
  storedqueryDelete: StoredQueryDeleteResult,
  query: string,
  qname: string,
  format: string | null = null,
  formatstr: string | null = null
) => {
  if (!enabled) {
    const events: CSEvent[] = [];
    return events;
  }
  const { QUERY_JOBDEF_MAP } = LocalStorageKeys;
  const storedQueriesPayload = getStoredQueryPayload(query, qname);
  const jobDefinitionsPayload = getJobDefinitionsPayload(
    storedQueriesPayload.qname,
    fedid,
    indexid,
    tapedb,
    format,
    formatstr
  );

  let queryExists: boolean = false;
  try {
    const queryCheck = await getStoredQuery({
      session,
      fedid,
      indexid,
      qname
    });
    if (queryCheck.status === 200) {
      queryExists = true;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  // Create a stored query with the supplied name only if it does not already exist.
  if (!queryExists) {
    await storedqueries.mutateAsync(storedQueriesPayload);
  }

  /*
    TODO:This is an interim fix for 8.7. Create a way for reusing job definitions between sessions,
    as job definitions persist indefinitely unless explicitly removed.
  */
  const queryHistory =
    (jobid === undefined && localStorage.getItem(`${QUERY_JOBDEF_MAP}`)) ||
    '{}';
  const queryHistoryMap = JSON.parse(queryHistory);
  const isArray = Array.isArray(queryHistoryMap[qname]);
  // let qjobdefid = queryHistoryMap[qname];
  let qjobdefid;
  if (isArray) {
    qjobdefid = queryHistoryMap[qname].find(
      (item: any) => item.indexid === indexid
    );
    if (qjobdefid) {
      qjobdefid = qjobdefid.qjobdefid;
    }
  } else {
    queryHistoryMap[qname] = [];
  }
  if (qjobdefid && isArray) {
    try {
      await jobDefinitionsGet(qjobdefid);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      qjobdefid = null;
    }
  }

  if (!qjobdefid) {
    const { data } = await jobDefinitions.mutateAsync(jobDefinitionsPayload);
    qjobdefid = data.qjobdefid;
    const objIndex = queryHistoryMap[qname].findIndex(
      (item: any) => item.indexid === indexid
    );
    if (objIndex !== -1) queryHistoryMap[qname][objIndex].qjobdefid = qjobdefid;
    else queryHistoryMap[qname].push({ indexid, qjobdefid });
    if (jobid === undefined) {
      localStorage.setItem(
        `${QUERY_JOBDEF_MAP}`,
        JSON.stringify(queryHistoryMap)
      );
    }
  }

  const {
    data: { qjobinstid }
  } = await jobInstances.mutateAsync(qjobdefid);

  let data = {
    result: {
      ie_qdata: { ie_reports: { reports: [{ bins: [] }] }, ie_format: '' }
    },
    status: ''
  };
  let refetch = true;

  do {
    try {
      // eslint-disable-next-line no-await-in-loop
      const result = await API.get(`/queries/jobinstances/${qjobinstid}`, {
        headers: {
          sessionId: session,
          format: 'reports',
          proddupflags: 'path',
          formatstr
        }
      });
      data = result.data;
      refetch =
        data?.status === 'pending' ||
        data?.status === 'querying' ||
        (data?.status === 'completed' &&
          data?.result?.ie_qdata?.ie_format === 'progress');
      if (refetch) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => {
          setTimeout(resolve, 2000);
        });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  } while (refetch);

  try {
    await jobInstancesDelete.mutateAsync(qjobinstid);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      'Error while deleting job definition and instance-Events Query',
      error
    );
  }

  if (jobid) {
    try {
      await jobDefinitionsDelete.mutateAsync(qjobdefid);
      await storedqueryDelete.mutateAsync(qname);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(
        'Error while deleting job definition and stored query',
        error
      );
    }
  }

  const events: CSEvent[] = [];
  if (data?.result?.ie_qdata?.ie_reports?.reports?.length > 0) {
    events.push(
      ...getEventDetails(data.result.ie_qdata.ie_reports.reports[0].bins)
    );
  }
  return events;
};

const parseNotificationEventDetails = (alert: Notification): CSEventDetails => {
  const event: CSEventDetails = {
    backupset_id: alert.backupset_id,
    job_id: alert.job_id,
    backup_time: alert.backuptime,
    cleared: !!alert.cleartime,
    cleartime: alert.cleartime,
    engineid: alert.engine,
    id: alert.id.toString(),
    index: alert.index,
    timedate: alert.starttime,
    type: alert.type!,
    cr_policy: alert.policyname,
    displayValue: alert.type,
    host: alert.host,
    severity: alert.severity,
    file_path: alert.file_path,
    signature: alert.signature,
    statistics_id: alert.statistics_id,
    isNotification: true
  };

  if (event.type === 'YARA rule matched file found') {
    return {
      ...event,
      displayValue: EVENT_YARA_MATCH,
      type: EVENT_YARA_MATCH,
      yara_rules: alert.yara_rules
    };
  }
  if (event.type === 'Threshold exceeded') {
    return {
      ...event,
      displayValue: EVENT_THRESHOLD,
      type: EVENT_THRESHOLD,
      threshold_name: alert.threshold_name,
      threshold_type: alert.threshold_type,
      threshold_version: alert.threshold_version
    };
  }
  if (event.type === 'Daily activity limit reached') {
    return {
      ...event,
      displayValue: EVENT_THRESHOLD,
      type: EVENT_DAILY_THRESHOLD,
      threshold_name: alert.threshold_name,
      threshold_type: alert.threshold_type,
      engineid: undefined
    };
  }
  if (event.type === 'Database corruption') {
    return {
      ...event,
      displayValue: EVENT_DB_CORRUPTION,
      type: EVENT_DB_CORRUPTION,
      corruption_class: alert.corruption_class,
      corruption_class_number: alert.corruption_class_number,
      message: alert.message
    };
  }
  if (event.type === 'Infection found') {
    return {
      ...event,
      displayValue: EVENT_INFECTION_FOUND,
      type: EVENT_INFECTION_FOUND,
      infection_class: alert.infection_class,
      infection_class_number: alert.infection_class_number,
      infection_second_class_number: alert.infection_second_class_number,
      message: alert.message
    };
  }

  return event;
};

const getNotifications = () => async () => {
  const res = await API.get('/notifications');
  let events = res.data.map(parseNotificationEventDetails);

  events = events.sort(
    (a: CSEventDetails, b: CSEventDetails) =>
      (b.timedate ?? 0) - (a.timedate ?? 0)
  );

  return events.map((event: CSEventDetails) => {
    return {
      event_details: event,
      severity: event.severity
    };
  });
};

interface UseEventsParams {
  enabled?: boolean;
}

const useEvents = ({
  enabled = true
}: UseEventsParams): UseQueryResult<CSEvents, AxiosError> => {
  return useQuery({
    queryKey: [CS_EVENTS],
    queryFn: getNotifications(),
    enabled,
    refetchInterval: 120000
  });
};

export default useEvents;
