import { Box, Button, Grid, Stack, Typography, useTheme } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useState } from 'react';
import useConfigInfo from 'data-hooks/useConfigInfo';
import { AxiosError } from 'axios';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import { useUser } from 'utils/context/UserContext';
import useResetYaraRules from './hooks/useResetYaraRules';
import ResetYaraRulesConfirmModal from './ResetYaraRulesConfirmModal';

const ResetYaraRules = () => {
  const theme = useTheme();
  const [resetOpen, setResetOpen] = useState(false);
  const [yaraRulesAreResetting, setYaraRulesAreResetting] = useState(false);
  const { data: configInfo } = useConfigInfo();
  const { canAccess } = useUser();
  const { showSuccessSnackbar, showAxiosErrorSnackbar } = useSnackbarContext();
  const { fedid, indexid } = configInfo ?? {};
  const { mutate } = useResetYaraRules({
    fedId: fedid,
    indexId: indexid
  });

  const resetYaraRules = async () => {
    setYaraRulesAreResetting(true);
    try {
      await mutate(undefined, {
        onSuccess: () => {
          setResetOpen(false);
          setYaraRulesAreResetting(false);
          showSuccessSnackbar('Success: Yara Rules reset');
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
          Reset YARA Rulesets
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: '0.5em' }}>
          This will delete all custom YARA rulesets.
        </Typography>
        <Typography
          sx={{
            color: theme.palette.error.main,
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: 1.5
          }}
        >
          Warning: This will delete all custom YARA rulesets. This action cannot
          be reversed.
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
              disabled={!canAccess('alertmgmt')}
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
              Reset YARA Rulesets
            </Button>
          </Box>
        </Grid>
      </Stack>
      <ResetYaraRulesConfirmModal
        visibility={resetOpen}
        isResetting={yaraRulesAreResetting}
        onResetYaraRules={resetYaraRules}
        onCancel={() => {
          setResetOpen(false);
        }}
      />
    </>
  );
};

export default ResetYaraRules;
