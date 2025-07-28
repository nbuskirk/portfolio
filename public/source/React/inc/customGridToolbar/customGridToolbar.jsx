import { GridToolbarColumnsButton } from '@mui/x-data-grid-premium';

import { Box } from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';

const CustomGridToolbar = () => {
  return (
    <Box
      sx={{
        transform: 'translateY(-3px)',
        display: 'flex',
        justifyContent: 'flex-end',
        width: '70px'
      }}
      id='filterButtonEl'
    >
      <GridToolbarColumnsButton startIcon={<SettingsIcon />} />
    </Box>
  );
};

export default CustomGridToolbar;
