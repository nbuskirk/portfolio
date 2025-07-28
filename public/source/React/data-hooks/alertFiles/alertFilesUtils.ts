/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { API } from 'utils/helpers/api';
import FileDownload from 'js-file-download';
import { getAlertOperatorFilesStoredQueryPayload } from 'utils/helpers/helpers';
import { getStoredQuery } from 'data-hooks/useStoredqueriesGet';
import { IeSystemResponse, ieTimezone } from 'data-hooks/useIeSystem';
import changeTimezone from 'utils/helpers/timezone';
import {
  EVENT_DAILY_THRESHOLD,
  EVENT_DB_CORRUPTION,
  EVENT_INFECTION_FOUND,
  EVENT_MALWARE_DETECTED,
  EVENT_THRESHOLD,
  EVENT_YARA_MATCH,
  LocalStorageKeys
} from 'constants/constants';
import { format } from 'date-fns';
import { CSEvent } from 'data-hooks/useEvents';
import { BuiltFilter } from 'components/Alerts/hooks/useFilterBuilder';
import { ConfigInfo } from 'data-hooks/useConfigInfo';
import { GraphData } from './graphData.types';
import {
  getCSVProperties,
  getCSVPropertiesMap,
  Properties
} from './alertFilesUtilsCsv';
import { Customizations } from '../config/useCustomization';

const { QUERY_HISTORY } = LocalStorageKeys;

interface QData {
  queryName?: string;
  query?: string;
  qjobdefid?: number;
  qjobinstid?: number;
}

function getReportFormatString(
  title: string,
  propertyNumber: number,
  axisLabel: string,
  axisWidth: number,
  axisWidthUnit: number,
  userExpression: string | null
) {
  return {
    header: 0,
    cache_only: 1,
    return_value: 0,
    min_value_fraction: 0,
    min_value_depth: 0,
    max_depth: 0,
    encoding: null,
    eol: null,
    tformat: null,
    report_title: title,
    report_values: [
      {
        property: 89,
        sum_function: 0,
        expression: '1',
        user_expression: null,
        label: 'Count'
      }
    ],
    axes: [
      {
        sort: 0,
        property: 89,
        nbins: 0,
        logscale: 0,
        axistype: 0,
        range: {
          from: null,
          to: null,
          exactly: null
        },
        limit: 0,
        offset: 0,
        width: 0,
        bin_offset: 0,
        widthunit: 0,
        rangeunit: 0,
        flags: 0,
        expression: '1',
        detail_expression: null,
        user_expression: null,
        user_detail_expression: null,
        label: 'Count'
      },
      {
        sort: 0,
        property: propertyNumber,
        nbins: 0,
        logscale: 0,
        axistype: 0,
        range: {
          from: null,
          to: null,
          exactly: null
        },
        limit: 0,
        offset: 0,
        width: axisWidth,
        bin_offset: 0,
        widthunit: axisWidthUnit,
        rangeunit: 0,
        flags: 0,
        expression: null,
        detail_expression: null,
        user_expression: userExpression,
        user_detail_expression: null,
        label: axisLabel
      }
    ]
  };
}

function getFormatString() {
  return [
    getReportFormatString('Host', 23, 'Host', 0, 0, null),
    getReportFormatString(
      'Extension',
      89,
      'File Extension',
      0,
      0,
      'extension(FILENAME)'
    ),
    getReportFormatString('Modified time', 5, 'Modified time', 1, 18, null)
  ];
}

function encodeString(str: string) {
  // eslint-disable-next-line no-useless-escape
  return `"${str.replace(/"/g, `\""`)}"`;
}

const setupFileQuery = async ({
  config,
  alert,
  headers,
  filter,
  filetype
}: {
  config?: ConfigInfo;
  alert?: CSEvent;
  headers: any;
  filter: BuiltFilter;
  filetype?: string;
}) => {
  if (!alert || !config) {
    return null;
  }

  const session = headers.headers.sessionId;
  const indexdb = config.fedid;
  const indexid = alert?.event_details?.index ?? config.indexid;
  const tapedb = config.tdbuuid;

  let tag = '';
  let isMalwareOrYaraFilesQuery = false;

  console.log(`Generating query tag for ${filetype}`);
  if (
    alert?.event_details?.type === EVENT_MALWARE_DETECTED ||
    alert?.event_details?.type === EVENT_YARA_MATCH
  ) {
    const { query: queryTag } = getAlertOperatorFilesStoredQueryPayload(alert);
    tag = queryTag;
    isMalwareOrYaraFilesQuery = true;
  } else if (alert.event_details.type === EVENT_THRESHOLD) {
    tag = `TAG:/threshold-${alert.event_details.statistics_id}:${alert.event_details.threshold_version}`;
  } else if (alert.event_details.type === EVENT_DAILY_THRESHOLD) {
    tag = `TAG:/csdailythr-${alert.event_details.statistics_id}`;
  } else if (alert.event_details.type === EVENT_DB_CORRUPTION) {
    if (filetype === 'suspect') {
      tag = `TAG:/${filetype}-${alert.event_details.statistics_id}:${alert?.event_details.corruption_class_number}`;
    } else {
      // modified, added, deleted
      tag = `TAG:/${filetype}-${alert.event_details.statistics_id}`;
    }
  } else if (alert.event_details.type === EVENT_INFECTION_FOUND) {
    if (filetype === 'suspect') {
      if ((alert.event_details.infection_second_class_number ?? 0) > 0) {
        tag = `TAG:/${filetype}-${alert.event_details.statistics_id}:${alert?.event_details.infection_class_number} OR TAG:/${filetype}-${alert.event_details.statistics_id}:${alert?.event_details.infection_second_class_number}`;
      } else {
        tag = `TAG:/${filetype}-${alert.event_details.statistics_id}:${alert?.event_details.infection_class_number}`;
      }
    } else {
      // modified, added, deleted
      tag = `TAG:/${filetype}-${alert.event_details.statistics_id}}`;
    }
  }

  // Get TRUSTED files with statsid -
  // tag += ` WHERE:"TRUSTED('s${alert.event_details.statistics_id}')=1"`;

  console.log(`Tag ${tag}`);
  if (filter != null) {
    filter.forEach((f) => {
      if (f.field === 'Host') {
        tag += ` BACKUPHOST:${encodeString(f.value)}`;
      } else if (f.field === 'File Type') {
        tag += ` FT:${encodeString(f.value)}`;
      } else if (f.field === 'Extension') {
        tag += ` FNEXT:${encodeString(f.value)}`;
      } else if (f.field === 'Modified time') {
        const d = new Date(f.value);
        const dstr = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
        tag += ` MTIME:${encodeString(dstr)}`;
      }
    });
  }

  if (tag === '') {
    return null;
  }

  let qdata: QData = {};
  if (!localStorage.getItem(`${QUERY_HISTORY}`)) {
    localStorage.setItem(`${QUERY_HISTORY}`, '{}');
  }
  const suspectQueryHistory = JSON.parse(
    localStorage.getItem(`${QUERY_HISTORY}`) || '{}'
  );
  if (suspectQueryHistory[tag]) {
    qdata = suspectQueryHistory[tag];
  } else {
    suspectQueryHistory[tag] = qdata;
  }

  if (qdata.query == null) {
    // created stored query
    qdata.queryName = `find_suspect_files_${Date.now()}`;
    qdata.query = `find_suspects${tag}`;
    console.log(`Query name ${qdata.queryName}`);
    const queryBody = {
      kftmode: 'all',
      user_query: tag,
      query: tag,
      production: 'Both',
      author: 'CyberSenseUI',
      graphmode: 'together',
      description: `Find suspect files ${tag}`,
      orderby: 'unsorted',
      global: 1,
      regexlang: 'simple',
      view: 'responsive',
      qname: qdata.queryName,
      queryflags: ['federate']
    };
    if (isMalwareOrYaraFilesQuery) {
      const { qname, query } = getAlertOperatorFilesStoredQueryPayload(alert);
      qdata.queryName = qname;
      qdata.query = query;
      queryBody.qname = qname;
      queryBody.query = query;
    }

    let queryExists = false;
    try {
      const queryCheck = await getStoredQuery({
        session,
        fedid: indexdb,
        indexid,
        qname: queryBody.qname
      });
      queryExists = queryCheck.status === 200;
    } catch (error) {
      console.error(error);
    }

    // Create a stored query with the supplied name only if it does not already exist.
    if (!queryExists) {
      await API.post(
        `/federations/${indexdb}/indexes/${indexid}/storedqueries`,
        queryBody,
        headers
        // eslint-disable-next-line func-names
      ).catch(function (error) {
        console.log(error.message);
      });
    }
  }

  if (qdata.qjobdefid == null || qdata.qjobdefid === 0) {
    const jobDefBody = {
      qjob: {
        ie_index: {
          indexdb: `${indexdb}`,
          id: indexid,
          tapedb: `${tapedb}`
        },
        qname: qdata.queryName,
        format: 'reports',
        formatstr: JSON.stringify(getFormatString()),
        global: 1,
        descript: 'find_suspects',
        email: ''
      }
    };
    const jobDefResponse = await API.post(
      `/queries/jobdefinitions`,
      jobDefBody,
      headers
    );
    qdata.qjobdefid = jobDefResponse.data.qjobdefid;
  }

  if (qdata.qjobinstid == null || qdata.qjobinstid === 0) {
    const jobInstanceBody = { qjobdefid: qdata.qjobdefid };
    const jobInstanceResponse = await API.post(
      `/queries/jobinstances`,
      jobInstanceBody,
      headers
    );
    qdata.qjobinstid = jobInstanceResponse.data.qjobinstid;
  }

  localStorage.setItem(
    `${QUERY_HISTORY}`,
    JSON.stringify({ ...suspectQueryHistory, [tag]: qdata })
  );

  return qdata;
};

const runFileQueryJob = async ({
  headers,
  qdata
}: {
  headers: any;
  qdata: QData;
}) => {
  let fileResult = {};
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const job: any = await API.get(
      `/queries/jobinstances/${qdata.qjobinstid}`,
      headers
      // eslint-disable-next-line func-names
    ).catch(function (error) {
      if (error.response) {
        console.log('Error response', error.response);
        return { errorObj: error.response };
      }
      if (error.request) {
        console.log('Request error', error.request);
        return { errorObj: error.request };
      }
      console.log('Error', error);
      return { errorObj: { status: error.message } };
    });
    if (typeof job !== 'object') {
      console.log('Suspect file query data is not an object.');
      return { status: 'Query data is not an object' };
    }
    if (job.errorObj !== undefined) {
      console.log('Suspect file query got an error', job.errorObj);
      return job.errorObj;
    }
    if (
      job.data?.status === 'pending' ||
      job.data?.status === 'querying' ||
      (job.data?.status === 'completed' &&
        job.data?.result?.ie_qdata?.ie_format === 'progress')
    ) {
      console.log('Delay and retry');
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    } else {
      if (job.data) {
        console.log('Suspect file query done');
        fileResult = job.data;
      } else {
        console.log('Unexpected job data structure');
        return { status: 'Unexpected job data structure' };
      }
      break;
    }
  }
  return fileResult;
};

const csvProperties = (customizations: any, args: Map<string, string>) => {
  let props = getCSVProperties(customizations).join(',');
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of args.entries()) {
    props = props.replace(key, value);
  }
  return `tformat=%s encoding=UTF8 properties=${props}`;
};

const csvFileProperties = (customizations: any, args: Map<string, string>) => {
  let props = getCSVProperties(customizations).join(',');
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of args.entries()) {
    props = props.replace(key, value);
  }
  return `tformat="%Y-%m-%d %H:%M:%S" encoding=UTF8 properties=${props}`;
};

const statusFlagNames = [
  'Corrupted',
  'Unsupported',
  'Encrypted',
  'Internal error',
  'Warning',
  'Aborted',
  'Disabled',
  'Missing',
  'Cancelled'
];

const parseFileQueryResult = (fileResult: any) => {
  const suspects: any[] = [];
  try {
    fileResult.result.ie_qdata.ie_csvlines.forEach((res: any) => {
      const file: any = {};
      const [
        name, // 0: 3 FILENAME
        host, // 1: 23 BACKUPHOST
        owner, // 2: 15 OWNER
        modified, // 3: 5  MTIME
        accessed, // 4: 6 ATIME
        size, // 5: 4 SIZE
        path, // 6: 2 PATH
        backupid, // 7: 87 bkuplongid
        filetype, // 8: 90 FILETYPEDISP
        ,
        // 9: 42 PATHID
        backuptime, // 10: 26 BACKUPTIME
        software, // 11: 22 BACKUPSOFT
        policy, // 12: 24 BACKUPPOLICY
        indexowner, // 13: 17 INDEXEDOWNER
        entropy, // 14: 110 FILEENTROPY
        entropydelta, // 15: 143 FILEENTROPYDELTA
        signature // 16: 41 CONTSIG
      ] = res.fields;

      Object.assign(file, {
        name,
        host,
        owner,
        modified,
        accessed,
        size,
        path,
        backupid,
        filetype,
        backuptime,
        software,
        policy,
        indexowner,
        entropy,
        entropydelta,
        signature
      });

      file.resultid = `${res.fields[17]}-${res.fields[18]}-${res.fields[19]}.${res.fields[9]}`;

      const statusArr = [];
      for (let i = 0; i <= 8; i += 1) {
        if (res.fields[i + 20] !== '') {
          statusArr.push(`${statusFlagNames[i]} (${res.fields[i + 20]})`);
        }
      }
      file.flags = statusArr;
      // eslint-disable-next-line prefer-destructuring
      file.malwarename = res.fields[29]; // 29: 157 MALWARENAME
      // eslint-disable-next-line prefer-destructuring
      file.trusted = res.fields[30]; // 30: 178 TRUSTED
      suspects.push(file);
    });
  } catch (error) {
    console.log('Suspect file parsing failed.', error);
  }
  return suspects;
};

const removeStaleJobInstance = (qjobinstid: number) => {
  if (localStorage.getItem(`${QUERY_HISTORY}`)) {
    const suspectQueryHistory = JSON.parse(
      localStorage.getItem(`${QUERY_HISTORY}`) || '{}'
    );
    Object.values(suspectQueryHistory).forEach((query: any) => {
      if (query.qjobinstid === qjobinstid) {
        delete query.qjobinstid;
      }
    });
    localStorage.setItem(
      `${QUERY_HISTORY}`,
      JSON.stringify(suspectQueryHistory)
    );
  }
  API.delete(`/queries/jobinstances/${qjobinstid}`);
};

const getTrustedArg = (
  alertType: string | undefined,
  statsid: number | undefined
) => {
  let trustedArg = Properties.TRUSTED.toString();
  switch (alertType) {
    case EVENT_INFECTION_FOUND:
    case EVENT_DB_CORRUPTION:
    case EVENT_THRESHOLD:
      trustedArg = `${Properties.TRUSTED.toString()}("s${statsid}")`;
      break;

    default:
      break;
  }
  return trustedArg;
};

// Run files query
// filetype : suspect, added, modified, or deleted
export const runFilesQuery = async ({
  alert,
  filter,
  sessionId,
  config,
  cursor,
  howmany,
  filetype,
  customizations
}: {
  alert?: CSEvent;
  filter: BuiltFilter;
  sessionId: string;
  config: ConfigInfo;
  cursor?: number;
  howmany?: number;
  filetype: string;
  customizations: any;
}) => {
  const headers: any = {
    headers: {
      sessionId,
      Accept: 'application/json',
      'Content-type': 'application/json'
    }
  };

  let qdata: any = await setupFileQuery({
    config,
    alert,
    headers,
    filter,
    filetype
  });
  if (qdata == null) {
    // old alert
    return { suspects: [], totalResults: 0, isComplete: true };
  }
  if (cursor != null && cursor > 0) {
    headers.headers.cursor = cursor;
  }
  if (howmany != null && howmany > 0) {
    headers.headers.howmany = howmany;
  }
  headers.headers.format = 'csvlines';

  const argsMap = new Map<string, string>();
  argsMap.set(
    Properties.TRUSTED.toString(),
    getTrustedArg(
      alert?.event_details?.type,
      alert?.event_details?.statistics_id
    )
  );
  customizations = {} as Customizations;
  headers.headers.formatstr = csvProperties(customizations, argsMap);

  let res = await runFileQueryJob({ headers, qdata });
  if (res?.status === 410) {
    // Query result is gone from the cache. Rerun the query.
    console.log('Rerun files query');
    removeStaleJobInstance(qdata.qjobinstid);
    qdata = await setupFileQuery({ config, alert, headers, filter, filetype });
    if (qdata) {
      res = await runFileQueryJob({ headers, qdata });
    }
  }
  let suspects = [];
  if (res?.status === 'completed') {
    suspects = parseFileQueryResult(res);
  }

  return {
    suspects,
    totalResults: res?.result?.ie_nfound,
    isComplete: res?.status === 'completed'
  };
};

async function runChartQueryJob({
  headers,
  qdata
}: {
  headers: any;
  qdata: QData;
}) {
  const formatString = getFormatString();
  formatString.forEach((element) => {
    element.cache_only = 0;
  });

  headers.headers.format = 'reports';
  headers.headers.formatstr = JSON.stringify(formatString);

  let jobInstanceResult = {};
  // eslint-disable-next-line no-constant-condition
  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const job: any = await API.get(
      `/queries/jobinstances/${qdata.qjobinstid}`,
      headers
      // eslint-disable-next-line func-names
    ).catch(function (error) {
      if (error.response) {
        console.log('Error response', error.response);
        return { errorObj: error.response };
      }
      if (error.request) {
        console.log(error.request);
        return { errorObj: error.request };
      }
      console.log('Error', error);
      return { errorObj: { status: error.message } };
    });
    if (typeof job !== 'object') {
      console.log('Suspect file query data is not an object.');
      return { status: 'Query data is not an object' };
    }
    if (job?.errorObj !== undefined) {
      console.log('Suspect file query got an error', job.errorObj);
      return job.errorObj;
    }
    if (
      job?.data?.status === 'pending' ||
      job?.data?.status === 'querying' ||
      (job?.data?.status === 'completed' &&
        job?.data?.result?.ie_qdata?.ie_format === 'progress')
    ) {
      console.log('Delay and retry');
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        setTimeout(resolve, 2000);
      });
    } else {
      console.log('Chart query done');
      jobInstanceResult = job.data;
      break;
    }
  }
  return jobInstanceResult;
}

async function parseChartData(jobInstanceResult: any): Promise<GraphData> {
  const charts: any[] = [];
  try {
    jobInstanceResult.result.ie_qdata.ie_reports.reports.forEach(
      (report: any) => {
        const chart: any = {};
        const data: any[] = [];
        chart.title = report.report_title;
        chart.data = data;
        if (report.bins !== undefined && report.bins.length > 0) {
          report.bins[0].bins.forEach((bin: any) => {
            const d: any = {};
            if (bin.range.exactly != null) {
              d.label = bin.range.exactly;
            } else {
              // range
              d.label = bin.range.from;
            }
            if (bin.values[0].ie_data_type === 'integer') {
              d.count = bin.values[0].i;
            } else if (bin.values[0].ie_data_type === 1) {
              d.count = bin.values[0].union;
            }
            data.push(d);
          });
        }
        charts.push(chart);
      }
    );
  } catch (error) {
    console.log(error);
    console.log('Chart data parsing failed.');
  }
  return charts;
}

// Run query for chart data
// filetype : suspect, added, modified, or deleted
export const runChartQuery = async ({
  alert,
  filter,
  sessionId,
  config,
  filetype
}: {
  alert?: CSEvent;
  filter: BuiltFilter;
  sessionId: string;
  config?: ConfigInfo;
  filetype?: string;
}): Promise<GraphData> => {
  const headers = {
    headers: {
      sessionId,
      Accept: 'application/json',
      'Content-type': 'application/json'
    }
  };
  let qdata = await setupFileQuery({
    config,
    alert,
    headers,
    filter,
    filetype
  });
  if (qdata == null) {
    return [];
  }
  let res = await runChartQueryJob({ headers, qdata });
  if (res.status === 410) {
    // Query result is gone from the cache. Rerun the query.
    console.log('Rerun chart query');
    removeStaleJobInstance(qdata.qjobinstid!);
    qdata = await setupFileQuery({ config, alert, headers, filter, filetype });
    if (qdata) {
      res = await runFileQueryJob({ headers, qdata });
    }
  }
  let chartData: Promise<GraphData> = new Promise((resolve) => {
    resolve([]);
  });
  if (res.status === 'completed') {
    chartData = parseChartData(res);
  }

  return chartData;
};

export const downloadFileList = async ({
  alert,
  filter,
  sessionId,
  config,
  ieSystem,
  filetype,
  customizations,
  intl
}: {
  alert: CSEvent;
  filter: BuiltFilter;
  sessionId: string;
  config: ConfigInfo;
  ieSystem: IeSystemResponse;
  filetype: string;
  customizations: any;
  intl: any;
}) => {
  const headers: any = {
    headers: {
      sessionId,
      Accept: 'application/json',
      'Content-type': 'application/json'
    }
  };

  let qdata = await setupFileQuery({
    config,
    alert,
    headers,
    filter,
    filetype
  });
  if (qdata == null) {
    console.log('Download failed.');
    return;
  }
  headers.headers.format = 'csvfile';

  const argsMap = new Map<string, string>();
  argsMap.set(
    Properties.TRUSTED.toString(),
    getTrustedArg(
      alert?.event_details?.type,
      alert?.event_details?.statistics_id
    )
  );
  headers.headers.formatstr = csvFileProperties(customizations, argsMap);

  let res = await runFileQueryJob({ headers, qdata });
  if (res.status === 410) {
    // Query result is gone from the cache. Rerun the query.
    console.log('Rerun download query');
    removeStaleJobInstance(qdata.qjobinstid!);
    qdata = await setupFileQuery({ config, alert, headers, filter, filetype });
    if (qdata) {
      res = await runFileQueryJob({ headers, qdata });
    }
  }
  const filename = res.result.ie_qdata.ie_filename;

  const downloadFileRes: any = await API.get(
    `queries/results?filename=${filename}`,
    {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment',
        sessionid: sessionId
      }
    }
    // eslint-disable-next-line func-names
  ).catch(function (error) {
    if (error.response) {
      console.log('Error response', error.response);
      return { errorObj: error.response };
    }
    if (error.request) {
      console.log('Request error', error.request);
      return { errorObj: error.request };
    }
    console.log('Error', error);
    return { errorObj: { status: error.message } };
  });
  if (downloadFileRes.errorObj !== undefined) {
    console.log('Error while downloading file', downloadFileRes.errorObj);
    // eslint-disable-next-line consistent-return
    return downloadFileRes.errorObj;
  }

  const formattedDate = format(
    changeTimezone(new Date(), ieTimezone(ieSystem)),
    'yyyy-MM-dd_HH-mm-ss'
  );
  const name = `alerts ${formattedDate}.csv`;

  // Split the CSV content into rows
  const rows = downloadFileRes.data.split('\n');

  // Modify the 'File Type' column values  // Performance issues for large files?
  const rowsArr = rows[0].split(',');
  const trustedFlagIndex = rowsArr.findIndex((item: string) =>
    item.includes('Trusted Flag')
  ); // Partial matching: Trusted Flag(s4)
  const fileTypeIndex = rowsArr.indexOf('File Type Display Name');
  rows.forEach((row: string, index: number) => {
    const columns = row.split(',');
    if (index > 0 && columns.length > 0) {
      if (
        columns[trustedFlagIndex] === '1' &&
        columns[fileTypeIndex] === 'Unknown'
      )
        columns[fileTypeIndex] = intl.formatMessage({
          id: 'alerts.file.data.table.row.trusted',
          defaultMessage: 'Trusted'
        });
      rows[index] = columns.join(',');
    }
  });

  // Split the first row (header) into columns
  const headersRow = rows[0].split(',');

  const properties = getCSVProperties();
  const propertiesMap = getCSVPropertiesMap(intl);

  const csvColumnHeaders = headersRow.map((header: any, index: number) => {
    const property = properties[index];
    return propertiesMap[property]?.displayName || header;
  });

  // Join the new headers and rows back into CSV format
  const csvContent = [csvColumnHeaders.join(','), ...rows.slice(1)].join('\n');

  FileDownload(csvContent, name);
};
