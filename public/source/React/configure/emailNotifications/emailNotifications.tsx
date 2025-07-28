import { useState } from 'react';
import useSession from 'utils/hooks/useSession';
import {
  Typography,
  Grid,
  Box,
  FormControlLabel,
  Button,
  Stack,
  TextField,
  Checkbox,
  Autocomplete,
  Chip,
  Divider
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import Container from 'components/inc/container';
import {
  useEmailAlerts,
  useUpdateEmailMutation,
  useDeleteEmailMutation,
  AlertDataPayload,
  AlertCategory
} from 'data-hooks/useEmailAlerts';
import Loader from 'components/inc/loader';
import { useUser } from 'utils/context/UserContext';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import { AxiosResponse } from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { LoaderFunction, redirect } from 'react-router-dom';
import { loadCanAccess } from 'lib/loadCanAccess';
import sx from './emailNotifications.module.scss';

interface AlertData {
  alert_category_list: AlertCategory[];
  alert_email_address: string;
}
const EMAIL_PLACEHOLDER = 'Email';
const EMAIL_HELPER_MSG = 'Add email and press Enter.';
const URL = '/configurations/emailalerts';
const SECURITY_ALERT_VAL = 'CyberSense Analysis';
const LAN_INDEXING = 'LAN Indexing';
const POST_PROCESSING = 'Post-Processing';
const SYSTEM_MESSAGES = 'Linux System Messages';
const JOB_DONE = 'Job Done';
const JOB_STARTED = 'Job Started';
const JOB_FAILED = 'Job Failed';
const SECURITY_JOB = 'CyberSense Alert';

const OPERATIONAL_ALERTS = [LAN_INDEXING, POST_PROCESSING, SYSTEM_MESSAGES];

const SECURITY_ALERTS = [SECURITY_ALERT_VAL];

const getAlertsEmails = (
  alertObjects: AlertData[],
  category: string[]
): string[] => {
  const emails: string[] = [];
  if (alertObjects) {
    alertObjects.forEach((alert: AlertData) => {
      if (
        alert.alert_category_list &&
        alert.alert_category_list.find((c: AlertCategory) =>
          category.includes(c.alertCategory)
        )
      ) {
        emails.push(alert.alert_email_address);
      }
    });
  }
  return emails;
};

const getAlertTypes = (
  alertObjects: AlertData[],
  category: string[]
): string[] => {
  interface LocalHash {
    [key: string]: string;
  }
  const types: LocalHash = {};
  if (alertObjects) {
    alertObjects.forEach((alert: AlertData) => {
      if (
        alert.alert_category_list &&
        alert.alert_category_list.find((c: AlertCategory) =>
          category.includes(c.alertCategory)
        )
      ) {
        alert.alert_category_list.forEach((c: AlertCategory) => {
          c.alert_types.forEach((type) => {
            types[type] = type;
          });
        });
      }
    });
  }

  return Object.keys(types);
};

const operationAlerTypes = (alertTypes: string[]) => [
  {
    alertCategory: LAN_INDEXING,
    alert_types: alertTypes
  },
  {
    alertCategory: POST_PROCESSING,
    alert_types: alertTypes
  },
  {
    alertCategory: SYSTEM_MESSAGES,
    alert_types: alertTypes
  }
];

const EmailNotifications = () => {
  const { session } = useSession();
  const {
    data: alerts,
    refetch: refetchAlerts,
    isLoading
  } = useEmailAlerts({ session });
  const updateEmail = useUpdateEmailMutation(session, URL);
  const deleteEmail = useDeleteEmailMutation(session);
  const [isSecEmailFocused, setSecEmailFocused] = useState(false);
  const [isOpEmailFocused, setOpEmailIsFocused] = useState(false);
  const [securityAlertEmailList, setSecurityAlertEmailList] = useState<
    string[]
  >([]);
  const [operationalAlertEmailList, setOperationalAlertEmailList] = useState<
    string[]
  >([]);
  const [jobFailedAlert, setJobFailedAlert] = useState<boolean>(false);
  const [jobStartAndDoneAlert, setJobStartAndDoneAlert] =
    useState<boolean>(false);
  const [changed, setChanged] = useState<boolean>(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);
  const [doEnterInit, setEnterInit] = useState<boolean>(true);
  const { canAccess } = useUser();
  const { showSuccessSnackbar } = useSnackbarContext();

  const intialize = () => {
    setSecurityAlertEmailList(getAlertsEmails(alerts, SECURITY_ALERTS));
    setOperationalAlertEmailList(getAlertsEmails(alerts, OPERATIONAL_ALERTS));
    setJobFailedAlert(
      getAlertTypes(alerts, OPERATIONAL_ALERTS).includes(JOB_FAILED)
    );
    setJobStartAndDoneAlert(() => {
      const jobs = getAlertTypes(alerts, OPERATIONAL_ALERTS);
      return jobs.includes(JOB_STARTED) || jobs.includes(JOB_DONE);
    });
    setChanged(false);
  };

  if (!isLoading && alerts && doEnterInit) {
    intialize();
    setIsLoadingUpdate(false);
    setEnterInit(false);
  }

  const getDeleteEmailPromises = (): Promise<AxiosResponse>[] => {
    const securityEmails: string[] = [];
    const operationEmails: string[] = [];
    const deletePromises = [];

    getAlertsEmails(alerts, SECURITY_ALERTS).forEach((email) => {
      if (!securityAlertEmailList.includes(email)) {
        securityEmails.push(email);
      }
    });

    getAlertsEmails(alerts, OPERATIONAL_ALERTS).forEach((email) => {
      if (!operationalAlertEmailList.includes(email)) {
        operationEmails.push(email);
      }
    });

    securityEmails.push(...operationEmails);

    if (securityEmails.length > 0) {
      const urls: string[] = [];
      securityEmails.forEach((email) => {
        urls.push(`${URL}/${email}`);
      });

      deletePromises.push(...urls.map((url) => deleteEmail.mutateAsync(url)));
    }

    return deletePromises;
  };

  const getUpdateEmailPromises = (): Promise<AxiosResponse>[] => {
    const securityAlertPayload = {} as AlertDataPayload;
    const operationAlertPayload = {} as AlertDataPayload;
    const updatePromises = [];

    if (securityAlertEmailList.length > 0) {
      securityAlertPayload.alert_category_list = [
        {
          alertCategory: SECURITY_ALERT_VAL,
          alert_types: [SECURITY_JOB]
        }
      ];
      securityAlertPayload.alert_email_address_list = [];
      securityAlertEmailList.forEach((email) => {
        securityAlertPayload.alert_email_address_list.push(email);
      });
      updatePromises.push(updateEmail.mutateAsync(securityAlertPayload));
    }

    if (operationalAlertEmailList.length > 0) {
      const alertTypes: string[] = [];

      if (jobFailedAlert) {
        alertTypes.push(JOB_FAILED);
      }

      if (jobStartAndDoneAlert) {
        alertTypes.push(JOB_DONE);
        alertTypes.push(JOB_STARTED);
      }

      operationAlertPayload.alert_category_list =
        operationAlerTypes(alertTypes);
      operationAlertPayload.alert_email_address_list = [];
      operationalAlertEmailList.forEach((email) => {
        operationAlertPayload.alert_email_address_list.push(email);
      });
      updatePromises.push(updateEmail.mutateAsync(operationAlertPayload));
    }

    return updatePromises;
  };

  const saveChanges = async () => {
    const promises = [...getDeleteEmailPromises(), ...getUpdateEmailPromises()];

    if (promises.length > 0) {
      setIsLoadingUpdate(true);
      try {
        await Promise.all(promises);
        await refetchAlerts();
        setEnterInit(true);
        showSuccessSnackbar('Success: Saved email notification settings');
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error updating emails: ', error);
      }
      setIsLoadingUpdate(false);
    }
  };

  const theme = useTheme();
  const chipStyle = {
    backgroundColor: theme.palette.neutral.primary500,
    color: theme.palette.neutral.primary100
  };

  return (
    <Container height='100%' padding='16px 16px 16px 24px'>
      <Box sx={{ fontSize: 16, fontWeight: 600 }}>Email Notifications</Box>
      {isLoading && <Loader sx={{ height: 470 }} />}
      {!isLoading && (
        <Stack
          sx={{
            width: '70%',
            pointerEvents: isLoadingUpdate ? 'none' : 'auto'
          }}
        >
          <Stack
            sx={{
              paddingBottom: '20px'
            }}
          >
            <Box sx={{ padding: '16px 0 5px 0' }}>
              <Typography
                variant='subtitle1'
                fontSize='14px'
                fontWeight='600'
                display='block'
              >
                Security Alerts
              </Typography>
            </Box>
            <Box>
              <Autocomplete
                multiple
                id='tags-filled'
                options={[]}
                freeSolo
                disabled={!canAccess('alertmgmt')}
                value={securityAlertEmailList}
                onChange={(e, value: string[]) => {
                  setSecurityAlertEmailList(value);
                  setChanged(true);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant='filled'
                      label={option}
                      sx={chipStyle}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className='chipInput'
                    size='medium'
                    variant='standard'
                    label='Send an email notification for security alerts.'
                    placeholder={EMAIL_PLACEHOLDER}
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                      onFocus: () => setSecEmailFocused(true),
                      onBlur: () => setSecEmailFocused(false),
                      style: {
                        border: '1px solid',
                        boxSizing: 'border-box',
                        borderColor: isSecEmailFocused
                          ? theme.palette.neutral.secondary100
                          : theme.palette.neutral.dark400,
                        borderRadius: '4px',
                        padding: '5px 8px 5px 8px'
                      }
                    }}
                    InputLabelProps={{
                      ...params.InputLabelProps,
                      shrink: true
                    }}
                  />
                )}
              />
              <Typography variant='body2'>{EMAIL_HELPER_MSG}</Typography>
            </Box>
          </Stack>
          <Divider />
          <Stack>
            <Box sx={{ padding: '16px 0 5px 0' }}>
              <Typography
                variant='subtitle1'
                fontWeight='600'
                display='block'
                fontSize='14px'
              >
                Operations Notifications
              </Typography>
            </Box>
            <Box>
              <Autocomplete
                multiple
                id='tags-filled'
                options={[]}
                freeSolo
                value={operationalAlertEmailList}
                disabled={!canAccess('alertmgmt')}
                onChange={(e, value: string[]) => {
                  setOperationalAlertEmailList(value);
                  setChanged(true);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      variant='filled'
                      label={option}
                      sx={chipStyle}
                      {...getTagProps({ index })}
                    />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    className='chipInput'
                    size='medium'
                    variant='standard'
                    label='Send an email notification for LAN Indexer and post-processing jobs.'
                    placeholder={EMAIL_PLACEHOLDER}
                    InputProps={{
                      ...params.InputProps,
                      disableUnderline: true,
                      onFocus: () => setOpEmailIsFocused(true),
                      onBlur: () => setOpEmailIsFocused(false),
                      style: {
                        border: '1px solid',
                        boxSizing: 'border-box',
                        borderColor: isOpEmailFocused
                          ? theme.palette.neutral.secondary100
                          : theme.palette.neutral.dark400,
                        borderRadius: '4px',
                        padding: '5px 8px 5px 8px'
                      }
                    }}
                    InputLabelProps={{
                      ...params.InputLabelProps,
                      shrink: true
                    }}
                  />
                )}
              />
              <Typography variant='body2'>{EMAIL_HELPER_MSG}</Typography>
            </Box>
          </Stack>
          <Stack sx={{ paddingTop: '16px' }}>
            <FormControlLabel
              sx={{ height: '15px', marginTop: '15px' }}
              control={
                <Checkbox
                  checked={jobFailedAlert}
                  disabled={!canAccess('alertmgmt')}
                  onChange={() => {
                    setJobFailedAlert(!jobFailedAlert);
                    setChanged(true);
                  }}
                />
              }
              label={<Typography variant='body2'>Job Failed</Typography>}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={jobStartAndDoneAlert}
                  disabled={!canAccess('alertmgmt')}
                  onChange={() => {
                    setJobStartAndDoneAlert(!jobStartAndDoneAlert);
                    setChanged(true);
                  }}
                />
              }
              label={
                <Typography variant='body2'>
                  Job Started and Job Done
                </Typography>
              }
            />
          </Stack>
          <Divider />
          <Grid
            sx={{
              paddingTop: '15px'
            }}
          >
            <Box className={sx.changes}>
              {isLoadingUpdate && (
                <Box sx={{ position: 'absolute', left: 0 }}>
                  <Loader />
                </Box>
              )}
              <Button
                variant='outlined'
                className={sx.footerButton}
                disabled={
                  isLoadingUpdate || !changed || !canAccess('alertmgmt')
                }
                onClick={() => {
                  intialize();
                }}
              >
                Clear Changes
              </Button>
              <Button
                variant='contained'
                className={sx.footerButton}
                disabled={
                  isLoadingUpdate || !changed || !canAccess('alertmgmt')
                }
                onClick={() => {
                  saveChanges();
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Stack>
      )}
    </Container>
  );
};

export default EmailNotifications;

export const emailNotificationsLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const canAccess = await loadCanAccess(queryClient);
    if (!canAccess('alertmgmt')) {
      return redirect('..');
    }
    return null;
  };
