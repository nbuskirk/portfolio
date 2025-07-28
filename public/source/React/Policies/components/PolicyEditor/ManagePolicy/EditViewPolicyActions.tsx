import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { PolicyData } from 'data-hooks/policies/useQueryPolicy';
import { ReactNode, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import useQueryPolicyJobState from 'data-hooks/policies/useQueryPolicyJobState';
import { useUser } from 'utils/context/UserContext';
import Loader from 'components/inc/loader';
import DeletePolicyModal from './DeletePolicyModal';
import usePolicyActions from './usePolicyActions';

interface Props {
  disabled: boolean;
  policyData: PolicyData;
}

const EditViewPolicyActions = ({ policyData, disabled }: Props): ReactNode => {
  const { session } = useUser();
  const theme = useTheme();
  const policyJobStateQuery = useQueryPolicyJobState({
    session,
    policyId: policyData.policy
  });
  const { runPolicy, cancelPolicy, mutateRunPolicy, mutateCancelPolicy } =
    usePolicyActions({ policyData });
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const { showSuccessSnackbar } = useSnackbarContext();

  return (
    <Box>
      <Stack direction='row' spacing={2} alignItems='center' marginBottom='1em'>
        <Button
          disabled={disabled}
          variant='contained'
          color='primary'
          onClick={() => {
            navigate(
              `/dashboard/policies/log?policy=${encodeURI(
                policyData.display_name
              )}`
            );
          }}
        >
          Log
        </Button>
        <Button
          disabled={disabled}
          variant='contained'
          color='primary'
          onClick={() => {
            setModalOpen(true);
          }}
        >
          Delete
        </Button>
        {policyJobStateQuery.isLoading && <Loader />}
        {policyJobStateQuery.isError && (
          <Typography
            fontSize='12px'
            fontWeight='600'
            color={theme.palette.dark.main}
          >
            Policy run status is unavailable
          </Typography>
        )}
        {policyJobStateQuery.isSuccess &&
          policyJobStateQuery.data.policy_state === 'Idle' && (
            <Stack direction='row' alignItems='center' gap='1em'>
              <LoadingButton
                loading={mutateRunPolicy.isPending}
                disabled={disabled}
                variant='contained'
                color='primary'
                onClick={() => {
                  runPolicy().then(() => {
                    showSuccessSnackbar(
                      `Success: ${policyData.display_name} policy start requested!`
                    );
                    navigate('.?started=1', { relative: 'path' });
                  });
                }}
              >
                Run
              </LoadingButton>
              <Typography
                fontSize='12px'
                fontWeight='600'
                color={theme.palette.dark.main}
              >
                Policy is currently idle
              </Typography>
            </Stack>
          )}
        {policyJobStateQuery.isSuccess &&
          (policyJobStateQuery.data.policy_state === 'Running' ||
            policyJobStateQuery.data.policy_state === 'Pending' ||
            policyJobStateQuery.data.policy_state === 'Execute') && (
            <Stack direction='row' alignItems='center' gap='1em'>
              <LoadingButton
                loading={mutateCancelPolicy.isPending}
                disabled={disabled}
                variant='contained'
                color='primary'
                onClick={() => {
                  cancelPolicy().then(() => {
                    showSuccessSnackbar(
                      `Success: ${policyData.display_name} policy stop requested!`
                    );
                    navigate('.?stopped=1', { relative: 'path' });
                  });
                }}
              >
                Stop
              </LoadingButton>
              <Typography
                fontSize='12px'
                fontWeight='600'
                color={theme.palette.dark.main}
              >
                Policy is running
              </Typography>
            </Stack>
          )}
      </Stack>
      <DeletePolicyModal
        theme={theme}
        policyData={policyData}
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
      />
    </Box>
  );
};

export default EditViewPolicyActions;
