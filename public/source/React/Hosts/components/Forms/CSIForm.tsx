import { Box, Button, TextField, Slider, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import useDailyActivity, { Host } from 'data-hooks/useDailyActivity';

interface CSIGraphEditFormProps {
  onCancel: () => void;
  handleSliderChange: (_: Event, value: number | number[]) => void;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  alertLevel: number;
  onSave?: (alertLevel: number) => void;
  host?: Host;
  rssId?: number;
}

const CSIGraphEditForm = ({
  onCancel,
  handleSliderChange,
  handleInputChange,
  alertLevel,
  onSave,
  host,
  rssId
}: CSIGraphEditFormProps) => {
  const theme = useTheme();
  const { showSuccessSnackbar, showErrorSnackbar } = useSnackbarContext();

  const minThreshold = 0;
  const maxThreshold = 100;
  const { postRSSActivityAlertLevel, patchRSSActivityAlertLevel } =
    useDailyActivity(host);
  const handleSave = async () => {
    try {
      if (!alertLevel || alertLevel === -1 || !rssId) {
        await postRSSActivityAlertLevel.mutateAsync({
          payload: {
            activity_type: 'ransomware_signal_strength',
            alert_level_value_1: alertLevel,
            severity: 'Critical'
          }
        });
      } else {
        await patchRSSActivityAlertLevel.mutateAsync({
          payload: {
            alert_level_value_1: alertLevel,
            enabled_state: 'enabled',
            severity: 'Critical'
          },
          id: rssId
        });
      }

      if (onSave) {
        onSave(alertLevel);
      }
      showSuccessSnackbar('Success: Threshold saved');
    } catch (error) {
      showErrorSnackbar('Error: Failed to save threshold');
    }
  };

  return (
    <Box sx={{ paddingTop: '1em' }}>
      <Box
        sx={{
          padding: '1em',
          borderTop: `1px solid ${theme.palette.neutral.dark500}`
        }}
      >
        <Typography sx={{ paddingBottom: '0.5em' }} fontWeight={600}>
          CyberSensitivity Alert Level
        </Typography>
        <Typography
          fontSize={12}
          sx={{
            paddingBottom: '1em',
            color: theme.palette.neutral.dark200
          }}
        >
          The CyberSensitivity Index threshold value is used to trigger alert
          notifications for a host. The default CyberSensitivity Index threshold
          value is set to 50 which is appropriate for most use cases.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: '1em',
            alignItems: 'center',
            marginLeft: '.7em'
          }}
        >
          <Slider
            value={alertLevel}
            step={1}
            min={minThreshold}
            max={maxThreshold}
            onChange={handleSliderChange}
          />

          <TextField
            value={alertLevel}
            type='number'
            sx={{ width: '6em' }}
            onChange={handleInputChange}
          />
        </Box>
      </Box>

      <Box
        sx={{
          padding: '1em',
          '.MuiButtonBase-root': {
            padding: '12px'
          },
          display: 'flex',
          gap: '12px',
          justifyContent: 'end'
        }}
      >
        <Button
          variant='outlined'
          onClick={onCancel}
          // disabled={isLoading || disabled}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          sx={{ marginRight: '1em' }}
          onClick={handleSave}
          // disabled={isLoading || disabled}
        >
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default CSIGraphEditForm;
