import { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';

import {
  Box,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// ICONS
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadOutlined from '@mui/icons-material/FileDownloadOutlined';

import Loader from 'components/inc/loader';

import {
  useLicenseCapacity,
  useLicenses,
  refactorLicenseCapacity,
  useClients,
  useServer
} from 'utils/useQuery/useLicenses';
import useSession from 'utils/hooks/useSession';
import { ctime } from 'utils/helpers/time';
import useConfig from 'utils/hooks/useConfig';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import ExtendedChartHeaderLayout from '../extendedChartHeaderLayout';
import Header from './header';
import sx from './expandedLicenseChart.module.scss';
import ChartUsage from './chartUsage';
import AllocationByHost from './allocationByHost';

const Buttons = () => {
  const theme = useTheme();
  return (
    <>
      <IconButton className={sx.iconButton}>
        <SearchIcon
          sx={{
            color: theme.palette.primary.main
          }}
          className={sx.icon}
        />
      </IconButton>
      <IconButton className={sx.iconButton}>
        <SettingsIcon
          sx={{
            color: theme.palette.primary.main
          }}
          className={sx.icon}
        />
      </IconButton>
    </>
  );
};

const ExpandedLicenseChart = () => {
  const { session } = useSession();

  const { data: dataLicense } = useLicenses({ session });
  const {
    data: licenseClients,
    isLoading: licenseClientsLoading,
    refetch: licenseClientsRefetch
  } = useClients({ session });
  const { data: licenseServer, refetch: licenseServerRefetch } = useServer({
    session
  });
  const { data: dataLicenseCapacity } = useLicenseCapacity({
    session,
    include_hosts: true,
    enabled: !!dataLicense
  });

  const [licenseCapacityData, setLicenseCapacityData] = useState(null);
  const [downloadData, setDownloadData] = useState([]);

  const [type, setType] = useState('usage');
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedPage, setSelectedPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);

  const paginationLength = dataLicenseCapacity?.length
    ? Math.ceil(dataLicenseCapacity.length / itemsPerPage)
    : 0;

  const [chart, clientlist] = ['chart', 'clientlist'];
  const [toggleButtonValue, setToggleButtonValue] = useState(chart);
  const currentHostname = window.location.hostname; // TODO: This information need to be come from server.
  const { customization } = useConfig();

  let licenseStatusDownloadHeaders = [
    {
      'label': 'Client hostname',
      'key': 'hostname'
    },
    {
      'label': 'Date',
      'key': 'datetime'
    },
    {
      'label': 'Active Data',
      'key': 'active_data'
    }
  ];

  useEffect(() => {
    if (dataLicenseCapacity) {
      const data = refactorLicenseCapacity({
        licCap: dataLicenseCapacity,
        licenses: dataLicense
      });
      setLicenseCapacityData(data);
    }
  }, [dataLicenseCapacity]);

  const downloadCSV = () => {
    const measurements = dataLicenseCapacity.hosts.flatMap((host) => {
      let pitms = [];
      const { hostname, measurements } = host;
      measurements.forEach((m) => {
        pitms.push({
          'hostname': hostname,
          'time': m.time,
          'active_data': m.managed_bytes
        });
      });
      pitms.sort((a, b) => a.time - b.time);
      pitms.forEach((pitm) => {
        const d = new Date(pitm.time * 1000);
        pitm['datetime'] = ctime(d);
      });
      return pitms;
    });
    setDownloadData(measurements);
  };

  const columns = [
    { field: 'ipaddress', headerName: 'IP ADDRESS', width: '200' },
    { field: 'hostname', headerName: 'HOST', width: '250' },
    {
      field: 'lastupdate',
      headerName: 'LAST CONTACT',
      width: '350',
      valueGetter: (params) => ctime(new Date(params.row.lastupdate * 1000))
    },
    { field: 'role', headerName: 'ROLE', width: '150' }
  ];

  return (
    <>
      <ExtendedChartHeaderLayout
        chartType='licenseChart'
        childrenButtons={
          type === 'allocation' ? (
            <Buttons />
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                flex: 1,
                justifyContent: 'space-between'
              }}
              ml='1em'
            >
              <ToggleButtonGroup
                value={toggleButtonValue}
                exclusive
                onChange={(e) => {
                  setToggleButtonValue(e.target.value);
                  if (e.target.value === clientlist) {
                    licenseClientsRefetch();
                    licenseServerRefetch();
                  }
                }}
                aria-label='chart-type-selection'
              >
                <ToggleButton color='secondary' value={chart}>
                  Usage
                </ToggleButton>
                <ToggleButton color='secondary' value={clientlist}>
                  Details
                </ToggleButton>
              </ToggleButtonGroup>
              {toggleButtonValue === chart && (
                <CSVLink
                  style={{ padding: 1 }}
                  filename='License_status'
                  asyncOnClick
                  onClick={downloadCSV}
                  data={downloadData}
                  headers={licenseStatusDownloadHeaders}
                >
                  <FileDownloadOutlined />
                </CSVLink>
              )}
            </Box>
          )
        }
      >
        <Header
          toggle={{ type, setType }}
          perPage={{ itemsPerPage, setItemsPerPage }}
          currentPage={{ selectedPage, setSelectedPage }}
          anchor={{ anchorEl, setAnchorEl }}
          paginationLength={paginationLength}
        />
      </ExtendedChartHeaderLayout>
      <Stack>
        {toggleButtonValue === chart ? (
          <Box className={sx.contentWrapper} height={350}>
            {!dataLicense || !dataLicenseCapacity ? <Loader /> : null}
            {type === 'usage' && dataLicense && dataLicenseCapacity && (
              <ChartUsage data={licenseCapacityData} />
            )}
            {type === 'allocation' && dataLicense && dataLicenseCapacity && (
              <AllocationByHost
                itemsPerPage={itemsPerPage}
                selectedPage={selectedPage}
                data={licenseCapacityData}
              />
            )}
          </Box>
        ) : (
          <Stack>
            <Divider sx={{ margin: '0 0 0.5em' }} />
            <Stack className={sx.detailSection}>
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
            <Stack className={sx.detailSection}>
              <Typography fontSize={14}>
                {customization?.vendor === 'infinidat' ? (
                  <strong>This InfiniSafe Cyber Detection Server</strong>
                ) : (
                  <strong>This CyberSense Server</strong>
                )}
              </Typography>
              <Box sx={{ display: 'flex', marginTop: '0.5em' }}>
                <Typography fontSize={14} width='7em'>
                  Host:
                </Typography>
                <Typography fontSize={14}>{currentHostname}</Typography>
              </Box>
              <Box sx={{ display: 'flex', marginTop: '0.5em' }}>
                <Typography fontSize={14} width='7em'>
                  Engine ID:
                </Typography>
                <Typography fontSize={14}>
                  {dataLicense.license_engineid
                    ? dataLicense.license_engineid
                    : ''}
                </Typography>
              </Box>
            </Stack>
            <Divider sx={{ margin: '0.5em 0 1.5em' }} />
            <Stack className={sx.detailSection}>
              <Typography fontSize={14}>
                <strong>License Clients </strong>
              </Typography>
            </Stack>
            <Stack height='215px'>
              <DataGridPremium
                getRowId={(row) => (row ? row.ipaddress : '')}
                columns={columns}
                rows={licenseClients || []}
                loading={licenseClientsLoading || licenseClientsLoading}
                disableColumnMenu
                disableSelectionOnClick
                disableColumnReorder
                headerHeight={24}
                rowHeight={48}
                scrollbarSize={10}
                localeText={{ toolbarColumns: '' }}
              />
            </Stack>
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default ExpandedLicenseChart;
