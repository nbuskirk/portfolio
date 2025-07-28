import React, { MutableRefObject, useState } from 'react';
import { baseURL } from 'utils/helpers/api';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { Button, Grid2, TextField, Tooltip, InputLabel } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import sx from './restoreBackup.module.scss';

interface PathProps {
  setProgress: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  setRestore: React.Dispatch<React.SetStateAction<string[]>>;
  restoreMessagesRef: MutableRefObject<string[]>;
  session: string;
  recoverPath: string;
  loading: boolean;
}

const RestorePath: React.FC<PathProps> = ({
  setProgress,
  setLoading,
  setDisplay,
  setRestore,
  restoreMessagesRef,
  session,
  recoverPath,
  loading
}) => {
  const theme = useTheme();
  const [path, setPath] = useState<string>(recoverPath);
  const { showSuccessSnackbar, showErrorSnackbar } = useSnackbarContext();

  const messagesRef = restoreMessagesRef;

  const isSuccessMessage = (messages: string[]): boolean => {
    return (
      messages[messages.length - 1] ===
        'You must sign out and sign back in again.' &&
      messages[messages.length - 2].startsWith('Recovery completed at')
    );
  };

  const isErrorMessage = (message: string): boolean => {
    return message === 'An error has occurred.';
  };

  const getSnackbarSuccessMessage = (messages: string[]): string => {
    return `${messages[messages.length - 2]}. ${messages[messages.length - 1]}`;
  };

  const recover = () => {
    setProgress(true);
    setLoading(true);
    setDisplay(true);
    setRestore([]);
    messagesRef.current = [];
    // Establish connection.
    const eventSource = new EventSourcePolyfill(`${baseURL}/backup/restore`, {
      headers: {
        sessionid: session,
        path
      }
    });
    eventSource.addEventListener('message', (event: any) => {
      // Appending new messages into list.
      setRestore((prev) => [...prev, event.data]);
      messagesRef.current = [...messagesRef.current, event.data];

      if (isSuccessMessage(messagesRef.current)) {
        showSuccessSnackbar(getSnackbarSuccessMessage(messagesRef.current));
      } else if (isErrorMessage(event.data)) {
        showErrorSnackbar('Error: Failed to recover from backup');
      }
    });
    // Closing connection upon error.
    eventSource.addEventListener('error', () => {
      // Not putting any snackbars here as this is executing in both the
      // success and error cases. The EventStream is probably not getting closed correctly by the API.
      setLoading(false);
      eventSource.close();
    });
  };
  return (
    <>
      <Grid2>
        <Grid2
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <InputLabel id='restore-label'>Location of Restored Files</InputLabel>
          <Tooltip
            arrow
            title='Restore the backup and then add the location of the restored files before you start the recovery process.'
            placement='right'
            sx={{ margin: '0em 0em 0.3em 0em' }}
          >
            <InfoIcon color='secondary' />
          </Tooltip>
        </Grid2>
        <TextField
          variant='outlined'
          placeholder='Path'
          fullWidth
          value={path}
          onChange={(e) => {
            setRestore([]);
            setPath(e.target.value);
          }}
        />
      </Grid2>
      <Grid2
        className={sx.button_container}
        sx={{ borderTop: `1px solid ${theme.palette.neutral.dark400}` }}
      >
        <Button
          variant='contained'
          disabled={loading || !path?.trim()}
          onClick={() => {
            if (!loading) recover();
          }}
        >
          Recover
        </Button>
      </Grid2>
    </>
  );
};

export default RestorePath;
