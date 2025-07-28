import { Alert, Typography, useTheme } from '@mui/material';
import { ReactNode } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { useIntl } from 'react-intl';

const YARADisclaimer = (): ReactNode => {
  const intl = useIntl();
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
        {intl.formatMessage({
          id: 'globalfeatureoptions.yara.disclaimer.intent'
        })}
      </Typography>
    </Alert>
  );
};

export default YARADisclaimer;
