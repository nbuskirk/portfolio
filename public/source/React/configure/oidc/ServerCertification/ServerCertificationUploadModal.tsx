import {
  Box,
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  DialogActions,
  Button,
  Alert,
  AlertTitle
} from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import { FileWithPath, useDropzone } from 'react-dropzone';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import CSDropZone, { FileStatus } from 'components/inc/CSDropZone/CSDropZone';
import useMutateCreateServerCertificate from 'data-hooks/oidc/useMutateCreateServerCertificate';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import { AxiosResponse } from 'axios';
import validateServerCertificateFile from '../utils/validateServerCertificateFile';

interface Props {
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
}

const ServerCertificationUploadModal = ({ modalOpen, setModalOpen }: Props) => {
  const theme = useTheme();

  const [acceptedFile, setAcceptedFile] = useState<FileWithPath | undefined>();
  const dropZone = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    onDrop: (acceptedFiles: File[]) => {
      setAcceptedFile(acceptedFiles[0]);
    }
  });
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const { mutate } = useMutateCreateServerCertificate();
  const { showSuccessSnackbar } = useSnackbarContext();

  const { fileStatus: fileValidationStatus, fileValidationError } =
    validateServerCertificateFile(acceptedFile);
  const [fileUploadWarnings, setFileUploadWarnings] = useState<string[]>([]);

  const instructions =
    'Supported file types are .crt, .cer, .der, .p12, .pem and .pfx.';

  let fileStatus: FileStatus = fileValidationStatus;
  if (fileUploadWarnings.length > 0 && fileStatus !== 'error') {
    fileStatus = 'warning';
  }

  const resetState = () => {
    setAcceptedFile(undefined);
    setFileUploadWarnings([]);
  };

  const upload = () => {
    setUploadLoading(true);
    acceptedFile?.text().then((fileContents) => {
      mutate(
        { server_certificate: { certificate: fileContents } },
        {
          onSuccess: (data: AxiosResponse) => {
            if (data.status === 207) {
              setFileUploadWarnings(
                data.data.map(
                  (responseObject: any) => responseObject.details.errormsg
                )
              );
            } else {
              showSuccessSnackbar('Success: Uploaded server certification');
              setModalOpen(false);
            }
          },
          onSettled: () => {
            setUploadLoading(false);
          }
        }
      );
    });
  };

  return (
    <Dialog
      open={modalOpen}
      fullWidth
      TransitionProps={{ onExited: resetState }}
    >
      <DialogTitle
        sx={{ borderBottom: `1px solid ${theme.palette.neutral.dark400}` }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography fontWeight={600}>Select Certification File</Typography>
          <IconButton
            onClick={() => setModalOpen(false)}
            sx={{ transform: 'translateX(10px)' }}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <CSDropZone
          dropZone={dropZone}
          acceptedFile={acceptedFile}
          onClose={resetState}
          instructions={instructions}
          fileStatus={fileStatus}
          errorMessage={fileValidationError}
          warningMessage={
            fileUploadWarnings?.length > 0 && (
              <Alert severity='warning' icon={false}>
                <AlertTitle>
                  Certificate upload finished with the following validation
                  errors
                </AlertTitle>
                {fileUploadWarnings.join('<br>')}
              </Alert>
            )
          }
        />
      </DialogContent>
      <DialogActions
        sx={{
          padding: '1em 2em',
          borderTop: `1px solid ${theme.palette.neutral.dark400}`
        }}
      >
        {!acceptedFile && (
          <Button variant='outlined' onClick={() => setModalOpen(false)}>
            Cancel
          </Button>
        )}
        {acceptedFile && (
          <>
            {fileUploadWarnings.length === 0 && (
              <>
                <Button variant='outlined' onClick={() => resetState()}>
                  Back
                </Button>
                <LoadingButton
                  variant='contained'
                  loading={uploadLoading}
                  disabled={fileStatus === 'error'}
                  onClick={() => upload()}
                >
                  Upload
                </LoadingButton>
              </>
            )}
            {fileUploadWarnings.length > 0 && (
              <Button variant='outlined' onClick={() => setModalOpen(false)}>
                Close
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ServerCertificationUploadModal;
