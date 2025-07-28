import { useEffect, useState } from 'react';
import { Typography, Stack, Grid, Box, Button } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import { useUser } from 'utils/context/UserContext';
import CircularProgress from '@mui/material/CircularProgress';
import {
  useSecurityConfig,
  useConnectionConfig,
  useMutationConnection,
  useMutationSecurity
} from 'data-hooks/config/useSecurityConfig';
import Container from 'components/inc/container';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import Modal from 'components/inc/modalContainer/modalContainer';
import { CONNECTION_CONFIG } from 'constants/queryKeys';
import Loader from 'components/inc/loader';
import { LoaderFunction, redirect } from 'react-router-dom';
import { loadCanAccess } from 'lib/loadCanAccess';
import Card from './Card';
import sx from './security.module.scss';

const Security = () => {
  const queryClient = useQueryClient();
  const [visibility, setVisibility] = useState<boolean>(false);
  const [upload, setUpload] = useState<boolean>(true);
  const [issuer, setIssuer] = useState<string | undefined>('');
  const [validFrom, setValidFrom] = useState<string | undefined>('');
  const [expiration, setExpiration] = useState<string | undefined>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [detailVisibility, setDetailVisibility] = useState(false);
  const [prevConnection, setPrevConnection] = useState(false);
  const [warning, setWarning] = useState(false);
  const { session } = useUser();

  const { data: securityConfig, isLoading: securityConfigLoading } =
    useSecurityConfig(session);

  const { data: connectionConfig, isLoading: connectionConfigLoading } =
    useConnectionConfig(session);

  const mutationConnection = useMutationConnection(session);
  const mutationSecurity = useMutationSecurity(session);

  const isLoadingInitial = securityConfigLoading || connectionConfigLoading;

  const timeFormatter: any = (timestamp: any) => {
    const date = new Date(timestamp * 1000);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    return formattedDate;
  };
  useEffect(() => {
    if (
      !securityConfigLoading &&
      securityConfig &&
      securityConfig?.data &&
      !connectionConfigLoading &&
      connectionConfig &&
      connectionConfig?.data
    ) {
      setPrevConnection(connectionConfig?.data?.security === 1);
      setUpload(connectionConfig?.data?.security === 1);
      const index: any = securityConfig?.data?.issuer.indexOf('CN');
      setIssuer(securityConfig?.data?.issuer.substring(0, index - 2));
      setValidFrom(timeFormatter(securityConfig?.data?.start_time));
      setExpiration(timeFormatter(securityConfig?.data?.end_time));
      setDetailVisibility(true);
    }
  }, [securityConfigLoading, connectionConfigLoading]);

  const cancelChanges = () => {
    setUpload(prevConnection);
    setWarning(false);
  };

  const successAction = () => {
    setLoading(false);
    setPrevConnection(upload);
    const queryKey: any = CONNECTION_CONFIG;
    queryClient.invalidateQueries(queryKey);
    window.location.reload();
  };

  const saveChanges = () => {
    setLoading(true);
    setWarning(false);
    mutationConnection.mutate(
      {
        security: upload ? 1 : 2
      },
      {
        onSuccess: () => {
          successAction();
        },
        onError: (error: any) => {
          if (error?.response?.data?.status) {
            // If error is thrown from backend with status codes then Failure message will be displayed.
            setLoading(false);
          } else {
            // If error is regarding CORS policy which has no status codes. Even if backend operation is successful, this error is not consistent and rarely occur when HTTP, HTTPS settings are altered.
            successAction();
          }
        }
      }
    );
  };

  return (
    <Container className={sx.body}>
      <Typography className={sx.heading} display='block'>
        Security Certificates for SSL/TLS Connection
      </Typography>
      {isLoadingInitial && <Loader sx={{ height: 352 }} />}
      {!isLoadingInitial && (
        <>
          <Box
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <Card
              visibility={visibility}
              setVisibility={setVisibility}
              setLoading={setLoading}
              setDetailVisibility={setDetailVisibility}
              mutationSecurity={mutationSecurity}
            />
          </Box>

          <Modal
            setVisibility={setWarning}
            visibility={warning}
            title='Security Certificates for SSL/TLS Connection'
            cancelText='Cancel Changes'
            onCancel={cancelChanges}
            saveText='Save Changes'
            onSave={saveChanges}
            width='572px'
            saveDisabled={false}
          >
            <Typography>
              This will cause the Webserver to restart. Do you want to continue?
            </Typography>
          </Modal>

          <Stack className={sx.securityContainer}>
            <Grid />
            <Stack>
              <Stack direction='column' gap={2} alignItems='left'>
                <Typography className={sx.section}>
                  HTTPS requires SSL/TLS certificates to establish secure
                  communication between the browser and server. Ensure that the
                  SSL/TLS certificates are in PEM format.
                </Typography>

                <Stack
                  direction='column'
                  className={`${sx.uploadcontainer} ${
                    detailVisibility ? sx.display_block : sx.display_none
                  }`}
                >
                  <Grid className={sx.icon_holder}>
                    <DescriptionIcon
                      sx={{ color: '#8FA2B2' }}
                      className={sx.descriptionIcon}
                    />
                    <Typography className={sx.heading} display='block'>
                      Certificate
                    </Typography>
                  </Grid>
                  <Stack
                    direction='row'
                    className={`${sx.filedetails} ${sx.colorGrey}`}
                  >
                    <Grid className={sx.issuer}>
                      <Typography className={sx.text1} display='block'>
                        Issuer
                      </Typography>
                      <Typography className={sx.text} display='block'>
                        {issuer}
                      </Typography>
                    </Grid>
                    <Grid className={sx.validfrom}>
                      <Typography className={sx.text1} display='block'>
                        Valid From
                      </Typography>
                      <Typography className={sx.text} display='block'>
                        {validFrom}
                      </Typography>
                    </Grid>
                    <Grid className={sx.expiration}>
                      <Typography className={sx.text1} display='block'>
                        Expiration
                      </Typography>
                      <Typography className={sx.text} display='block'>
                        {expiration}
                      </Typography>
                    </Grid>
                  </Stack>
                </Stack>
                <Grid style={{ borderBottom: '1px solid #CAD6E099' }}>
                  <Button
                    variant='contained'
                    onClick={() => {
                      setVisibility(true);
                    }}
                    style={{ marginBottom: '16px' }}
                  >
                    Upload Files
                  </Button>
                </Grid>
              </Stack>
            </Stack>
            <Grid className={sx.uploadButton}>
              <Grid className={sx.button_container}>
                <Grid
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}
                >
                  <Grid
                    className={`${sx.button_container} ${
                      loading ||
                      mutationConnection.isPending ||
                      mutationSecurity.isPending
                        ? sx.visible
                        : sx.hidden
                    }`}
                  >
                    <CircularProgress size={20} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Stack>
        </>
      )}
    </Container>
  );
};

export default Security;

export const securitySettingsLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const canAccess = await loadCanAccess(queryClient);
    if (!canAccess('netsecmgmt')) {
      return redirect('..');
    }
    return null;
  };
