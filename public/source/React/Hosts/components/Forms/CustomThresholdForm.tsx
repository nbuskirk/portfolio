import { Box, Button } from '@mui/material';
import validateCustomThresholdForm from 'components/Hosts/utils/validateCustomThresholdForm';
import { ReactNode, useState, useEffect } from 'react';
import {
  decodePartsPerMillionIntoPercent,
  parseHomogenizedType
} from 'components/Hosts/utils/utils';
import Loader from 'components/inc/loader';
import useConfigInfo from 'data-hooks/useConfigInfo';
import useQueryThreshold from 'data-hooks/hosts/useQueryThreshold';
import SwitchEnabled from './ThresholdFormMembers/SwitchEnabled';
import { CustomThresholdFormData } from './types';
import InputName from './ThresholdFormMembers/InputName';
import SelectType from './ThresholdFormMembers/SelectType';
import SelectFormat from './ThresholdFormMembers/SelectFormat';
import SeverityLevels from './ThresholdFormMembers/SeverityLevels';
import Locations from './ThresholdFormMembers/Locations';
import CustomThresholdConfirmDialog from '../CustomThresholdConfirmDialog';
import DeleteDialog from '../DeleteDialog';

interface CustomThresholdFormProps {
  onSave?(): void;
  onCancel?(): void;
  id?: number;
}

const DEFAULT_FORM_STATE: CustomThresholdFormData = {
  enabled: 'enabled',
  name: '',
  type: 'none',
  format: 'none',
  severityLevels: {
    critical: { enabled: false, value: -1 },
    high: { enabled: false, value: -1 },
    medium: { enabled: false, value: -1 },
    low: { enabled: false, value: -1 }
  },
  threshold_value_2: 0,
  locations: [],
  action: 'create'
};

const newDefaultFormState = () => ({ ...DEFAULT_FORM_STATE });

const CustomThresholdForm = ({
  id,
  onSave,
  onCancel
}: CustomThresholdFormProps): ReactNode => {
  const { data: configInfo } = useConfigInfo();
  const { isFetching, isSuccess, data } = useQueryThreshold({
    fedId: configInfo?.fedid,
    indexId: configInfo?.indexid,
    thresholdId: id
  });

  const [formData, setFormData] = useState<CustomThresholdFormData>(
    newDefaultFormState()
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formState, setFormState] = useState('idle');

  // Update formData when query data is loaded
  useEffect(() => {
    if (data) {
      const output: CustomThresholdFormData = {
        enabled: data.enabled_state,
        name: data.name,
        ...parseHomogenizedType(data.threshold_type),
        severityLevels: data.severity_levels,
        threshold_value_2: data.threshold_value_2,
        locations: data.locations,
        action: 'update'
      };

      if (output.format === 'percent') {
        output.severityLevels = decodePartsPerMillionIntoPercent(
          output.severityLevels
        );
      }

      setFormData(output);
    }
  }, [data]);

  const { isValidForm, formErrors } = validateCustomThresholdForm(formData);

  if (id && !isFetching && !isSuccess) {
    // TODO: Might be nice to show an error here. Ask UX.
    return null;
  }

  if (isFetching) {
    return (
      <Loader
        sx={{
          minHeight: '400px',
          alignItems: 'center',
          display: 'flex'
        }}
      />
    );
  }

  return (
    <>
      <Box
        sx={{
          border: '1px solid #ccc',
          borderLeft: 'none',
          borderRight: 'none',
          borderBottom: 'none',
          padding: '1em 0',
          marginTop: '1em',
          display: 'flex',
          gap: '1em'
        }}
      >
        <SwitchEnabled enabled={formData.enabled} setFormData={setFormData} />
        {id && (
          <Button
            variant='contained'
            onClick={() => {
              setDeleteDialogOpen(true);
            }}
          >
            Delete
          </Button>
        )}
      </Box>
      <Box
        display='flex'
        alignItems='center'
        sx={{
          padding: '1em 0 0 0',
          border: '1px solid #ccc',
          borderLeft: 'none',
          borderRight: 'none'
        }}
      >
        <InputName
          name={formData.name}
          setFormData={setFormData}
          formState={formState}
        />
        <SelectType
          type={formData.type}
          setFormData={setFormData}
          formState={formState}
        />
        <SelectFormat
          format={formData.format}
          setFormData={setFormData}
          disabled={formData.type === 'entropy'}
          formState={formState}
        />
      </Box>
      <Box sx={{ padding: '1em 0 0 0', borderBottom: '1px solid #ccc' }}>
        <SeverityLevels
          severityLevels={formData.severityLevels}
          min={formData.threshold_value_2}
          type={formData.type}
          format={formData.format}
          setFormData={setFormData}
          error={formErrors.severity}
          formState={formState}
          enabled={formData.enabled === 'enabled'}
        />
      </Box>
      <Box>
        <Locations
          locations={formData.locations}
          setFormData={setFormData}
          formState={formState}
          error={formErrors.locations || ''}
        />
      </Box>
      <Box sx={{ padding: '1em 0', textAlign: 'right' }}>
        <Button
          variant='outlined'
          sx={{ marginRight: '1em' }}
          onClick={() => {
            if (onCancel) {
              onCancel();
            }
          }}
        >
          {id ? 'Cancel' : 'Back'}
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            if (!isValidForm) {
              setFormState('error');
            } else {
              setFormState('submitting');
            }
            if (isValidForm) setDialogOpen(true);
          }}
        >
          Save Changes
        </Button>
      </Box>

      <CustomThresholdConfirmDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        formData={formData}
        id={id}
        onSave={onSave}
      />

      <DeleteDialog
        dialogOpen={deleteDialogOpen}
        setDialogOpen={setDeleteDialogOpen}
        id={`custom ${id?.toString()}`}
        key={`threshold-${id?.toString()}`}
        name={formData.name ?? ''}
      />
    </>
  );
};

export default CustomThresholdForm;
