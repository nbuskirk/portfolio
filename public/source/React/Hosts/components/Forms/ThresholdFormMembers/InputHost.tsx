import { TextField } from '@mui/material';
import React from 'react';
import { THRESHOLD_ERROR_TEXT } from 'constants/constants';

interface InputHostProps {
  name?: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formState: string;
}

const InputHost = ({ name, setFormData, formState }: InputHostProps) => {
  return (
    <TextField
      id='host'
      slotProps={{ inputLabel: { shrink: true } }}
      value={name}
      placeholder='Host'
      onChange={(e) => {
        setFormData((prev: any) => ({ ...prev, host: e.target.value }));
      }}
      sx={{ width: '300px', margin: '0 1em 0 0' }}
      error={name === '' && formState === 'error'}
      helperText={
        name === '' && formState === 'error' ? THRESHOLD_ERROR_TEXT.host : ' '
      }
    />
  );
};

export default InputHost;
