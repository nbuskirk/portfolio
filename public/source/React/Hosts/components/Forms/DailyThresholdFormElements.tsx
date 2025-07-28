import { Box, Button } from '@mui/material';
import React, { ReactNode } from 'react';
import validateDailyThresholdForm from 'components/Hosts/utils/validateDailyThresholdForm';
import {
  decodePartsPerMillionIntoPercent,
  getDailyThresholdType,
  getThresholdFormat
} from 'components/Hosts/utils/utils';
import { ThresholdResponse } from 'data-hooks/hosts/useThresholds';
import { Host } from 'data-hooks/useDailyActivity';
import SeverityLevels from './ThresholdFormMembers/SeverityLevels';
import SwitchEnabled from './ThresholdFormMembers/SwitchEnabled';
import { DailyThresholdFormData } from './types';
import DailyThresholdConfirmDialog from '../DailyThresholdConfirmDialog';

const DEFAULT_FORM_STATE: DailyThresholdFormData = {
  enabled: 'enabled',
  type: 'none',
  format: 'none',
  severityLevels: {
    critical: { enabled: false, value: -1 },
    high: { enabled: false, value: -1 },
    medium: { enabled: false, value: -1 },
    low: { enabled: false, value: -1 }
  },
  host: '',
  action: 'create'
};

const newDefaultFormState = (activityType: string, host: Host) => ({
  ...DEFAULT_FORM_STATE,
  type: getDailyThresholdType(activityType),
  format: getThresholdFormat(activityType),
  host: host.hostname
});

interface DailyThresholdFormProps {
  id?: number;
  onSave?(): void;
  onCancel?(): void;
  dailyThresholdQueryData?: ThresholdResponse;
  activityType?: string;
  host: Host;
}

const DailyThresholdFormelements = ({
  id,
  onSave,
  onCancel,
  dailyThresholdQueryData,
  activityType,
  host
}: DailyThresholdFormProps): ReactNode => {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [formData, setFormData] = React.useState<DailyThresholdFormData>(() => {
    if (dailyThresholdQueryData !== undefined) {
      const output: DailyThresholdFormData = {
        enabled: dailyThresholdQueryData.enabled_state,
        type: getDailyThresholdType(dailyThresholdQueryData.activity_type),
        format: getThresholdFormat(dailyThresholdQueryData.activity_type),
        host: host.hostname,
        severityLevels: dailyThresholdQueryData.severity_levels,
        action: !dailyThresholdQueryData.host ? 'create' : 'update'
      };
      if (output.format === 'percent') {
        output.severityLevels = decodePartsPerMillionIntoPercent(
          output.severityLevels
        );
      }
      return output;
    }
    return newDefaultFormState(activityType!, host!);
  });

  const { isValidForm, formErrors } = validateDailyThresholdForm(formData);
  const [formState, setFormState] = React.useState('idle');
  return (
    <>
      <Box
        sx={{
          padding: '1em 0 0 0',
          border: '1px solid #ccc',
          borderBottom: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          marginTop: '1em'
        }}
      >
        <Box
          sx={{
            borderBottom: '1px solid #ccc',
            paddingBottom: '1em',
            marginBottom: '1em'
          }}
        >
          <SwitchEnabled enabled={formData.enabled} setFormData={setFormData} />
        </Box>
        <Box sx={{ padding: '1em 0 0 0' }}>
          <SeverityLevels
            severityLevels={formData.severityLevels}
            type={formData.type}
            setFormData={setFormData}
            format={formData.format}
            error={formErrors.severity}
            formState={formState}
            enabled={formData.enabled === 'enabled'}
          />
        </Box>
      </Box>

      <Box
        sx={{
          padding: '1em 0',
          textAlign: 'right',
          borderTop: '1px solid #ccc',
          marginTop: '1em'
        }}
      >
        <Button
          variant='outlined'
          sx={{ marginRight: '1em' }}
          onClick={() => {
            if (onCancel) {
              onCancel();
            }
          }}
        >
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            if (!isValidForm) {
              setFormState('error');
            } else {
              setFormState('submitting');
            }
            if (isValidForm) {
              setDialogOpen(true);
            }
          }}
        >
          Save Changes
        </Button>
        <DailyThresholdConfirmDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          onSave={onSave}
          formData={formData}
          id={id}
        />
      </Box>
    </>
  );
};

export default DailyThresholdFormelements;
