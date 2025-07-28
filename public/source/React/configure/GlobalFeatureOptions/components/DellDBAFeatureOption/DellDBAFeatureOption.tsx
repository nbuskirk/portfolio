import { Box, SwitchProps, Typography } from '@mui/material';
import Loader from 'components/inc/loader';
import useConfigurations from 'data-hooks/useConfigurations';
import useMutateDBAConfiguration from 'data-hooks/useMutateDBAConfiguration';
import { ReactNode, useState } from 'react';
import { useUser } from 'utils/context/UserContext';
import { useQueryClient } from '@tanstack/react-query';
import { CONFIGURATIONS } from 'constants/queryKeys';
import useMutatePolicies from 'data-hooks/policies/useMutatePolicies';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import DBAToggle from './DBAToggle';
import DBADisclaimer from './DBADisclaimer';
import ConfirmDBAResetModal from './ConfirmDBAResetModal';

const DellDBAFeatureOption = (): ReactNode => {
  const { session, canAccess } = useUser();
  const { showSuccessSnackbar, showErrorSnackbar } = useSnackbarContext();
  const queryClient = useQueryClient();

  const configureationQuery = useConfigurations({ session });
  const mutateDBA = useMutateDBAConfiguration({ session });
  const mutatePolicies = useMutatePolicies({ session });

  const [featureIsUpdating, setFeatureIsUpdating] = useState(false);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);

  const handleToggleChange: SwitchProps['onChange'] = (e, checked) => {
    e.preventDefault();
    if (!checked) {
      setConfirmModalIsOpen(true);
    } else {
      setFeatureIsUpdating(true);
      mutateDBA
        .mutateAsync({
          allow_dba_disable: true
        })
        .then(() => {
          return queryClient.invalidateQueries({
            queryKey: [CONFIGURATIONS]
          });
        })
        .then(() => {
          showSuccessSnackbar('Full Scan Option Enabled');
        })
        .finally(() => {
          setFeatureIsUpdating(false);
        });
    }
  };

  const handleCancel = () => {
    setConfirmModalIsOpen(false);
  };

  const handleConfirmReset = () => {
    setFeatureIsUpdating(true);
    Promise.all([
      mutateDBA.mutateAsync({
        allow_dba_disable: false
      }),
      mutatePolicies.mutateAsync({
        payloadToPatch: { dba_disabled: false }
      })
    ])
      .then(() => {
        return queryClient.invalidateQueries({ queryKey: [CONFIGURATIONS] });
      })
      .then(() => {
        showSuccessSnackbar('Full Scan Option Disabled');
      })
      .catch((error) => {
        showErrorSnackbar(
          error instanceof Error
            ? error.message
            : 'An unknown error occured while reseting DBA.'
        );
      })
      .finally(() => {
        setFeatureIsUpdating(false);
        setConfirmModalIsOpen(false);
      });
  };

  return (
    <Box sx={{ padding: '10px 0' }}>
      <Typography fontSize={16} fontWeight={600} lineHeight='22px'>
        Display Per-Policy Control to Force Full Scan
      </Typography>
      {configureationQuery.isLoading && <Loader sx={{ height: 200 }} />}
      {configureationQuery.isSuccess && (
        <Box>
          <DBAToggle
            disabled={
              (!confirmModalIsOpen && featureIsUpdating) || !canAccess('policyjob')
            }
            checked={configureationQuery.data.dba.allow_dba_disable === '1'}
            onChange={handleToggleChange}
          />
          <DBADisclaimer />
        </Box>
      )}
      <ConfirmDBAResetModal
        open={confirmModalIsOpen}
        onCancel={handleCancel}
        onConfirm={handleConfirmReset}
        isSaving={featureIsUpdating}
      />
    </Box>
  );
};

export default DellDBAFeatureOption;
