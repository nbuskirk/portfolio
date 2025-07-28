import { Box, SxProps, Theme } from '@mui/material';
import BigLogo from 'assets/logo/fullLogo.png';
import WhiteLogo from 'assets/logo/navbarLogoWhite.svg';
import { useCustomAssets } from 'lib/context/CustomAssetContext';
import { useIntl } from 'react-intl';

interface Props {
  type: 'logo' | 'login' | 'favicon';
  sx?: SxProps<Theme>;
  className?: string;
}

const images = {
  logo: WhiteLogo,
  login: BigLogo,
  favicon: BigLogo
} as const;

/* ThemeIcon
 *
 * Renders Logo from theme: theme.icons
 * Uses local bundle image for 'default'
 * */
const ThemeIcon = ({ type, sx, className }: Props): JSX.Element => {
  const assets = useCustomAssets();
  const intl = useIntl();

  const logoAlt = intl.formatMessage({
    id: 'navbar.logo.alt',
    defaultMessage: 'CyberSense logo. Tagline: Powered by Index Engines'
  });

  return (
    <Box sx={sx}>
      <img
        className={className}
        src={
          assets.icons[type].icon === 'default'
            ? images[type]
            : assets.icons[type].icon
        }
        alt={logoAlt}
        width='100%'
        height='100%'
      />
    </Box>
  );
};

export default ThemeIcon;
