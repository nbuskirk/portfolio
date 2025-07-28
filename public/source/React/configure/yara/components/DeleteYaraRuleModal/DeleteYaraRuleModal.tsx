import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  DialogActions,
  Button,
  useTheme
} from '@mui/material';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import useMutateDeleteYaraRule from 'data-hooks/yara/useMutateDeleteYaraRule';
import useConfigInfo from 'data-hooks/useConfigInfo';
import Loader from 'components/inc/loader';
import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';

interface Props {
  modalOpen: boolean;
  setModalOpen: (value: boolean) => void;
  selectedIds: string[];
}

const DeleteYaraRuleModal = ({
  modalOpen,
  setModalOpen,
  selectedIds
}: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { data: configInfo, isLoading, isSuccess } = useConfigInfo();
  const { fedid, indexid } = configInfo ?? {};
  const { mutate } = useMutateDeleteYaraRule({
    fedId: fedid,
    indexId: indexid
  });
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const { showSuccessSnackbar } = useSnackbarContext();

  const deleteYaraRules = () => {
    setDeleteLoading(true);
    mutate(
      {
        ids: selectedIds
      },
      {
        onSuccess: () => {
          showSuccessSnackbar(
            `Success: Deleted YARA ${selectedIds.length > 1 ? 'rules' : 'rule'}`
          );
          setModalOpen(false);
          navigate('/dashboard/settings/yara');
        },
        onSettled: () => setDeleteLoading(false)
      }
    );
  };

  return (
    <Dialog open={modalOpen} fullWidth>
      <DialogTitle
        sx={{ borderBottom: `1px solid ${theme.palette.neutral.dark400}` }}
      >
        <Typography fontWeight={600}>
          Delete YARA {selectedIds.length > 1 ? 'Rulesets' : 'Ruleset'}
        </Typography>
      </DialogTitle>
      <>
        {isLoading && <Loader />}
        {isSuccess && (
          <>
            <DialogContent sx={{ margin: '1em 0 2em 0' }}>
              <Typography fontSize={14} color={theme.palette.warning.main}>
                Warning: Do you want to delete the selected YARA{' '}
                {selectedIds.length > 1 ? 'rulesets' : 'ruleset'}?
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
                onClick={deleteYaraRules}
                loading={deleteLoading}
              >
                Delete
              </LoadingButton>
            </DialogActions>
          </>
        )}
      </>
    </Dialog>
  );
};

export default DeleteYaraRuleModal;
