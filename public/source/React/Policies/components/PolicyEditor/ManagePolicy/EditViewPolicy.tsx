import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Grid,
  Stack,
  TextField,
  useTheme
} from '@mui/material';
import { PolicyData } from 'data-hooks/policies/useQueryPolicy';
import { ReactNode } from 'react';
import { LoadingButton } from '@mui/lab';
import { PolicyScheduleData } from 'data-hooks/policies/schedule/schedule.types';
import { useNavigate } from 'react-router-dom';
import useEditViewPolicyState from './useEditViewPolicyState';
import ScheduleInput from '../ScheduleInput';
import ExecLocalForm from '../ExecSpecificForms/ExecLocalForm';
import PolicyDetailsList from '../PolicyDetailsList';
import EditViewPolicyActions from './EditViewPolicyActions';
import ExecNfsForm from '../ExecSpecificForms/ExecNfsForm';
import ExecSmbForm from '../ExecSpecificForms/ExecSmbForm';
import ExecVfmsForm from '../ExecSpecificForms/ExecVmfsForm';
import { buildDetails } from '../util';
import ExecScsiForm from '../ExecSpecificForms/ExecScsiForm';
import { ExecJobType } from '../types';

interface Props {
  policyData: PolicyData;
  policyScheduleData?: PolicyScheduleData;
}

const EditViewPolicy = ({
  policyData,
  policyScheduleData
}: Props): ReactNode => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    state,
    policyNamesIsLoading,
    changeExecSharedState,
    changeExecSpecificState,
    changePolicyDisplayName,
    changePolicySchedule,
    saveChanges,
    resetState
  } = useEditViewPolicyState(policyData, policyScheduleData);

  return (
    <Grid container spacing={2}>
      {state.policyScheduleError !== undefined && (
        <Grid item xs={12}>
          <Alert
            severity='error'
            variant='outlined'
            sx={{
              border: '1px solid rgb(229, 115, 115)',
              color: 'rgb(229, 115, 115)',
              fontWeight: 800
            }}
          >
            Update Schedule Error
            {' - '}
            {state.policyScheduleError.message}
          </Alert>
        </Grid>
      )}
      <Grid item xs={12}>
        <EditViewPolicyActions
          policyData={policyData}
          disabled={state.loading}
        />
      </Grid>
      <Grid item xs={6}>
        <FormControl sx={{ width: '100%' }}>
          <FormLabel>
            Policy Name{' '}
            {policyNamesIsLoading && <CircularProgress size='10px' />}
          </FormLabel>
          <TextField
            autoComplete='off'
            disabled={policyNamesIsLoading || state.loading}
            value={state.policyDisplayName}
            onChange={(e) => {
              changePolicyDisplayName(e.target.value);
            }}
            helperText='Must be unique'
          />
        </FormControl>
        {state.execSpecificState.job_type === 'local' && (
          <ExecLocalForm
            disabled={state.loading}
            execLocalState={state.execSpecificState}
            setExecLocalState={changeExecSpecificState}
            execSharedState={state.execSharedState}
            setExecSharedState={changeExecSharedState}
          />
        )}
        {state.execSpecificState.job_type === 'scsi' && (
          <ExecScsiForm
            disabled={state.loading}
            execScsiState={state.execSpecificState}
            setExecScsiState={changeExecSpecificState}
            execSharedState={state.execSharedState}
            setExecSharedState={changeExecSharedState}
          />
        )}
        {state.execSpecificState.job_type === 'nfs' && (
          <ExecNfsForm
            disabled={state.loading}
            execNfsState={state.execSpecificState}
            setExecNfsState={changeExecSpecificState}
            execSharedState={state.execSharedState}
            setExecSharedState={changeExecSharedState}
          />
        )}
        {state.execSpecificState.job_type === ExecJobType.SMB && (
          <ExecSmbForm
            disabled={state.loading}
            execSmbState={state.execSpecificState}
            setExecSmbState={changeExecSpecificState}
            execSharedState={state.execSharedState}
            setExecSharedState={changeExecSharedState}
          />
        )}
        {state.execSpecificState.job_type === 'vmfs' && (
          <ExecVfmsForm
            disabled={state.loading}
            execVmfsState={state.execSpecificState}
            setExecVmfsState={changeExecSpecificState}
            execSharedState={state.execSharedState}
            setExecSharedState={changeExecSharedState}
          />
        )}
      </Grid>
      <Grid item xs={6}>
        <PolicyDetailsList
          list={buildDetails(policyData.policy_description)}
          header='Storage Connector Information'
          onEdit={() => {
            navigate('./storageconnector', { relative: 'path' });
          }}
        />
        <Box sx={{ marginTop: '1.3em' }}>
          <ScheduleInput
            disabled={state.loading}
            policySchedule={state.policySchedule}
            setPolicySchedule={changePolicySchedule}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Stack
          direction='row'
          alignItems='center'
          justifyContent='flex-end'
          spacing={2}
          sx={{
            borderTop: `1px solid ${theme.palette.neutral.dark400}`,
            padding: '1em 0 0 0'
          }}
        >
          <Button
            disabled={
              (!state.scheduleChanged && !state.policyChanged) || state.loading
            }
            variant='outlined'
            color='primary'
            onClick={resetState}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={state.loading}
            disabled={!state.scheduleChanged && !state.policyChanged}
            variant='contained'
            color='primary'
            onClick={saveChanges}
          >
            Save Changes
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default EditViewPolicy;
