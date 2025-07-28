import {
  GridFilterItem,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel
} from '@mui/x-data-grid-premium';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { BACKUPSET_REPORTS, BACKUPSET_HOSTS } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

export type AnalysisStatus = 'Clean-DBA' | 'Clean' | 'Not analyzed' | 'Alerts';

export interface Backupset {
  alerts: BackupsetAlert[];
  analysis_status: AnalysisStatus;
  unique_id: string;
  backupID: string;
  backupflags: any[];
  backupflags_int: number;
  backuptype: string;
  backuptype_int: number;
  bstatnum: number;
  client: string;
  clienttype: string;
  clienttype_int: number;
  displayID: string;
  fidinfo: Fidinfo;
  flags: number;
  has_exceptions: boolean;
  ie_node: number;
  info: string;
  job_uuid: string;
  license: string[];
  license_int: number;
  licflags: string[];
  licflags_int: number;
  licsize: number;
  merge: any[];
  path: string;
  policy: string;
  rootpath: string;
  seguuid: string;
  stats: Stats;
  type: string;
  vsflags: string[];
  vsflags_int: number;
  statsid: number;
}

export interface BackupsetAlert {
  alert_id: number;
  alert_type: number;
  alert_update_time: number;
}

interface Fidinfo {
  bkupclient: string;
  bkupctype: string;
  bkupctype_int: number;
  bkupid: string;
  bkuplongid: string;
  bkuppolicy: string;
  bkupsoft: string;
  bkuptime: number;
  body_type: number;
  collect: number;
  ctime: number;
  databaseid: number;
  durid: string;
  fileid: number;
  flags: Flags;
  guid: number;
  mtime: number;
  name: string;
  policy_name_sz: number;
  policy_state_sz: number;
  rank: number;
  relevance: number;
  rfid: number;
  signature: string;
  size: number;
  type: string;
  volumes: Volumes;
}

interface Flags {
  archive_is: boolean;
  archive_want: boolean;
  compound: boolean;
  ctype: number;
  discard: boolean;
  exitflag: number;
  extr_subst: boolean;
  locked: boolean;
  more: boolean;
  nocurr: boolean;
  nonarchivable: boolean;
  nonextractable: boolean;
  nsrl: boolean;
  ownernumeric: boolean;
  subjname: boolean;
  unkdedupsize: boolean;
  xflags: number;
}

interface Volumes {
  backupformat: string;
  container: string;
  dcn: string;
  indexaspath: string;
  label: string;
  path: string;
}

interface Stats {
  backup_time: number;
  end_time: number;
  failwords: number;
  filecounts: any[];
  fnim_total_bytes: number;
  licnumfile: number;
  missing_bytes: number;
  missing_dirs: number;
  missing_percent: number;
  num_media_errs: number;
  num_missing: number;
  numbytes: number;
  numdir: number;
  numfile: number;
  numremoved: number;
  numwords: number;
  speed: number;
  start_time: number;
  stopwords: number;
  uniqwords: number;
  unsup_unknown_bytes: number;
  unsup_unknown_percent: number;
}

export interface BackupSetReportsResponse {
  atleast: number;
  atmost: number;
  estimate: number;
  stale: number;
  bkuplist: Backupset[];
}

const getBackupSetReports =
  (session: string, fedid: string, indexid: number, params: FilterParams) =>
  () =>
    API.get<BackupSetReportsResponse>(
      `/federations/${fedid}/indexes/${indexid}/backupsets_qry`,
      {
        headers: {
          sessionId: session
        },
        params
      }
    );

interface FilterParams {
  host?: string;
  backup_set_id?: string;
  backup_start_time?: number;
  backup_end_time?: number;
  analysis_status?: string;
  sort_by?: string;
  cursor?: number;
  howmany?: number;
}
const addDays = (date: string | number, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
const parseFilterItems = (filterItems: GridFilterItem[]) => {
  return filterItems.reduce((acc, filter) => {
    if (filter.field === 'host' && filter.value !== '') {
      acc.host = filter.value;
    }
    if (filter.field === 'displayID' && filter.value !== '') {
      acc.backup_set_id = filter.value;
    }
    if (filter.field === 'backupTime' && filter.value !== undefined) {
      acc.backup_start_time = new Date(filter.value[0]).getTime() / 1000;
      acc.backup_end_time = addDays(filter.value[1], 1).getTime() / 1000;
    }
    if (filter.field === 'status' && filter.value !== '') {
      const statusValMap = {
        'Clean/Clean-DBA': 'clean',
        'Not analyzed': 'notanalyzed',
        'Alert': 'alert'
      };
      acc.analysis_status =
        filter.value in statusValMap
          ? statusValMap[filter.value as keyof typeof statusValMap]
          : filter.value;
    }
    return acc;
  }, {} as FilterParams);
};

const backupSortKeyMap = {
  host: 'host',
  displayID: 'displayID',
  backupTime: 'backuptime',
  exceptions: 'exception',
  startScan: 'indextime',
  status: 'analyzedstatus',
  duration: 'indexingduration'
} as const;

const backupSortKeys = Object.keys(
  backupSortKeyMap
) as unknown as keyof typeof backupSortKeyMap;

const parseSortModel = (sortModel: GridSortModel): string | undefined => {
  const sort = sortModel[0];
  if (
    sort?.field &&
    sort.field !== undefined &&
    backupSortKeys.includes(sort.field)
  ) {
    const sortKey =
      backupSortKeyMap[sort.field as keyof typeof backupSortKeyMap];
    return `${sort.sort === 'desc' ? '-' : ''}${sortKey}`;
  }
  return undefined;
};

interface Params {
  session: string;
  fedid: string;
  indexid: number | undefined;
  filterModel: GridFilterModel;
  sortModel: GridSortModel;
  paginationModel: GridPaginationModel;
}

const useBackupsetReports = ({
  session,
  fedid,
  indexid,
  filterModel,
  sortModel,
  paginationModel
}: Params) => {
  const params = parseFilterItems(filterModel.items);
  params.sort_by = parseSortModel(sortModel);
  params.cursor = paginationModel.page * paginationModel.pageSize;
  params.howmany = paginationModel.pageSize;
  return useQuery({
    queryKey: [BACKUPSET_REPORTS, session, fedid, indexid, params],
    queryFn: getBackupSetReports(session, fedid, indexid!, params),
    enabled: fedid !== '' && indexid !== undefined,
    placeholderData: keepPreviousData,
    refetchInterval: 60000
  });
};

const getBackupHostList = async (session: string) => {
  try {
    const {
      data: { fedid, indexid }
    } = await API.get('/configinfo', {
      headers: {
        sessionId: session
      }
    });

    const { data } = await API.get(
      `/federations/${fedid}/indexes/${indexid}/hosts`,
      {
        headers: {
          sessionId: session
        }
      }
    );
    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('An error occurred when retrieving backup hosts.', error);
    return [];
  }
};

export function useBackupHostList({ session }: { session: string }) {
  return useQuery({
    queryKey: [BACKUPSET_HOSTS, session],
    queryFn: () => getBackupHostList(session)
  });
}

export default useBackupsetReports;
