import {
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  InputLabel
} from '@mui/material';
import React from 'react';
import { THRESHOLD_ERROR_TEXT } from 'constants/constants';
import { CustomThresholdFormData } from '../types';

interface SelectTypeProps {
  type?: string;
  setFormData: React.Dispatch<React.SetStateAction<CustomThresholdFormData>>;
  formState: string;
  disabled?: boolean;
}

// FIX: I don't think this needs to be here
// The 'type' coming is not homogenized
const getType = (type?: string) => {
  if (type === 'entropy') return 'entropy';
  if (type === 'deletion') return 'deletion';
  if (type === 'deletion_count') return 'deletion';
  if (type === 'addition') return 'addition';
  if (type === 'addition_count') return 'addition';
  if (type === 'change_or_delete') return 'change_or_delete';
  if (type === 'change_or_delete_count') return 'change_or_delete';
  if (type === 'change_type') return 'change_type';
  if (type === 'change_type_count') return 'change_type';
  if (type === 'none') return 'none';
  return '';
};

const SelectType = ({
  type,
  setFormData,
  formState,
  disabled = false
}: SelectTypeProps) => {
  const selectedType = getType(type);
  return (
    <FormControl
      sx={{ m: 1, width: 200, margin: 0, mr: 2 }}
      disabled={disabled}
    >
      <InputLabel>Type</InputLabel>
      <Select
        error={selectedType === 'none' && formState === 'error'}
        value={selectedType}
        onChange={(e) => {
          setFormData((prev) => {
            const update = { ...prev };
            update.type = e.target.value;
            if (e.target.value === 'entropy') {
              update.format = 'percent';
            }
            return update;
          });
        }}
      >
        <MenuItem value='none'>Select a type...</MenuItem>
        <MenuItem value='addition'>Added Files</MenuItem>
        <MenuItem value='change_or_delete'>Changed or Deleted</MenuItem>
        <MenuItem value='change_type'>Changed File Type</MenuItem>
        <MenuItem value='deletion'>Deleted Files</MenuItem>
        <MenuItem value='entropy'>Entropy</MenuItem>
      </Select>
      {selectedType === 'none' && formState === 'error' ? (
        <FormHelperText error={selectedType === 'none'}>
          {THRESHOLD_ERROR_TEXT.type}
        </FormHelperText>
      ) : (
        <FormHelperText> </FormHelperText>
      )}
    </FormControl>
  );
};
export default SelectType;
