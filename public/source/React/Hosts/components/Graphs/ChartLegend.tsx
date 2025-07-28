import { Box, Typography, useTheme } from '@mui/material';
import { SeverityLevel } from '../Forms/types';

interface ThesholdChartLegendProps {
  levels: SeverityLevel[];
}

const ThesholdChartLegend = ({ levels }: ThesholdChartLegendProps) => {
  const theme = useTheme();

  const legendItems = {
    critical: { label: 'Critical', color: theme.palette.error.main },
    high: { label: 'High', color: theme.palette.error.dark },
    medium: { label: 'Medium', color: theme.palette.warning.dark },
    low: { label: 'Low', color: theme.palette.warning.light },
    csi: {
      label: 'CyberSensitivity Index',
      color: theme.palette.neutral.primary100
    },
    dba: { label: 'DBA Score', color: theme.palette.secondary.main },
    alertlevel: {
      label: 'CyberSensitivity Threshold',
      color: theme.palette.error.main
    }
  };

  // Sort the available levels based on preset order of severity
  const severityOrder: SeverityLevel[] = ['critical', 'high', 'medium', 'low'];
  const sortedLevels = levels.sort(
    (a, b) => severityOrder.indexOf(a) - severityOrder.indexOf(b)
  );

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        justifyContent: 'flex-end',
        alignItems: 'center',
        mt: 1
      }}
    >
      {sortedLevels.map((level) => (
        <Box
          key={level}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              //  borderRadius: '50%',
              backgroundColor: legendItems[level].color
            }}
          />
          <Typography
            sx={{
              fontSize: 10,
              color: '#000000'
            }}
          >
            {legendItems[level].label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ThesholdChartLegend;
