import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Typography,
  useTheme
} from '@mui/material';
import { ReactNode } from 'react';

interface Props {
  open: DialogProps['open'];
  onCancel: () => void;
  onConfirm: () => void;
  isSaving: boolean;
}

const ConfirmDBAResetModal = ({
  open,
  onCancel,
  onConfirm,
  isSaving
}: Props): ReactNode => {
  const theme = useTheme();
  return (
    <Dialog
      disableEscapeKeyDown
      open={open}
      fullWidth
      onClose={() => {
        // Don't let the user close the modal while its changing the setting
        if (!isSaving) {
          onCancel();
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #ccc' }}>
        <Typography fontWeight={600}>
          Reset Policies and Hide Delta Block Analysis Column
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ margin: '2em 0 2em 0' }}>
        <Typography fontSize={14} color={theme.palette.warning.main}>
          {`When you hide the Delta Block Analysis (DBA) column in the Policies
            table, all policies will return to the default of "Use CR Setting".`}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '1em 2em', borderTop: '1px solid #ccc' }}>
        <Button disabled={isSaving} variant='text' onClick={onCancel}>
          Cancel
        </Button>
        <LoadingButton
          loading={isSaving}
          variant='contained'
          onClick={onConfirm}
        >
          Reset Policies and Hide Column
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDBAResetModal;
