import { Box, Stack, Typography, Divider } from '@mui/material';
import { ctime } from 'utils/helpers/time';
import { DataGridPremium, GridColDef } from '@mui/x-data-grid-premium';
import { FormattedMessage } from 'react-intl';

interface ClientDetails {
  engineid: string;
  hostname: string;
  ipaddress: string;
  lastupdate: number;
  role: string;
}

interface Server {
  hostname: string;
}

const LicenseClientsServer = ({
  licenseClients,
  licenseServer,
  engineId,
  isLoading
}: {
  licenseClients: ClientDetails[];
  licenseServer: Server;
  engineId: string;
  isLoading: boolean;
}) => {
  const currentHostname = window.location.hostname; // TODO: This information need to be come from server.

  const columns: GridColDef[] = [
    { field: 'ipaddress', headerName: 'IP Address', width: 200 },
    { field: 'hostname', headerName: 'Host', width: 250 },
    {
      field: 'lastupdate',
      headerName: 'Last Contact',
      width: 350,
      valueGetter: (value) => ctime(new Date(value * 1000))
    },
    { field: 'role', headerName: 'Role', width: 150 }
  ];

  return (
    <Stack>
      <Stack sx={{ margin: '0 0 0.5em' }}>
        <Typography fontSize={14}>
          <strong>License Server </strong>
        </Typography>
        <Box sx={{ display: 'flex', marginTop: '0.5em' }}>
          <Typography fontSize={14} width='7em'>
            Host:
          </Typography>
          <Typography fontSize={14}>
            {licenseServer && licenseServer.hostname
              ? licenseServer.hostname
              : ''}
          </Typography>
        </Box>
      </Stack>
      <Stack>
        <Typography fontSize={14} fontWeight={600}>
          <FormattedMessage
            id='license.server.title'
            defaultMessage='Backupsets'
          />
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <Typography fontSize={14} width='7em'>
            Host:
          </Typography>
          <Typography fontSize={14}>{currentHostname}</Typography>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Typography fontSize={14} width='7em'>
            Engine ID:
          </Typography>
          <Typography fontSize={14}>{engineId || ''}</Typography>
        </Box>
      </Stack>
      <Divider sx={{ margin: '0.5em 0 1.5em' }} />
      <Stack sx={{ margin: '0 0 0.5em' }}>
        <Typography fontSize={14}>
          <strong>License Clients </strong>
        </Typography>
      </Stack>
      <Stack height='215px'>
        <DataGridPremium
          getRowId={(row) => (row ? row.ipaddress : '')}
          columns={columns}
          rows={licenseClients || []}
          loading={isLoading}
          disableColumnMenu
          disableRowSelectionOnClick
          disableColumnReorder
          columnHeaderHeight={36}
          rowHeight={36}
          scrollbarSize={10}
          localeText={{ toolbarColumns: '' }}
        />
      </Stack>
    </Stack>
  );
};

export default LicenseClientsServer;
