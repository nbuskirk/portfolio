import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  useTheme
} from '@mui/material';
import useMutateDeltaBlock from 'data-hooks/policies/useMutateDeltaBlock';
import { ReactNode, useState } from 'react';
import { useUser } from 'utils/context/UserContext';
import { useQueryClient } from '@tanstack/react-query';

const DeltaBlock = ({
  value,
  name
}: {
  value: string;
  name: string;
}): ReactNode => {
  const { session } = useUser();
  const queryClient = useQueryClient();
  const { mutateAsync, error, isError, isPending } = useMutateDeltaBlock({
    session
  });
  const [dba, setDba] = useState(
    value === 'Force Full Scan' ? 'Force Full Scan' : 'Use CR Setting'
  );

  const [modalOpen, setModalOpen] = useState(false);
  const theme = useTheme();
  const onChange = async (event: SelectChangeEvent) => {
    if (event.target.value === 'Force Full Scan') {
      setDba(event.target.value);
      setModalOpen(true);
    } else {
      setDba(event.target.value);
      await mutateAsync({
        name,
        payloadToPatch: {
          dba_disabled: event.target.value === 'Force Full Scan'
        }
      }).finally(() => {
        queryClient.invalidateQueries({ queryKey: ['POLICIES'] });
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <FormControl fullWidth size='small'>
        <Select
          id='delta-block'
          value={dba}
          onChange={onChange}
          inputProps={{ 'aria-label': 'Without label' }}
          displayEmpty
          SelectDisplayProps={{
            style: { paddingTop: 2, paddingBottom: 2 }
          }}
        >
          <MenuItem value='Use CR Setting'>Use CR Setting</MenuItem>
          <MenuItem value='Force Full Scan'>Force Full Scan</MenuItem>
        </Select>
      </FormControl>
      <Dialog disableEscapeKeyDown open={modalOpen} fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid #ccc' }}>
          <Typography fontWeight={600}>Force Full Scan</Typography>
        </DialogTitle>
        <DialogContent sx={{ margin: '2em 0 2em 0' }}>
          <Typography fontSize={14} color={theme.palette.warning.main}>
            Are you sure you want to force full scanning? This will cause
            CyberSense to perform a full index of all virtual machines in this
            policy. It may have a serious negative impact on performance.
          </Typography>

          {isError && (
            <Alert
              severity='error'
              variant='filled'
              sx={{
                marginTop: '1em',
                border: '1px solid rgb(229, 115, 115)',
                color: 'white',
                fontWeight: 800
              }}
            >
              <Typography fontSize={14}>
                {error instanceof Error && error?.message}
              </Typography>
            </Alert>
          )}
          {isPending && (
            <Typography fontSize={14} marginTop={1}>
              Loading...
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: '1em 2em', borderTop: '1px solid #ccc' }}>
          <Button
            variant='text'
            onClick={() => {
              setModalOpen(!modalOpen);
              setDba(
                dba === 'Use CR Setting' ? 'Force Full Scan' : 'Use CR Setting'
              );
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={async () => {
              await mutateAsync({
                name,
                payloadToPatch: {
                  dba_disabled: dba === 'Force Full Scan'
                }
              }).finally(() => {
                setModalOpen(!modalOpen);
                queryClient.invalidateQueries({ queryKey: ['POLICIES'] });
              });
            }}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeltaBlock;
