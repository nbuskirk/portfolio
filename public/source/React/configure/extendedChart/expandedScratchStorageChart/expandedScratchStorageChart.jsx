import { useState, useEffect } from 'react';

import { Box, Typography, Paper, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Line,
  Cell,
  Legend
} from 'recharts';

import useSession from 'utils/hooks/useSession';

// ICONS
import CircleIcon from '@mui/icons-material/Circle';

import { formatDate } from 'utils/helpers/helpers';

import useScratchStorage from 'utils/useQuery/useScratchStorage';

import { INDEX_STORAGE_MAX_DATA } from 'constants/constants';
import Loader from 'components/inc/loader';
import { formatBytes } from 'utils/helpers/size';
import ExtendedChartHeaderLayout from '../extendedChartHeaderLayout';
import sx from './expandedScratchStorageChart.module.scss';

const AVAILABLE = 'Available';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Paper sx={{ padding: '10px' }}>
        <Box>
          <Typography fontSize='12px' fontWeight='700'>
            {formatDate(label * 1000)}
          </Typography>
          <Box>
            {payload.map((entry) => {
              const { value } = entry;
              let { name } = entry;
              if (name === 'total') {
                name = AVAILABLE;
              }
              name = name.charAt(0).toUpperCase() + name.slice(1);
              return (
                <Box
                  key={name}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop: '10px'
                  }}
                >
                  <CircleIcon sx={{ height: '10px', color: entry.color }} />
                  <Typography fontSize='12px'>{name}:</Typography>
                  <Typography fontSize='12px' ml={2}>
                    {formatBytes({ bytes: value })}
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

const ExpandedScratchStorageChart = () => {
  const { session } = useSession();
  const { data } = useScratchStorage({
    session,
    count: INDEX_STORAGE_MAX_DATA
  });
  const [chartData, setChartData] = useState(null);
  const [subTitleInfo, setSubTitleInfo] = useState(null);

  useEffect(() => {
    if (data) {
      const formatedData = [];

      const sortedData = data.history.sort((a, b) => a.datetime - b.datetime);

      sortedData.map((item) => {
        return formatedData.push({
          id: item.datetime,
          date: item.datetime,
          used: item.used,
          total: item.total
        });
      });
      setChartData(formatedData);
      if (sortedData.length > 0) {
        const maxUsed = sortedData.reduce(
          (max, obj) => (obj.used > max.used ? obj : max),
          sortedData[0]
        );
        const subTitleInfoObj = {};
        subTitleInfoObj.available = sortedData[sortedData.length - 1].total;
        subTitleInfoObj.maxUsed = maxUsed.used;
        subTitleInfoObj.date = maxUsed.datetime;
        setSubTitleInfo(subTitleInfoObj);
      }
    }
  }, [data]);

  const theme = useTheme();

  return (
    <>
      <ExtendedChartHeaderLayout chartType='scratchStorage' />
      <Box className={sx.subTitleWrapper}>
        <Typography className={sx.subTitle} color={theme.palette.error.dark}>
          {`${AVAILABLE}: `}
          {subTitleInfo ? formatBytes({ bytes: subTitleInfo.available }) : ''}
        </Typography>
        <Divider
          orientation='vertical'
          flexItem
          sx={{
            borderRightWidth: 2,
            borderColor: theme.palette.neutral.dark400,
            margin: '3px'
          }}
        />
        <Typography className={sx.subTitle} color={theme.palette.neutral.dark200}>
          Max Used:{' '}
          {subTitleInfo ? formatBytes({ bytes: subTitleInfo.maxUsed }) : ''}
        </Typography>
        <Divider
          orientation='vertical'
          flexItem
          sx={{
            borderRightWidth: 2,
            borderColor: theme.palette.neutral.dark400,
            margin: '3px'
          }}
        />
        <Typography className={sx.subTitle} color={theme.palette.neutral.dark200}>
          Max Used Date:{' '}
          {subTitleInfo ? formatDate(subTitleInfo.date * 1000) : ''}
        </Typography>
      </Box>
      <Box className={sx.contentWrapper} height={350}>
        {!data ? (
          <Loader sx={{ height: 300 }} />
        ) : (
          <ResponsiveContainer width='98%'>
            <ComposedChart
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
                tickFormatter={(value) => {
                  return `${formatBytes({ bytes: value, decimals: 0 })}`;
                }}
              />
              <Bar dataKey='used' barSize={8} fill='#3366CC'>
                {chartData &&
                  chartData.map((item) => {
                    const { used, total } = item;
                    return (
                      <Cell
                        key={item.id}
                        fill={
                          used > total ? theme.palette.error.dark : '#3366CC'
                        }
                      />
                    );
                  })}
              </Bar>

              <Line
                dataKey='total'
                stroke={theme.palette.error.dark}
                strokeDasharray='2 2'
                type='step'
                dot={false}
              />

              <Legend
                verticalAlign='bottom'
                height={34}
                align='right'
                formatter={(param) => {
                  const val = param === 'total' ? AVAILABLE : param;
                  const capitalize = val.charAt(0).toUpperCase() + val.slice(1);
                  return `${capitalize}`;
                }}
              />

              <Tooltip
                cursor={{
                  fill: theme.palette.neutral.dark600
                }}
                content={<CustomTooltip />}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </Box>
    </>
  );
};

export default ExpandedScratchStorageChart;
