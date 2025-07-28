import {
  Alert,
  Box,
  Breadcrumbs,
  ButtonBase,
  Grid,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import { useParams } from 'react-router-dom';
import LinkRouter from 'components/inc/LinkRouter';
import { NavigateNext } from '@mui/icons-material';
import useQueryPolicy from 'data-hooks/policies/useQueryPolicy';
import { useUser } from 'utils/context/UserContext';
import Loader from 'components/inc/loader';
import useQueryPolicySchedules from 'data-hooks/policies/schedule/useQueryPolicySchedules';
import { useQueryClient } from '@tanstack/react-query';
import { POLICY, POLICY_SCHEDULE } from 'constants/queryKeys';
import EditViewPolicy from './EditViewPolicy';

const ManagePolicy = () => {
  const { session } = useUser();
  const theme = useTheme();
  const { policyId } = useParams();
  const queryClient = useQueryClient();

  const scheduleQuery = useQueryPolicySchedules({ session, policyId });
  const policyQuery = useQueryPolicy({
    session,
    policyId
  });

  return (
    <Grid container spacing={2} marginTop={1}>
      <Grid item xs={12}>
        <Paper
          sx={{
            boxShadow: 'none'
          }}
        >
          <Box
            sx={{
              borderBottom: `1px solid ${theme.palette.neutral.dark400}`,
              padding: '1em'
            }}
          >
            <Typography fontSize='16px' fontWeight='600'>
              Policy
            </Typography>
            <Breadcrumbs
              sx={{
                '.MuiBreadcrumbs-separator': {
                  margin: '4px'
                }
              }}
              separator={<NavigateNext sx={{ fontSize: '14px' }} />}
            >
              <LinkRouter
                underline='hover'
                to='..'
                sx={{
                  fontSize: '12px',
                  display: 'flex',
                  color: theme.palette.primary.main
                }}
              >
                Policies
              </LinkRouter>
              <Typography fontSize='12px' fontWeight='600' color='text.primary'>
                {policyQuery.isLoading && 'Loading Policy Name'}
                {policyQuery.isSuccess && policyQuery.data.display_name}
                {policyQuery.isError && 'Unavailable'}
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box
            sx={{
              padding: '1em'
            }}
          >
            {policyQuery.isError && (
              <Alert
                severity='error'
                variant='outlined'
                sx={{
                  border: '1px solid rgb(229, 115, 115)',
                  color: 'rgb(229, 115, 115)',
                  fontWeight: 800,
                  marginBottom: '1em'
                }}
                action={
                  <ButtonBase
                    sx={{
                      color: 'rgb(229, 115, 115)',
                      padding: '4px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      borderRadius: '3px'
                    }}
                    onClick={() => {
                      queryClient.resetQueries({ queryKey: [POLICY] });
                    }}
                  >
                    refresh
                  </ButtonBase>
                }
              >
                Error Loading Policy
                {' - '}
                {(policyQuery.error as Error).message}
              </Alert>
            )}
            {scheduleQuery.isError && (
              <Alert
                severity='error'
                variant='outlined'
                sx={{
                  border: '1px solid rgb(229, 115, 115)',
                  color: 'rgb(229, 115, 115)',
                  fontWeight: 800,
                  marginBottom: '1em'
                }}
                action={
                  <ButtonBase
                    sx={{
                      color: 'rgb(229, 115, 115)',
                      padding: '4px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      borderRadius: '3px'
                    }}
                    onClick={() => {
                      queryClient.resetQueries({
                        queryKey: [POLICY_SCHEDULE]
                      });
                    }}
                  >
                    refresh
                  </ButtonBase>
                }
              >
                Error Loading Policy Schedule
                {' - '}
                {(scheduleQuery.error as Error).message}
              </Alert>
            )}
            {scheduleQuery.isSuccess && scheduleQuery.data.length > 1 && (
              <Alert
                severity='info'
                variant='outlined'
                sx={{
                  marginBottom: '1em'
                }}
              >
                Found multiple schedules for this policy created from external
                resources.
              </Alert>
            )}
            {(policyQuery.isLoading || scheduleQuery.isLoading) && (
              <Loader
                sx={{
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              />
            )}
            {policyQuery.isSuccess && scheduleQuery.isSuccess && (
              <EditViewPolicy
                policyData={policyQuery.data}
                policyScheduleData={scheduleQuery.data[0]}
                key={`${policyQuery.dataUpdatedAt}${scheduleQuery.dataUpdatedAt}`}
              />
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ManagePolicy;
