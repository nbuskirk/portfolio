import { Alert, Box } from '@mui/material';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useNavigate } from 'react-router-dom';

import { urls } from 'utils/helpers/urls';
import { CSEvent } from 'data-hooks/useEvents';
import useJobAlertsTableColumnDef from './hooks/useJobAlertsTableColumnDef';

interface Props {
  events: CSEvent[];
  eventsIsLoading: boolean;
  eventsIsError: boolean;
}

const JobAlertsTable = ({ events, eventsIsLoading, eventsIsError }: Props) => {
  const navigate = useNavigate();
  const jobAlertsTableColumnDef = useJobAlertsTableColumnDef();
  const rows = events;
  return (
    <>
      {eventsIsError && events.length === 0 && (
        <Alert
          severity='error'
          variant='outlined'
          sx={{
            border: '1px solid rgb(229, 115, 115)',
            color: 'rgb(229, 115, 115)',
            fontWeight: 800,
            marginBottom: '1em'
          }}
        >
          Some alert data failed to load. Refresh to try again.
        </Alert>
      )}
      <Box
        sx={{ display: 'flex', flexDirection: 'column', maxHeight: '600px' }}
      >
        <DataGridPremium
          columns={jobAlertsTableColumnDef}
          getRowId={(row) => row?.event_details?.id}
          rows={rows}
          loading={eventsIsLoading}
          density='compact'
          hideFooter
          hideFooterSelectedRowCount
          disableAggregation
          disableColumnSelector
          disableRowGrouping
          onRowClick={(row) => {
            navigate(`${urls.alerts}?eventid=${row.id}`);
          }}
        />
      </Box>
    </>
  );
};

export default JobAlertsTable;
