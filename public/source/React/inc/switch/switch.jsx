import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import {
  FormControl,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// ICONS
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import EditBlacklistAlertModal from '../editBlackListAlertModal/editBlacklistAlertModal';

import sx from './switch.module.scss';

const list = {
  blackList: ['Blacklist 1', 'Blacklist 2', 'Blacklist 3', 'Blacklist 4'],
  watchList: ['Watchlist 1', 'Watchlist 2', 'Watchlist 3', 'Watchlist 4'],
};

const SwitchInput = ({
  label = "",
  onChange,
  value,
  staticLabel = "",
  editListOption = false,
  disabled = false,
  labelClass = ""
}) => {
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleSwitchChange = (e) => {
    setChecked(e.target.checked);
    onChange && onChange(e.target.checked, staticLabel);
  };

  useEffect(() => {
    setChecked(value);
  }, [value]);

  const theme = useTheme();

  const labelText = (staticLabel) => {
    if (editListOption) {
      return checked ? (
        <Typography sx={{ color: theme.palette.primary.main }}>
          {staticLabel ? staticLabel : 'On'}
        </Typography>
      ) : (
        <Typography sx={{ color: theme.palette.neutral.dark300 }}>
          {staticLabel ? staticLabel : 'Off'}
        </Typography>
      );
    } else {
      return checked ? (
        <Typography
          className={labelClass.length > 0 ? labelClass : sx.typography__switchLabel}
          sx={{ color: theme.palette.primary.main }}
        >
          {staticLabel ? staticLabel : 'On'}
        </Typography>
      ) : (
        <Typography
          className={labelClass.length > 0 ? labelClass : sx.typography__switchLabel}
          sx={{ color: theme.palette.neutral.dark300 }}
        >
          {staticLabel ? staticLabel : 'Off'}
        </Typography>
      );
    }
  };
  return editListOption ? (
    <>
      <Box className={sx.box__switchEditItem}>
        <Switch
          checked={checked}
          onChange={(e) => handleSwitchChange(e)}
          disabled={disabled}
        />
        <Box className={sx.box__textBlock}>
          {label ? labelText() : staticLabel ? labelText(staticLabel) : false}
          <Typography className={sx.typography__list}>
            {list.blackList.join(', ')}
          </Typography>
        </Box>
        <IconButton
          sx={{
            height: '26px',
            width: '26px',
            marginLeft: '5px',
            transform: 'translateY(12px)',
            color: theme.palette.primary.main,
          }}
          onClick={handleOpenModal}
        >
          <ModeEditIcon sx={{ height: '16px' }} />
        </IconButton>
      </Box>
      <EditBlacklistAlertModal visibility={open} setVisibility={setOpen} />
    </>
  ) : (
    <FormControl fullWidth>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={(e) => handleSwitchChange(e)}
            disabled={disabled}
          />
        }
        label={
          label ? labelText() : staticLabel ? labelText(staticLabel) : false
        }
        labelPlacement='end'
      />
    </FormControl>
  );
};

SwitchInput.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
  staticLabel: PropTypes.string,
  editListOption: PropTypes.bool,
}

export default SwitchInput;
