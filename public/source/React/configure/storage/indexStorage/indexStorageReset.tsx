import { Box, Button, Grid, Stack, Typography, useTheme } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { useState } from 'react';
import {
  createIndex,
  deleteIndex,
  deselectIndex,
  getIndexes,
  selectIndex
} from 'utils/hooks/useIndexes';
import { getConfig } from 'utils/helpers/auth';
import useConfig from 'utils/hooks/useConfig';
import { useUser } from 'utils/context/UserContext';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import { AxiosError } from 'axios';
import IndexStorageResetConfirmModal from './indexStorageResetConfirmModal';
import sx from './indexStorageReset.module.scss';

const IndexStorageReset = () => {
  const theme = useTheme();
  const [resetOpen, setResetOpen] = useState(false);
  const { config, setConfig } = useConfig();
  const { session, canAccess } = useUser();
  const indexmgmt = canAccess('indexmgmt');
  const { showSuccessSnackbar, showAxiosErrorSnackbar } = useSnackbarContext();

  const resetIndex = async () => {
    // eslint-disable-next-line no-console
    console.log(`Resetting Index: ${config.indexid}...`);

    try {
      /* First, Deselect whatever index is active */
      await deselectIndex(config, session);

      /* Second, delete the deselected index */
      await deleteIndex(config, session);

      /* Third, Generate a new name by incrementing indexid by 1 */
      const indexes = await getIndexes(config, session);
      const indexId = indexes?.data[indexes.data.length - 1].indexid;
      const newIndexName = `index_${indexId + 1}`;

      /* Fourth, create a new index with indexName */
      const createResponse: any = await createIndex(
        config,
        session,
        newIndexName
      );
      const newIndexId = createResponse.data.indexid;

      /* Fifth, select index with newly created indexid */
      await selectIndex(config, session, newIndexId);

      /* Lastly, update application config with new config */
      // eslint-disable-next-line no-console
      console.log(`  -> Getting Configuration...`);
      const configRes = await getConfig(session);

      // eslint-disable-next-line no-console
      console.log(`  -> Setting new Configuration...`);
      setConfig(configRes.data);

      showSuccessSnackbar('Success: Reset index');
    } catch (error) {
      showAxiosErrorSnackbar(error as AxiosError);
    }
  };

  return (
    <>
      <Stack className={sx.main}>
        <Typography
          component='h2'
          variant='body2'
          sx={{ fontWeight: 600, marginBottom: '1em' }}
        >
          Reset Index
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: '0.5em' }}>
          This will delete the current index and create a new one.
        </Typography>
        <Typography
          sx={{ color: theme.palette.error.main }}
          className={sx.warning}
        >
          Warning: Resetting the index will delete all CyberSense data. This
          action cannot be reversed.
        </Typography>
      </Stack>
      <Stack>
        <Grid p={2}>
          <Box className={sx.changes}>
            <Button
              disabled={!indexmgmt}
              sx={{
                color: theme.palette.error.main,
                borderColor: theme.palette.error.main,
                '&:hover': {
                  color: theme.palette.error.dark,
                  borderColor: theme.palette.error.dark
                }
              }}
              className={`${sx.footerButton} ${sx.resetIndex}`}
              variant='outlined'
              onClick={() => {
                setResetOpen(!resetOpen);
              }}
              startIcon={
                <WarningIcon
                  className={sx.iconAlert}
                  sx={{ color: theme.palette.error.main }}
                />
              }
            >
              Reset Index
            </Button>
          </Box>
        </Grid>
      </Stack>
      <IndexStorageResetConfirmModal
        visibility={resetOpen}
        setVisibility={setResetOpen}
        resetIndex={resetIndex}
      />
    </>
  );
};

export default IndexStorageReset;
