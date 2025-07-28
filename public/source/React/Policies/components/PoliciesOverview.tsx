import { ReactNode } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { urls } from 'utils/helpers/urls';
import { useUser } from 'utils/context/UserContext';
import useCustomization from 'data-hooks/config/useCustomization';
import PoliciesTable from './PoliciesTable/PoliciesTable';
import useStorageConnectors from '../hooks/useStorageConnectors';

const generateToolTipText = (
  disabled: boolean,
  storageConnectorsQuery: ReturnType<typeof useStorageConnectors>
) => {
  if (storageConnectorsQuery.isLoading) {
    return 'Loading';
  }
  if (
    storageConnectorsQuery.isSuccess &&
    storageConnectorsQuery.data.length === 0
  )
    return 'This action is disabled because no storage connectors are installed.';
  if (disabled) return 'No Permission';
  return 'Create New Policy';
};

const PoliciesOverview = (): ReactNode => {
  const theme = useTheme();
  const { canAccess } = useUser();
  const navigate = useNavigate();
  const customizationQuery = useCustomization();
  const disabled = !canAccess('policyjob');
  const storageConnectorsQuery = useStorageConnectors();
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
            <Typography fontSize='16px' fontWeight={600}>
              Policies
            </Typography>
          </Box>
          <Box
            sx={{
              padding: '1em'
            }}
          >
            <Stack direction='row' spacing={2}>
              {customizationQuery.isSuccess &&
                customizationQuery.data.policies_disableCreatePolicyButton !==
                  '1' && (
                  <Tooltip
                    title={generateToolTipText(
                      disabled,
                      storageConnectorsQuery
                    )}
                    placement='top'
                  >
                    <span>
                      <Button
                        variant='contained'
                        disabled={
                          disabled ||
                          storageConnectorsQuery.isLoading ||
                          (storageConnectorsQuery.isSuccess &&
                            storageConnectorsQuery.data.length === 0)
                        }
                        color='primary'
                        onClick={() => {
                          navigate(urls.policies.new);
                        }}
                      >
                        Create New Policy
                      </Button>
                    </span>
                  </Tooltip>
                )}

              <Button
                variant='contained'
                color='primary'
                sx={{ marginTop: '1em' }}
                onClick={() => {
                  navigate(urls.policies.log);
                }}
              >
                Log
              </Button>
            </Stack>
            <PoliciesTable />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PoliciesOverview;
