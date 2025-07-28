import { ReactNode } from 'react';
import { TextField, TextFieldProps, InputLabel, FormControl } from '@mui/material';
import { InputMemberSchema } from '../schema.types';

type Props = Partial<InputMemberSchema['props']> & {
  disabled: boolean;
  value: string;
  setValue: (value: string) => void;
};

const InputMember = ({
  label,
  name,
  required,
  showRequiredAsterisk = true,
  value,
  setValue,
  disabled = false
}: Props): ReactNode => {
  const handleChange: TextFieldProps['onChange'] = (event) => {
    setValue(event.target.value);
  };
  return (
    <FormControl fullWidth>
      <InputLabel>
        {label}
        {showRequiredAsterisk === required &&
          (required ? <span> *</span> : ' (optional)')}
      </InputLabel>
      <TextField
        name={name}
        required={required}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        label=""
      />
    </FormControl>
  );
};

export default InputMember;
