import { Stack, Box, Typography, Divider, Button, Grid2 } from '@mui/material';
import { useUser } from 'utils/context/UserContext';
import usePhysicalStorageForm from 'utils/hooks/usePhysicalStorageForm';
import Container from 'components/inc/container';
import ScratchStorageForm from 'components/forms/physicalStorageForm/scratchStorageForm';
import { useState } from 'react';
import Loader from 'components/inc/loader';
import AddIcon from '@mui/icons-material/Add';
import sx from './scratchStorageEdit.module.scss';

interface StorageSettings {
  location: string;
  minBytes: string;
  minBytesUnit: string;
  maxBytes: string;
  maxBytesUnit: string;
  uuid: string;
  error?: boolean;
}

const ScratchStorageEdit = () => {
  const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);
  const {
    inputValues,
    initialValues,
    handleInputsChange,
    deleteValue,
    onSubmit,
    appendNewInput,
    deleteTempValue,
    resetValues,
    clearErrors,
    isLoading,
    isValidInput
  } = usePhysicalStorageForm(
    { successCallback: () => setIsLoadingUpdate(false) },
    () => {
      setIsLoadingUpdate(false);
    }
  );
  const addNew = () => {
    clearErrors();
    appendNewInput();
  };

  const { canAccess } = useUser();
  const enginemgmt = canAccess('enginemgmt');

  return (
    <Container>
      <Stack className={sx.stack__main}>
        <Typography className={sx.typography__title}>
          Scratch Storage Settings
        </Typography>
        {isLoading && <Loader sx={{ height: 305 }} />}
        {!isLoading && (
          <>
            <Box className={`verticalScroll ${sx.box__main}`} mt={1}>
              <Stack gap='24px'>
                <ScratchStorageForm
                  values={{
                    inputValues,
                    handleInputsChange,
                    deleteValue,
                    initialValues,
                    deleteTempValue,
                    loader: isLoadingUpdate
                  }}
                />
              </Stack>
            </Box>
            <Box pt='15px' pb='15px'>
              <Divider />
            </Box>
            <Grid2>
              <Box className={sx.changes}>
                {isLoadingUpdate ? (
                  <Box sx={{ position: 'absolute', left: 0 }}>
                    <Loader />
                  </Box>
                ) : (
                  <Button
                    sx={{ position: 'absolute', left: 0 }}
                    variant='outlined'
                    disabled={!enginemgmt}
                    onClick={addNew}
                    startIcon={<AddIcon />}
                  >
                    Add Location
                  </Button>
                )}
                <Button
                  variant='outlined'
                  className={sx.footerButton}
                  disabled={isLoadingUpdate || !enginemgmt}
                  onClick={() => {
                    resetValues();
                  }}
                >
                  Clear Changes
                </Button>
                <Button
                  variant='contained'
                  className={sx.footerButton}
                  onClick={() => {
                    setIsLoadingUpdate(true);
                    onSubmit();
                  }}
                  disabled={
                    !enginemgmt ||
                    isLoadingUpdate ||
                    JSON.stringify(initialValues) ===
                      JSON.stringify(inputValues) ||
                    (JSON.stringify(initialValues) !==
                      JSON.stringify(inputValues) &&
                      !isValidInput())
                  }
                >
                  Save Changes
                </Button>
              </Box>
            </Grid2>
          </>
        )}
      </Stack>
    </Container>
  );
};

export default ScratchStorageEdit;
