import { ReactNode } from 'react';
import { TransitionModalSchema } from '../schema.types';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography
} from '@mui/material';

import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export type TransitionState = 'transition' | 'success' | 'error';

export interface ModalTransitionState {
  open?: boolean;
  close: () => void;
  state: TransitionState;
  errorMsg?: string;
}

type Props = Partial<TransitionModalSchema['props']> & ModalTransitionState;

const TransitionModalMember = ({
  open = false,
  close,
  state,
  title,
  transitionText,
  successText,
  errorMsg,
  errorBtnText,
  successBtnText
}: Props): ReactNode => {
  return (
    <Dialog
      open={open}
      maxWidth='sm'
      fullWidth
      sx={{
        '& .MuiDialog-container': {
          alignItems: 'flex-start'
        }
      }}
      PaperProps={{ sx: { mt: '150px' } }}
    >
      <DialogTitle sx={{ m: 0, p: 2, fontSize: '16px', fontWeight: 600 }}>
        {title}
      </DialogTitle>
      <DialogContent dividers>
        <Stack direction='row' alignItems='center' gap='14px'>
          {state === 'transition' && (
            <>
              <CircularProgress size='14px' />
              <Typography fontSize='14px' fontWeight='400'>
                {transitionText}
              </Typography>
            </>
          )}
          {state === 'error' && (
            <>
              <ErrorIcon color='error' sx={{ fontSize: '22px' }} />
              <Typography fontSize='14px' fontWeight='400' color='error'>
                {errorMsg ?? 'An unknown error occured'}
              </Typography>
            </>
          )}
          {state === 'success' && (
            <>
              <CheckCircleIcon color='success' sx={{ fontSize: '22px' }} />
              <Typography fontSize='14px' fontWeight='400'>
                {successText}
              </Typography>
            </>
          )}
        </Stack>
      </DialogContent>
      {state === 'success' && (
        <DialogActions>
          <Button variant='contained' autoFocus onClick={close}>
            {successBtnText ?? 'Ok'}
          </Button>
        </DialogActions>
      )}
      {state === 'error' && (
        <DialogActions>
          <Button variant='contained' autoFocus onClick={close}>
            {errorBtnText ?? 'Ok'}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default TransitionModalMember;
