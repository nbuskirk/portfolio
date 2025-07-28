import { ReactNode } from 'react';
import {
  Autocomplete,
  Chip,
  FormControl,
  FormLabel,
  TextField,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AutoCompletedMemberSchema } from '../schema.types';

type Props = Partial<AutoCompletedMemberSchema['props']> & {
  loading?: boolean;
  value: string;
  setValue: (value: string | string[]) => void;
};

const AutocompleteMember = ({
  label,
  name,
  required,
  showRequiredAsterisk = true,
  value,
  setValue,
  disabled = false,
  options,
  multiple = false,
  freeSolo = true
}: Props): ReactNode => {
  const theme = useTheme();
  return (
    <FormControl disabled={disabled}>
      <FormLabel>
        {label}
        {showRequiredAsterisk === required &&
          (required ? <span> *</span> : ' (optional)')}
      </FormLabel>
      <Autocomplete
        autoSelect
        autoHighlight
        clearOnBlur
        disableClearable
        disablePortal
        multiple={multiple}
        freeSolo={freeSolo}
        slotProps={{
          listbox: {
            style: { maxHeight: 300 }
          }
        }}
        options={options ?? []}
        renderTags={(values, getTagProps) =>
          values.map((option, index) => {
            return option ? (
              <Chip
                variant='filled'
                label={option}
                sx={{
                  backgroundColor: theme.palette.neutral.primary500,
                  borderColor: theme.palette.neutral.primary500,
                  color: theme.palette.primary.main,
                  fontWeight: 600
                }}
                {...getTagProps({ index })}
                deleteIcon={<CloseIcon />}
              />
            ) : (
              ''
            );
          })
        }
        renderInput={(params) => (
          <TextField {...params} required={required} name={name} />
        )}
        value={value}
        onChange={(_event, newVal) => {
          if (newVal !== null) {
            setValue(newVal);
          }
        }}
      />
    </FormControl>
  );
};

export default AutocompleteMember;
