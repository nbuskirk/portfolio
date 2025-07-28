import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button
} from '@mui/material';
import useMutateDeleteThreshold from 'data-hooks/hosts/useMutateDeleteThreshold';
import { useUser } from 'utils/context/UserContext';
import useConfigInfo from 'data-hooks/useConfigInfo';

interface DeleteDialogProps {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
  id?: string;
}

const DeleteDialog = ({
  dialogOpen,
  setDialogOpen,
  name,
  id
}: DeleteDialogProps) => {
  const { session } = useUser();
  const { data: configInfo } = useConfigInfo();
  const { mutateAsync } = useMutateDeleteThreshold({
    id,
    session,
    fedid: configInfo?.fedid,
    indexid: configInfo?.indexid
  });

  const handleDelete = () => {
    mutateAsync({
      id: id?.split(' ')[1]
    });
  };

  return (
    <Dialog open={dialogOpen}>
      <DialogTitle>Delete Custom Threshold</DialogTitle>
      <DialogContent
        sx={{
          width: '650px',
          borderTop: '1px solid #ccc',
          borderBottom: '1px solid #ccc'
        }}
      >
        <Typography fontSize={14} color='warning.main' pt={2}>
          Warning: Do you want to delete threshold <strong>{name}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '1em' }}>
        <Button onClick={() => setDialogOpen(false)} variant='outlined'>
          Cancel
        </Button>
        <Button onClick={handleDelete} variant='contained'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
