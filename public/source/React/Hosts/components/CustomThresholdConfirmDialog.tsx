import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  Box
} from '@mui/material';
import useMutatePostThreshold from 'data-hooks/hosts/useMutatePostThreshold';
import { useUser } from 'utils/context/UserContext';
import useConfigInfo from 'data-hooks/useConfigInfo';
import useMutatePatchThreshold from 'data-hooks/hosts/useMutatePatchThreshold';
import { ThresholdLocation } from 'data-hooks/useDailyActivityAlertLevels';
import { CustomThresholdFormData } from './Forms/types';
import { preProcessCustomFormData } from '../utils/utils';
import SeverityLevelsText from './SeverityLevelsText';

interface ConfirmDialogProps {
  id?: number | null;
  onSave?(): void;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: CustomThresholdFormData;
}

const CustomThresholdConfirmDialog = ({
  id,
  onSave,
  dialogOpen,
  setDialogOpen,
  formData
}: ConfirmDialogProps) => {
  const { session } = useUser();
  const { data: configInfo } = useConfigInfo();
  const { mutateAsync: postThreshold } = useMutatePostThreshold({
    session,
    fedid: configInfo?.fedid,
    indexid: configInfo?.indexid
  });
  const { mutateAsync: patchThreshold } = useMutatePatchThreshold({
    session,
    fedid: configInfo?.fedid,
    indexid: configInfo?.indexid
  });

  return (
    <Dialog open={dialogOpen}>
      <DialogTitle>Confirm Threshold</DialogTitle>
      <DialogContent
        sx={{
          borderTop: '1px solid #ccc',
          borderBottom: '1px solid #ccc'
        }}
      >
        <Typography fontSize={14} pt={2}>
          <strong> Enabled: </strong> {formData.enabled}
        </Typography>
        <Typography fontSize={14}>
          <strong> Name: </strong> {formData.name}
        </Typography>
        <Typography fontSize={14}>
          <strong> Type: </strong> {formData.type}
        </Typography>
        <Typography fontSize={14}>
          <strong> Format: </strong> {formData.format}
        </Typography>

        <SeverityLevelsText severityLevels={formData.severityLevels} />

        {formData.type === 'entropy' && (
          <Typography sx={{ paddingLeft: '1em', fontSize: '14px' }}>
            <strong> Minimum: </strong> {formData.threshold_value_2}
          </Typography>
        )}
        <Typography fontSize={14}>
          <strong> Locations: </strong>
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1em'
          }}
        >
          {formData.locations.map((location: ThresholdLocation) => (
            <Typography
              sx={{ paddingLeft: '1em', fontSize: '14px' }}
              key={`${location.host}-${location.path}`}
            >
              Host: {location.host} | Path: {location.path} | Include
              Subdirectories: {location.recursive ? 'Yes' : 'No'}
            </Typography>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '1em' }}>
        <Button onClick={() => setDialogOpen(false)} variant='outlined'>
          Cancel
        </Button>
        <Button
          onClick={() => {
            if (formData.action === 'create') {
              postThreshold({
                payload: preProcessCustomFormData(formData)
              });
            } else {
              patchThreshold({
                id: id as number,
                payload: preProcessCustomFormData(formData)
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

export default CustomThresholdConfirmDialog;
