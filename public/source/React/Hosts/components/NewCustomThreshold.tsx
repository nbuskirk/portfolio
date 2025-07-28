import {
  Breadcrumbs,
  IconButton,
  Paper,
  Tooltip,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useIntl } from 'react-intl';
import useCustomization from 'data-hooks/config/useCustomization';
import { NavigateNext } from '@mui/icons-material';
import LinkRouter from 'components/inc/LinkRouter';
import HelpIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';
import { DOCS_THRESHOLD_CONFIG_URI } from 'constants/constants';
import CustomThresholdForm from './Forms/CustomThresholdForm';

const NewCustomThreshold = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const intl = useIntl();
  const { data: customizations } = useCustomization();
  const disableHelpLinks = customizations?.disable_help_links === '1';

  const handleSave = () => {
    navigate('/dashboard/settings/customthresholds');
  };

  const handleCancel = () => {
    navigate('/dashboard/settings/customthresholds');
  };

  return (
    <Paper
      sx={{
        boxShadow: 'none',
        border: `1px solid ${theme.palette.neutral.dark500}`,
        borderRadius: 1,
        padding: '0.5em 1em 1em 1em',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        width: '100%'
      }}
    >
      <Typography fontSize='16px' fontWeight='600' variant='h2' mb={2} mt={1}>
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
      <Breadcrumbs
        sx={{
          '.MuiBreadcrumbs-separator': {
            margin: '4px'
          }
        }}
        separator={<NavigateNext sx={{ fontSize: '14px' }} />}
      >
        <LinkRouter
          underline='hover'
          to='/dashboard/settings/customthresholds'
          sx={{
            fontSize: '12px',
            display: 'flex',
            color: theme.palette.primary.main
          }}
        >
          Custom Thresholds
        </LinkRouter>
        <Typography fontSize='12px' fontWeight='600' color='text.primary'>
          New Custom Threshold
        </Typography>
      </Breadcrumbs>
      <CustomThresholdForm onSave={handleSave} onCancel={handleCancel} />
    </Paper>
  );
};

export default NewCustomThreshold;
