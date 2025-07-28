import {
  Grid2,
  FormControlLabel,
  Checkbox,
  Typography,
  TextField,
  FormHelperText,
  Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { SeverityLevel } from '../types';
import SeverityLevelTextField from './SeverityLevelTextField';

interface SeverityLevelsProps {
  severityLevels: {
    critical: { value: number; enabled: boolean };
    high: { value: number; enabled: boolean };
    medium: { value: number; enabled: boolean };
    low: { value: number; enabled: boolean };
  };
  min?: number;
  type: string;
  format: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  error?: string;
  formState: string;
  enabled: boolean;
}

const SeverityLevels = ({
  severityLevels,
  min,
  type,
  format,
  setFormData,
  error,
  formState,
  enabled
}: SeverityLevelsProps) => {
  const limitSeverityLevel = (value: number): number => {
    if (value < 0) {
      return -1;
    }

    if (format === 'percent' && value > 100) {
      return 100;
    }

    return value;
  };

  const handleSeverityChange = (
    severity: SeverityLevel,
    value: string,
    currentFormat: string
  ) => {
    const numValue = value === '' ? -1 : Number(value);
    const limitedValue =
      currentFormat === 'percent' ? limitSeverityLevel(numValue) : numValue;

    setFormData((prev: any) => ({
      ...prev,
      severityLevels: {
        ...prev.severityLevels,
        [severity]: {
          value: limitedValue,
          enabled: prev.severityLevels[severity].enabled
        }
      }
    }));
  };

  const handleCheckboxChange =
    (severity: SeverityLevel) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev: any) => ({
        ...prev,
        severityLevels: {
          ...prev.severityLevels,
          [severity]: {
            value: prev.severityLevels[severity].value,
            enabled: e.target.checked
          }
        }
      }));
    };

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      threshold_value_2: e.target.value === '' ? 0 : Number(e.target.value)
    }));
  };

  const hasError = error !== undefined && formState === 'error';

  return (
    <Grid2 container alignItems='left' spacing={2}>
      <Grid2 mr={2} size={{ xs: 12 }}>
        <Typography variant='body2'>
          Severity Levels
          <Tooltip
            arrow
            title='Severity level values must be set in decreasing order. Percent severity levels must be in the range of 0-100%.'
            placement='right'
            sx={{ marginLeft: '0.25rem', marginY: '-.4rem' }}
          >
            <InfoIcon
              color='secondary'
              sx={{ fontSize: '14px', margin: '0 0 -0.2em 0.3em' }}
            />
          </Tooltip>
        </Typography>
      </Grid2>

      {/* Critical */}
      <Grid2>
        <FormControlLabel
          control={
            <Checkbox
              size='small'
              checked={severityLevels.critical.enabled}
              onChange={handleCheckboxChange('critical')}
              disabled={!enabled}
            />
          }
          label={
            <Typography
              variant='h5'
              color='textSecondary'
              sx={{ width: '40px' }}
            >
              Critical
            </Typography>
          }
        />
        <SeverityLevelTextField
          severity='critical'
          value={severityLevels.critical.value}
          format={format}
          onChange={handleSeverityChange}
          hasError={hasError}
          disabled={!enabled}
        />
      </Grid2>

      {/* High */}
      <Grid2>
        <FormControlLabel
          control={
            <Checkbox
              size='small'
              checked={severityLevels.high.enabled}
              onChange={handleCheckboxChange('high')}
              disabled={!enabled}
            />
          }
          label={
            <Typography
              variant='h5'
              color='textSecondary'
              sx={{ width: '30px' }}
            >
              High
            </Typography>
          }
        />
        <SeverityLevelTextField
          severity='high'
          value={severityLevels.high.value}
          format={format}
          hasError={hasError}
          onChange={handleSeverityChange}
          disabled={!enabled}
        />
      </Grid2>

      {/* Medium */}
      <Grid2>
        <FormControlLabel
          control={
            <Checkbox
              size='small'
              checked={severityLevels.medium.enabled}
              onChange={handleCheckboxChange('medium')}
              disabled={!enabled}
            />
          }
          label={
            <Typography
              variant='h5'
              color='textSecondary'
              sx={{ width: '50px' }}
            >
              Medium
            </Typography>
          }
        />
        <SeverityLevelTextField
          severity='medium'
          value={severityLevels.medium.value}
          format={format}
          hasError={hasError}
          onChange={handleSeverityChange}
          disabled={!enabled}
        />
      </Grid2>

      {/* Low */}
      <Grid2>
        <FormControlLabel
          control={
            <Checkbox
              size='small'
              checked={severityLevels.low.enabled}
              onChange={handleCheckboxChange('low')}
              disabled={!enabled}
            />
          }
          label={
            <Typography
              variant='h5'
              color='textSecondary'
              sx={{ width: '25px' }}
            >
              Low
            </Typography>
          }
        />
        <SeverityLevelTextField
          severity='low'
          value={severityLevels.low.value}
          format={format}
          hasError={hasError}
          onChange={handleSeverityChange}
          disabled={!enabled}
        />
      </Grid2>

      {/* Minimum field for entropy types */}
      {(type === 'entropy' || type === 'entropy_average') &&
        min !== undefined && (
          <Grid2 sx={{ display: 'inline-flex' }} alignItems='center'>
            <Typography variant='h5' color='textSecondary' mr={2}>
              Minimum
            </Typography>
            <TextField
              sx={{ width: 75 }}
              placeholder='0'
              value={min}
              onChange={handleMinChange}
            />
          </Grid2>
        )}

      {/* Error message */}
      <Grid2 size={{ xs: 12 }}>
        {hasError ? (
          <FormHelperText error>{error}</FormHelperText>
        ) : (
          <FormHelperText> </FormHelperText>
        )}
      </Grid2>
    </Grid2>
  );
};

export default SeverityLevels;
