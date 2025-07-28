import {
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Switch,
  SwitchProps,
  Typography
} from '@mui/material';
import { ReactNode } from 'react';
import { useIntl } from 'react-intl';

interface Props {
  disabled: boolean;
  checked: boolean;
  onChange: SwitchProps['onChange'];
}

const YARAToggle = ({ disabled, checked, onChange }: Props): ReactNode => {
  const intl = useIntl();
  return (
    <FormGroup sx={{ padding: '10px 0' }}>
      <FormControlLabel
        control={
          <Switch disabled={disabled} checked={checked} onChange={onChange} />
        }
        label={
          <Typography variant='body2'>
            {intl.formatMessage({
              id: 'globalfeatureoptions.yara.switch.label'
            })}
            {disabled && (
              <>
                {' '}
                <CircularProgress size={15} />
              </>
            )}
          </Typography>
        }
      />
    </FormGroup>
  );
};

export default YARAToggle;
