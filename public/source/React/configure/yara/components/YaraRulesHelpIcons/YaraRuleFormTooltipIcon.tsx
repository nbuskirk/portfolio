import { Tooltip, useTheme } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useIntl } from 'react-intl';

const YaraRuleFormTooltipIcon = () => {
  const theme = useTheme();
  const intl = useIntl();

  return (
    <Tooltip
      arrow
      title={intl.formatMessage({ id: 'yararules.form.tooltip' })}
      placement='right'
    >
      <InfoIcon
        sx={{
          fontSize: '18px',
          color: theme.palette.secondary.main,
          marginLeft: '5px'
        }}
      />
    </Tooltip>
  );
};

export default YaraRuleFormTooltipIcon;
