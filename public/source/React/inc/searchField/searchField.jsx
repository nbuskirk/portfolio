import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import debounce from 'lodash.debounce';

// ICONS
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import sx from './searchField.module.scss';
import { useCallback } from 'react';

const SearchField = ({ onChange }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const toggleSearchInput = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchValue('');
  };

  const handleClearField = () => {
    setSearchValue('');
  };

  const debounceHandelChange = useCallback(
    debounce((val) => {
      onChange && onChange(val);
    }, 500),
    []
  );

  useEffect(() => {
    debounceHandelChange(searchValue);
  }, [searchValue]);

  const theme = useTheme();

  return isSearchOpen ? (
    <OutlinedInput
      id={'mainFilterIntput'}
      className={sx.searchField}
      variant='outlined'
      placeholder='Search'
      startAdornment={
        <InputAdornment
          position='start'
          onClick={toggleSearchInput}
          className={sx.toggleSearchIcon}
        >
          <SearchIcon
            className={sx.searchIcon}
            sx={{ color: theme.palette.dark.main }}
          />
        </InputAdornment>
      }
      endAdornment={
        searchValue.length > 0 && (
          <InputAdornment position='end'>
            <IconButton
              className={sx.endIcon}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.white.main,
              }}
              onClick={handleClearField}
            >
              <ClearIcon className={sx.clearIcon} />
            </IconButton>
          </InputAdornment>
        )
      }
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
    />
  ) : (
    <IconButton
      onClick={toggleSearchInput}
      sx={{
        width: '36px',
        height: '36px',
        transform: 'translate(10px, 0)',
      }}
    >
      <SearchIcon sx={{ height: '20px' }} />
    </IconButton>
  );
};

SearchField.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default SearchField;
