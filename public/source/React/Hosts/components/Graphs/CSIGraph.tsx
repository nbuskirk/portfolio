import {
  Typography,
  Tooltip as MUITooltip,
  IconButton,
  Box,
  Tooltip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { GridSize, ResponsiveStyleValue } from '@mui/system';
import Grid from '@mui/material/Grid2';
import {
  AxisConfig,
  ChartsReferenceLine,
  ChartsXAxisProps,
  ChartsYAxisProps
} from '@mui/x-charts';
import { format, eachDayOfInterval, fromUnixTime, getUnixTime } from 'date-fns';
import { useTheme, alpha } from '@mui/material/styles';
import { LineChartPro, areaElementClasses } from '@mui/x-charts-pro';
import { Host } from 'data-hooks/useDailyActivity';
import { useUser } from 'utils/context/UserContext';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import useIsVendor from 'hooks/useIsVendor';
import { doCombinedData } from 'components/Hosts/utils/utils';
import ThesholdChartLegend from './ChartLegend';
import CSIForm from '../Forms/CSIForm';
import { SeverityLevel } from '../Forms/types';

interface ThresholdTableRow {
  time_date: number;
  value: number;
  dbavalue?: number;
}

interface CSIThresholdGraphProps {
  data: ThresholdTableRow[];
  dbaData: ThresholdTableRow[];
  name: string;
  size?: ResponsiveStyleValue<GridSize>;
  minY?: number;
  maxY?: number;
  host?: Host;
  initialAlertLevel?: number;
  rssId?: number;
  valueDecimalPlaces?: number;
  editEnabled?: boolean;
}

const CSIGraph = ({
  data,
  dbaData,
  name,
  minY,
  maxY,
  size,
  initialAlertLevel,
  rssId,
  host,
  valueDecimalPlaces = 6,
  editEnabled = true
}: CSIThresholdGraphProps) => {
  const theme = useTheme();
  const { canAccess } = useUser();
  const { vendor } = useIsVendor('dell');
  const [isEditing, setIsEditing] = useState(false);
  const [alertLevel, setAlertLevel] = useState(initialAlertLevel);
  const sortedData = data.sort(
    (a, b) => a.time_date - b.time_date
  ) as ThresholdTableRow[];

  // Add a x100 multiplier to the value for the chart
  const mData = sortedData.map((item) => ({
    ...item,
    value: item.value * 100
  }));

  const combinedData = doCombinedData(mData, dbaData).sort(
    (a, b) => a.time_date - b.time_date
  );

  const disabled =
    !canAccess('thresholdmgmt') || !editEnabled || !host?.hostname;

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };
  const handleEditEnd = () => {
    setAlertLevel(initialAlertLevel);
    setIsEditing(false);
  };

  const handleOnSave = () => {
    setIsEditing(false);
  };
  const getCSILegendItems = (): SeverityLevel[] => {
    if (vendor && host?.hostname && dbaData.length > 0)
      return ['csi', 'dba', 'alertlevel'] as SeverityLevel[];
    if (vendor && host?.hostname)
      return ['csi', 'alertlevel'] as SeverityLevel[];
    if (host?.hostname) return ['csi', 'alertlevel'] as SeverityLevel[];
    if (host?.hostname === '') return [];
    return [];
  };

  const getAllDates = () => {
    if (combinedData.length === 0) return [];

    const minTimestamp = Math.min(...combinedData.map((d) => d.time_date));
    const maxTimestamp = Math.max(...combinedData.map((d) => d.time_date));

    const minDate = fromUnixTime(minTimestamp);
    const maxDate = fromUnixTime(maxTimestamp);

    return eachDayOfInterval({ start: minDate, end: maxDate }).map((date) =>
      getUnixTime(date)
    );
  };

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
          <Tooltip
            arrow
            title="Probability that this host's data exhibits corruption indicative of a ransomware attack, derived from multiple AI analysis models."
            placement='right'
            sx={{ marginLeft: '0.25rem', marginY: '-.4rem' }}
          >
            <InfoIcon
              color='secondary'
              sx={{ fontSize: '14px', margin: '0 0 -0.2em 0.3em' }}
            />
          </Tooltip>
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
      <ThesholdChartLegend levels={getCSILegendItems()} />
      <LineChartPro
        height={300}
        margin={{ top: 20, bottom: 80, left: 60, right: 0 }}
        dataset={combinedData}
        grid={{ horizontal: true }}
        slotProps={{
          legend: {
            hidden: true
          }
        }}
        slots={{
          noDataOverlay: () => null
        }}
        xAxis={[
          {
            id: 'x',
            zoom: true,
            data: getAllDates(),
            scaleType: 'band',
            dataKey: 'time_date',
            valueFormatter: (v) => ` ${format(new Date(v * 1000), 'MMM dd')} `,
            tickLabelStyle: {
              fontSize: 12,
              fill: `${theme.palette.neutral.dark100}`
            }
          } as AxisConfig<'band', any, ChartsXAxisProps>
        ]}
        yAxis={[
          {
            id: 'y',
            min: minY,
            max: maxY,
            tickLabelStyle: {
              fill: `${theme.palette.neutral.dark100}`,
              fontSize: 12
            }
          } as AxisConfig<'band', any, ChartsYAxisProps>
        ]}
        series={[
          {
            dataKey: 'value',
            area: true,
            label: 'CyberSensitivity Index',
            color: theme.palette.neutral.primary100,
            valueFormatter: (v: number) => {
              if (v === null) {
                return null;
              }
              const formatted = valueDecimalPlaces
                ? v.toFixed(valueDecimalPlaces)
                : v.toString();

              return formatted;
            }
          },
          {
            dataKey: 'dbavalue',
            label: 'DBA Score',
            type: 'line',
            color: theme.palette.secondary.main,
            area: true,
            valueFormatter: (v: number) => {
              if (v === null) {
                return null;
              }
              const formatted = valueDecimalPlaces
                ? v.toFixed(valueDecimalPlaces)
                : v.toString();

              return formatted;
            }
          }
        ].reduce((acc, series) => {
          if (!vendor) {
            if (series.label === 'CyberSensitivity Index') {
              return [...acc, series];
            }
          } else {
            return [...acc, series];
          }
          return acc;
        }, [] as any)}
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
        {alertLevel && alertLevel !== -1 && (
          <ChartsReferenceLine
            y={alertLevel}
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
        <CSIForm
          onCancel={handleEditEnd}
          onSave={handleOnSave}
          host={host}
          handleSliderChange={(_, value) => {
            setAlertLevel(value as number);
          }}
          handleInputChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setAlertLevel(Number(event.target?.value));
          }}
          alertLevel={alertLevel!}
          rssId={rssId}
        />
      )}
    </Grid>
  );
};

export default CSIGraph;
