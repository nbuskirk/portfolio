import {
  Typography,
  Tooltip as MUITooltip,
  IconButton,
  Box,
  Tooltip
} from '@mui/material';
import { GridSize, ResponsiveStyleValue } from '@mui/system';
import InfoIcon from '@mui/icons-material/Info';
import Grid from '@mui/material/Grid2';
import { Host } from 'data-hooks/useDailyActivity';
import {
  AxisConfig,
  ChartsReferenceLine,
  ChartsXAxisProps,
  ChartsYAxisProps
} from '@mui/x-charts';
import { format } from 'date-fns';
import { useTheme, alpha } from '@mui/material/styles';
import { LineChartPro, areaElementClasses } from '@mui/x-charts-pro';
import { useUser } from 'utils/context/UserContext';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { getActiveSeverityLevels } from 'components/Hosts/utils/utils';
import { useQueryClient } from '@tanstack/react-query';
import { DAILY_ACTIVITY } from 'constants/queryKeys';
import ThesholdChartLegend from './ChartLegend';
import DailyThresholdForm from '../Forms/DailyThresholdForm';
import {
  SeverityLevels,
  ThresholdGraphType,
  ThresholdTableRow
} from '../Forms/types';

export interface DailyThresholdGraphProps {
  data: ThresholdTableRow[];
  name: string;
  enabled: boolean;
  id?: number | null;
  size?: ResponsiveStyleValue<GridSize>;
  severityLevels?: SeverityLevels;
  valueType?: ThresholdGraphType;
  valueDecimalPlaces?: number;
  minY?: number;
  maxY?: number;
  activityType?: string;
  host?: Host;
  tooltipText?: string;
}

const DailyThresholdGraph = ({
  id,
  data,
  name,
  severityLevels,
  valueType = 'qty',
  valueDecimalPlaces,
  minY,
  maxY,
  size,
  activityType,
  host,
  enabled,
  tooltipText
}: DailyThresholdGraphProps) => {
  const theme = useTheme();
  const { canAccess } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  // Process data based on valueType
  const formattedData = data.map((d: ThresholdTableRow) => ({
    ...d,
    value: valueType === 'percent' ? d.value * 0.0001 : d.value
  }));
  const sortedData = formattedData.sort((a, b) => a.time_date - b.time_date);

  const availableLevels = getActiveSeverityLevels(enabled, severityLevels);
  const disabled = !canAccess('thresholdmgmt');

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    queryClient.invalidateQueries({ queryKey: [DAILY_ACTIVITY] });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };
  let maxSeverityLevel = 0;
  const severityEntries = Object.entries(severityLevels || {});
  severityEntries.forEach(([, value]) => {
    if (value.enabled && value.value > maxSeverityLevel) {
      maxSeverityLevel = value.value;
    }
  });
  return (
    <Grid
      size={size ?? { xs: 12, md: 6 }}
      sx={{
        border: `1px solid ${theme.palette.neutral.primary400}`,
        backgroundColor: `${alpha(theme.palette.neutral.secondary400, 0.05)}`,
        padding: '1em',
        borderRadius: '4px'
      }}
    >
      <Box sx={{ display: 'flex' }}>
        <Typography
          sx={{
            color: theme.palette.neutral.primary100,
            flex: 1,
            fontWeight: 'bold',
            fontSize: '14px'
          }}
          variant='h3'
        >
          {name}
          {tooltipText && (
            <Tooltip
              arrow
              title={tooltipText}
              placement='right'
              sx={{ marginLeft: '0.25rem', marginY: '-.4rem' }}
            >
              <InfoIcon
                color='secondary'
                sx={{ fontSize: '14px', margin: '0 0 -0.2em 0.3em' }}
              />
            </Tooltip>
          )}
        </Typography>
        <MUITooltip
          title={disabled ? 'No Permission' : 'Edit Alert Level'}
          arrow
          placement='right'
        >
          <span>
            <IconButton
              onClick={handleEditClick}
              disabled={disabled}
              sx={{
                '&&.MuiButtonBase-root': {
                  padding: '4px',
                  margin: '0',
                  minHeight: 'auto',
                  maxHeight: 'auto'
                }
              }}
            >
              <EditIcon
                sx={{
                  fontSize: '16px'
                }}
              />
            </IconButton>
          </span>
        </MUITooltip>
      </Box>
      <ThesholdChartLegend levels={availableLevels} />
      <LineChartPro
        height={300}
        margin={{ top: 20, bottom: 80, left: 60, right: 0 }}
        dataset={sortedData}
        grid={{ horizontal: true }}
        slotProps={{
          legend: {
            hidden: true
          }
        }}
        xAxis={[
          {
            id: 'x',
            zoom: true,
            scaleType: 'band',
            dataKey: 'time_date',
            valueFormatter: (v) => format(new Date(v * 1000), 'MMM dd'),
            tickLabelStyle: {
              fontSize: 12,
              fill: `${theme.palette.neutral.dark100}`
            }
          } as AxisConfig<'band', any, ChartsXAxisProps>
        ]}
        yAxis={[
          {
            id: 'y',
            min: sortedData.length ? minY : undefined,
            max: sortedData.length ? maxY : undefined,
            tickLabelStyle: {
              fill: `${theme.palette.neutral.dark100}`,
              fontSize: 12
            },

            domainLimit: (min, max) => {
              if (min === 0 && max === 0 && maxSeverityLevel === 0) {
                return {
                  min: 0,
                  max: 100
                };
              }
              return {
                min,
                max: maxSeverityLevel > max ? maxSeverityLevel : max
              };
            }
          } as AxisConfig<'band', any, ChartsYAxisProps>
        ]}
        series={[
          {
            dataKey: 'value',
            area: true,
            label: valueType === 'percent' ? 'Percent' : 'Quantity',
            color: theme.palette.neutral.primary100,
            valueFormatter: (v) => {
              if (v === null) {
                return null;
              }
              const formatted = valueDecimalPlaces
                ? v.toFixed(valueDecimalPlaces)
                : v.toString();

              return valueType === 'percent' ? `${formatted}%` : formatted;
            }
          }
        ]}
        sx={{
          [`& .${areaElementClasses.root}`]: {
            fill: `${theme.palette.neutral.primary600}`
          },
          '& .MuiChartsGrid-line': {
            stroke: `${theme.palette.neutral.primary600} !important`
          },
          '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': {
            stroke: `${theme.palette.neutral.dark100}`
          }
        }}
      >
        {severityLevels?.low?.value &&
          severityLevels?.low?.value !== -1 &&
          severityLevels.low.enabled &&
          enabled && (
            <ChartsReferenceLine
              y={
                valueType === 'percent'
                  ? severityLevels.low.value / 10000
                  : severityLevels?.low?.value
              }
              lineStyle={{
                stroke: theme.palette.warning.light,
                strokeDasharray: '2 1',
                strokeWidth: '2',
                opacity: 0.5
              }}
            />
          )}
        {severityLevels?.medium?.value &&
          severityLevels?.medium?.value !== -1 &&
          severityLevels.medium.enabled &&
          enabled && (
            <ChartsReferenceLine
              y={
                valueType === 'percent'
                  ? severityLevels.medium.value / 10000
                  : severityLevels?.medium?.value
              }
              lineStyle={{
                stroke: theme.palette.warning.dark,
                strokeDasharray: '2 1',
                strokeWidth: '2',
                opacity: 0.5
              }}
            />
          )}
        {severityLevels?.high?.value &&
          severityLevels?.high?.value !== -1 &&
          severityLevels.high.enabled &&
          enabled && (
            <ChartsReferenceLine
              y={
                valueType === 'percent'
                  ? severityLevels.high.value / 10000
                  : severityLevels?.high?.value
              }
              lineStyle={{
                stroke: theme.palette.error.dark,
                strokeDasharray: '2 1',
                strokeWidth: '2',
                opacity: 0.5
              }}
            />
          )}
        {severityLevels?.critical?.value &&
          severityLevels?.critical?.value !== -1 &&
          severityLevels.critical.enabled &&
          enabled && (
            <ChartsReferenceLine
              y={
                valueType === 'percent'
                  ? severityLevels.critical.value / 10000
                  : severityLevels?.critical?.value
              }
              lineStyle={{
                stroke: theme.palette.error.main,
                strokeDasharray: '2 1',
                strokeWidth: '2',
                opacity: 0.5
              }}
            />
          )}
      </LineChartPro>
      {isEditing && (
        <DailyThresholdForm
          id={id}
          onSave={handleSave}
          onCancel={handleCancel}
          activityType={activityType}
          host={host!}
        />
      )}
    </Grid>
  );
};

export default DailyThresholdGraph;
