import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import useSession from 'utils/hooks/useSession';
import { API } from 'utils/helpers/api';
import { useDropzone } from 'react-dropzone';

import { Stack, Box, Typography, LinearProgress, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// ICONS
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import ErrorIcon from '@mui/icons-material/Error';
import Cloud from 'assets/icons/cloudWithArrow.png';

import useLicenseForm from 'utils/hooks/useLicenseForm';
import sx from './dropzone.module.scss';

const Dropzone = ({ uploadEvent }) => {
  const { onDrop, error, success, progress, cleanupFunc } = useLicenseForm();
  const { open, getRootProps, getInputProps, acceptedFiles, inputRef } =
    useDropzone({
      onDrop,
      noClick: true,
      noKeyboard: true
    });

  const resetUploading = () => {
    cleanupFunc();

    acceptedFiles.length = 0;
    acceptedFiles.splice(0, acceptedFiles.length);
    inputRef.current.value = '';
  };

  useEffect(() => {
    if (success) {
      uploadEvent();
    }
  }, [success]);

  const theme = useTheme();

  const files = acceptedFiles.map((file) => (
    <Stack key={file.path} sx={{ width: '100%', flexDirection: 'column' }}>
      <Box className={sx.typography__uploadBox}>
        {error ? (
          <ErrorIcon sx={{ color: theme.palette.error.dark }} />
        ) : success ? (
          <CheckCircleIcon sx={{ color: theme.palette.success.dark }} />
        ) : (
          <DescriptionIcon sx={{ color: theme.palette.neutral.dark300 }} />
        )}

        <Typography className={sx.typography__fileName}>{file.path}</Typography>
        <Typography className={sx.typography__fileSize}>
          {file.size} bytes
        </Typography>
      </Box>
      <Box sx={{ marginTop: '16px', width: '100%' }}>
        <LinearProgress variant='determinate' value={progress} />
      </Box>
    </Stack>
  ));

  return (
    <>
      <Stack
        sx={{
          alignItems: 'center',
          background: theme.palette.neutral.primary600,
          border: `1px solid ${theme.palette.neutral.dark500}`
        }}
        {...getRootProps({ className: sx.stack__main })}
      >
        <input {...getInputProps()} />

        {acceptedFiles.length > 0 ? (
          files
        ) : (
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
            <Typography variant='body'>
              Drag and drop to upload your file, or&nbsp;
              <Typography
                variant='body'
                onClick={open}
                className={sx.typography__dropzoneBody}
              >
                browse
              </Typography>
            </Typography>
          </Stack>
        )}
        {error && (
          <Typography
            className={sx.typography__error}
            sx={{ color: theme.palette.error.main }}
          >
            Failed to start license uploading. Please check the uploaded file.
          </Typography>
        )}
      </Stack>
      {error && (
        <Stack
          sx={{
            maxWidth: '200px',
            margin: '24px 0 0 0'
          }}
        >
          <Button variant='outlined' onClick={resetUploading}>
            Start over
          </Button>
        </Stack>
      )}
    </>
  );
};

Dropzone.propTypes = {
  uploadEvent: PropTypes.func.isRequired
};

export default Dropzone;
