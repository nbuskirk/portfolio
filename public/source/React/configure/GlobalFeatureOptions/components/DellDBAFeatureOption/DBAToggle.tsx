import {
  CircularProgress,
  FormControlLabel,
  FormGroup,
  Switch,
  SwitchProps,
  Typography
} from '@mui/material';
import { ReactNode } from 'react';

interface Props {
  disabled: boolean;
  checked: boolean;
  onChange: SwitchProps['onChange'];
}

const DBAToggle = ({ disabled, checked, onChange }: Props): ReactNode => {
  return (
    <FormGroup sx={{ padding: '10px 0' }}>
      <FormControlLabel
        control={
          <Switch disabled={disabled} checked={checked} onChange={onChange} />
        }
        label={
          <Typography variant='body2'>
            Provide the user with an option to force CyberSense to always do
            full scans for selected policies.
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

export default DBAToggle;
