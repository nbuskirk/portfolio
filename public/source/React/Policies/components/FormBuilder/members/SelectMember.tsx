import { ReactNode } from 'react';
import {
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectProps,
  Checkbox,
  Chip,
  OutlinedInput,
  InputAdornment,
  Button
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { SelectMemberSchema } from '../schema.types';

type Props = Partial<SelectMemberSchema['props']> & {
  loading?: boolean;
  value: string | string[];
  setValue: (value: string | string[]) => void;
};

const SelectMember = ({
  label,
  name,
  options = [],
  required,
  showRequiredAsterisk = true,
  value,
  setValue,
  disabled = false,
  multiple = false
}: Props): ReactNode => {
  let selectedValues: string | string[];
  if (multiple) {
    selectedValues = Array.isArray(value) ? value : [];
  } else {
    selectedValues = value;
  }

  const handleChange: SelectProps<string | string[]>['onChange'] = (event) => {
    if (disabled) return;
    const newValue = event.target.value;

    if (multiple) {
      setValue(typeof newValue === 'string' ? newValue.split(',') : newValue);
    } else {
      setValue(newValue as string);
    }
  };

  const handleDelete = (event: React.MouseEvent, chipToDelete: string) => {
    if (disabled) return;
    event.stopPropagation();
    if (multiple && Array.isArray(selectedValues)) {
      setValue(selectedValues.filter((chip) => chip !== chipToDelete));
    }
  };

  const handleClearAll = (event: React.MouseEvent) => {
    if (disabled) return;
    event.stopPropagation();
    setValue(multiple ? [] : '');
  };

  return (
    <FormControl fullWidth>
      <FormLabel>
        {label}
        {showRequiredAsterisk === required &&
          (required ? <span> *</span> : ' (optional)')}
      </FormLabel>
      <Select
        disabled={disabled}
        required={required}
        value={selectedValues}
        onChange={handleChange}
        name={name}
        multiple={multiple}
        displayEmpty
        input={
          <OutlinedInput
            sx={{
              '& .MuiOutlinedInput-input': {
                maxHeight: 'none !important',
              },
            }}
            disabled={disabled}
            endAdornment={
              multiple &&
                Array.isArray(selectedValues) &&
                selectedValues.length > 0 &&
                !disabled ? (
                <InputAdornment position='end'>
                  <Button
                    onClick={handleClearAll}
                    size='small'
                    disabled={disabled}
                  >
                    Clear All
                  </Button>
                </InputAdornment>
              ) : null
            }
          />
        }
        MenuProps={{
          style: { maxHeight: 300 }
        }}
        renderValue={(selected) =>
          multiple && Array.isArray(selected) && selected.length > 0 ? (
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {selected.map((val) => {
                const option = options.find((opt) => opt.value === val);
                return option ? (
                  <Chip
                    key={val}
                    label={option.display}
                    onMouseDown={(e) => e.stopPropagation()}
                    onDelete={
                      disabled ? undefined : (event) => handleDelete(event, val)
                    }
                    deleteIcon={!disabled ? <Close /> : undefined}
                    sx={{
                      cursor: disabled ? 'default' : 'pointer',
                      opacity: disabled ? 0.6 : 1
                    }}
                  />
                ) : null;
              })}
            </div>
          ) : (
            options.find((opt) => opt.value === selected)?.display
          )
        }
      >
        {options.map(({ display, value: optionValue }) => (
          <MenuItem key={optionValue} value={optionValue} disabled={disabled}>
            {multiple ? (
              <Checkbox
                checked={
                  Array.isArray(selectedValues) &&
                  selectedValues.includes(optionValue)
                }
                disabled={disabled}
              />
            ) : null}
            {display}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectMember;
