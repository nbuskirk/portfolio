import { FormControlLabel, FormGroup, Switch, Typography } from '@mui/material';
import React from 'react';

interface SwitchEnabledProps {
  enabled?: string;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const SwitchEnabled = ({ enabled, setFormData }: SwitchEnabledProps) => {
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            name='enabled'
            checked={enabled !== 'disabled'}
            onChange={(e) => {
              setFormData((prev: any) => ({
                ...prev,
                enabled: e.target.checked ? 'enabled' : 'disabled'
              }));
            }}
          />
        }
        label={<Typography variant='body2'>Enable Threshold</Typography>}
      />
    </FormGroup>
  );
};

export default SwitchEnabled;
