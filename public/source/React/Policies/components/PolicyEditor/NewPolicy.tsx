import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  FormControl,
  FormLabel,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import { FormEventHandler } from 'react';
import usePolicyNames from 'components/Policies/hooks/usePolicyNames';
import { NavigateNext } from '@mui/icons-material';
import LinkRouter from 'components/inc/LinkRouter';
import useStorageConnectors from 'components/Policies/hooks/useStorageConnectors';
import FormRenderer from '../FormBuilder/FormRenderer';
import useNewPolicyState from './useNewPolicyState';
import ExecLocalForm from './ExecSpecificForms/ExecLocalForm';
import ExecNfsForm from './ExecSpecificForms/ExecNfsForm';
import ExecSmbForm from './ExecSpecificForms/ExecSmbForm';
import ExecVfmsForm from './ExecSpecificForms/ExecVmfsForm';
import { policyDetailsList } from './util';
import PolicyDetailsList from './PolicyDetailsList';
import ScheduleInput from './ScheduleInput';
import StorageConnectorSelector from './StorageConnectorSelector';
import ExecScsiForm from './ExecSpecificForms/ExecScsiForm';
import { ExecJobType } from './types';
import TransitionModalMember from '../FormBuilder/members/TransitionModalMember';

const NewPolicy = () => {
  const theme = useTheme();
  const storageConnectorsQuery = useStorageConnectors();
  const { policyNamesIsLoading } = usePolicyNames();
  const navigate = useNavigate();
  const {
    state,
    setPolicyName,
    setStorageConnector,
    next,
    back,
    changeMemberData,
    changeExecSpecificState,
    changeExecSharedState,
    changePolicySchedule,
    closeTransitionModal
  } = useNewPolicyState();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    next();
  };

  const hasCriticalError = state.criticalError !== undefined;
  const storageConnectorsError = storageConnectorsQuery.isError
    ? (storageConnectorsQuery.error as Error)
    : undefined;

  return (
    <Grid container spacing={2} marginTop={1}>
      <Grid item xs={12}>
        <Paper
          sx={{
            boxShadow: 'none'
          }}
        >
          <Box
            sx={{
              borderBottom: `1px solid ${theme.palette.neutral.dark400}`,
              padding: '1em'
            }}
          >
            <Typography fontSize='16px' fontWeight='600'>
              Create New Policy
            </Typography>
            <Breadcrumbs
              sx={{
                '.MuiBreadcrumbs-separator': {
                  margin: '4px'
                }
              }}
              separator={<NavigateNext sx={{ fontSize: '14px' }} />}
            >
              <LinkRouter
                underline='hover'
                to='..'
                sx={{
                  fontSize: '12px',
                  display: 'flex',
                  color: theme.palette.primary.main
                }}
              >
                Policies
              </LinkRouter>
              <Typography fontSize='12px' fontWeight='600' color='text.primary'>
                {state.step === 0 ? 'Create New Policy' : state.policyName}
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box
            sx={{
              padding: '1em',

              borderBottom: `1px solid ${theme.palette.neutral.dark400}`
            }}
          >
            <Stepper
              activeStep={state.step}
              alternativeLabel
              sx={{
                '.MuiStepLabel-label.Mui-active': {
                  fontWeight: 'bold'
                }
              }}
            >
              <Step>
                <StepLabel>Name and Storage Connector</StepLabel>
              </Step>
              <Step>
                <StepLabel>Configure Storage Connector</StepLabel>
              </Step>
              <Step>
                <StepLabel>Policy Details</StepLabel>
              </Step>
              <Step>
                <StepLabel>Review and Create</StepLabel>
              </Step>
            </Stepper>
          </Box>
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                padding: '1em',
                borderBottom: `1px solid ${theme.palette.neutral.dark400}`
              }}
            >
              <>
                {state.policyError !== undefined && (
                  <Alert
                    severity='error'
                    variant='outlined'
                    sx={{
                      border: '1px solid rgb(229, 115, 115)',
                      color: 'rgb(229, 115, 115)',
                      fontWeight: 800,
                      marginBottom: '1em'
                    }}
                  >
                    Save Policy Error - {state.policyError.message}
                  </Alert>
                )}
                {state.stagedTransitionModalSchema !== undefined && (
                  <TransitionModalMember
                    {...state.modalTransitionState}
                    close={closeTransitionModal}
                    {...state.stagedTransitionModalSchema.props}
                  />
                )}
                {state.step === 0 && (
                  <Stack direction='column' spacing={0.5}>
                    <FormControl sx={{ width: '100%' }}>
                      <FormLabel>
                        Name{' '}
                        {policyNamesIsLoading && (
                          <CircularProgress size='10px' />
                        )}
                      </FormLabel>
                      <TextField
                        required
                        autoComplete='off'
                        disabled={policyNamesIsLoading}
                        value={state.policyName}
                        onChange={(event) => setPolicyName(event.target.value)}
                        error={state.policyNameError !== undefined}
                        helperText={
                          state.policyNameError !== undefined
                            ? state.policyNameError.message
                            : undefined
                        }
                      />
                    </FormControl>
                    <StorageConnectorSelector
                      isLoading={storageConnectorsQuery.isLoading}
                      storageConnectors={storageConnectorsQuery.data ?? []}
                      selectedStorageConnector={state.storageConnector}
                      setSelectedStorageConnector={setStorageConnector}
                      error={
                        storageConnectorsError || state.storageConnectorError
                      }
                    />
                  </Stack>
                )}
                {state.criticalError !== undefined && (
                  <Alert
                    severity='error'
                    variant='outlined'
                    sx={{
                      border: '1px solid rgb(229, 115, 115)',
                      color: 'rgb(229, 115, 115)',
                      fontWeight: 800,
                      marginBottom: '1em'
                    }}
                  >
                    Unexpected Error: {state.criticalError.message}
                  </Alert>
                )}
                {state.step === 1 && (
                  <>
                    {state.initialLoad && (
                      <Stack direction='column' spacing={2}>
                        <Skeleton
                          variant='rectangular'
                          width='100%'
                          height='40px'
                        />
                        <Skeleton
                          variant='rectangular'
                          width='100%'
                          height='40px'
                        />
                        <Skeleton
                          variant='rectangular'
                          width='100%'
                          height='40px'
                        />
                      </Stack>
                    )}
                    {state.formError !== undefined && (
                      <Alert
                        severity='error'
                        variant='outlined'
                        sx={{
                          border: '1px solid rgb(229, 115, 115)',
                          color: 'rgb(229, 115, 115)',
                          fontWeight: 800,
                          marginBottom: '1em'
                        }}
                      >
                        {state.formError.message}
                      </Alert>
                    )}
                    {state.noTemplateConfig && (
                      <Alert severity='info' variant='outlined'>
                        This storage connector has no interactive configuration
                        steps required. Hit next to proceed.
                      </Alert>
                    )}
                    {!state.initialLoad &&
                      !state.noTemplateConfig &&
                      state.template !== undefined &&
                      state.payload !== undefined && (
                        <FormRenderer
                          disabled={state.loading}
                          memberData={state.payload}
                          changeMemberData={changeMemberData}
                          jsonTemplateSchema={state.template}
                        />
                      )}
                  </>
                )}
                {state.step === 2 && (
                  <Stack direction='column' spacing={0.5}>
                    {state.execSpecificState!.job_type === 'local' && (
                      <ExecLocalForm
                        execLocalState={state.execSpecificState!}
                        setExecLocalState={changeExecSpecificState}
                        execSharedState={state.execSharedState!}
                        setExecSharedState={changeExecSharedState}
                      />
                    )}
                    {state.execSpecificState!.job_type === 'scsi' && (
                      <ExecScsiForm
                        disabled={state.loading}
                        execScsiState={state.execSpecificState!}
                        setExecScsiState={changeExecSpecificState}
                        execSharedState={state.execSharedState!}
                        setExecSharedState={changeExecSharedState}
                      />
                    )}
                    {state.execSpecificState!.job_type === 'nfs' && (
                      <ExecNfsForm
                        execNfsState={state.execSpecificState!}
                        setExecNfsState={changeExecSpecificState}
                        execSharedState={state.execSharedState!}
                        setExecSharedState={changeExecSharedState}
                      />
                    )}
                    {state.execSpecificState!.job_type === ExecJobType.SMB && (
                      <ExecSmbForm
                        execSmbState={state.execSpecificState!}
                        setExecSmbState={changeExecSpecificState}
                        execSharedState={state.execSharedState!}
                        setExecSharedState={changeExecSharedState}
                      />
                    )}
                    {state.execSpecificState!.job_type === 'vmfs' && (
                      <ExecVfmsForm
                        execVmfsState={state.execSpecificState!}
                        setExecVmfsState={changeExecSpecificState}
                        execSharedState={state.execSharedState!}
                        setExecSharedState={changeExecSharedState}
                      />
                    )}
                  </Stack>
                )}
                {state.step === 3 && (
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <PolicyDetailsList
                        header='Policy and Storage Connector Details'
                        list={policyDetailsList(
                          state,
                          storageConnectorsQuery.data!
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <ScheduleInput
                        disabled={state.loading}
                        policySchedule={state.policySchedule}
                        setPolicySchedule={changePolicySchedule}
                      />
                    </Grid>
                  </Grid>
                )}
              </>
            </Box>
            <Box sx={{ padding: '1em' }}>
              <Stack direction='row' spacing={0.5}>
                <Button
                  disabled={
                    hasCriticalError || state.step === 0 || state.loading
                  }
                  onClick={back}
                  variant='outlined'
                >
                  Back
                </Button>
                <Button
                  onClick={() => {
                    navigate('/dashboard/policies');
                  }}
                  variant='outlined'
                  disabled={state.loading}
                  sx={{
                    marginLeft: 'auto !important'
                  }}
                >
                  Cancel
                </Button>
                <LoadingButton
                  disabled={hasCriticalError}
                  loading={state.loading}
                  variant='contained'
                  type='submit'
                >
                  {state.step === 3 ? 'Create New Policy' : 'Next'}
                </LoadingButton>
              </Stack>
            </Box>
          </form>
          {false && ( // make true to show state machine
            <Grid item xs={12}>
              <Typography>State Machine</Typography>
              <pre>{JSON.stringify(state, null, 2)}</pre>
            </Grid>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default NewPolicy;
