import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  DialogActions,
  Button,
  useTheme
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

interface Props {
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  entity: string;
  onDeleteClicked: () => void;
  deleteLoading: boolean;
}

const DeleteConfirmationModal = ({
  modalOpen,
  setModalOpen,
  entity,
  onDeleteClicked,
  deleteLoading
}: Props) => {
  const theme = useTheme();

  return (
    <Dialog open={modalOpen} fullWidth>
      <DialogTitle
        sx={{ borderBottom: `1px solid ${theme.palette.neutral.dark400}` }}
      >
        <Typography fontWeight={600} sx={{ textTransform: 'capitalize' }}>
          Delete {entity}
        </Typography>
      </DialogTitle>
      <>
        <DialogContent sx={{ margin: '1em 0 2em 0' }}>
          <Typography fontSize={14} color={theme.palette.warning.main}>
            Warning: Do you want to delete the selected {entity}?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            padding: '1em 2em',
            borderTop: `1px solid ${theme.palette.neutral.dark400}`
          }}
        >
          <Button
            variant='text'
            onClick={() => {
              setModalOpen(false);
            }}
          >
            Cancel
          </Button>
          <LoadingButton
            variant='contained'
            onClick={onDeleteClicked}
            loading={deleteLoading}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </>
    </Dialog>
  );
};

export default DeleteConfirmationModal;
