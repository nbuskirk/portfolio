import React from 'react';
import PropTypes from 'prop-types';
import {
  Menu,
  Box,
  Input,
  InputAdornment,
  Button,
  Divider,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';

import sx from './datagridSettingsOption.module.scss';

const DatagridSettingsOption = ({ anchorEl, open, onClose, columns }) => {
  const theme = useTheme();

  return columns ? (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          maxHeight: 300,
          width: 200,
          transform: 'translate(-120px,0px)'
        }
      }}
    >
      <Box display='flex'>
        <Input
          startAdornment={
            <InputAdornment position='start'>
              <SearchIcon sx={{ fontSize: '16px' }} />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position='end'>
              <Button
                size='small'
                className={sx.btn__clearAll}
                
              >
                Clear All
              </Button>
            </InputAdornment>
          }
          className={sx.input__searchMenu}
        />
      </Box>
      <Divider />
      <Box className={sx.centeredBtn}>
        <Button
          variant='outlined'
          fontweight='700'
          startIcon={<AddIcon className={sx.startIcon} />}
          
        >
          Create Calculated Field
        </Button>
      </Box>
      {columns
        .filter((col) => col.headerName)
        .map((item, index) => {
          const { headerName } = item;
          const lowerCaseHeaderName = headerName.toLowerCase();
          const capitalizedItem =
            lowerCaseHeaderName.charAt(0).toUpperCase() +
            lowerCaseHeaderName.slice(1);

          return (
            <MenuItem key={index} className={sx.btn__filterItem}>
              <FormControlLabel
                control={<Checkbox />}
                label={
                  <Typography variant='body'>{capitalizedItem}</Typography>
                }
              />
            </MenuItem>
          );
        })}
    </Menu>
  ) : null;
};

DatagridSettingsOption.propTypes = {
  anchorEl: PropTypes.object,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  columns: PropTypes.array
};

export default DatagridSettingsOption;
