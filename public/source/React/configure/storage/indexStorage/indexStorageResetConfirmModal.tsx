import { Box, TextField, Typography, useTheme } from '@mui/material';
import Modal from 'components/inc/modalContainer/modalContainer';
import { useState } from 'react';
import sx from './indexStorageReset.module.scss';

const IndexStorageResetConfirmModal = ({
  visibility,
  setVisibility,
  resetIndex
}: {
  visibility: boolean;
  setVisibility: (visibility: boolean) => void;
  resetIndex: () => void;
}) => {
  const theme = useTheme();
  const [resetText, setResetText] = useState('');
  const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);
  return (
    <Modal
      visibility={visibility}
      setVisibility={setVisibility}
      title='Confirm Index Reset'
      cancelText='Cancel'
      saveText='Confirm Index Reset'
      saveButtonPalette={{
        bgcolor: theme.palette.error.main,
        borderColor: theme.palette.error.main,
        '&:hover': {
          bgcolor: theme.palette.error.dark,
          borderColor: theme.palette.error.dark
        }
      }}
      saveIsPending={isLoadingUpdate}
      onCancel={() => {
        setVisibility(false);
        if (!isLoadingUpdate) {
          setResetText('');
        }
      }}
      saveDisabled={resetText.toLowerCase() !== 'reset index'}
      onSave={async () => {
        try {
          if (resetText.toLowerCase() === 'reset index') {
            setIsLoadingUpdate(true);
            await resetIndex();
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        } finally {
          setIsLoadingUpdate(false);
          setVisibility(false);
        }
      }}
      width={500}
    >
      <Box
        padding={2}
        sx={{
          borderRadius: '5px',
          backgroundColor: theme.palette.neutral.dark600,
          position: 'relative'
        }}
      >
        <Typography
          sx={{ color: theme.palette.error.main }}
          className={sx.warning}
          pb={1}
          pr={2}
        >
          WARNING: Do you really want to reset your index?
        </Typography>
        <Typography
          fontSize={14}
          sx={{ color: theme.palette.error.main }}
          mb={2}
        >
          {`Resetting your index will permanently DELETE all data for this
            index. To reset the index type 'reset index' and then click Confirm Index Reset.`}
        </Typography>
        <TextField
          id='outlined-basic'
          fullWidth
          variant='outlined'
          value={resetText}
          style={{ marginTop: 0 }}
          onChange={(e) => setResetText(e.target.value)}
          disabled={isLoadingUpdate}
        />
      </Box>
    </Modal>
  );
};

export default IndexStorageResetConfirmModal;
