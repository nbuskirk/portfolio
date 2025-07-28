import { Alert, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

import ErrorIcon from '@mui/icons-material/Error';

const DBADisclaimer = (): ReactNode => {
  const theme = useTheme();
  return (
    <Alert
      severity='error'
      variant='outlined'
      icon={<ErrorIcon />}
      sx={{
        border: `1px solid ${theme.palette.error.dark}`,
        color: theme.palette.dark.main,
        marginBottom: '1em',
        placeItems: 'center'
      }}
    >
      <Typography fontSize={14}>
        {`When this setting is enabled, a control labeled "Delta Block
              Analysis" is displayed on the Policies page and can be modified
              per policy. When this control is set to "Force Full Scan", you can
              force CyberSense to perform full scans whenever the selected
              policy is run. In this setting, CyberSense will not perform the
              more efficient Delta Block Analysis for the selected policy.`}
      </Typography>
    </Alert>
  );
};

export default DBADisclaimer;
