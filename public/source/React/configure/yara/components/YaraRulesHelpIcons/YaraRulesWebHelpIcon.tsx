import { IconButton, Tooltip, useTheme } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';
import { useIntl } from 'react-intl';
import useCustomization from 'data-hooks/config/useCustomization';

const YaraRulesWebHelpIcon = () => {
  const theme = useTheme();
  const intl = useIntl();
  const { data: customizations } = useCustomization();
  const disableHelpLinks = customizations?.disable_help_links === '1';

  return (
    <Tooltip
      title={intl.formatMessage({
        id: 'settings.advanced.yararules.title.tooltip',
        defaultMessage: 'web help'
      })}
      placement='top'
    >
      <span>
        {disableHelpLinks ? (
          <InfoIcon
            color='secondary'
            sx={{ fontSize: '14px', margin: '0 0 -0.1em 0.3em' }}
          />
        ) : (
          <IconButton
            href='/docs/webhelp/repository/settings_page/yara_rulesets.html'
            target='_blank'
          >
            <HelpIcon
              sx={{
                fontSize: '18px',
                color: theme.palette.secondary.main
              }}
            />
          </IconButton>
        )}
      </span>
    </Tooltip>
  );
};

export default YaraRulesWebHelpIcon;
