import {
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  Alert,
  Tooltip,
  Box
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { Helmet } from 'react-helmet-async';
import { styled, useTheme } from '@mui/material/styles';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useUser } from 'utils/context/UserContext';
import useStats from 'data-hooks/stats/useStats';
import useCustomization from 'data-hooks/config/useCustomization';
import Layout from 'components/layout';
import { useState } from 'react';
import { useIeSystem } from 'data-hooks/useIeSystem';
import { DateRange } from '@mui/x-date-pickers-pro';
import { getUnixTime } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { STATS } from 'constants/queryKeys';
import useConfigInfo from 'data-hooks/useConfigInfo';
import { useIntl } from 'react-intl';
import LicenseStatus from './components/LicenseStatus';
import HostsAnalyzed from './components/HostsAnalyzed';
import TotalCapacityAnalyzed from './components/TotalCapacityAnalyzed';
import BackupsBySizeChart from './components/BackupsBySizeChart';
import ConfiguredPolicies from './components/ConfiguredPolicies';
import './print.css';
import DateRangePicker from './components/DateRangePicker';

const WidgetContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.primary.main,
  height: '322px',
  display: 'flex',
  border: '1px solid #ccc',
  borderRadius: '3px',
  fontWeight: 600
}));

const WidgetContainerStacked = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.primary.main,
  height: '157px',
  display: 'flex',
  border: '1px solid #ccc',
  borderRadius: '3px',
  fontWeight: 600,
  textAlign: 'center',
  placeItems: 'center'
}));

const Stats = () => {
  const theme = useTheme();
  const { session } = useUser();
  const { data: config } = useConfigInfo();
  const queryClient = useQueryClient();
  const intl = useIntl();

  /* Date Range Picker */
  const ieSystem = useIeSystem({ session });
  const systemTime = ieSystem.data?.system_time;
  const previousDate = new Date(systemTime! * 1000);
  previousDate.setMonth(previousDate.getMonth() - 1);

  const [startTime, setStartTime] = useState(previousDate);
  const [endTime, setEndTime] = useState(new Date(systemTime! * 1000));

  const handleDateChange = (value: DateRange<Date>) => {
    setStartTime(value[0]!);
    setEndTime(value[1]!);
    queryClient.invalidateQueries({ queryKey: [STATS] });
  };

  const {
    data,
    isFetching: isLoading,
    isError,
    error
  } = useStats({
    session,
    fedId: config?.fedid,
    indexId: config?.indexid,
    startTime: getUnixTime(startTime),
    endTime: getUnixTime(endTime)
  });
  const customization = useCustomization();

  return (
    <Layout>
      <Helmet>
        <title>
          Welcome to {customization?.data?.product_name || 'CyberSense'}
        </title>
      </Helmet>
      <Grid container spacing={2} marginTop={1}>
        <Grid item xs={12}>
          {isError && (
            <Alert
              severity='error'
              variant='filled'
              sx={{
                border: '1px solid rgb(229, 115, 115)',
                color: 'white',
                fontWeight: 800,
                marginBottom: '1em'
              }}
            >
              Scan stats failed to load. {error?.message}
            </Alert>
          )}
          {!isError && (
            <Paper
              sx={{
                boxShadow: 'none',
                border: `1px solid ${theme.palette.neutral.dark500}`,
                borderRadius: 1
              }}
            >
              <Stack
                sx={{
                  borderBottom: `1px solid ${theme.palette.neutral.dark500}`,
                  padding: '1em'
                }}
              >
                <Grid container>
                  <Grid item xs={8}>
                    <Typography
                      variant='h2'
                      fontWeight='600'
                      color='text.primary'
                    >
                      Welcome to{' '}
                      {customization?.data?.product_name || 'CyberSense'}
                    </Typography>
                    <Box marginTop={2}>
                      <DateRangePicker
                        start={startTime}
                        end={endTime}
                        handleChange={handleDateChange}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={4} textAlign='right'>
                    <Button
                      variant='contained'
                      className='view'
                      onClick={() => window.print()}
                    >
                      <FileDownloadIcon sx={{ fontSize: '16px' }} />
                      <Typography fontSize={12} fontWeight={600}>
                        Download
                      </Typography>
                    </Button>
                  </Grid>
                </Grid>
              </Stack>
              <Stack sx={{ padding: '1em' }}>
                <Grid container spacing={2}>
                  <Grid item xs={6} md={6} xl={2}>
                    <WidgetContainerStacked>
                      License Expiration
                      <LicenseStatus
                        data={data?.license_stats}
                        isError={isError}
                        isLoading={isLoading}
                        error={error}
                      />
                    </WidgetContainerStacked>
                    <WidgetContainerStacked marginTop={1}>
                      Policies
                      <ConfiguredPolicies
                        data={data?.scan_stats}
                        isLoading={isLoading}
                      />
                    </WidgetContainerStacked>
                  </Grid>
                  <Grid item xs={6} md={6} xl={2}>
                    <WidgetContainerStacked>
                      Hosts Analyzed
                      <HostsAnalyzed
                        value={data?.scan_stats?.bkuphosts_count}
                        isLoading={isLoading}
                      />
                    </WidgetContainerStacked>
                    <WidgetContainerStacked marginTop={1}>
                      <Box sx={{ display: 'flex' }}>
                        <Typography fontWeight='600' fontSize={14}>
                          {intl.formatMessage({
                            id: 'stats.stat.analyzed.title',
                            defaultMessage: 'Files Analyzed'
                          })}
                        </Typography>
                        <Tooltip
                          title={intl.formatMessage({
                            id: 'stats.stat.analyzed.tooltip',
                            defaultMessage:
                              'The sum of the daily count of all analyzed files over the past 30 days. Includes files that were created or modified.'
                          })}
                          placement='right'
                          sx={{ marginLeft: '0.25em' }}
                        >
                          <InfoIcon color='secondary' />
                        </Tooltip>
                      </Box>
                      <TotalCapacityAnalyzed
                        value={data?.scan_stats?.total_new_changed_files}
                        isLoading={isLoading}
                      />
                    </WidgetContainerStacked>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    md={12}
                    xl={8}
                    // sx={{ pageBreakBefore: 'always' }}
                  >
                    <WidgetContainer>
                      <Box sx={{ display: 'flex' }}>
                        <Typography fontWeight='600' fontSize={14}>
                          {intl.formatMessage({
                            id: 'stats.graph.title',
                            defaultMessage: 'Files Analyzed by Backup Type'
                          })}
                        </Typography>
                        <Tooltip
                          title={intl.formatMessage({
                            id: 'stats.graph.title.tooltip',
                            defaultMessage:
                              'The sum of the daily count of all analyzed files, grouped by backup type. Includes files that were created or modified.'
                          })}
                          placement='right'
                          sx={{ marginLeft: '0.25em' }}
                        >
                          <InfoIcon color='secondary' />
                        </Tooltip>
                      </Box>
                      <BackupsBySizeChart
                        data={data?.scan_stats}
                        isLoading={isLoading}
                      />
                    </WidgetContainer>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography fontSize={12} sx={{ textAlign: 'left' }}>
                      {customization?.data?.product_name || 'CyberSense'}{' '}
                      conducts comprehensive full content scans to verify the
                      integrity of both files and databases, guaranteeing the
                      reliability of data. This robust process provides the
                      assurance needed for confident restoration following a
                      ransomware attack.
                      <br />
                      <br />
                      {customization?.data?.product_name || 'CyberSense'} is
                      architected to detect malicious corruption by known
                      variants of ransomware, encompassing a wide range of
                      tactics such as full, partial, and intermittent file
                      corruption, along with both known and unknown changes to
                      file extensions. Additionally, it scrutinizes databases
                      for comprehensive changes, including full file
                      alterations, as well as page and table corruption.
                    </Typography>
                  </Grid>
                </Grid>
              </Stack>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Stats;
