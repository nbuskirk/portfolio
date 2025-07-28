import { Box, Typography } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';
import { MenuItemData } from 'components/configure/hooks/useSidebarMenuData';
import Notification from './Notification';

interface MenuHeaderProps {
  data: MenuItemData;
}

const MenuHeader = ({ data }: MenuHeaderProps) => {
  const theme = useTheme();

  return (
    <Box
      data-testid={data.testId}
      sx={{
        padding: '1.1em 0 0.8em 1em',
        borderTopLeftRadius: '2px',
        borderTopRightRadius: '2px',
        display: 'flex',
        fontSize: '14px',
        fontWeight: 700,
        borderBottom: `1px solid ${theme.palette.neutral.dark500}`
      }}
    >
      <Box sx={{ paddingRight: '1em', cursor: 'default' }}>
        <SettingsIcon aria-hidden='true' />
      </Box>
      <Box
        display='flex'
        alignItems='center'
        sx={{ position: 'relative', top: '-3px' }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: '16px' }}>
          {data.title}
        </Typography>
        {data.notification && <Notification data={data} />}
      </Box>
    </Box>
  );
};

export default MenuHeader;
