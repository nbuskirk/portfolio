import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button
} from '@mui/material';
import { useUser } from 'utils/context/UserContext';
import useMutatePatchDailyActivityThreshold from 'data-hooks/hosts/useMutatePatchDailyActivityThreshold';
import useMutatePostDailyActivityThreshold from 'data-hooks/hosts/useMutatePostDailyActivityThreshold';
import useConfigInfo from 'data-hooks/useConfigInfo';
import { DailyThresholdFormData } from './Forms/types';
import { preProcessDailyFormData } from '../utils/utils';
import SeverityLevelsText from './SeverityLevelsText';

interface ConfirmDialogProps {
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: DailyThresholdFormData;
  onSave?(): void;
  id?: number;
}

const DailyThresholdConfirmDialog = ({
  dialogOpen,
  setDialogOpen,
  formData,
  onSave,
  id
}: ConfirmDialogProps) => {
  const { session } = useUser();
  const { data: configInfo } = useConfigInfo();

  const { mutateAsync: postThreshold } = useMutatePostDailyActivityThreshold({
    session,
    fedid: configInfo?.fedid,
    indexid: configInfo?.indexid
  });

  const { mutateAsync: patchThreshold } = useMutatePatchDailyActivityThreshold({
    session,
    fedid: configInfo?.fedid,
    indexid: configInfo?.indexid
  });

  return (
    <Dialog open={dialogOpen}>
      <DialogTitle>Confirm Threshold</DialogTitle>
      <DialogContent
        sx={{
          width: '650px',
          borderTop: '1px solid #ccc',
          borderBottom: '1px solid #ccc'
        }}
      >
        <Typography fontSize={14} pt={2}>
          <strong> Enabled: </strong> {formData.enabled}
        </Typography>

        <SeverityLevelsText severityLevels={formData.severityLevels} />

        <Typography fontSize={14}>
          <strong> Host: </strong> {formData.host}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ padding: '1em' }}>
        <Button
          onClick={() => {
            setDialogOpen(false);
          }}
          variant='outlined'
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (formData.action === 'create') {
              postThreshold({
                payload: preProcessDailyFormData(formData)
              });
            } else {
              patchThreshold({
                id: id as number,
                payload: preProcessDailyFormData(formData)
              });
            }
            if (onSave) {
              onSave();
            }
            setDialogOpen(false);
          }}
          variant='contained'
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DailyThresholdConfirmDialog;
