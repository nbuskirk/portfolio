import { Box, Button, Grid, Stack, Typography, useTheme } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useState } from 'react';
import useConfigInfo from 'data-hooks/useConfigInfo';
import { AxiosError } from 'axios';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import { useUser } from 'utils/context/UserContext';
import useResetThresholds from '../../Hosts/hooks/useResetThresholds';
import ResetThresholdsConfirmModal from './ResetThresholdsConfirmModal';

const ResetThresholds = () => {
  const theme = useTheme();
  const [resetOpen, setResetOpen] = useState(false);
  const [thresholdsIsResetting, setThresholdsIsResetting] = useState(false);
  const { data: configInfo } = useConfigInfo();
  const { canAccess } = useUser();
  const thresholdmgmt = canAccess('thresholdmgmt');
  const { showSuccessSnackbar, showAxiosErrorSnackbar } = useSnackbarContext();
  const { fedid, indexid } = configInfo ?? {};
  const { mutate } = useResetThresholds({
    fedId: fedid,
    indexId: indexid
  });

  const resetThresholds = async () => {
    setThresholdsIsResetting(true);
    try {
      await mutate(undefined, {
        onSuccess: () => {
          setResetOpen(false);
          setThresholdsIsResetting(false);
          showSuccessSnackbar('Success: Thresholds reset');
        }
      });
    } catch (error) {
      showAxiosErrorSnackbar(error as AxiosError);
    }
  };

  return (
    <>
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '15px'
        }}
      >
        <Typography
          component='h2'
          variant='body2'
          sx={{ fontWeight: 600, marginBottom: '1em' }}
        >
          Reset Thresholds
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: '0.5em' }}>
          This will delete all custom Thresholds.
        </Typography>
        <Typography
          sx={{
            color: theme.palette.error.main,
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: 1.5
          }}
        >
          Warning: Resetting thresholds will delete custom thresholds, and daily
          activity thresholds. The CyberSensitivity Index will also be reset to
          default. This action cannot be reversed.
        </Typography>
      </Stack>
      <Stack>
        <Grid p={2}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'right',
              position: 'relative'
            }}
          >
            <Button
              disabled={!thresholdmgmt}
              sx={{
                color: theme.palette.error.main,
                borderColor: theme.palette.error.main,
                '&:hover': {
                  color: theme.palette.error.dark,
                  borderColor: theme.palette.error.dark
                },
                margin: '0.5em 0 1em 0',
                justifySelf: 'flex-start',
                width: 'fit-content',
                paddingLeft: '7.5px',
                paddingRight: '10px'
              }}
              variant='outlined'
              onClick={() => {
                setResetOpen(true);
              }}
              startIcon={
                <WarningIcon
                  sx={{ color: theme.palette.error.main, height: '13px' }}
                />
              }
            >
              Reset Thresholds
            </Button>
          </Box>
        </Grid>
      </Stack>
      <ResetThresholdsConfirmModal
        visibility={resetOpen}
        isResetting={thresholdsIsResetting}
        onResetThresholds={resetThresholds}
        onCancel={() => {
          setResetOpen(false);
        }}
      />
    </>
  );
};

export default ResetThresholds;
