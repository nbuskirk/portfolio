import { Box, IconButton, Tooltip, Badge } from '@mui/material';
import { MenuItemData } from 'components/configure/hooks/useSidebarMenuData';

interface NotificationProps {
  data: MenuItemData;
}

const Notification = ({ data }: NotificationProps) => {
  if (!data.notification) return null;

  return (
    <Box ml={1} aria-live='polite'>
      <Tooltip title={data.notification.message}>
        <IconButton
          sx={{ marginRight: '12px' }}
          aria-label={`Notification: ${data.notification.message}`}
          size='small'
        >
          <Badge badgeContent={data.notification.content} color='primary' />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Notification;
