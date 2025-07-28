import { useCallback, useEffect, useState, useRef } from 'react';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridColumnVisibilityModel,
  GridLogicOperator,
  GridPaginationModel,
  gridFocusCellSelector,
  GridRowParams,
  GridCallbackDetails,
  GridFilterModel,
  MuiEvent,
  useGridApiRef,
  GRID_DETAIL_PANEL_TOGGLE_FIELD
} from '@mui/x-data-grid-premium';

import JobsTableExpandedPanel from 'components/configure/jobs/components/JobsTable/JobsTableExpandedPanel';
import { ExpandedJob } from 'data-hooks/policies/useJobs';
import { Box } from '@mui/material';
import columns from './JobsTableColumnDefinition';

interface JobData {
  job_id: number;
  job_state: string;
  start_time: string;
  start_time_unix: number;
  policy: string;
  mtype: string;
}

interface Props {
  rows: Array<JobData>;
  systemTime: number | undefined;
  loading: boolean;
  initialState: any;
  paginationModel: GridPaginationModel;
  onSortModelChange: NonNullable<DataGridPremiumProps['onSortModelChange']>;
  rowCount: number;
  toolbar: any;
  footer: any;
  onFilterModelChange: NonNullable<DataGridPremiumProps['onFilterModelChange']>;
  onRowClick: NonNullable<DataGridPremiumProps['onRowClick']>;
  rowSelectionModel: NonNullable<DataGridPremiumProps['rowSelectionModel']>;
  onRowSelectionModelChange: NonNullable<
    DataGridPremiumProps['onRowSelectionModelChange']
  >;
  filterModel: GridFilterModel;
}

const JobsTable = ({
  rows,
  systemTime,
  loading,
  initialState,
  paginationModel,
  onSortModelChange,
  rowCount,
  toolbar,
  footer,
  onFilterModelChange,
  onRowClick,
  rowSelectionModel,
  onRowSelectionModelChange,
  filterModel
}: Props) => {
  const [visibilityModel, setVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      segment: false // Hide segment by default
    });

  const useIsMount = () => {
    const isMountRef = useRef(true);
    useEffect(() => {
      isMountRef.current = false;
    }, []);
    return isMountRef.current;
  };

  const isMount = useIsMount();

  const apiRef = useGridApiRef();
  useEffect(() => {
    const handleCleanFocus = () => {
      // TODO: https://github.com/mui/mui-x/issues/16116
      // Type is wrong, remove any casting when its fixed
      const cell = gridFocusCellSelector(apiRef as unknown as any);

      // If the focused cell is in a row which does not exist anymore, then remove the focus
      if (cell && !apiRef.current?.getRow(cell.id)) {
        apiRef.current?.setState((state) => ({
          ...state,
          focus: {
            cell: null,
            columnHeader: null,
            columnHeaderFilter: null,
            columnGroupHeader: null
          }
        }));
      }
    };
    if (!isMount) {
      return apiRef.current?.subscribeEvent('rowsSet', handleCleanFocus);
    }
    return () => {};
  }, []);

  const handleRowClick = (
    params: GridRowParams,
    event: MuiEvent<React.MouseEvent<HTMLElement, MouseEvent>>,
    detail: GridCallbackDetails
  ) => {
    if (onRowClick) {
      onRowClick(params, event, detail);
    }
  };

  const columns2 = columns;

  const getDetailPanelContent = useCallback<
    NonNullable<DataGridPremiumProps['getDetailPanelContent']>
  >(
    ({ row }) => {
      const expandedJob: ExpandedJob = {
        'job_id': row.job_id,
        'job_state': row.job_state,
        'job_phases': row.job_phases,
        'bscompleted_workload': row.bscompleted_workload
      };
      return (
        <JobsTableExpandedPanel row={expandedJob} systemTime={systemTime} />
      );
    },
    [systemTime]
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
      <DataGridPremium
        sx={{
          '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus':
            {
              outline: 'none'
            }
        }}
        columnVisibilityModel={visibilityModel}
        onColumnVisibilityModelChange={setVisibilityModel}
        columns={columns2}
        rows={rows}
        pagination
        loading={loading}
        initialState={{
          ...initialState,
          pinnedColumns: {
            right: [GRID_DETAIL_PANEL_TOGGLE_FIELD]
          }
        }}
        sortingMode='server'
        onSortModelChange={onSortModelChange}
        paginationMode='server'
        rowCount={rowCount}
        paginationModel={paginationModel}
        disableAggregation
        disableColumnSelector
        disableDensitySelector
        disableColumnPinning
        density='compact'
        onRowClick={handleRowClick}
        slots={{ toolbar, footer }}
        slotProps={{
          filterPanel: { logicOperators: [GridLogicOperator.And] },
          toolbar: { filePrefix: 'policy_log_' }
        }}
        filterMode='server'
        filterModel={filterModel}
        onFilterModelChange={onFilterModelChange}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={onRowSelectionModelChange}
        getDetailPanelContent={getDetailPanelContent}
        getDetailPanelHeight={() => 'auto'}
      />
    </Box>
  );
};

export default JobsTable;
