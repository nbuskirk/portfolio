import useSideBarMenuData from 'components/configure/hooks/useSidebarMenuData';
import { Box } from '@mui/material';
import MenuItem from './MenuItem';

const SidebarMenu = () => {
  const data = useSideBarMenuData();

  return (
    <Box
      id='sidebar'
      data-testid='sidebar-menu'
      component='nav'
      aria-label='Configuration menu'
      sx={{
        width: '250px',
        backgroundColor: '#FFF',
        overflow: 'hidden',
        borderRadius: '4px',
        border: (theme) => `1px solid ${theme.palette.neutral.dark500}`,
        flexShrink: 0,
        flexGrow: 0
      }}
    >
      <Box
        component='ul'
        sx={{
          padding: 0,
          margin: 0,
          listStyle: 'none'
        }}
        role='menu'
      >
        {data.map((item) => (
          <MenuItem key={item.title} data={item} />
        ))}
      </Box>
    </Box>
  );
};

export default SidebarMenu;
