import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { Box, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// ICONS
import CircleIcon from '@mui/icons-material/Circle';

import { formatDate } from 'utils/helpers/helpers';

import { formatBytes } from 'utils/helpers/size';
import sx from './chartUsage.module.scss';

const labels = {
  'used': 'Active Data',
  'licensed': 'Current License'
};

const ChartUsage = ({ data }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data && typeof data.capacity !== 'undefined') {
      const formatedData = [];
      const sortedData = data.history.sort((a, b) => a.time - b.time);

      sortedData.forEach((item) => {
        const day = new Date(item.date * 1000);
        const day2 = day.setHours(24, 0, 0, 0);
        const day3 = new Date(day2).getTime();

        formatedData.push({
          date: day3,
          used: item.size,
          licensed: item.capacity
        });
      });

      setChartData(formatedData);
    }
  }, [data]);

  const theme = useTheme();

  return (
    <Box className={sx.chartWrapper} height={345}>
      <ResponsiveContainer width='98%'>
        <LineChart
          width='200px'
          data={chartData}
          margin={{ left: 0, top: 10 }}
          strokeWidth={1}
        >
          <CartesianGrid strokeOpacity={0.3} strokeDasharray='4 1' />
          <XAxis
            domain={['auto', 'auto']}
            dataKey='date'
            scale='time'
            type='number'
            tick={{ fontSize: 10, fill: theme.palette.neutral.dark300 }}
            tickLine={false}
            strokeOpacity={0.2}
            tickFormatter={(value) => {
              return `${formatDate(value)}`;
            }}
          />

          <YAxis
            type='number'
            tickLine={false}
            tick={{
              fontSize: 10,
              fill: theme.palette.neutral.dark300,
              transform: 'translate(0, -5)'
            }}
            strokeOpacity={0.2}
            tickFormatter={(value) => {
              return formatBytes({ bytes: value, decimals: 0 });
            }}
          />

          <Legend
            verticalAlign='bottom'
            align='right'
            height={34}
            formatter={(val) => {
              return labels[val.toLowerCase()];
            }}
          />
          <Tooltip
            cursor={{
              fill: theme.palette.neutral.dark600
            }}
            content={<CustomTooltip />}
          />
          <Line dataKey='used' stroke='#3366CC' dot={false} type='step' />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

ChartUsage.propTypes = {
  data: PropTypes.shape({
    capacity: PropTypes.number.isRequired,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.number.isRequired,
        size: PropTypes.number.isRequired
      })
    ),
    label: PropTypes.string.isRequired,
    used: PropTypes.number.isRequired,
    license_engineid: PropTypes.string.isRequired
  })
};

export default ChartUsage;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ padding: '10px', width: '250px' }}>
        <Box>
          <Typography fontSize='12px' fontWeight='700'>
            {formatDate(label)}
          </Typography>
          <Box>
            {payload.map((entry, index) => {
              const { value, name } = entry;
              return (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: '10px'
                  }}
                >
                  <CircleIcon sx={{ height: '10px', color: entry.color }} />
                  <Typography fontSize='12px' width={100}>
                    {labels[name.toLowerCase()]}:
                  </Typography>
                  <Typography fontSize='12px' ml={2} align='right'>
                    {formatBytes({ bytes: value, decimals: 2 })}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Paper>
    );
  }
  return null;
};

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string,
      color: PropTypes.string
    })
  ),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

const CustomizedLabel = ({ viewBox }) => {
  return (
    <text
      y={viewBox.y + 18}
      x={viewBox.x + 10}
      fill={useTheme().palette.neutral.dark300}
      fontSize={12}
      textAnchor='left'
      position='absolute'
    >
      Current Licensed Plan
    </text>
  );
};

CustomizedLabel.propTypes = {
  viewBox: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  })
};
