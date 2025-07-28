import React, { useState, useRef } from 'react';
import { Typography, Stack, Box, Grid } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { SECURITY_CONFIG } from 'constants/queryKeys';
import Modal from 'components/inc/modalContainer/modalContainer';
import { useTheme } from '@mui/material/styles';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import sx from './security.module.scss';
import CustomButton from '../customButton';

interface CardProps {
  visibility: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setDetailVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  mutationSecurity: any;
}

const Card: React.FC<CardProps> = ({
  visibility,
  setVisibility,
  setLoading,
  setDetailVisibility,
  mutationSecurity
}) => {
  const theme = useTheme();
  const [keyName, setKeyName] = useState<string>('');
  const [certName, setCertName] = useState<string>('');
  const [certificate, setCertificate] = useState<File | null>(null);
  const [key, setKey] = useState<File | null>(null);
  const crtInputRef = useRef<HTMLInputElement | null>(null);
  const keyInputRef = useRef<HTMLInputElement | null>(null);
  const [selectionMessage, setSelectionMessage] = useState('');
  const { showSuccessSnackbar, showAxiosErrorSnackbar } = useSnackbarContext();

  const queryClient = useQueryClient();

  const CancelSubmit: any = () => {
    setSelectionMessage('');
    if (crtInputRef.current) {
      crtInputRef.current.value = '';
    }
    if (keyInputRef.current) {
      keyInputRef.current.value = '';
    }
    setKeyName('');
    setCertName('');
    setCertificate(null);
    setKey(null);
    setVisibility(false);
  };

  const successAction = () => {
    showSuccessSnackbar('Success: Certificate files uploaded');
    const queryKey: any = SECURITY_CONFIG;
    queryClient.invalidateQueries(queryKey);

    // reload the window after giving enough time for the success snackbar to display
    setTimeout(() => window.location.reload(), 2000);
  };

  const SubmitFiles = () => {
    setSelectionMessage('');
    if (certName !== '' && keyName !== '') {
      setDetailVisibility(false);
      setVisibility(false);
      const formData = new FormData();
      if (certificate) formData.append('ssl_certificate', certificate);
      if (key) formData.append('ssl_key', key);
      setLoading(true);
      mutationSecurity.mutate(formData, {
        onSuccess: () => {
          successAction();
        },
        onError: (error: any) => {
          if (error?.response?.data?.status) {
            // If error is thrown from backend with status codes then Failure message will be displayed.
            setDetailVisibility(true);
            showAxiosErrorSnackbar(error);
          } else {
            // If error is regarding CORS policy which has no status codes. Even if backend operation is successful, this error is not consistent and rarely occur when HTTP, HTTPS settings are altered.
            successAction();
          }
        }
      });
      if (crtInputRef.current) {
        crtInputRef.current.value = '';
      }
      if (keyInputRef.current) {
        keyInputRef.current.value = '';
      }
      setLoading(false);
      setKeyName('');
      setCertName('');
      setCertificate(null);
      setKey(null);
    } else {
      setSelectionMessage('Please upload the Certificate and Key to continue.');
    }
  };

  return (
    <Modal
      setVisibility={setVisibility}
      visibility={visibility}
      title='Security Certificates for SSL/TLS Connection'
      cancelText='Cancel'
      saveText='Upload'
      onCancel={CancelSubmit}
      saveDisabled={false}
      width='772px'
      onSave={SubmitFiles}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 3, margin: '0px' }}
      >
        <Typography>
          HTTPS requires SSL/TLS certificates to establish secure communication
          between the browser and server. Ensure that the SSL/TLS certificates
          are in PEM format.
        </Typography>
        <Box className={sx.cardBody} sx={{ borderBottom: '1px solid #cdd0d4' }}>
          <Grid>
            <input
              accept='.key'
              ref={keyInputRef}
              type='file'
              style={{ display: 'none' }}
              id='key-file-upload'
              onChange={(e: any) => {
                setSelectionMessage('');
                if (
                  e.target.files !== null &&
                  e.target.files[0] &&
                  e.target.files[0].name !== ''
                ) {
                  setKey(e.target.files[0]);
                  setKeyName(e.target.files[0].name);
                }
              }}
            />
            <label htmlFor='key-file-upload'>
              {/* {' '} */}
              <CustomButton
                bgColor={
                  keyName.length > 0
                    ? `${theme.palette.neutral.primary300}`
                    : `${theme.palette.primary.main}`
                }
                fontColor='#ffffff'
                width='150px'
                id='key-file-upload'
                component='span'
              >
                Choose Private Key
              </CustomButton>
            </label>
          </Grid>
          <Stack
            className={`${sx.fileName} ${
              keyName !== '' && visibility ? sx.visible : sx.hidden
            }`}
            direction='row'
          >
            {keyName !== '' && (
              <Typography className={sx.text}>{keyName}</Typography>
            )}
          </Stack>
        </Box>
        <Box className={sx.cardBody}>
          <Grid>
            <input
              accept='.crt, .pem'
              ref={crtInputRef}
              type='file'
              id='crt-file-upload'
              style={{ display: 'none' }}
              onChange={(e: any) => {
                setSelectionMessage('');
                if (
                  e.target.files !== null &&
                  e.target.files[0] &&
                  e.target.files[0].name !== ''
                ) {
                  setCertificate(e.target.files[0]);
                  setCertName(e.target.files[0].name);
                }
              }}
            />
            <label htmlFor='crt-file-upload'>
              {/* {' '} */}
              <CustomButton
                bgColor={
                  certName.length > 0
                    ? `${theme.palette.neutral.primary300}`
                    : `${theme.palette.primary.main}`
                }
                fontColor='#ffffff'
                width='150px'
                id='crt-file-upload'
                component='span'
              >
                Choose Certificate
              </CustomButton>
            </label>
          </Grid>
          <Stack
            className={`${sx.fileName} ${
              certName !== '' && visibility ? sx.visible : sx.hidden
            }`}
            direction='row'
          >
            {certName !== '' && (
              <Typography className={sx.text}>{certName}</Typography>
            )}
          </Stack>
          <Typography className={sx.section}>{selectionMessage}</Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default Card;
