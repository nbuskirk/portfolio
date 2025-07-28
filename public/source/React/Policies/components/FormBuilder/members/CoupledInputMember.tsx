import {
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { CoupledInputMemberSchema } from '../schema.types';

export interface CoupledInputMemberValue {
  primaryInput: string;
  secondarySelect: string;
}

type Props = Partial<CoupledInputMemberSchema['props']> & {
  loading?: boolean;
  value: CoupledInputMemberValue;
  setValue: (value: CoupledInputMemberValue) => void;
};

const CoupledInputMember = ({
  label,
  value,
  setValue,
  secondaryInputOptions,
  showRequiredAsterisk = true,
  disabled = false,
  loading = false,
  required = false
}: Props) => {
  if (secondaryInputOptions === undefined) {
    throw new Error('Missing "secondaryInputOptions"');
  }
  return (
    <FormControl>
      <Typography fontSize='14px' sx={{ marginBottom: '4px' }}>
        {label}
        {showRequiredAsterisk === required &&
          (required ? <span> *</span> : ' (optional)')}
      </Typography>
      <Stack direction='row' gap='10px' alignItems='center'>
        <TextField
          required={required}
          disabled={disabled || loading}
          sx={{
            width: '100px'
          }}
          value={value.primaryInput}
          onChange={(e) => {
            setValue({
              ...value,
              primaryInput: e.target.value
            });
          }}
        />
        <Select
          required={required}
          disabled={disabled || loading}
          sx={{
            width: '200px'
          }}
          value={value.secondarySelect}
          onChange={(e) => {
            setValue({
              ...value,
              secondarySelect: e.target.value
            });
          }}
        >
          {secondaryInputOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.display}
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </FormControl>
  );
};

export default CoupledInputMember;
