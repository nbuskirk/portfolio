import {
  Alert,
  Box,
  Breadcrumbs,
  Grid,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import { ReactNode } from 'react';
import { useUser } from 'utils/context/UserContext';
import { NavigateNext } from '@mui/icons-material';
import LinkRouter from 'components/inc/LinkRouter';
import useQueryPolicy from 'data-hooks/policies/useQueryPolicy';
import { useParams } from 'react-router-dom';
import Loader from 'components/inc/loader';
import useQueryEditStorageConnectorStep from 'data-hooks/policies/useQueryEditStorageConnectorStep';
import EditStorageConnectorDetails from './EditStorageConnectorDetails';

const ManageStorageConnector = (): ReactNode => {
  const theme = useTheme();
  const { session } = useUser();
  const { policyId } = useParams();

  const policyQuery = useQueryPolicy({ session, policyId });
  const editStorageConnectorStepQuery = useQueryEditStorageConnectorStep({
    session,
    storageConnector: policyQuery.data?.storage_connector_name,
    policyContext: policyQuery.data?.policy_context,
    displayName: policyQuery.data?.display_name
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
              Storage Connector
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
                relative='path'
                to='../..'
                sx={{
                  fontSize: '12px',
                  display: 'flex',
                  color: theme.palette.primary.main
                }}
              >
                Policies
              </LinkRouter>
              <LinkRouter
                underline='hover'
                to='..'
                relative='path'
                sx={{
                  fontSize: '12px',
                  display: 'flex',
                  color: theme.palette.primary.main
                }}
              >
                {policyQuery.isLoading && 'Loading Policy Name'}
                {policyQuery.isSuccess && policyQuery.data.display_name}
                {policyQuery.isError && 'Unavailable'}
              </LinkRouter>
              <Typography
                fontSize='12px'
                fontWeight='600'
                color={theme.palette.primary.main}
              >
                Storage Connector
              </Typography>
            </Breadcrumbs>
          </Box>
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
            >
              Error loading policy data - {(policyQuery.error as Error).message}
            </Alert>
          )}
          {editStorageConnectorStepQuery.isError && (
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
              Error loading storage connector template -{' '}
              {(editStorageConnectorStepQuery.error as Error).message}
            </Alert>
          )}
          {(policyQuery.isLoading ||
            editStorageConnectorStepQuery.isLoading) && (
            <Loader
              sx={{
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            />
          )}
          {policyQuery.isSuccess && editStorageConnectorStepQuery.isSuccess && (
            <EditStorageConnectorDetails
              policyData={policyQuery.data}
              editStorageConnectorStepData={editStorageConnectorStepQuery.data}
              key={`${policyQuery.dataUpdatedAt}${editStorageConnectorStepQuery.dataUpdatedAt}`}
            />
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ManageStorageConnector;
