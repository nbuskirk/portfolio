import { Box, Typography } from '@mui/material';
import { FormattedThreshold } from 'components/Hosts/hooks/useThresholdTableData';
import { ThresholdLocation } from 'data-hooks/useDailyActivityAlertLevels';
import { thresholdTableTypeLookup } from 'components/Hosts/utils/dailyGraphConfig';
import {
  decodePartsPerMillionIntoPercent,
  parseHomogenizedType
} from 'components/Hosts/utils/utils';
import SeverityLevelsText from '../SeverityLevelsText';

const ThresholdTableExpandedPanel = ({ row }: { row: FormattedThreshold }) => {
  const { format } = parseHomogenizedType(row?.type ?? '');
  const severityLevels =
    format === 'percent' && row?.severity_levels
      ? decodePartsPerMillionIntoPercent(row?.severity_levels)
      : row?.severity_levels;

  return (
    <Box sx={{ width: '100%', padding: '1em' }}>
      <Typography sx={{ fontSize: '14px' }}>
        <span style={{ fontWeight: 'bold' }}>Type:</span>{' '}
        {(
          thresholdTableTypeLookup[
            row.type as keyof typeof thresholdTableTypeLookup
          ] as string
        )?.toString() || row.type?.replace(/_/g, ' ')}
      </Typography>

      <SeverityLevelsText severityLevels={severityLevels} />

      {row.locations && (
        <Typography sx={{ fontSize: '14px' }}>
          <span style={{ fontWeight: 'bold' }}>Locations:</span>
          {row.locations.map((location: ThresholdLocation) => (
            <Typography sx={{ paddingLeft: '2em', fontSize: '14px' }}>
              Host: {location.host} | Path: {location.path} | Include
              Subdirectories: {location.recursive ? 'Yes' : 'No'}
            </Typography>
          ))}
        </Typography>
      )}
    </Box>
  );
};

export default ThresholdTableExpandedPanel;
