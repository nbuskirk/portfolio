import { Box, TextField, Typography, useTheme } from '@mui/material';
import Modal from 'components/inc/modalContainer/modalContainer';
import { useState } from 'react';

const ResetYaraRulesConfirmModal = ({
  visibility,
  isResetting,
  onResetYaraRules,
  onCancel
}: {
  visibility: boolean;
  isResetting: boolean;
  onResetYaraRules: () => void;
  onCancel: () => void;
}) => {
  const theme = useTheme();
  const [resetText, setResetText] = useState('');

  return (
    <Modal
      visibility={visibility}
      setVisibility={() => {}}
      title='Reset YARA Rulesets'
      cancelText='Cancel'
      saveText='Confirm YARA Rulset Reset'
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
      saveDisabled={resetText.toLowerCase() !== 'reset yara rulesets'}
      onSave={onResetYaraRules}
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
          WARNING: Do you really want to reset YARA rulesets?
        </Typography>
        <Typography
          sx={{ color: theme.palette.error.main, fontSize: '14px' }}
          mb={2}
        >
          {`Resetting the YARA rulesets will permanently DELETE all YARA rulesets. To reset the Yara rulesets type 'reset yara rulesets' and then
            select Confirm YARA Rulesets Reset.`}
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

export default ResetYaraRulesConfirmModal;
