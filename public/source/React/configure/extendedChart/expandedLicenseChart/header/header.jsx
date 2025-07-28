import PropTypes from 'prop-types';

import {
  Stack,
  Box,
  Typography,
  Divider,
  Button,
  Menu,
  MenuItem,
  Select,
  Pagination,
  PaginationItem
} from '@mui/material';

import { styled, useTheme } from '@mui/material/styles';

// ICONS
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import sx from './header.module.scss';

const StyledSelect = styled(Select)(() => ({
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none !important'
  }
}));

const Header = ({ toggle, paginationLength, perPage, currentPage, anchor }) => {
  const { type, setType } = toggle;
  const { itemsPerPage, setItemsPerPage } = perPage;
  const { selectedPage, setSelectedPage } = currentPage;
  const { anchorEl, setAnchorEl } = anchor;

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setSelectedPage(1);
  };

  const handleSelectedPage = (page) => {
    setSelectedPage(page);
  };

  const handleFilterButton = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleCloseFilterButton = () => {
    setAnchorEl(null);
  };
  const handleChange = (e) => {
    setType(e.target.value);
  };

  const openFilterButton = Boolean(anchorEl);
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex' }}>
        <Divider orientation='vertical' className={sx.verticalLine} flexItem />
        {/* <ToggleButtonGroup
          value={type}
          exclusive
          onChange={handleChange}
          aria-label='Select chart'
        >
          <ToggleButton color='secondary' value='usage'>
            Usage
          </ToggleButton> 
          <ToggleButton color='secondary' value='allocation'>
            Allocation by Host
          </ToggleButton>
        </ToggleButtonGroup> */}
        {type === 'allocation' && (
          <Box className={sx.filterBtnWrapper}>
            <Button
              id='firstLevel-button'
              aria-controls={openFilterButton ? 'basic-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={openFilterButton ? 'true' : undefined}
              className={sx.filterBtn}
              sx={{
                border: `1px solid ${theme.palette.neutral.dark400}`,
                backgroundColor: theme.palette.white.main
              }}
              
              onClick={(e) => handleFilterButton(e)}
            >
              <FilterAltIcon
                className={sx.filterBtn__filterIcon}
                sx={{ color: theme.palette.neutral.dark200 }}
              />
            </Button>
            <Menu
              id='basic-menu'
              anchorEl={anchorEl}
              open={openFilterButton}
              onClose={() => handleCloseFilterButton()}
              MenuListProps={{
                'aria-labelledby': 'firstLevel-button'
              }}
              transformOrigin={{
                horizontal: 'center',
                vertical: 'top'
              }}
              anchorOrigin={{
                horizontal: 'center',
                vertical: 'bottom'
              }}
              PaperProps={{
                style: {
                  maxHeight: 300,
                  width: 'fit-content',
                  transform: 'translateY(10px)'
                }
              }}
            >
              {filterItems.map((item, index) => (
                <MenuItem
                  key={item.id + index}
                  onClick={() => handleCloseFilterButton()}
                >
                  {item.option}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        )}
      </div>

      {type === 'allocation' && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <Typography fontSize='12px'>Show</Typography>
          <StyledSelect
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            sx={{ width: '60px' }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={20}>20</MenuItem>
            <MenuItem value={30}>30</MenuItem>
          </StyledSelect>
          <Stack direction='row' spacing='5px' alignItems='center'>
            <Pagination
              count={paginationLength}
              defaultPage={1}
              siblingCount={0}
              boundaryCount={0}
              showFirstButton
              showLastButton
              page={selectedPage}
              onChange={(e, page) => handleSelectedPage(page)}
              renderItem={(item) => {
                if (item.type === 'page' && item.selected) {
                  return (
                    <Typography fontSize='12px' fontWeight='600'>
                      {item.page}
                    </Typography>
                  );
                }
                if (item.type === 'first' || item.type === 'previous') {
                  return (
                    <PaginationItem
                      components={{
                        first: KeyboardDoubleArrowLeftIcon,
                        previous: KeyboardArrowLeftIcon
                      }}
                      {...item}
                    />
                  );
                }
                if (item.type === 'next' || item.type === 'last') {
                  return (
                    <PaginationItem
                      components={{
                        next: KeyboardArrowRightIcon,
                        last: KeyboardDoubleArrowRightIcon
                      }}
                      {...item}
                    />
                  );
                }
              }}
            />
          </Stack>
        </Box>
      )}
      <Box />
    </Box>
  );
};

Header.propTypes = {
  toggle: PropTypes.shape({
    type: PropTypes.string.isRequired,
    setType: PropTypes.func.isRequired
  }),
  perPage: PropTypes.shape({
    itemsPerPage: PropTypes.number.isRequired,
    setItemsPerPage: PropTypes.func.isRequired
  }),
  currentPage: PropTypes.shape({
    selectedPage: PropTypes.number.isRequired,
    setSelectedPage: PropTypes.func.isRequired
  }),
  anchor: PropTypes.shape({
    anchorEl: PropTypes.object,
    setAnchorEl: PropTypes.func
  }),
  paginationLength: PropTypes.number.isRequired
};

export default Header;

export const filterItems = [
  {
    id: 'host',
    option: 'Host'
  },
  {
    id: 'job',
    option: 'Job'
  },
  {
    id: 'type-of-scan',
    option: 'Type of Scan',
    subOptions: [
      'Scheduled Full',
      'Scheduled Incremental',
      'Demand Full',
      'Demand Incremental',
      'Delta Block'
    ]
  },
  {
    id: 'scan-time',
    option: 'Start Time'
  },
  {
    id: 'duration',
    option: 'Duration'
  },
  {
    id: 'data-processed',
    option: 'Data Processed'
  },
  {
    id: 'size-of-disk',
    option: 'Size of Disk'
  },
  {
    id: 'files-changed',
    option: 'Files Changed'
  },
  {
    id: 'files-deleted',
    option: 'Files Deleted'
  },
  {
    id: 'scratch-storage-used',
    option: 'Scratch Storage Used'
  }
];

const get_options = () => {
  const theme = useTheme();
  const options = {
    chartArea: {
      height: '296px',
      width: '100%',
      left: 49,
      right: 0,
      bottom: 20,
      top: 7
    },
    fontSize: 10,
    fontName: "'Open Sans', sans-serif",
    vAxis: {
      maxValue: 100,
      format: '#GB',
      textStyle: {
        fontSize: 10,
        color: theme.palette.neutral.dark300
      },
      gridlines: {
        color: '#e7ecf1',
        // minSpacing: 10,
        count: 6,
        // interval: 5,
        slantedText: false
      },
      minorGridlines: {
        count: 0
      }
    },
    hAxis: {
      format: 'MMM d',
      textStyle: {
        fontSize: 10,
        color: theme.palette.neutral.dark300
      },
      // allowContainerBoundaryTextCutoff: true,
      showTextEvery: 1,
      // baseline: new Date(2022, 3, 1),
      // baselineColor: '#e7ecf1',
      gridlines: {
        color: '#e7ecf1',
        // minSpacing: 10,
        count: 23,
        // interval: 5,
        slantedText: false
      },
      minorGridlines: {
        count: 0
      }
    },
    series: {
      0: {
        lineWidth: 2
      }
    }
  };
  return options;
};
