import { TextField, Typography } from '@mui/material';
import { SeverityLevel } from '../types';

interface SeverityLevelTextFieldProps {
  severity: SeverityLevel;
  value: number;
  format: string;
  hasError: boolean;
  disabled?: boolean;
  onChange: (severity: SeverityLevel, value: string, format: string) => void;
}

const SeverityLevelTextField = ({
  severity,
  value,
  format,
  hasError,
  onChange,
  disabled
}: SeverityLevelTextFieldProps) => {
  return (
    <TextField
      sx={{
        width: 75,
        // Hide number input spinners
        '& input[type=number]': {
          'MozAppearance': 'textfield',
          '&::-webkit-outer-spin-button': {
            margin: 0,
            WebkitAppearance: 'none'
          },
          '&::-webkit-inner-spin-button': {
            margin: 0,
            WebkitAppearance: 'none'
          }
        }
      }}
      onFocus={(e) => e.target.select()}
      slotProps={{
        input: {
          endAdornment:
            format === 'percent' ? (
              <Typography sx={{ opacity: '50%' }}>%</Typography>
            ) : null
        }
      }}
      placeholder=''
      autoComplete='off'
      type='number'
      value={value === -1 ? '' : value}
      error={hasError}
      onChange={(e) => onChange(severity, e.target.value, format)}
      disabled={disabled}
    />
  );
};

export default SeverityLevelTextField;
