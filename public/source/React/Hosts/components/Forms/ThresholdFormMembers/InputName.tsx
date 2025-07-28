import { TextField } from '@mui/material';
import React from 'react';
import { THRESHOLD_ERROR_TEXT } from 'constants/constants';

interface InputNameProps {
  name?: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  formState: string;
}

const InputName = ({ name, formState, setFormData }: InputNameProps) => {
  // const [state, setState] = React.useState(name);
  return (
    <TextField
      id='name'
      label='Name'
      slotProps={{ inputLabel: { shrink: true } }}
      value={name}
      placeholder='Threshold Name'
      onChange={(e) => {
        setFormData((prev: any) => ({ ...prev, name: e.target.value }));
      }}
      sx={{ width: '300px', margin: '0 1em 0 0' }}
      error={name === '' && formState === 'error'}
      helperText={
        name === '' && formState === 'error' ? THRESHOLD_ERROR_TEXT.name : ' '
      }
    />
  );
};

export default InputName;
