import { Typography } from '@mui/material';
import { CustomThresholdSeverityLevels } from './Forms/types';

interface SeverityLevelProps {
  severityLevels?: CustomThresholdSeverityLevels;
}

const SeverityLevelsText = ({ severityLevels }: SeverityLevelProps) => {
  if (!severityLevels) {
    return null;
  }

  return (
    <Typography sx={{ fontSize: '14px' }}>
      <strong>Severity Levels: </strong>
      <span style={{ paddingLeft: '1em', display: 'block' }}>
        {(['critical', 'high', 'medium', 'low'] as const)
          .filter(
            (severity) =>
              severityLevels[severity].value !== undefined &&
              severityLevels[severity].enabled
          )
          .map(
            (severity) =>
              `${severity.charAt(0).toUpperCase() + severity.slice(1)}: ${
                severityLevels[severity].value
              }`
          )
          .join(' | ')}
      </span>
    </Typography>
  );
};

export default SeverityLevelsText;
