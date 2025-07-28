import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import useMutateDeletePolicy from 'data-hooks/policies/useMutateDeletePolicy';
import { useUser } from 'utils/context/UserContext';
import { PolicyData } from 'data-hooks/policies/useQueryPolicy';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import { FormattedMessage } from 'react-intl';

interface Props {
  theme: any;
  policyData: PolicyData;
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
}

const DeletePolicyModal = ({
  theme,
  policyData,
  modalOpen,
  setModalOpen
}: Props) => {
  const { session } = useUser();
  const { mutateAsync } = useMutateDeletePolicy({
    session,
    setModalOpen
  });
  const { showSuccessSnackbar } = useSnackbarContext();

  return (
    <Dialog disableEscapeKeyDown open={modalOpen} fullWidth>
      <DialogTitle sx={{ borderBottom: '1px solid #ccc' }}>
        <Typography fontWeight={600}>Delete Policy</Typography>
      </DialogTitle>
      <DialogContent sx={{ margin: '2em 0 2em 0' }}>
        <Typography fontSize={14} color={theme.palette.warning.main}>
          <FormattedMessage id='policy.delete.warning' />
        </Typography>
        <Typography
          marginTop={1}
          fontSize={14}
          color={theme.palette.warning.main}
        >
          Please confirm that you want to delete the policy:
          {policyData.display_name}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '1em 2em', borderTop: '1px solid #ccc' }}>
        <Button
          variant='text'
          onClick={() => {
            setModalOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={async () => {
            await mutateAsync({
              policyId: policyData.policy
            });
            showSuccessSnackbar(
              `Success: Deleted ${policyData.display_name} policy `
            );
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePolicyModal;
