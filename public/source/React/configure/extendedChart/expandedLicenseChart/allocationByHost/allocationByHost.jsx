import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Stack, Box, Divider } from '@mui/material';

import HostItem from './hostItem';

import sx from './allocationByHost.module.scss';

const AllocationByHost = ({
  itemsPerPage,
  data,
  selectedPage,
}) => {
  const [itemsToRender, setItemsToRender] = useState([]);

  useEffect(() => {
    if (data && itemsPerPage && selectedPage) {
      const items = data.hosts.slice(
        selectedPage * itemsPerPage - itemsPerPage,
        selectedPage * itemsPerPage
      );
      setItemsToRender(items);
    }
  }, [data, itemsPerPage, selectedPage]);


  return (
    <Box>
      <Stack
        className={sx.allocationWrapper}
        divider={
          <Divider
            className={sx.columnDivider}
            orientation='vertical'
            flexItem
          />
        }
      >
        {itemsToRender.length > 0 &&
          Array.from({ length: 3 }, (_, i) => (
            <Stack
              className={sx.column}
              divider={
                <Divider
                  className={sx.rowDivider}
                  orientation='horizontal'
                  flexItem
                />
              }
              key={i}
            >
              {' '}
              {itemsToRender
                .slice(
                  i * Math.ceil(itemsPerPage / 3),
                  (i + 1) * Math.ceil(itemsPerPage / 3)
                )
                .map((item) => (
                  <HostItem key={item.hostname} item={item} />
                ))}
            </Stack>
          ))}
      </Stack>
    </Box>
  );
};

AllocationByHost.propTypes = {
  itemsPerPage: PropTypes.number.isRequired,
  selectedPage: PropTypes.number.isRequired,
  data: PropTypes.shape({
    capacity: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(PropTypes.shape({
      date: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
    })),
    label: PropTypes.string.isRequired,
    used: PropTypes.number.isRequired,
    license_engineid: PropTypes.string.isRequired,
    hosts: PropTypes.arrayOf(PropTypes.shape({
      hostname: PropTypes.string.isRequired,
      history: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
      }),)
    }))
  }),
};

export default AllocationByHost;
