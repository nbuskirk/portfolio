import { Box, Divider, Stack, Typography } from '@mui/material';
import { QueryClient } from '@tanstack/react-query';
import { LoaderFunction, redirect } from 'react-router-dom';
import { loadCanAccess } from 'lib/loadCanAccess';
import useCustomization, {
  getCustomizationQuery
} from 'data-hooks/config/useCustomization';
import IndexStorageReset from '../storage/indexStorage/indexStorageReset';
import SettingsContentStack from './SettingsContentStack';
import ResetThresholds from './ResetThresholds';
import ResetYaraRules from './ResetYaraRules';

const GlobalResets = () => {
  const { data: customization } = useCustomization();

  return (
    <SettingsContentStack>
      <Stack
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '15px 15px 0',
          gap: '15px'
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            lineHeight: 1.2
          }}
          component='h1'
          variant='body1'
        >
          Global Resets
        </Typography>
      </Stack>
      <Stack sx={{ padding: '15px 15px 0 15px' }}>
        {customization?.disable_index_reset !== '1' && (
          <>
            <IndexStorageReset />
            <Divider />
          </>
        )}

        <Box
          sx={{
            paddingTop: customization?.disable_index_reset === '1' ? 0 : '1em'
          }}
        >
          <ResetYaraRules />
        </Box>

        <Divider />

        <Box
          sx={{
            paddingTop: '1em'
          }}
        >
          <ResetThresholds />
        </Box>
      </Stack>
    </SettingsContentStack>
  );
};

export default GlobalResets;

export const gloabalResetsLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const [, canAccess] = await Promise.all([
      queryClient.ensureQueryData(getCustomizationQuery()),
      loadCanAccess(queryClient)
    ]);

    if (
      !(
        canAccess('indexmgmt') ||
        canAccess('thresholdmgmt') ||
        canAccess('alertmgmt')
      )
    ) {
      return redirect('..');
    }
    return null;
  };
