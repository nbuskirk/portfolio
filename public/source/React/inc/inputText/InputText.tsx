import { useState } from 'react';

import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Tooltip,
  InputAdornment,
  IconButton,
  FormHelperText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';

import sx from './input-text.module.scss';

interface Props {
  label: string;
  type?: string;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: 'outlined' | 'standard' | 'filled';
  tooltip?: boolean;
  tooltipTitle?: string;
  tooltipIcon?: never;
  tooltipFontSize?: string;
  maxWidth?: number;
  required?: boolean;
  value: string;
  autoFocus?: boolean;
  helperText?: string;
  error?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  >;
}

const InputText = ({
  label,
  type = 'text',
  placeholder,
  id,
  disabled,
  fullWidth = true,
  variant = 'outlined',
  tooltip = false,
  tooltipTitle,
  tooltipIcon,
  tooltipFontSize = '0.75rem',
  maxWidth = 360,
  required = false,
  value,
  autoFocus = false,
  helperText,
  error,
  onChange,
  onKeyDown
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((p) => !p);
  };

  const handleMouseDownPassword: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    event.preventDefault();
  };

  const theme = useTheme();

  return (
    <FormControl
      disabled={disabled}
      variant={variant}
      fullWidth={fullWidth}
      sx={{ maxWidth: `${maxWidth}px` }}
      error={error}
      className={sx.inputContainer}
    >
      {label && (
        <InputLabel shrink htmlFor={id}>
          <span>
            <span>{label}</span>
            {tooltip && (
              <Tooltip title={tooltipTitle} arrow placement='right'>
                <span style={{ fontSize: tooltipFontSize }}>{tooltipIcon}</span>
              </Tooltip>
            )}
          </span>
        </InputLabel>
      )}
      <OutlinedInput
        type={showPassword ? 'text' : type}
        notched={false}
        placeholder={placeholder}
        id={id}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        required={required}
        autoFocus={autoFocus}
        error={error}
        endAdornment={
          type === 'password' && (
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge='end'
                disableRipple
                size='small'
              >
                {showPassword ? (
                  <VisibilityOff sx={{ color: theme.palette.primary.main }} />
                ) : (
                  <Visibility sx={{ color: theme.palette.primary.main }} />
                )}
              </IconButton>
            </InputAdornment>
          )
        }
      />
      <FormHelperText id={`${id}-helper-text`} className={sx.helperText}>
        {helperText}
      </FormHelperText>
    </FormControl>
  );
};

export default InputText;
