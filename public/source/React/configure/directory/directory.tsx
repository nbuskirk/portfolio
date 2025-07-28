import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  TextField,
  Switch,
  Stack,
  Grid,
  Box,
  FormLabel,
  Container,
  CircularProgress,
  FormControlLabel
} from '@mui/material';
import { useUser } from 'utils/context/UserContext';
import {
  useADConfig,
  useMutationActiveDirectory,
  useMutationActiveDirectoryDomain
} from 'data-hooks/config/useActiveDirectoryConfig';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { AD_CONFIG } from 'constants/queryKeys';
import Modal from 'components/inc/modalContainer/modalContainer';
import Loader from 'components/inc/loader';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import { LoaderFunction, redirect } from 'react-router-dom';
import { loadCanAccess } from 'lib/loadCanAccess';
import DomainTable from './domainTable';
import sx from './directory.module.scss';

const Directory = () => {
  const { session } = useUser();
  const [change, setChange] = useState(false);
  const {
    data: ADConfig,
    isLoading: isLoadingInitial,
    isFetching,
    refetch: refetchADConfig
  } = useADConfig(session);

  const mutation = useMutationActiveDirectory(session);
  const domainMutation = useMutationActiveDirectoryDomain(session);
  const queryClient = useQueryClient();

  const [domain, setDomain] = useState(false);
  const [username, setUsername] = useState<string | undefined>('');
  const [password, setPassword] = useState<string | undefined>('');
  const [dname, setDname] = useState<string | undefined>('');
  const [adEnabled, setAdEnabled] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(true);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [warning, setWarning] = useState(false);
  const [prev, setPrev] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const { showSuccessSnackbar, showErrorSnackbar, showAxiosErrorSnackbar } =
    useSnackbarContext();

  useEffect(() => {
    if (ADConfig?.data) {
      setFormErrors([]);
      if (
        ADConfig?.data?.enabled &&
        ADConfig?.data?.domain &&
        ADConfig?.data?.svcusername &&
        ADConfig?.data?.enabled &&
        !isLoadingInitial &&
        !isFetching
      ) {
        if (!isFetching) {
          let isPending = false;
          ADConfig?.data?.all_domains.forEach((ele) => {
            // Query will be refetched if QUERY STATUS of any one is pending.
            if (ele.queryable === 1) {
              isPending = true;
            }
          });
          if (isPending) {
            setTimeout(() => {
              const queryKey: any = AD_CONFIG;
              queryClient.invalidateQueries(queryKey);
            }, 10000);
          }
        }
        setRows(ADConfig?.data?.all_domains);
        setPassword('');
        setDomain(ADConfig?.data?.enabled === '1');
        setDname(ADConfig?.data?.domain);
        setUsername(ADConfig?.data?.svcusername);
        setAdEnabled(ADConfig?.data?.enabled === '1');
        setPrev(() => [
          ADConfig?.data?.enabled === '1',
          ADConfig?.data?.domain,
          ADConfig?.data?.svcusername
        ]);
      } else if (!isFetching) {
        setDname('');
        setUsername('');
        setDomain(false);
        setAdEnabled(false);
        setPrev(() => [false, '', '']);
      }
    }
  }, [ADConfig, isFetching]);

  const checkEmptyFields = () => {
    const errorFields = [];
    if (dname?.trim().length === 0) errorFields.push('dname');
    if (username?.trim().length === 0) errorFields.push('username');
    if (password?.length === 0) errorFields.push('password');
    setFormErrors(errorFields);
    return errorFields;
  };

  const onSubmit = async () => {
    if (!domain) {
      setUsername('');
      setDname('');
    }
    setWarning(false);
    setChange(false);
    const errorFields = checkEmptyFields();
    setFormErrors(errorFields);
    setPassword('');
    if (
      !domain ||
      (domain && dname && username && password && errorFields.length === 0)
    ) {
      setAdEnabled(domain);
      setIsLoadingUpdate(true);
      mutation.mutate(
        {
          domain: dname,
          svcusername: username,
          svcpasswd: password,
          enabled: domain ? '1' : '0',
          usemachinepass: '1'
        },
        {
          onSuccess: () => {
            setAdEnabled(domain);
            showSuccessSnackbar(
              'Success: Saved Active Directory account setings'
            );
            const queryKey: any = AD_CONFIG;
            queryClient.invalidateQueries(queryKey);
            setIsLoadingUpdate(false);
            setPrev(() => [domain, dname, username]);
            refetchADConfig();
          },
          onError: (error: any) => {
            setAdEnabled(false);
            setChange(true);
            if (error.response.data.status === 400) {
              showErrorSnackbar(
                'Error: Incorrect Domain Name or user credentials. Please try again.'
              );
            } else {
              showAxiosErrorSnackbar(error);
            }
            setIsLoadingUpdate(false);
          }
        }
      );
    }
  };

  const onCancel = () => {
    setWarning(false);
    setDomain(prev[0]);
    setChange(false);
    setUsername(prev[2]);
    setDname(prev[1]);
    setPassword('');
  };

  return (
    <Container className={sx.directory_container}>
      <Modal
        setVisibility={setWarning}
        visibility={warning}
        title='Active Directory Connection'
        cancelText='Cancel Changes'
        onCancel={onCancel}
        saveText='Save Changes'
        onSave={onSubmit}
        width='572px'
        saveDisabled={false}
      >
        <Typography>
          Active Directory user accounts may lose their ability to log in if
          this feature is disabled. Do you want to continue?
        </Typography>
      </Modal>
      <Typography className={sx.heading} display='block'>
        Active Directory
      </Typography>
      {isLoadingInitial && <Loader sx={{ height: 135 }} />}
      {!isLoadingInitial && (
        <Box className={sx.form_container}>
          <Stack
            direction='row'
            spacing={1}
            alignItems='center'
            className={sx.title}
          >
            <FormControlLabel
              control={
                <Switch
                  value={domain}
                  checked={domain}
                  disabled={ADConfig?.data === undefined || isLoadingInitial}
                  onChange={(e) => {
                    setChange(true);
                    setDomain(() => {
                      return e.target.checked;
                    });
                    setFormErrors([]);
                  }}
                />
              }
              label={
                <Typography className={sx.section} marginLeft='10px'>
                  Domain
                </Typography>
              }
            />
          </Stack>

          <Stack className={domain ? sx.display_block : sx.display_none}>
            <TextField
              label={
                <Typography className={sx.content}>Domain Name</Typography>
              }
              placeholder='Enter Domain Name'
              variant='outlined'
              type='text'
              value={dname}
              className={domain ? sx.visible : sx.hidden}
              disabled={adEnabled}
              error={formErrors.includes('dname')}
              onChange={(e) => {
                setChange(true);
                setDname(e.target.value);
                setFormErrors([]);
              }}
              fullWidth
            />
            {formErrors.includes('dname') && (
              <FormLabel sx={{ fontSize: '12px', color: '#E56109' }}>
                Domain Name is required.
              </FormLabel>
            )}
            <Stack className={sx.account_container}>
              <Grid>
                <Typography variant='h4' className={sx.typography_subtitle}>
                  {' '}
                  Account{' '}
                </Typography>
              </Grid>
              <TextField
                label={
                  <Typography className={sx.content}>Login Username</Typography>
                }
                placeholder='Enter Username'
                variant='outlined'
                type='text'
                error={formErrors.includes('username')}
                value={username}
                className={domain ? sx.visible : sx.hidden}
                disabled={adEnabled}
                onChange={(e) => {
                  setChange(true);
                  setUsername(e.target.value);
                  setFormErrors([]);
                }}
                fullWidth
              />
              {formErrors.includes('username') && (
                <FormLabel sx={{ fontSize: '12px', color: '#E56109' }}>
                  Username is required.
                </FormLabel>
              )}
              <TextField
                label={<Typography className={sx.content}>Password</Typography>}
                type='password'
                variant='outlined'
                placeholder='Enter Password'
                error={formErrors.includes('password')}
                value={password}
                className={`${domain ? sx.visible : sx.hidden}`}
                disabled={adEnabled}
                fullWidth
                onChange={(e) => {
                  setChange(true);
                  setPassword(e.target.value);
                  setFormErrors([]);
                }}
              />
              {formErrors.includes('password') && (
                <FormLabel sx={{ fontSize: '12px', color: '#E56109' }}>
                  Password is required.
                </FormLabel>
              )}
            </Stack>
          </Stack>
          <Grid
            style={{ borderTop: '1px solid rgb(225, 211, 211)' }}
            className={sx.changes}
          >
            <Grid>
              <Grid className={mutation.isPending ? sx.visible : sx.hidden}>
                <CircularProgress size={20} />
              </Grid>
            </Grid>
            <Grid>
              <Button
                variant='outlined'
                className={`${sx.button}`}
                disabled={
                  !(
                    (ADConfig?.data ||
                      !isLoadingInitial ||
                      !isLoadingUpdate ||
                      !mutation.isPending) &&
                    change &&
                    adEnabled !== domain
                  )
                }
                onClick={onCancel}
              >
                Clear Changes
              </Button>
              <Button
                variant='contained'
                className={`${sx.button}`}
                onClick={() => {
                  if (!domain) {
                    setWarning(true);
                  } else if (domain && checkEmptyFields().length === 0) {
                    onSubmit();
                  }
                }}
                disabled={
                  !(
                    (ADConfig?.data ||
                      !isLoadingInitial ||
                      !isLoadingUpdate ||
                      !mutation.isPending) &&
                    change &&
                    adEnabled !== domain
                  )
                }
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
      <Box
        className={`${sx.query_table} ${
          adEnabled && !isLoadingInitial ? sx.visible : sx.hidden
        }`}
      >
        {adEnabled && !isLoadingInitial && (
          <DomainTable
            all_domains={ADConfig?.data?.all_domains ? rows : []}
            domainMutation={domainMutation}
            ADLoading={
              isLoadingInitial ||
              mutation.isPending ||
              domainMutation.isPending ||
              isFetching
            }
          />
        )}
      </Box>
    </Container>
  );
};

export default Directory;

export const directorySettingsLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const canAccess = await loadCanAccess(queryClient);
    if (!canAccess('netsecmgmt')) {
      return redirect('..');
    }
    return null;
  };
