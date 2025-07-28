import { ReactNode } from 'react';
import { Checkbox, CheckboxProps, FormControlLabel } from '@mui/material';
import { CheckboxMemberSchema } from '../schema.types';

type Props = Partial<CheckboxMemberSchema['props']> & {
  value: boolean;
  setValue: (value: boolean) => void;
};

const CheckboxMember = ({
  name,
  label,
  required,
  disabled = false,
  value,
  setValue
}: Props): ReactNode => {
  const handleChange: CheckboxProps['onChange'] = (event) => {
    setValue(event.target.checked);
  };
  return (
    <FormControlLabel
      required={required}
      label={label}
      control={
        <Checkbox
          disabled={disabled}
          name={name}
          checked={value}
          onChange={handleChange}
        />
      }
    />
  );
};

export default CheckboxMember;
