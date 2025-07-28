import {
  Modal as ModalMUI,
  Typography,
  Box,
  Button,
  Divider,
  IconButton
} from '@mui/material';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

import { LoadingButton } from '@mui/lab';
import sx from './modal-container.module.scss';

interface ButtonPalette {
  bgcolor: string;
  borderColor: string;
  '&:hover'?: {
    bgcolor: string;
    borderColor: string;
  };
}

interface Props {
  visibility: boolean;
  setVisibility: (visibility: boolean) => void;
  title: string;
  children: React.ReactNode;
  onCancel?: () => void;
  cancelVariant?: 'text' | 'outlined' | 'contained';
  cancelText: string;
  onSave?: () => void;
  saveDisabled?: boolean;
  saveText: string;
  onActionBtn?: boolean;
  noDivider?: boolean;
  compactContent?: boolean;
  height?: number | string;
  width?: number | string;
  showFooter?: boolean;
  saveIsPending?: boolean;
  saveButtonPalette?: ButtonPalette | {};
}

const Modal = ({
  visibility,
  setVisibility,
  title,
  children,
  onCancel,
  cancelVariant = 'text',
  cancelText,
  onSave,
  saveDisabled = false,
  saveText,
  onActionBtn = false,
  noDivider = false,
  compactContent = false,
  height,
  width,
  showFooter = true,
  saveIsPending = false,
  saveButtonPalette = {}
}: Props): JSX.Element => {
  const handleCloseModal = () => {
    setVisibility(false);
    onCancel?.();
  };

  return (
    <ModalMUI
      open={visibility}
      onClose={handleCloseModal}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box className={sx.modal__container} height={height} width={width}>
        <Box className={sx.modal__header}>
          <Typography className={sx.modal__title}>{title}</Typography>
          <IconButton
            onClick={handleCloseModal}
            sx={{ transform: 'translateX(2px)' }}
          >
            <CloseOutlinedIcon className={sx.modal__closeIcon} />
          </IconButton>
        </Box>
        {!noDivider && <Divider />}
        <Box
          className={`verticalScroll ${
            compactContent ? sx.modal__compactContent : sx.modal__content
          }`}
        >
          {children}
        </Box>
        {(onCancel || onSave) && !noDivider && <Divider />}
        {showFooter && (
          <Box className={onActionBtn ? sx.modal__footer : sx.modal__footer2}>
            {onActionBtn}
            {onCancel && (
              <Button
                disabled={saveIsPending}
                variant={cancelVariant}
                className={sx.btn__cancel}
                sx={{ justifySelf: 'flex-end' }}
                onClick={handleCloseModal}
              >
                {cancelText}
              </Button>
            )}
            {onSave && (
              <LoadingButton
                loading={saveIsPending}
                disabled={saveDisabled}
                variant='contained'
                onClick={() => {
                  onSave();
                }}
                sx={saveButtonPalette}
              >
                {saveText}
              </LoadingButton>
            )}
          </Box>
        )}
      </Box>
    </ModalMUI>
  );
};

export default Modal;
