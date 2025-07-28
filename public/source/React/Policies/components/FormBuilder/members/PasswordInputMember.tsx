import { ReactNode, useState } from 'react';
import {
  TextField,
  TextFieldProps,
  InputAdornment,
  IconButton,
  IconButtonProps,
  FormControl,
  InputLabel
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { PasswordInputMemberSchema } from '../schema.types';

type Props = Partial<PasswordInputMemberSchema['props']> & {
  value: string;
  setValue: (value: string) => void;
};

const PasswordMember = ({
  label,
  name,
  required,
  showRequiredAsterisk = true,
  value,
  setValue,
  disabled = false
}: Props): ReactNode => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword: IconButtonProps['onClick'] = () => {
    setShowPassword(!showPassword);
  };
  const handleChange: TextFieldProps['onChange'] = (event) => {
    setValue(event.target.value);
  };
  return (
    <FormControl>
      <InputLabel>
        {label}
        {showRequiredAsterisk === required &&
          (required ? <span> *</span> : ' (optional)')}
      </InputLabel>
      <TextField
        type={showPassword ? 'text' : 'password'}
        required={required}
        name={name}
        value={value}
        onChange={handleChange}
        label=""
        disabled={disabled}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton edge='end' onClick={handleClickShowPassword}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }
        }}
      />
    </FormControl>
  );
};

export default PasswordMember;
