import { Stack } from '@mui/material';
import { styled } from '@mui/system';

const SettingsContentStack = styled(Stack)(({ theme }) => ({
  border: `1px solid ${theme.palette.neutral.dark500}`,
  backgroundColor: theme.palette.white.main,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  borderRadius: '4px',
  minWidth: '300px',
  justifyContent: 'space-between'
}));

export default SettingsContentStack;
