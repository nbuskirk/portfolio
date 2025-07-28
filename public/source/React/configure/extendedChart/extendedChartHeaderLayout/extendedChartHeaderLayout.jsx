import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';

// ICONS

import sx from './extendedChartHeaderLayout.module.scss';

const ExtendedChartHeaderLayout = ({
  chartType,
  childrenButtons,
  children
}) => {
  return (
    <Box className={sx.titleWrapper}>
      <Box className={sx.titleContainer}>
        <Typography className={sx.title}>
          {chartType === 'licenseChart' && 'License Status'}
          {chartType === 'indexStorage' && 'Index Storage'}
          {chartType === 'scratchStorage' && 'Scratch Storage'}
        </Typography>
        {childrenButtons}
      </Box>

      {!children ? children : <Box />}
    </Box>
  );
};

ExtendedChartHeaderLayout.propTypes = {
  chartType: PropTypes.string,
  children: PropTypes.element,
  childrenButtons: PropTypes.element
};

export default ExtendedChartHeaderLayout;
