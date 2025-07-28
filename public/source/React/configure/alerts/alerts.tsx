import { useState } from 'react';

import {
  Alert,
  Stack,
  Box,
  IconButton,
  Typography,
  Divider,
  InputLabel,
  Button,
  InputBase
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Container from 'components/inc/container';
import useAnalysisForm from 'utils/hooks/useAnalysisForm';
import useMalwareStatus from 'data-hooks/useMalwareStatus';
import useConfigurations from 'utils/useQuery/useConfigurations';
import { useUser } from 'utils/context/UserContext';
import useSignatures, { SignatureParams } from 'data-hooks/useSignatures';
import useSignaturesUpdate, {
  SignaturesPayload
} from 'data-hooks/useSignaturesUpdate';
import useConfigInfo from 'data-hooks/useConfigInfo';
import Loader from 'components/inc/loader';
import debounce from 'lodash.debounce';
import { loadCanAccess } from 'lib/loadCanAccess';
import { QueryClient } from '@tanstack/react-query';
import { LoaderFunction, redirect } from 'react-router-dom';
import AlertsMalwareModal from './alertsMalwareModal';

import sx from './alerts.module.scss';
import AlertConfigurationModal from './alertConfigurationModal';

interface MalwareStatusResult {
  data: any;
  isLoading: boolean;
  isError: boolean;
  error: any;
}

const inputbaseId = 'signatures_inputbase';
const SIGNSET_NAME = 'CustomMalwareSigs';
const MAX_SIGNATURES = 1000;
const Alerts = () => {
  const { session } = useUser();
  const [signatures, setSignatures] = useState('');
  const [signatureCount, setSignatureCount] = useState(0);
  const [changed, setChanged] = useState(false);
  const [valideSignatures, setValideSignatures] = useState(false);
  const [openMalwareModal, setOpenMalwareModal] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  const [openAlertConfigurationModal, setOpenAlertConfigurationModal] =
    useState(false);
  const [doEnterInit, setEnterInit] = useState(true);
  const [, setSignatureLoader] = useState(true);

  const { configurationsLoading } = useConfigurations();
  const { data: configInfo } = useConfigInfo();
  /* Malware Packages Hook */
  const {
    data: malwareStatus,
    isLoading: isMalwareStatusLoading,
    isError: isMalwareStatusError,
    error: malwareStatusError
  }: MalwareStatusResult = useMalwareStatus({
    session
  });
  const { canAccess } = useUser();

  const { uploadList, progress, error, success, cleanupUpload } =
    useAnalysisForm();

  const theme = useTheme();

  const params: SignatureParams = { sigset_name: SIGNSET_NAME };

  const {
    data: customSignatures,
    refetch: refetchSignatures,
    isLoading: signaturesLoading
  } = useSignatures(
    session,
    configInfo?.fedid || '',
    configInfo?.indexid === undefined ? -1 : configInfo?.indexid,
    params
  );

  const setSignaturesCall = useSignaturesUpdate(
    session,
    configInfo?.fedid || '',
    configInfo?.indexid === undefined ? -1 : configInfo?.indexid
  );

  const intialize = () => {
    setChanged(false);
    setValideSignatures(false);
    setSubmitMessage('');
    if (customSignatures && customSignatures.signatures) {
      setSignatures(customSignatures.signatures.join('\n'));
      setSignatureCount(customSignatures.signatures.length);
    } else {
      setSignatures('');
    }
  };

  if (!signaturesLoading && customSignatures && doEnterInit) {
    intialize();
    setEnterInit(false);
    setSignatureLoader(signaturesLoading);
  }

  const updateSignatures = async () => {
    const payload: SignaturesPayload = {
      'signatures': signatures.split('\n').filter((line) => line.trim() !== ''),
      'version': customSignatures.version + 1,
      'sigset_name': SIGNSET_NAME
    };
    if (customSignatures.sigtype) {
      payload.sigtype = customSignatures.sigtype;
    }
    try {
      setSaveLoader(true);
      await setSignaturesCall.mutateAsync(payload);
      await refetchSignatures();
      setEnterInit(true);
      setSubmitMessage('Changes saved successfully.');
    } catch (errorObject) {
      // eslint-disable-next-line no-console
      console.error(errorObject);
      setSubmitMessage(
        'Changes could not be saved due to potential conflicts with updates from another node or update-related errors. Refreshing the page should resolve potential conflicts. Review the logs for error details to resolve the update-related errors.'
      );
    } finally {
      setSaveLoader(false);
    }
  };

  const validateSignatures = debounce(
    (customSigs: string[], validLength: number) =>
      setValideSignatures(
        customSigs.every((signature: string) =>
          [validLength, 0].includes(signature.length)
        )
      ),
    300
  );

  return (
    <>
      <Container
        padding='16px 16px 16px 24px'
        className={sx.alertContainer}
        height='100%'
      >
        <Stack className={sx.stack__main}>
          {isMalwareStatusError &&
            malwareStatusError?.response?.status !== 404 && (
              <Alert
                severity='error'
                variant='filled'
                sx={{
                  border: '1px solid rgb(229, 115, 115)',
                  color: 'white',
                  fontWeight: 800,
                  marginBottom: '1em'
                }}
              >
                Failed to get malware file status. {malwareStatusError.message}
              </Alert>
            )}
          <Typography className={sx.title}>Special Criteria</Typography>
        </Stack>
        {configurationsLoading && <Loader sx={{ height: 210 }} />}
        {!configurationsLoading && (
          <Stack className={sx.stack__main}>
            <Box padding='16px 0 5px 0'>
              <Typography fontSize={14} fontWeight={600}>
                Malware Signature
              </Typography>
            </Box>
            <Box>
              <Typography
                variant='body1'
                className={sx.uploadMalware}
                fontSize={14}
              >
                <FileUploadIcon className={sx.emailIcon} />
                Upload malware signature file
                <IconButton
                  className={sx.editIconButton}
                  onClick={() => setOpenMalwareModal(true)}
                  disabled={!canAccess('alertmgmt')}
                >
                  <EditIcon
                    className={sx.editIcon}
                    sx={{ color: theme.palette.primary.main }}
                  />
                </IconButton>
              </Typography>
            </Box>

            <Typography fontSize={14} fontWeight={600} paddingTop={2}>
              Malware signature file details:
            </Typography>
            {isMalwareStatusLoading && (
              <Typography fontSize={14}>Status: Fetching...</Typography>
            )}
            {isMalwareStatusError &&
              malwareStatusError.response?.status === 404 && (
                <Typography fontSize={14}>
                  No malware signature file installed.
                </Typography>
              )}
            {!isMalwareStatusLoading && !isMalwareStatusError && (
              <>
                <Typography fontSize={14}>
                  Installed date: {malwareStatus.date}
                </Typography>
                <Typography fontSize={14}>
                  Version: {malwareStatus.version}
                </Typography>
              </>
            )}

            <Divider sx={{ paddingTop: 2 }} />

            <Box sx={{ padding: '16px 0 5px 0', width: '100%' }}>
              <Typography
                variant='subtitle1'
                fontWeight='600'
                display='block'
                fontSize='14px'
                width='100%'
              >
                Custom Signatures
              </Typography>
              <InputLabel htmlFor={inputbaseId}>
                Add or update MD5 custom signatures using hexadecimal characters
                (0-9, A-F).
              </InputLabel>
              <InputLabel htmlFor={inputbaseId}>
                Signature starts on a new line and is not case sensitive. Press
                Enter to move to the next line.
              </InputLabel>
              <InputBase
                id={inputbaseId}
                placeholder='Add signatures.'
                sx={{
                  '&:hover': {
                    borderColor: theme.palette.neutral.secondary100
                  },
                  '&.Mui-focused': {
                    borderColor: theme.palette.neutral.secondary100
                  },
                  border: `1px solid ${theme.palette.neutral.dark500}`,
                  borderRadius: '4px',
                  padding: '5px 8px 5px 8px',
                  fontSize: '14px'
                }}
                multiline
                fullWidth
                rows={6}
                value={signatures}
                onChange={(event) => {
                  const validLength = 32;
                  const newValue = event.target.value;
                  setSubmitMessage('');
                  if (/^[0-9a-fA-F\n]*$/.test(newValue)) {
                    // Split the input into lines
                    const lines = newValue.split('\n');
                    // Check each line to ensure it does not exceed 32 characters
                    const validLines = lines.map((line) =>
                      line.slice(0, validLength)
                    );
                    setSignatureCount(
                      lines.filter((line) => line.trim() !== '').length
                    );
                    // Join the lines back together
                    const validValue = validLines.join('\n');
                    setSignatures(validValue);
                    validateSignatures(validLines, validLength);
                    setChanged(true);
                  }
                }}
              />
              <Box justifyContent='space-between' display='flex'>
                <InputLabel>Maximum signatures: {MAX_SIGNATURES}</InputLabel>
                <InputLabel>Signature count: {signatureCount}</InputLabel>
              </Box>
            </Box>
            <Box display='flex'>
              {saveLoader && (
                <Box className={sx.footerElement}>
                  <Loader />
                </Box>
              )}
              {submitMessage && (
                <Box
                  className={`${sx.footerElement} ${sx.footerMessage}`}
                  sx={{
                    fontSize: '16px',
                    fontWeight: 600
                  }}
                >
                  {submitMessage}
                </Box>
              )}
              <Box flexGrow={1} />
              <Button
                variant='outlined'
                className={sx.footerElement}
                disabled={!changed || saveLoader}
                onClick={() => {
                  intialize();
                }}
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                className={sx.footerElement}
                disabled={
                  !valideSignatures ||
                  saveLoader ||
                  signatureCount > MAX_SIGNATURES
                }
                onClick={() => {
                  updateSignatures();
                }}
              >
                Save
              </Button>
            </Box>
            <Typography
              fontSize={14}
              fontWeight={600}
              paddingTop={2}
              marginTop={2}
              sx={{ borderTop: '1px dotted #ccc' }}
            >
              Database Corruption
            </Typography>
            <Typography fontSize={14}>
              Configure Database Corruption Alerting Criteria
              <IconButton
                className={sx.editIconButton}
                onClick={() => setOpenAlertConfigurationModal(true)}
                disabled={!canAccess('alertmgmt')}
              >
                <EditIcon
                  className={sx.editIcon}
                  sx={{ color: theme.palette.primary.main }}
                />
              </IconButton>
            </Typography>
          </Stack>
        )}
      </Container>
      <AlertsMalwareModal
        visibility={openMalwareModal}
        setVisibility={setOpenMalwareModal}
        values={{ uploadList, progress, error, success, cleanupUpload }}
      />
      <AlertConfigurationModal
        visibility={openAlertConfigurationModal}
        setOpenAlertConfigurationModal={setOpenAlertConfigurationModal}
      />
    </>
  );
};

export default Alerts;

export const alertSettingsLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const canAccess = await loadCanAccess(queryClient);
    if (!canAccess('alertmgmt')) {
      return redirect('..');
    }
    return null;
  };
