import { DataGridPremium } from '@mui/x-data-grid-premium';
import { Alert, Box, styled } from '@mui/material';

import useSession from 'utils/hooks/useSession';
import { ExpandedJob } from 'data-hooks/policies/useJobs';
import { useIeSystem, ieTimezone } from 'data-hooks/useIeSystem';
import JobPhasesTableColumnDefinition from './JobPhasesTableColumnDefinition';
import preprocessExpandedJob from './JobPhasesUtils';

interface Props {
  expandedJob: ExpandedJob;
  systemTime: number | undefined;
}

const ChildDataGrid = styled(DataGridPremium)(({ theme }) => ({
  '& .MuiDataGrid-row': {
    backgroundColor: 'transparent !important',
    cursor: 'default'
  },
  '& .MuiDataGrid-row:nth-of-type(odd), & .MuiDataGrid-row:nth-of-type(even)': {
    backgroundColor: 'transparent !important'
  },
  '& .MuiDataGrid-cell.border-right': {
    border: 'none !important',
    borderRight: `1px solid ${theme.palette.neutral.dark400} !important`
  }
}));

const JobPhasesTable = ({ expandedJob, systemTime }: Props) => {
  const { session } = useSession();
  const {
    isLoading: ieIsLoading,
    error: ieError,
    data: ie
  }: {
    isLoading: boolean;
    error: any;
    data: any;
  } = useIeSystem({ session });
  const rows = [preprocessExpandedJob(ieTimezone(ie), systemTime, expandedJob)];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <ChildDataGrid
        columns={JobPhasesTableColumnDefinition}
        rows={rows}
        loading={ieIsLoading}
        density='compact'
        hideFooter
        getRowHeight={() => 'auto'}
        hideFooterSelectedRowCount
        disableAggregation
        disableColumnSelector
        disableRowGrouping
        getRowId={(row) => row.job_id}
        localeText={{
          noRowsLabel: 'No Data Available'
        }}
      />
      {ieError && <Alert severity='info'>{ieError?.message}</Alert>}
    </Box>
  );
};

export default JobPhasesTable;
