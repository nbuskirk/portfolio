import {
  Box,
  Stack,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
  Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Grid from '@mui/material/Grid2';
import { useTheme } from '@mui/material/styles';
import useDailyActivity, { Host } from 'data-hooks/useDailyActivity';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import useEventsData from 'components/Alerts/hooks/useEventsData';
import HostAlerts from 'components/HostAlerts';
import BackupSetHostList from 'components/BackupSetHostList';
import Layout from 'components/layout';
import { useBackupHostList } from 'data-hooks/reports/useBackupsetReports';
import { Helmet } from 'react-helmet-async';
import { useUser } from 'utils/context/UserContext';
import useSelectedHost from './hooks/useSelectedHost';
import HostTitle from './components/HostsTitle';
import CSIGraph from './components/Graphs/CSIGraph';
import { DailyActivityGraphs } from './components/DailyActivityGraphs';

const HostsOverview = () => {
  const { session } = useUser();
  const theme = useTheme();

  const { data: backupHostList, isLoading } = useBackupHostList({ session });
  const [host, setHost] = useSelectedHost(backupHostList);

  const handleHostChange = (newHost: Host) => {
    setHost(newHost);
  };

  const { getDailyActivity } = useDailyActivity(host);
  const { events, eventsIsLoading, eventsIsError } = useEventsData({});

  const ransomwareSignalStrength =
    getDailyActivity?.data?.activity_alert_levels.find(
      (item) => item.activity_type === 'ransomware_signal_strength'
    );

  return (
    <Layout>
      <Helmet>
        <title>Hosts</title>
      </Helmet>
      <Box marginTop={3}>
        <Stack
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            background: theme.palette.white.main,
            border: `1px solid ${theme.palette.neutral.dark500}`,
            borderRadius: 1,
            padding: '0.5em 1em 1em 1em',
            color: theme.palette.dark.main
          }}
        >
          <HostTitle />

          <BackupSetHostList
            backupHostList={backupHostList}
            isLoading={isLoading}
            host={host}
            onHostChange={handleHostChange}
            key={host?.hostname}
          />
        </Stack>

        {host && (
          <Box mt={2}>
            <Accordion
              defaultExpanded
              sx={{
                borderRight: `1px solid ${theme.palette.neutral.dark500}`,
                borderLeft: `1px solid ${theme.palette.neutral.dark500}`,
                borderTop: `1px solid ${theme.palette.neutral.dark500}`
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ margin: '1em' }} />}
                aria-controls='panel2-content'
                id='panel2-header'
              >
                <Typography
                  fontWeight='bold'
                  fontSize={14}
                  padding='0'
                  variant='h2'
                >
                  Daily Activity
                  <Tooltip
                    arrow
                    title='Data points displayed on the graphs in this section summarize activity on the selected host over 24 hours.'
                    placement='right'
                    sx={{ marginLeft: '0.25rem', marginY: '-.4rem' }}
                  >
                    <InfoIcon
                      color='secondary'
                      sx={{ fontSize: '14px', margin: '0 0 -0.2em 0.3em' }}
                    />
                  </Tooltip>
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ flexGrow: 1 }}>
                  <Grid container spacing={2} p={2}>
                    {ransomwareSignalStrength && (
                      <CSIGraph
                        key={ransomwareSignalStrength?.activity_type}
                        host={host}
                        data={ransomwareSignalStrength.points || []}
                        dbaData={
                          getDailyActivity?.data?.delta_block_analysis_scores ||
                          []
                        }
                        name='CyberSensitivity Index'
                        initialAlertLevel={
                          ransomwareSignalStrength?.alert_level_value_1 || 50
                        }
                        rssId={ransomwareSignalStrength.id!}
                        size={{ xs: 12, md: 12 }}
                        maxY={100}
                        minY={0}
                      />
                    )}

                    <DailyActivityGraphs host={host} />
                  </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>

            <Accordion
              defaultExpanded
              sx={{
                borderRight: `1px solid ${theme.palette.neutral.dark500}`,
                borderLeft: `1px solid ${theme.palette.neutral.dark500}`
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ margin: '1em' }} />}
                aria-controls='panel2-content'
                id='panel2-header'
              >
                <Typography
                  fontWeight='bold'
                  fontSize={14}
                  padding='1em 1em 1em 0'
                  variant='h2'
                >
                  Alerts
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ marginBottom: '1em' }}>
                {events && (
                  <Grid container>
                    <Grid size={12}>
                      {host && (
                        <HostAlerts
                          host={host}
                          events={events.filter(
                            (e) =>
                              e.locations?.host === host.hostname ||
                              e.event_details?.host === host.hostname
                          )}
                          eventsIsLoading={eventsIsLoading}
                          eventsIsError={eventsIsError}
                          useFixedWidths
                        />
                      )}
                    </Grid>
                  </Grid>
                )}
              </AccordionDetails>
            </Accordion>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default HostsOverview;
