import React from 'react';
import { useTheme } from '@mui/material/styles';

const SmallChart = ({
  chartType,
  width,
  height,
  data,
  lineStyle,
  barStyle,
  maxValue,
  hAxisFormat,
  vAxisFormat,
  vInterval,
  additionalOptions,
}) => {
  const theme = useTheme();
  const options = {
    chartArea: {
      height: height,
      width: width,
      left: 37,
      right: 6,
      bottom: 20,
      top: 7,
    },

    fontName: "'Open Sans', sans-serif",
    vAxis: {
      maxValue: maxValue,
      format: vAxisFormat,
      textStyle: {
        fontSize: 10,
        color: theme.palette.neutral.dark300,
      },
      gridlines: {
        color: '#e7ecf1',
        // minSpacing: 10,
        // count: -1,
        // interval: vInterval,
        slantedText: false,
      },
      minorGridlines: {
        count: 0,
      },
    },
    hAxis: {
      format: hAxisFormat,
      showTextEvery: 1,
      textStyle: {
        fontSize: 10,
        color: theme.palette.neutral.dark300,
      },
      // baseline: new Date(2022, 3, 1),
      // baselineColor: '#e7ecf1',
      gridlines: {
        color: '#e7ecf1',
        // minSpacing: 50,
        // count: 5,
        // interval: 2,
        slantedText: false,
      },
      minorGridlines: {
        count: 0,
      },
    },
    enableInteractivity: false,

    series: lineStyle ? lineStyle : barStyle ? barStyle : {},
    ...(additionalOptions && additionalOptions),
  };
  return (
    <>
      {/* <Chart
        chartType={chartType}
        width={width}
        height={height}
        data={data}
        options={options}
      /> */}
    </>
  );
};

export default SmallChart;
