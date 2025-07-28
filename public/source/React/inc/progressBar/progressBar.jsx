import React from 'react';
import PropTypes from 'prop-types';

import { Stack, Box, LinearProgress, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import sx from './progressBar.module.scss';

const ProgressBar = ({ data }) => {
  const { used, licensed, remaining } = data;

  if (licensed.value <= 0) {
    return (
    <Stack sx={{ marginTop: '9px' }}>
      <Box className={sx.legend}>
        <Typography fontSize={12}>{used.labeled} active data</Typography>
      </Box>
    </Stack>
    )
  }

  const theme = useTheme();

  const progress = used.value > licensed.value ? 100 : (used.value / licensed.value) * 100;

  return (
    <Stack sx={{ marginTop: '9px' }}>
      <LinearProgress
        className={sx.linearProgress}
        value={progress}
        variant='determinate'
        color='error'
      />
      <Box className={sx.legend}>
        <Typography fontSize={12}>{used.labeled} active data</Typography>
        <Typography
          fontSize={12}
          fontWeight={600}
          color={theme.palette.error.main}
        >
          {remaining.labeled} remaining
        </Typography>
      </Box>
    </Stack>
  );
};

ProgressBar.propTypes = {
  data: PropTypes.shape({
    used: PropTypes.shape({
      value: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      labeled: PropTypes.string.isRequired,
    }),
    capacity: PropTypes.shape({
      value: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      labeled: PropTypes.string.isRequired,
    }),
    remaining: PropTypes.shape({
      value: PropTypes.number.isRequired,
      unit: PropTypes.string.isRequired,
      labeled: PropTypes.string.isRequired,
    }),
  }),
}

export default ProgressBar;
