import { useTheme } from '@mui/material/styles';
import { Typography, Grid, Stack, Box } from '@mui/material';
import { useUser } from 'utils/context/UserContext';
import { useState, useRef } from 'react';
import Modal from 'components/inc/modalContainer/modalContainer';
import { useRestorePath } from 'data-hooks/useRestore';
import Loader from 'components/inc/loader';
import sx from './restoreBackup.module.scss';
import RestorePath from './RestorePath';
import { QueryClient } from '@tanstack/react-query';
import { LoaderFunction, redirect } from 'react-router-dom';
import { loadCanAccess } from 'lib/loadCanAccess';

const RestoreBackup = () => {
  const theme = useTheme();
  const { session } = useUser();
  const [loading, setLoading] = useState(false);
  const [display, setDisplay] = useState(false);
  const [progress, setProgress] = useState(false);

  const { data: Path, isLoading } = useRestorePath(session);
  const [restore, setRestore] = useState<string[]>([]);
  const restoreMessagesRef = useRef(restore);
  const containerRef = useRef(null);

  return (
    <Box
      className={sx.restoreContainer}
      sx={{ border: `1px solid ${theme.palette.neutral.dark400}` }}
    >
      <Modal
        setVisibility={setProgress}
        visibility={progress}
        title='Recover from Backup'
        saveText='Ok'
        cancelText='Cancel'
        onCancel={() => {
          setProgress(true);
          if (!loading) {
            setProgress(false);
          }
        }}
        saveDisabled={loading}
        width='772px'
        onSave={() => {
          if (!loading) {
            setProgress(false);
          }
        }}
      >
        {loading && <Loader sx={{ height: 240 }} />}
        {!loading && restore.length > 0 && (
          <>
            <Typography className={sx.title} display='block'>
              {restore[restore.length - 1]}
            </Typography>

            <Grid
              ref={containerRef}
              className={`${!display ? sx.hidden : sx.visible} ${
                sx.messageContainer
              }`}
              sx={{
                border: `1px solid ${theme.palette.neutral.dark400}`,
                backgroundColor: `${theme.palette.neutral.primary600}`
              }}
            >
              {restore.slice(0, restore.length - 1).map((str, index) => (
                <Grid
                  ref={(element) => {
                    if (index === restore.length - 1 && element) {
                      element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'end'
                      });
                    }
                  }}
                >
                  {str}
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Modal>
      <Box>
        <Typography className={sx.title} display='block'>
          Recover from Backup
        </Typography>
        {isLoading && <Loader sx={{ height: 185 }} />}
        {!isLoading && (
          <Stack direction='column' spacing={2.5} className={sx.container}>
            <RestorePath
              setProgress={setProgress}
              setLoading={setLoading}
              setDisplay={setDisplay}
              setRestore={setRestore}
              restoreMessagesRef={restoreMessagesRef}
              session={session}
              recoverPath={Path?.data?.path ? Path?.data?.path : ''}
              loading={loading || isLoading}
            />
          </Stack>
        )}
      </Box>
    </Box>
  );
};

export default RestoreBackup;

export const restoreBackupLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const canAccess = await loadCanAccess(queryClient);
    if (!canAccess('seebackup')) {
      return redirect('..');
    }
    return null;
  };
