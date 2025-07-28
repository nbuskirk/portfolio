import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel
} from '@mui/material';
import React from 'react';
import { THRESHOLD_ERROR_TEXT } from 'constants/constants';

interface SelectTypeDailyProps {
  type?: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formState: string;
  disabled: boolean;
}

const SelectTypeDaily = ({
  type,
  setFormData,
  formState,
  disabled
}: SelectTypeDailyProps) => {
  return (
    <FormControl sx={{ m: 1, width: 200, margin: 0, mr: 2 }}>
      <InputLabel>Type</InputLabel>
      <Select
        disabled={disabled}
        error={type === 'none' && formState === 'error'}
        value={type}
        onChange={(e) => {
          setFormData((prev: any) => ({ ...prev, type: e.target.value }));
        }}
      >
        <MenuItem value='none'>Select a type...</MenuItem>
        <MenuItem value='change_qty'>Changed or Deleted</MenuItem>
        <MenuItem value='change_type'>Changed File Type</MenuItem>
        <MenuItem value='deletion'>Deleted Files</MenuItem>
        <MenuItem value='entropy_average'>Entropy</MenuItem>
      </Select>
      {type === 'none' && formState === 'error' ? (
        <FormHelperText error={type === 'none'}>
          {THRESHOLD_ERROR_TEXT.type}
        </FormHelperText>
      ) : (
        <FormHelperText> </FormHelperText>
      )}
    </FormControl>
  );
};
export default SelectTypeDaily;
