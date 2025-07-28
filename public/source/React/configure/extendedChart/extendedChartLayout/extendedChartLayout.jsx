import React from 'react';
import PropTypes from 'prop-types';

import { Stack, Box, Divider } from '@mui/material';

import Container from 'components/inc/container';
import sx from './extendedChart.module.scss';

function ExtendedChartLayout({ children }, ref) {
  return (
    <Box className={sx.accordion} ref={ref}>
      <Container>
        <Stack>{children}</Stack>
      </Container>
    </Box>
  );
}

export default React.forwardRef(ExtendedChartLayout);
