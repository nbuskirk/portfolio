import { Paper, Typography, Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import HelpIcon from '@mui/icons-material/Help';
import { useTheme } from '@mui/material/styles';
import { useIntl } from 'react-intl';
import useCustomization from 'data-hooks/config/useCustomization';
import { DOCS_THRESHOLD_CONFIG_URI } from 'constants/constants';
import { QueryClient } from '@tanstack/react-query';
import { LoaderFunction, redirect } from 'react-router-dom';
import { loadCanAccess } from 'lib/loadCanAccess';
import { Helmet } from 'react-helmet-async';
import InfoIcon from '@mui/icons-material/Info';
import ThresholdTable from './ThresholdTable/ThresholdTable';
import CreateThresholdButton from './CreateThresholdButton';

interface ConfigureProps {
  disabled?: boolean;
}

const ConfigureCustomThresholds = ({ disabled = false }: ConfigureProps) => {
  const theme = useTheme();
  const intl = useIntl();
  const { data: customizations } = useCustomization();
  const disableHelpLinks = customizations?.disable_help_links === '1';

  return (
    <Paper
      sx={{
        boxShadow: 'none',
        border: `1px solid ${theme.palette.neutral.dark500}`,
        borderRadius: 1,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        padding: '1em 1em',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <Helmet>
        <title>Custom Thresholds</title>
      </Helmet>

      <Typography fontSize='16px' fontWeight='600' variant='h2' mb={2}>
        Custom Thresholds
        <Tooltip
          title={intl.formatMessage({
            id: 'settings.advanced.customthresholds.title.tooltip',
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
                sx={{ marginBottom: '0.2em' }}
                size='small'
                href={DOCS_THRESHOLD_CONFIG_URI}
                target='_blank'
              >
                <HelpIcon color='secondary' sx={{ fontSize: '14px' }} />
              </IconButton>
            )}
          </span>
        </Tooltip>
      </Typography>
      {disabled ? (
        <Tooltip title='No Permission'>
          <span>
            <CreateThresholdButton disabled={disabled} />
          </span>
        </Tooltip>
      ) : (
        <CreateThresholdButton disabled={disabled} />
      )}
      <ThresholdTable />
    </Paper>
  );
};

export default ConfigureCustomThresholds;

export const customThresholdConfigureLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const canAccess = await loadCanAccess(queryClient);
    if (!canAccess('thresholdmgmt')) {
      return redirect('..');
    }
    return null;
  };
