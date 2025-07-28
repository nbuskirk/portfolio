import { useState, useEffect } from 'react';
import useSession from 'utils/hooks/useSession';

import { Box, Typography, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import PropTypes from 'prop-types';
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

import useIndexStorage from 'utils/useQuery/useIndexStorage';
import { INDEX_STORAGE_MAX_DATA } from 'constants/constants';
import Loader from 'components/inc/loader';
import { bytesToGiga, formatBytes } from 'utils/helpers/size';
import ExtendedChartHeaderLayout from '../extendedChartHeaderLayout';
import sx from './expandedIndexStorageChart.module.scss';

const ExpandedIndexStorageChart = () => {
  const { session } = useSession();
  const { data } = useIndexStorage({ session, count: INDEX_STORAGE_MAX_DATA });
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (data && data.history) {
      const formatedData = [];
      const sortedData = data.history.sort((a, b) => a.datetime - b.datetime);

      sortedData.map((item) => {
        formatedData.push({
          id: item.datetime,
          date: item.datetime,
          storage: item.number
        });
      });

      setChartData(formatedData);
    }
  }, [data]);

  const theme = useTheme();

  return (
    <>
      <ExtendedChartHeaderLayout chartType='indexStorage' />
      <Box className={sx.contentWrapper} height={350}>
        {!data ? (
          <Loader sx={{ height: 300 }} />
        ) : (
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
                allowDataOverflow
                allowDuplicatedCategory
                tick={{ fontSize: 10, fill: theme.palette.neutral.dark300 }}
                tickLine={false}
                strokeOpacity={0.2}
                tickFormatter={(value) => {
                  return `${formatDate(value * 1000)}`;
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
                tickFormatter={(value) =>
                  `${formatBytes({ bytes: value, decimals: 0 })}`
                }
              />
              <Legend
                verticalAlign='bottom'
                height={34}
                align='right'
                formatter={() => {
                  return 'Index Storage';
                }}
              />
              <Tooltip
                cursor={{
                  fill: theme.palette.neutral.dark600
                }}
                content={<CustomTooltip />}
              />
              <Line dataKey='storage' stroke='#3366CC' dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Box>
    </>
  );
};

ExpandedIndexStorageChart.propTypes = {
  data: PropTypes.shape({
    capacity: PropTypes.number,
    history: PropTypes.arrayOf(
      PropTypes.shape({
        datetime: PropTypes.number,
        number: PropTypes.number
      })
    )
  })
};

export default ExpandedIndexStorageChart;

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ padding: '10px', width: '200px' }}>
        <Box>
          <Typography fontSize='12px' fontWeight='700'>
            {formatDate(label * 1000)}
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
                  <Typography fontSize='12px'>{name}:</Typography>
                  <Typography fontSize='12px' ml={2}>
                    {bytesToGiga(value)}GB
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
      color: PropTypes.string,
      name: PropTypes.string,
      value: PropTypes.number
    })
  ),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
