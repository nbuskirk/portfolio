import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import sx from './container.module.scss';

const Container = ({
  children,
  padding = '0px',
  maxWidth = '100%',
  arrow = false,
  arrowPosition = 'bottom',
  active = false,
  className = '',
  height = 'auto'
}) => {
  const theme = useTheme();
  return (
    <Box
      className={`${sx.box__main} ${className ? className : ''}`}
      sx={{
        border: `1px solid ${
          active ? theme.palette.secondary.main : theme.palette.neutral.dark500
        }`,
        background: theme.palette.white.main,
        padding: padding,
        maxWidth: maxWidth,
        boxShadow: active
          ? `0px 0px 0px 1px ${theme.palette.secondary.main}`
          : 'none',
	height: height
      }}
    >
      <Box>{children}</Box>
      {arrow && (
        <>
          <Box
            className={`${sx.arrow} ${
              arrowPosition === 'bottom' ? sx.bottom : sx.top
            } ${active ? sx.active : ''}`}
            style={{borderColor: theme.palette.secondary.main}}
           />
          <Box className={`${sx.arrowInner} ${active ? sx.active : ''}`}></Box>
        </>
      )}
    </Box>
  );
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  padding: PropTypes.string,
  maxWidth: PropTypes.string,
  arrow: PropTypes.bool,
  active: PropTypes.bool,
  className: PropTypes.string,
  height: PropTypes.string
}

export default Container;
