import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

const StyledGridOverlay = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .ant-empty-img-1': {
    fill: '#aeb8c2',
  },
  '& .ant-empty-img-2': {
    fill: '#f5f5f7',
  },
  '& .ant-empty-img-3': {
    fill: '#dce0e6',
  },
  '& .ant-empty-img-4': {
    fill: '#fff',
  },
  '& .ant-empty-img-5': {
    fillOpacity: '0.8',
    fill: '#f5f5f5',
  },
}));

const NoRowsOverlay = ({ width }) => {
  return (
    <StyledGridOverlay sx={{ width: width ? width : 'auto' }}>
      <Box sx={{ mt: 1, fontSize: '12px', fontWeight: '600' }}>
        No data to display
      </Box>
    </StyledGridOverlay>
  );
};

NoRowsOverlay.propTypes = {
  width: PropTypes.number,
}

export default NoRowsOverlay;
