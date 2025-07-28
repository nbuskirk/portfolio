import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Stack, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { formatDate } from 'utils/helpers/helpers';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

import sx from './hostItem.module.scss';

const HostItem = ({ item }) => {
  const { hostname, history } = item;
  const { size, data, time} = history;

  const [capacityValue, setCapacityValue] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [minData, setMinData] = useState(0);
  const [maxData, setMaxData] = useState(0);

  useEffect(() => {
    if (history) {
      const formatedData = [];

      history.map((item, index) => {
        formatedData.push({
          date: formatDate(item.data),
          used: item.size,
          capacity: item.size,
        });

        if (history.length === index + 1) {
          setCapacityValue(item.size);
        }
      });

      setChartData(formatedData);
    }
  }, [history]);

  useEffect(() => {
    if (history) {
      setMinData(Math.min(...history.map((item) => item.size)));
      setMaxData(Math.max(...history.map((item) => item.size)));
    }
  }, [history]);

  const theme = useTheme();

  return (
    <Stack className={sx.item}>
      <Typography sx={{ color: theme.palette.dark.main }} className={sx.title}>
        {hostname}
      </Typography>
      <Box className={sx.chartWrapper}>
        <Typography
          sx={{ color: theme.palette.dark.main }}
          className={sx.capacity}
        >
          {/* {used.toFixed(1)}/{capacity} GB */}
        </Typography>
        <Box className={sx.chartContainer}>
          <LineChart
            width={100}
            height={50}
            data={chartData}
            margin={{ left: -50, right: -50, top: 0, bottom: 0 }}
            strokeWidth={1}
          >
            <CartesianGrid horizontal={false} vertical={false} />
            <XAxis
              dataKey='date'
              tick={false}
              tickLine={false}
              stroke={'none'}
            />
            <YAxis
              type='number'
              domain={[minData, maxData]}
              tick={false}
              stroke={'none'}
            />
            <ReferenceLine
              stroke={theme.palette.error.dark}
              strokeDasharray='2 2'
              strokeWidth={2}
              dot={false}
              y={capacityValue}
            />
            <Line
              dataKey='capacity'
              stroke={theme.palette.error.dark}
              strokeDasharray='2 2'
              strokeWidth={0}
              dot={false}
            />
            <Line dataKey='used' stroke='#3366CC' dot={false} />
          </LineChart>
        </Box>
      </Box>
    </Stack>
  );
};

HostItem.propTypes = {
  item: PropTypes.shape({
    hostname:  PropTypes.string,
    history: PropTypes.arrayOf(PropTypes.shape({
      data: PropTypes.string,
      size: PropTypes.number
    })),
  }),
}

export default HostItem;
