import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel
} from '@mui/material';
import React from 'react';
import { THRESHOLD_ERROR_TEXT } from 'constants/constants';

interface SelectFormatProps {
  format?: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  disabled?: boolean;
  formState: string;
}

// Limit threshold values if switching from quantity to percent
const limitValue = (value: number, format?: string) => {
  return format === 'percent' && value > 100 ? 100 : value;
};

const SelectFormat = ({
  format,
  setFormData,
  disabled,
  formState
}: SelectFormatProps) => {
  return (
    <FormControl sx={{ m: 1, width: 200, margin: 0 }}>
      <InputLabel disabled={disabled}>Data Format</InputLabel>
      <Select
        value={format}
        disabled={disabled}
        error={format === 'none' && formState === 'error'}
        onChange={(e) => {
          const newFormat = e.target.value;

          setFormData((prev: any) => ({
            ...prev,
            format: newFormat,
            severityLevels: {
              ...prev.severityLevels,
              critical: {
                ...prev.severityLevels.critical,
                value: limitValue(prev.severityLevels.critical.value, newFormat)
              },
              high: {
                ...prev.severityLevels.high,
                value: limitValue(prev.severityLevels.high.value, newFormat)
              },
              medium: {
                ...prev.severityLevels.medium,
                value: limitValue(prev.severityLevels.medium.value, newFormat)
              },
              low: {
                ...prev.severityLevels.low,
                value: limitValue(prev.severityLevels.low.value, newFormat)
              }
            }
          }));
        }}
      >
        <MenuItem value='none'>Select a data format...</MenuItem>
        <MenuItem value='quantity'>Quantity</MenuItem>
        <MenuItem value='percent'>Percent</MenuItem>
      </Select>
      {format === 'none' && formState === 'error' ? (
        <FormHelperText error={format === 'none'}>
          {THRESHOLD_ERROR_TEXT.format}
        </FormHelperText>
      ) : (
        <FormHelperText> </FormHelperText>
      )}
    </FormControl>
  );
};
export default SelectFormat;
