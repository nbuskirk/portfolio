import {
  Stack,
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Grid
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DescriptionIcon from '@mui/icons-material/Description';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import Cloud from 'assets/icons/cloudWithArrow.png';

import { DropzoneState, FileWithPath } from 'react-dropzone';
import sx from './YaraRulesFileChooserDropZone.module.scss';

export type FileStatus = 'success' | 'error' | undefined;

interface Props {
  dropZone: DropzoneState;
  acceptedFile?: FileWithPath;
  fileStatus?: FileStatus;
  onClose: () => void;
}

const YaraRulesFileChooserDropZone = ({
  dropZone,
  acceptedFile,
  onClose,
  fileStatus
}: Props) => {
  const theme = useTheme();

  const getFilesizeDisplay = () => {
    if (!acceptedFile) return '';

    if (acceptedFile.size < 1000) {
      return `${acceptedFile.size} bytes`;
    }

    return `${(acceptedFile.size / 1000).toFixed(2)} KB`;
  };

  return (
    <>
      <Stack
        sx={{
          alignItems: 'center',
          background: theme.palette.neutral.primary600,
          border: `1px solid ${theme.palette.neutral.dark500}`,
          display: 'flex'
        }}
        {...dropZone.getRootProps({ className: sx.stack__main })}
      >
        <input {...dropZone.getInputProps()} />

        {acceptedFile && (
          <Stack sx={{ width: '100%', flexDirection: 'column' }}>
            <Grid container>
              <Grid item xs={11}>
                <Box className={sx.typography__uploadBox}>
                  {fileStatus === 'error' && (
                    <ErrorIcon sx={{ color: theme.palette.error.dark }} />
                  )}
                  {fileStatus === 'success' && (
                    <CheckCircleIcon
                      sx={{ color: theme.palette.success.dark }}
                    />
                  )}
                  {fileStatus === undefined && (
                    <DescriptionIcon
                      sx={{ color: theme.palette.neutral.dark300 }}
                    />
                  )}
                  <Typography className={sx.typography__fileName}>
                    {acceptedFile.path}
                  </Typography>
                  <Typography className={sx.typography__fileSize}>
                    {getFilesizeDisplay()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={1} className={sx.grid__closeIcon}>
                <IconButton className={sx.closeIcon} onClick={onClose}>
                  <CloseOutlinedIcon fontSize='small' />
                </IconButton>
              </Grid>
            </Grid>
            {fileStatus !== undefined && (
              <Box className={sx.box__progressBar}>
                <LinearProgress
                  variant='determinate'
                  value={100}
                  color={fileStatus === 'error' ? 'error' : 'success'}
                />
              </Box>
            )}
          </Stack>
        )}

        {!acceptedFile && (
          <Stack className={sx.stack__inner}>
            <Box>
              <img
                src={Cloud}
                width={52}
                height={36}
                alt=''
                role='presentation'
              />
            </Box>
            <Typography sx={{ display: 'inline' }}>
              Drag and drop your file, or&nbsp;
              <button
                type='button'
                onClick={dropZone.open}
                className={sx.typography__dropzoneBody}
                onKeyDown={dropZone.open}
              >
                browse
              </button>
            </Typography>
          </Stack>
        )}
      </Stack>

      {!acceptedFile && (
        <Typography variant='subtitle2' sx={{ marginTop: 1 }}>
          Maximum file size is 64kb. Suppported file types are .yar and .yara.
        </Typography>
      )}
    </>
  );
};

export default YaraRulesFileChooserDropZone;
