import { useState, useEffect } from 'react';

import {
  Box,
  Typography,
  Divider,
  Stack,
  FormControlLabel,
  Radio,
  RadioGroup,
  Button,
  Grid
} from '@mui/material';

import useLicenseForm from 'utils/hooks/useLicenseForm';
import { useDropzone } from 'react-dropzone';

import InputText from 'components/inc/inputText';
import Loader from 'components/inc/loader';
import { useUser } from 'utils/context/UserContext';
import useLicenseServerPatch, {
  ServerPayload
} from 'utils/hooks/useLicenseServerPatch';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import sx from './licenseConfiguration.module.scss';
import { LicenseCapacityData } from '../types';

const REGISTER = 'register';
const UPLOAD = 'upload';
const FONTSIZE = 14;
const UPLOAD_LICENSE = 'Upload License';
const REGISTER_TO_SERVER = 'Register';
const DEREGISTER_FROM_SERVER = 'Deregister';

const LicenseConfiguration = ({
  licenseInfo,
  licenseServer,
  licenseServerRefetch
}: {
  licenseInfo: LicenseCapacityData | null;
  licenseServer: { hostname: string } | null;
  licenseServerRefetch: () => void;
}) => {
  const { onDrop, progress } = useLicenseForm();
  const { session, canAccess } = useUser();
  const licenseAccess = canAccess('licensemgmt');
  const updateServerConfig = useLicenseServerPatch(session);
  const { open, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true
  });

  const expireDate =
    licenseInfo && licenseInfo.expires > 0
      ? new Date(licenseInfo.expires * 1000).toLocaleString(undefined, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          weekday: 'long',
          hour: '2-digit',
          hour12: true,
          minute: '2-digit',
          second: '2-digit'
        })
      : '';

  const [setupOption, setSetupOpion] = useState(
    licenseServer && licenseServer.hostname ? REGISTER : UPLOAD
  );

  const [hostname, setHostname] = useState('');
  const [password, setPassword] = useState('');
  const [registered, setRegistered] = useState(false);
  const [OTP, setOTP] = useState<string | undefined>();
  const [hostValidation, setHostValidation] = useState({
    error: false,
    errorMessage: ''
  });
  const [passwordValidation, setPasswordValidation] = useState({
    error: false,
    errorMessage: ''
  });

  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState<boolean>(false);
  const { showSuccessSnackbar } = useSnackbarContext();

  useEffect(() => {
    if (licenseServer && licenseServer.hostname) {
      setSetupOpion(REGISTER);
      setRegistered(true);
      setHostname(licenseServer.hostname);
    } else {
      setRegistered(false);
      setHostname('');
    }
  }, [licenseServer]);

  const validateRegisterInput = () => {
    let hostError = false;
    let passwordError = false;
    let hostErrorMessage = '';
    let passwordErrorMessage = '';
    if ((hostname || '').trim().length === 0) {
      hostError = true;
      hostErrorMessage = 'Hostname is not specified.';
    }
    if ((password || '').trim().length === 0) {
      passwordError = true;
      passwordErrorMessage = 'Password is not specified.';
    }
    setHostValidation((prev) => ({
      ...prev,
      'error': hostError,
      'errorMessage': hostErrorMessage
    }));
    setPasswordValidation((prev) => ({
      ...prev,
      'error': passwordError,
      'errorMessage': passwordErrorMessage
    }));

    return !(hostError || passwordError);
  };

  const handleRegiser = async () => {
    if (validateRegisterInput()) {
      setLoading(true);
      const payload: ServerPayload = {
        'hostname': hostname,
        'username': 'admin',
        'password': password,
        'otp': OTP
      };
      try {
        await updateServerConfig.mutateAsync(payload);
        setRegistered(true);
        showSuccessSnackbar('Success: Registered with the license server');
        licenseServerRefetch();
      } finally {
        setLoading(false);
      }
    }
  };
  const handleDeregiser = async () => {
    setLoading(true);
    const payload: ServerPayload = {
      'hostname': null
    };
    try {
      await updateServerConfig.mutateAsync(payload);
      setHostname('');
      setPassword('');
      setRegistered(false);
      showSuccessSnackbar('Success: Deregistered from the license server');
      licenseServerRefetch();
    } finally {
      setLoading(false);
    }
  };

  const onSave = async () => {
    if (setupOption === UPLOAD) {
      open();
    } else if (registered) {
      handleDeregiser();
    } else {
      handleRegiser();
    }
  };

  const getSubmitButtonLabel = () => {
    if (setupOption !== REGISTER) {
      return UPLOAD_LICENSE;
    }
    if (registered) {
      return DEREGISTER_FROM_SERVER;
    }
    return REGISTER_TO_SERVER;
  };

  return (
    <>
      <input {...getInputProps()} />
      <Box className={sx.box__columns}>
        {expireDate && (
          <Box>
            <Typography fontSize={14} fontWeight={600}>
              Expiration
            </Typography>
            <Typography fontSize={12} lineHeight={2}>
              {expireDate}
            </Typography>
          </Box>
        )}
      </Box>
      <Stack>
        <RadioGroup
          row
          sx={{ gap: '10px' }}
          name='row-radio-buttons-group'
          value={setupOption}
          onChange={(e) => {
            setSetupOpion(e.target.defaultValue);
            if (e.target.defaultValue === REGISTER) {
              licenseServerRefetch();
            }
          }}
        >
          <FormControlLabel
            value={UPLOAD}
            control={<Radio />}
            label={<Typography fontSize={FONTSIZE}>Upload License</Typography>}
            disabled={registered || loading || !licenseAccess}
          />
          <FormControlLabel
            value={REGISTER}
            control={<Radio />}
            label={
              <Typography fontSize={FONTSIZE}>
                Register with License Server
              </Typography>
            }
            disabled={loading || !licenseAccess}
          />
        </RadioGroup>
        {setupOption === REGISTER && (
          <Stack mt='10px' sx={{ width: '100%' }} gap={1}>
            <Box display='flex'>
              <Box width='100%'>
                <InputText
                  placeholder='Enter hostname'
                  value={hostname || ''}
                  error={hostValidation.error}
                  helperText={hostValidation.errorMessage}
                  disabled={loading || registered}
                  onChange={(e) => {
                    setChanged(true);
                    setHostname(e.target.value);
                    if (e.target.value.trim().length > 0) {
                      setHostValidation((prev) => ({
                        ...prev,
                        error: false,
                        errorMessage: ''
                      }));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onSave();
                    }
                  }}
                  label='License Server Host'
                />
              </Box>
              <Box width='100%'>
                <InputText
                  placeholder='Username'
                  value='admin'
                  disabled
                  onChange={() => {}}
                  label='Username'
                />
              </Box>
            </Box>
            {!registered && (
              <Box display='flex' pt={2}>
                <Box width='100%'>
                  <InputText
                    placeholder='Enter password'
                    value={password || ''}
                    type='password'
                    error={passwordValidation.error}
                    helperText={passwordValidation.errorMessage}
                    disabled={loading}
                    onChange={(e) => {
                      setChanged(true);
                      setPassword(e.target.value);
                      if (e.target.value.trim().length > 0) {
                        setPasswordValidation((prev) => ({
                          ...prev,
                          error: false,
                          errorMessage: ''
                        }));
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onSave();
                      }
                    }}
                    label='Password'
                  />
                </Box>
                <Box width='100%'>
                  <InputText
                    placeholder={
                      registered ? undefined : 'Enter One-Time Password'
                    }
                    value={OTP || ''}
                    disabled={loading || registered}
                    onChange={(e) => {
                      setChanged(true);
                      setOTP(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onSave();
                      }
                    }}
                    label='One-Time Password'
                  />
                </Box>
              </Box>
            )}
            <Divider sx={{ marginTop: 2 }} />
          </Stack>
        )}
        <Grid
          sx={{
            paddingTop: '15px'
          }}
        >
          <Box className={sx.changes}>
            {(loading || progress > 0) && (
              <Box sx={{ position: 'absolute', left: 0 }}>
                <Loader />
              </Box>
            )}
            <Box>
              {setupOption === REGISTER && (
                <Button
                  variant='outlined'
                  className={sx.footerButton}
                  disabled={
                    ((loading || !changed) && !registered) || !licenseAccess
                  }
                  onClick={() => {
                    setChanged(false);
                    setHostname('');
                    setPassword('');
                    setOTP('');
                    setHostValidation({
                      error: false,
                      errorMessage: ''
                    });
                    setPasswordValidation({
                      error: false,
                      errorMessage: ''
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button
                variant='contained'
                className={sx.footerButton}
                disabled={
                  ((loading || !changed) &&
                    !registered &&
                    setupOption === REGISTER) ||
                  !licenseAccess ||
                  progress > 0
                }
                onClick={() => onSave()}
              >
                {getSubmitButtonLabel()}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Stack>
    </>
  );
};

export default LicenseConfiguration;
