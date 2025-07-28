import React, { useState, useCallback, useEffect, useRef } from 'react';

import { Alert, Grid2, Paper, Box, Typography, Divider } from '@mui/material';

import {
  GridRowParams,
  GridRowSelectionModel,
  GridSortItem,
  GridSortModel
} from '@mui/x-data-grid-premium';

import IETableFooter from 'components/shared/IETableFooter';

import useSession from 'utils/hooks/useSession';
import { useIeSystem, ieTimezone } from 'data-hooks/useIeSystem';
import {
  useJobs,
  Job,
  PolicyInfo
} from 'data-hooks/policies/useJobs';
// import { mockNetworkError, mockTimeout } from '_mocks_/policy_jobs_info_error';

import useEventsData from 'components/Alerts/hooks/useEventsData';
import { LocalStorageKeys } from 'constants/constants';
import CustomLocalExportToolbar from 'components/inc/CustomLocalExportToolbar';
import { CSEvent } from 'data-hooks/useEvents';
import useFilterModel from './hooks/useFilterModel';
import usePaginationModel from './hooks/usePaginationModel';
import useSelectedRow from './hooks/useSelectedRow';

import { isJobWithAlert } from './helpers/getJobs';
import { setParams } from './helpers/setParams';

import SideBarContent from './components/sideBarContent';
import JobsTable from './components/JobsTable/JobsTable';
import JobAlertsTable from './components/JobAlertsTable/JobAlertsTable';

import preprocessJobsInfo from './components/JobsTable/JobsTableUtils';

import {
  jobStateFilterOp,
  jobAlertStateFilterOp,
  currentPhaseFilterOp,
  jobIdFilterOp,
  startTimeFilterOp,
  durationFilterOp,
  policyFilterOp,
  sortOp
} from './components/JobsTable/JobsTableColumnOps';

const { JOBS_SIDEPANEL_STATUS } = LocalStorageKeys;

const findJob = (jobs: any, job_id: number) =>
  jobs ? jobs.find((item: Job) => item.job_id === job_id) : undefined;

const Jobs = () => {
  const { session } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [selectedRow, setSelectedRow] = useSelectedRow();
  const [paginationModel, setPaginationModel] = usePaginationModel();

  const [filterModel, setFilterModel] = useFilterModel();
  // console.log(`Jobs: filterModel: ${JSON.stringify(filterModel)}`);
  const filterModelItems = filterModel.items;

  const initialState = {
    'sorting': {
      'sortModel': [{ 'field': 'job_id', 'sort': 'desc' }]
    }
  };
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'start_time_fmt', sort: 'desc' }
  ]);

  const updateDrawerOpen = (
    open: boolean | ((prevState: boolean) => boolean)
  ) => {
    /**
     * The sidebar panel should only be opened (when applicable) once the data grid's data load is finished.
     * This is the rationale behind not using "useLocalStorage" for the state variable "drawerOpen."
     */
    const lkey = `${JOBS_SIDEPANEL_STATUS}`;
    localStorage.setItem(lkey, JSON.stringify(open));
    setDrawerOpen(open);
  };

  const params = setParams(
    paginationModel,
    sortModel,
    jobStateFilterOp,
    jobAlertStateFilterOp,
    currentPhaseFilterOp,
    jobIdFilterOp,
    startTimeFilterOp,
    durationFilterOp,
    policyFilterOp,
    sortOp,
    filterModelItems
  );
  // mockTimeout(params);

  const {
    isLoading: ieIsLoading,
    error: ieError,
    data: ie
  }: {
    isLoading: boolean;
    error: any;
    data: any;
  } = useIeSystem({ session });
  const { isLoading, error, data } = useJobs({
    session,
    params
  });

  let totalJobs = 0;
  let systemTime = 0;
  let jobsPolicies: Array<PolicyInfo> = [];
  let jobs: Array<Job> = [];
  if (data) {
    totalJobs = data.total_jobs ?? 0;
    systemTime = data.system_time ?? 0;
    jobsPolicies = data.policies ?? [];
    jobs = data.jobs ?? [];
  }

  const [newJobs, policiesMap] = preprocessJobsInfo(
    ieTimezone(ie),
    systemTime,
    jobs,
    jobsPolicies
  );

  const selectedJob =
    selectedRow && selectedRow.row.job_id !== 0
      ? findJob(newJobs, selectedRow.row.job_id)
      : undefined;
  const isAlertsTableEnabled = selectedJob
    ? isJobWithAlert(selectedJob?.alert_flags)
    : false;
  const { events, eventsIsLoading, eventsIsError } = useEventsData({
    enabled: isAlertsTableEnabled
  });

  const toggleDrawer = (
    e: any,
    open: boolean | ((prevState: boolean) => boolean)
  ) => {
    if (e.type === 'keydown' && (e.key === 'Tab' || e.key === 'Shift')) {
      return;
    }
    updateDrawerOpen(open);
  };
  const toggleSideBar = (
    e:
      | React.SetStateAction<{ row: { job_id: number; mtype: string } }>
      | GridRowParams<any>
  ) => {
    // console.log(e);
    updateDrawerOpen(true);
    setSelectedRow(e);
  };

  const onFilterChange = useCallback(
    (model: { items: any[] }) => {
      setFilterModel(model);
      // console.log(`onFilterChange: model: ${JSON.stringify(model)}`);
      function containsKey(obj: Record<string, number>, key: string) {
        return !!Object.keys(obj).find(
          (k) => k.toLowerCase() === key.toLowerCase()
        );
      }
      function isCompleteValue(item: {
        value: string;
        columnField: string;
        operatorValue: string;
      }) {
        if (
          item.columnField === 'policy' &&
          item.operatorValue === 'equals' &&
          !containsKey(policiesMap, item.value)
        ) {
          return false;
        }
        return true;
      }
      if (model.items.every(isCompleteValue)) {
        if (paginationModel.pageSize * paginationModel.page > totalJobs) {
          setPaginationModel({ ...paginationModel, page: 0 });
        }
      }
    },
    [policiesMap, paginationModel]
  );

  // When a column is unsorted (from column menu), we should remove that column from sortModel,
  // including before adding it at the beginning of the sortMOdel
  // This code was removed since we disabled column menus in Log table.
  //
  // onSortModelChange is called with empty GridSortModel when toggling the sort order on the column
  const onSortModelChange = useCallback(
    (model: GridSortModel) => {
      // console.log(`onSortModelChange: model: ${JSON.stringify(model)}`);
      // console.log(`onSortModelChange: sortModel: ${JSON.stringify(sortModel)}`);
      if (model.length === 0) {
        // Toggle the sort order of the sorted column
        const newSortModel = sortModel.map(
          (item: GridSortItem) =>
            ({
              'field': item.field,
              'sort': item.sort === 'desc' ? 'asc' : 'desc'
            }) as GridSortItem
        );
        // console.log(`onSortModelChange 1: newSortModel: ${JSON.stringify(newSortModel)}`);
        setSortModel([...newSortModel]);
      } else {
        // Remove sorted column from sortModel before adding it at the beginning of sortModel
        const curSortModel = sortModel;
        let mergedSortModel = curSortModel.filter(
          (item) => item.field !== model[0].field
        );
        if (mergedSortModel.length !== 0) {
          mergedSortModel = model.concat(mergedSortModel);
          // console.log(`onSortModelChange 2: mergedSortMOdel: ${JSON.stringify(mergedSortModel)}`);
          setSortModel([...mergedSortModel]);
        } else {
          // Set sortModel to model
          // console.log(`onSortModelChange 3: newSortModel: ${JSON.stringify(model)}`);
          setSortModel([...model]);
        }
      }
    },
    [sortModel]
  );

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);

  const updateRowSelectionModel = (model: GridRowSelectionModel) => {
    setRowSelectionModel(model);
  };

  useEffect(() => {
    if (jobs && jobs.length > 0) {
      if (selectedJob) {
        for (let i: number = 0; i < jobs.length; i += 1) {
          if (selectedJob.job_id === jobs[i].job_id) {
            setRowSelectionModel([i]);
            break;
          }
        }
      } else {
        setRowSelectionModel([]);
      }
      onFilterChange(filterModel);
      const sidePanelStatus = localStorage.getItem(`${JOBS_SIDEPANEL_STATUS}`);
      if (sidePanelStatus) {
        setDrawerOpen(JSON.parse(sidePanelStatus));
      }
    }
  }, [jobs]);

  // Scroll to job alerts section every time a new events information becomes available
  const bottomRef = useRef<null | HTMLHRElement>(null);
  useEffect(() => {
    if (selectedJob) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events, eventsIsLoading, eventsIsError]);

  const customFooter = () => (
    <IETableFooter
      totalTableLength={totalJobs}
      paginationModel={paginationModel}
      setPaginationModel={setPaginationModel}
    />
  );

  const getAssociatedAlerts = () => {
    return events.filter(
      (event: CSEvent) =>
        event.event_details.job_id === selectedJob?.ie_idx_job_uuid
    );
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12, lg: 12 }}>
        <Paper
          sx={{
            padding: '0',
            boxShadow: 'none'
          }}
        >
          <JobsTable
            rows={newJobs}
            systemTime={systemTime}
            loading={ieIsLoading || isLoading}
            initialState={initialState}
            paginationModel={paginationModel}
            onSortModelChange={onSortModelChange}
            rowCount={totalJobs}
            toolbar={CustomLocalExportToolbar}
            footer={customFooter}
            onFilterModelChange={onFilterChange}
            onRowClick={(e) => toggleSideBar(e)}
            rowSelectionModel={rowSelectionModel}
            onRowSelectionModelChange={updateRowSelectionModel}
            filterModel={filterModel}
          />
          {(ieError || error) && (
            <Alert severity='info'>{ieError?.message || error?.message}</Alert>
          )}
          <div>
            <SideBarContent
              open={drawerOpen}
              onClose={(e) => toggleDrawer(e, false)}
              data={selectedRow}
            />
          </div>
        </Paper>
      </Grid2>
      {selectedJob && isAlertsTableEnabled && (
        <Grid2 size={{ xs: 12, lg: 12 }} sx={{ marginTop: 2 }}>
          <Grid2
            sx={{
              width: '100%'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: '16px'
                  }}
                >
                  Associated Alerts
                </Typography>
                <Typography sx={{ padding: '5px 0' }}>
                  Select an alert to see more details in the Alerts page.
                </Typography>
              </Box>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '16px',
                  padding: '5px 0'
                }}
              >
                <span style={{ fontWeight: 600 }}>Selected Job:</span>{' '}
                {selectedJob.job_id}
              </Typography>
            </Box>
          </Grid2>
          <Grid2 style={{ width: '100%' }}>
            <JobAlertsTable
              events={getAssociatedAlerts()}
              eventsIsLoading={eventsIsLoading && isAlertsTableEnabled}
              eventsIsError={eventsIsError}
            />
          </Grid2>
        </Grid2>
      )}
      {selectedJob && !isAlertsTableEnabled && (
        <Grid2 size={{ lg: 12, xs: 12 }} sx={{ marginTop: 2 }}>
          <Grid2
            sx={{
              width: '100%'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              }}
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '16px'
                }}
              >
                Associated Alerts
              </Typography>
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: '16px',
                  padding: '5px 0'
                }}
              >
                <span style={{ fontWeight: 600 }}>Selected Job:</span>{' '}
                {selectedJob.job_id}
              </Typography>
            </Box>
          </Grid2>
          <Divider />
          <Grid2 sx={{ width: '100%' }}>
            <Typography
              sx={{
                width: '100%',
                textAlign: 'center',
                paddingTop: '3em',
                paddingBottom: '2em',
                fontWeight: 600,
                fontSize: '14px'
              }}
            >
              There are no alerts associated with this job.
            </Typography>
          </Grid2>
        </Grid2>
      )}
    </Grid2>
  );
};

export default Jobs;
