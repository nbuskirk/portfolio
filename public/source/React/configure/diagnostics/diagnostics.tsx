import {
  Button,
  Typography,
  Stack,
  Switch,
  FormControlLabel,
  Checkbox,
  Grid2,
  CircularProgress
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  useDiagnosticsConfig,
  useMutationDiagnostics
} from 'data-hooks/config/useSecurityConfig';
import { useUser } from 'utils/context/UserContext';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { DIAGNOSTICS_CONFIG } from 'constants/queryKeys';
import Container from 'components/inc/container';
import { FormattedMessage } from 'react-intl';
import Loader from 'components/inc/loader';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import { LoaderFunction, redirect } from 'react-router-dom';
import { loadCanAccess } from 'lib/loadCanAccess';
import sx from './diagnostics.module.scss';

const Diagnostics = () => {
  const queryClient = useQueryClient();
  const [heartbeat, setHeartbeat] = useState(false);
  const [cybersense, setCybersense] = useState(false);
  const [change, setChange] = useState(false);
  const [prevHeartbeat, setPrevHeartbeat] = useState(false);
  const [prevCybersense, setPrevCybersense] = useState(false);
  const { session } = useUser();
  const { data: diagnosticsConfig, isLoading: diagnosticsConfigLoading } =
    useDiagnosticsConfig(session);
  const mutation = useMutationDiagnostics(session);
  const { showSuccessSnackbar } = useSnackbarContext();

  useEffect(() => {
    setPrevHeartbeat(diagnosticsConfig?.data?.heartbeat === '1');
    setPrevCybersense(diagnosticsConfig?.data?.cybersense === '1');
    setHeartbeat(diagnosticsConfig?.data?.heartbeat === '1');
    setCybersense(diagnosticsConfig?.data?.cybersense === '1');
  }, [diagnosticsConfig?.data]);

  const clearChanges = () => {
    setHeartbeat(prevHeartbeat);
    setCybersense(prevCybersense);
    setChange(false);
  };

  const submit = () => {
    if (change) {
      mutation.mutate(
        {
          cybersense: cybersense ? '1' : '0',
          heartbeat: heartbeat ? '1' : '0'
        },
        {
          onSuccess: () => {
            setPrevHeartbeat(heartbeat);
            setPrevCybersense(cybersense);
            showSuccessSnackbar('Success: Saved audit trail settings');
            const queryKey: any = DIAGNOSTICS_CONFIG;
            queryClient.invalidateQueries(queryKey);
          }
        }
      );
    }
    setChange(false);
  };

  return (
    <Container className={sx.diagonstics_container}>
      <Typography className={sx.typography_subtitle} display='block'>
        Audit Trail
      </Typography>
      {diagnosticsConfigLoading && <Loader sx={{ height: 220 }} />}
      {!diagnosticsConfigLoading && (
        <Grid2 className={sx.max_width}>
          <Stack
            direction='row'
            spacing={1}
            alignItems='center'
            className={sx.heartbeat}
          >
            <FormControlLabel
              control={
                <Switch
                  value={heartbeat}
                  checked={heartbeat}
                  onChange={(e) => {
                    setChange(true);
                    setHeartbeat(() => {
                      return e.target.checked;
                    });
                  }}
                />
              }
              label={
                <Typography className={sx.heading} marginLeft='10px'>
                  Heartbeat
                </Typography>
              }
            />
          </Stack>
          <Stack
            className={sx.cybersense}
            style={{ borderBottom: '1px #CAD6E099 solid' }}
          >
            <Typography className={sx.typography_subtitle} display='block'>
              Diagnostic Log File Reporting
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  value={cybersense}
                  checked={cybersense}
                  onChange={(e) => {
                    setChange(true);
                    setCybersense(() => {
                      return e.target.checked;
                    });
                  }}
                />
              }
              label={
                <Typography className={sx.heading}>
                  <FormattedMessage id='settings.networkandksecurity.diagnostics.msg' />
                </Typography>
              }
            />
          </Stack>
          <Grid2 className={sx.footer}>
            <Grid2
              className={`${sx.loader} ${
                diagnosticsConfigLoading || mutation.isPending
                  ? sx.visible
                  : sx.hidden
              }`}
            >
              <CircularProgress size={20} />
            </Grid2>
            <Grid2 className={sx.button_container}>
              <Button
                variant='outlined'
                className={`${sx.button}`}
                onClick={clearChanges}
                disabled={
                  !(change && !diagnosticsConfigLoading && !mutation.isPending)
                }
              >
                Clear Changes
              </Button>
              <Button
                variant='contained'
                className={`${sx.button}`}
                onClick={submit}
                disabled={
                  !(change && !diagnosticsConfigLoading && !mutation.isPending)
                }
              >
                Save Changes
              </Button>
            </Grid2>
          </Grid2>
        </Grid2>
      )}
    </Container>
  );
};

export default Diagnostics;

export const diagnosticsLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const canAccess = await loadCanAccess(queryClient);
    if (!canAccess('netsecmgmt')) {
      return redirect('..');
    }
    return null;
  };
