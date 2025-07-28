import { useTheme } from '@mui/material/styles';
import format from 'date-fns/format';
import changeTimezone from 'utils/helpers/timezone';
import { useIeSystem, ieTimezone } from 'data-hooks/useIeSystem';
import { BarChart } from '@mui/x-charts/BarChart';
import { useUser } from 'utils/context/UserContext';
import Loader from 'components/inc/loader';
import { ScanStats } from 'data-hooks/stats/useStats';
import { Alert } from '@mui/material';
import formatBackupTableData from './utils/formatBackupTableData';

const BackupsBySizeChart = ({
  data,
  isLoading
}: {
  isLoading: boolean;
  data: ScanStats | undefined;
}) => {
  const theme = useTheme();
  const { session } = useUser();
  const { data: ie } = useIeSystem({ session });

  const formatTimestamp = (timestamp: number) => {
    return format(
      changeTimezone(new Date(timestamp * 1000), ieTimezone(ie)),
      'M/dd/yy'
    );
  };

  const formattedData = formatBackupTableData(data).sort(
    (a, b) => a.date - b.date
  );

  const seriesArr = data?.bkupctypes.map((bkupctype, index) => {
    const colors = Object.keys(theme.palette.graph) as Array<
      keyof typeof theme.palette.graph
    >;
    const colorIndex = index % colors.length;
    const key = colors[colorIndex];
    return {
      dataKey: bkupctype,
      label: bkupctype,
      color: theme.palette.graph[key],
      stack: 'a'
    };
  }) as Array<{
    dataKey: string;
    label: string;
    color: string;
    stack: string;
  }>;

  return (
    <>
      {isLoading && <Loader sx={{ height: '100%' }} />}
      {!isLoading && formattedData?.length === 0 && (
        <Alert
          severity='warning'
          variant='filled'
          sx={{
            border: '1px solid rgb(229, 115, 115)',
            color: 'white',
            fontWeight: 800,
            marginBottom: '1em',
            marginTop: '1em'
          }}
        >
          There is currently no data available for this chart.
        </Alert>
      )}
      {!isLoading && formattedData?.length > 0 && (
        <BarChart
          sx={{
            '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': {
              stroke: `${theme.palette.neutral.dark500} !important`
            }
          }}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'top', horizontal: 'right' }
            }
          }}
          margin={{ left: 60, bottom: 60 }}
          dataset={formattedData}
          grid={{ vertical: true, horizontal: true }}
          series={seriesArr}
          xAxis={[
            {
              scaleType: 'band',
              dataKey: 'date',
              valueFormatter: (v) => formatTimestamp(v),
              tickLabelStyle: {
                angle: -90,
                textAnchor: 'end',
                dominantBaseline: 'central',
                fontSize: 12,
                fill: '#8FA2B2'
              }
            }
          ]}
        />
      )}
    </>
  );
};

export default BackupsBySizeChart;
