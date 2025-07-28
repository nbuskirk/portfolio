import { Stack, Typography } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';

const CSTextField: React.FC<TextFieldProps> = (props) => {
  const propCopy = { ...props };
  const { helperText, label } = props;
  delete propCopy.helperText;
  delete propCopy.label;
  const helperTextCopy =
    typeof helperText === 'string' && helperText.trim().length > 0
      ? helperText
      : '\u00A0';
  const labelCopy =
    typeof label === 'string' && label.trim().length > 0 ? label : '\u00A0';

  return (
    <Stack gap={0.1}>
      <Typography fontSize={14} fontWeight={400}>
        {labelCopy}
      </Typography>
      <TextField {...propCopy} />
      <Typography fontSize={14} fontWeight={400}>
        {helperTextCopy}
      </Typography>
    </Stack>
  );
};

export default CSTextField;
