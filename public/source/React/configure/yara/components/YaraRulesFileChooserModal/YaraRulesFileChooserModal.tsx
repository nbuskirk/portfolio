import {
  Box,
  useTheme,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  DialogActions,
  Button
} from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import { FileWithPath, useDropzone } from 'react-dropzone';
import useMutateUploadYaraRuleFileCreate from 'data-hooks/yara/useMutateUploadYaraRuleFileCreate';
import useConfigInfo from 'data-hooks/useConfigInfo';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import Loader from 'components/inc/loader';
import useMutateUploadYaraRuleFileUpdate from 'data-hooks/yara/useMutateUploadYaraRuleFileUpdate';
import YaraRulesFileUploadDropZone, {
  FileStatus
} from './YaraRulesFileChooserDropZone';
import validateYaraRuleFile from '../utils/validateYaraRuleFile';

interface CompileStatus {
  status: FileStatus;
  message?: string;
}

interface Props {
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  onAcceptFile: (file: File) => void;
  id?: string;
}

const YaraRulesFileChooserModal = ({
  modalOpen,
  setModalOpen,
  onAcceptFile,
  id
}: Props) => {
  const theme = useTheme();
  const {
    data: configInfo,
    isLoading: isConfigLoading,
    isSuccess: isConfigSuccess
  } = useConfigInfo();
  const { fedid, indexid } = configInfo ?? {};
  const { mutate: mutateCreate } = useMutateUploadYaraRuleFileCreate({
    fedId: fedid,
    indexId: indexid
  });
  const { mutate: mutateUpdate } = useMutateUploadYaraRuleFileUpdate({
    fedId: fedid,
    indexId: indexid
  });

  const [acceptedFile, setAcceptedFile] = useState<FileWithPath | undefined>();
  const dropZone = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    onDrop: (acceptedFiles: File[]) => {
      setAcceptedFile(acceptedFiles[0]);
    }
  });

  const [compileStatus, setCompileStatus] = useState<CompileStatus>();
  const [compileLoading, setCompileLoading] = useState<boolean>(false);

  const { isValidFile, fileValidationError } =
    validateYaraRuleFile(acceptedFile);

  const errorMessage =
    compileStatus?.status === 'error'
      ? compileStatus?.message
      : fileValidationError;

  let fileStatus: FileStatus;
  if (compileStatus?.status === 'error' || !isValidFile) {
    fileStatus = 'error';
  } else if (compileStatus?.status === 'success') {
    fileStatus = 'success';
  }

  const resetState = () => {
    setAcceptedFile(undefined);
    setCompileStatus(undefined);
  };

  const compile = () => {
    setCompileLoading(true);

    const formData = new FormData();
    formData.append('file', acceptedFile!);
    formData.append('fileName', acceptedFile!.name);

    const onSuccess = () => {
      setCompileStatus({
        status: 'success',
        message: undefined
      });
      setCompileLoading(false);
    };

    const onError = (error: any) => {
      setCompileStatus({
        status: 'error',
        message: error?.response?.data?.detail ?? error?.message
      });
      setCompileLoading(false);
    };

    if (id) {
      mutateUpdate(
        { formData, compile_only: true, id },
        {
          onSuccess,
          onError
        }
      );
    } else {
      mutateCreate(
        { formData, compile_only: true },
        {
          onSuccess,
          onError
        }
      );
    }
  };

  const handleContinue = () => {
    if (fileStatus !== undefined) {
      onAcceptFile(acceptedFile!);
      setModalOpen(false);
    } else {
      compile();
    }
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
          <Typography fontWeight={600}>
            {id ? 'Replace Ruleset File' : 'Select Ruleset File'}
          </Typography>
          <IconButton
            onClick={() => setModalOpen(false)}
            sx={{ transform: 'translateX(10px)' }}
          >
            <CloseOutlinedIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {isConfigLoading && <Loader sx={{ height: 200 }} />}
        {isConfigSuccess && (
          <>
            <YaraRulesFileUploadDropZone
              dropZone={dropZone}
              acceptedFile={acceptedFile}
              onClose={resetState}
              fileStatus={fileStatus}
            />
            {errorMessage && (
              <Typography
                variant='subtitle2'
                sx={{
                  marginTop: 1,
                  color: `${theme.palette.error.main}`
                }}
              >
                {errorMessage}
              </Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          padding: '1em 2em',
          borderTop: `1px solid ${theme.palette.neutral.dark400}`
        }}
      >
        {!acceptedFile && (
          <Button
            variant='outlined'
            onClick={() => {
              resetState();
              setModalOpen(false);
            }}
          >
            Cancel
          </Button>
        )}
        {acceptedFile && (
          <>
            <Button variant='outlined' onClick={() => resetState()}>
              Back
            </Button>
            <LoadingButton
              variant='contained'
              loading={compileLoading}
              disabled={!isValidFile}
              onClick={() => handleContinue()}
            >
              Continue
            </LoadingButton>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default YaraRulesFileChooserModal;
