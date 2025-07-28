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
import { FormattedMessage, useIntl } from 'react-intl';

interface Props {
  open: DialogProps['open'];
  enable: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  isSaving: boolean;
}

const ConfirmYaraGlobalEnableDisableModal = ({
  open,
  enable,
  onCancel,
  onConfirm,
  isSaving
}: Props): ReactNode => {
  const intl = useIntl();
  const theme = useTheme();
  return (
    <Dialog
      disableEscapeKeyDown
      open={open}
      fullWidth
      onClose={() => {
        // Don't let the user close the modal while it's changing the setting
        if (!isSaving) {
          onCancel();
        }
      }}
    >
      <DialogTitle
        sx={{ borderBottom: `1px solid ${theme.palette.neutral.dark400}` }}
      >
        <Typography fontWeight={600}>
          {intl.formatMessage({
            id: enable
              ? 'globalfeatureoptions.yara.confirmmodal.enable.title'
              : 'globalfeatureoptions.yara.confirmmodal.disable.title'
          })}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ margin: '2em 0 2em 0' }}>
        <Typography fontSize={14} color={theme.palette.warning.main}>
          <FormattedMessage
            id={
              enable
                ? 'globalfeatureoptions.yara.confirmmodal.enable.body'
                : 'globalfeatureoptions.yara.confirmmodal.disable.body'
            }
            values={{
              // eslint-disable-next-line react/no-unstable-nested-components
              strong: (chunks) => <strong>{chunks}</strong>
            }}
          />
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          padding: '1em 2em',
          borderTop: `1px solid ${theme.palette.neutral.dark400}`
        }}
      >
        <Button disabled={isSaving} variant='text' onClick={onCancel}>
          Cancel
        </Button>
        <LoadingButton
          loading={isSaving}
          variant='contained'
          onClick={onConfirm}
        >
          {intl.formatMessage({
            id: enable
              ? 'globalfeatureoptions.yara.confirmmodal.enable.confirmbtn'
              : 'globalfeatureoptions.yara.confirmmodal.disable.confirmbtn'
          })}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmYaraGlobalEnableDisableModal;
