import HelpIcon from '@mui/icons-material/Help';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';
import { DOCS_HOST_URI } from 'constants/constants';
import useCustomization from 'data-hooks/config/useCustomization';

const HostTitle = () => {
  const { data: customizations } = useCustomization();
  const disableHelpLinks = customizations?.disable_help_links === '1';

  return (
    <Typography fontSize='16px' fontWeight='600' variant='h1'>
      Hosts
      {!disableHelpLinks && (
        <IconButton
          size='small'
          href={DOCS_HOST_URI}
          target='_blank'
          sx={{ marginBottom: '0.1em' }}
        >
          <HelpIcon color='secondary' sx={{ fontSize: '14px' }} />
        </IconButton>
      )}
    </Typography>
  );
};

export default HostTitle;
