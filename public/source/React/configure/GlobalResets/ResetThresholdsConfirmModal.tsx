import { Box, TextField, Typography, useTheme } from '@mui/material';
import Modal from 'components/inc/modalContainer/modalContainer';
import { useState } from 'react';

const ResetThresholdsConfirmModal = ({
  visibility,
  isResetting,
  onResetThresholds,
  onCancel
}: {
  visibility: boolean;
  isResetting: boolean;
  onResetThresholds: () => void;
  onCancel: () => void;
}) => {
  const theme = useTheme();
  const [resetText, setResetText] = useState('');

  return (
    <Modal
      visibility={visibility}
      setVisibility={() => {}}
      title='Reset Thresholds'
      cancelText='Cancel'
      saveText='Confirm Threshold Reset'
      saveButtonPalette={{
        bgcolor: theme.palette.error.main,
        borderColor: theme.palette.error.main,
        '&:hover': {
          bgcolor: theme.palette.error.dark,
          borderColor: theme.palette.error.dark
        }
      }}
      saveIsPending={isResetting}
      onCancel={onCancel}
      saveDisabled={resetText.toLowerCase() !== 'reset thresholds'}
      onSave={onResetThresholds}
      width={500}
    >
      <Box
        padding={2}
        sx={{
          borderRadius: '5px',
          backgroundColor: theme.palette.neutral.dark600,
          position: 'relative'
        }}
      >
        <Typography
          sx={{
            color: theme.palette.error.main,
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: 1.5
          }}
          pb={1}
          pr={2}
        >
          WARNING: Do you really want to reset Thresholds?
        </Typography>
        <Typography
          sx={{ color: theme.palette.error.main, fontSize: '14px' }}
          mb={2}
        >
          {`Resetting thresholds will permanently DELETE all custom thresholds, daily activity thresholds,
            and reset the CyberSensitivity Index. To reset thresholds type 'reset thresholds' and then
            select Confirm Threshold Reset.`}
        </Typography>
        <TextField
          id='outlined-basic'
          fullWidth
          variant='outlined'
          value={resetText}
          sx={{ marginTop: 0 }}
          onChange={(e) => setResetText(e.target.value)}
          disabled={isResetting}
        />
      </Box>
    </Modal>
  );
};

export default ResetThresholdsConfirmModal;
