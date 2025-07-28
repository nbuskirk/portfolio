import {
  Alert,
  Box,
  Button,
  Stack,
  Step,
  StepLabel,
  Stepper,
  useTheme
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { PolicyData } from 'data-hooks/policies/useQueryPolicy';
import { useNavigate } from 'react-router-dom';
import { FormEventHandler, ReactNode } from 'react';
import { StorageConnectorStepResponse } from 'data-hooks/policies/useQueryEditStorageConnectorStep';
import useEditStorageConnectorState from './useEditStorageConnectorState';
import FormRenderer from '../../FormBuilder/FormRenderer';
import PolicyDetailsList from '../PolicyDetailsList';
import { buildDetails } from '../util';
import TransitionModalMember from '../../FormBuilder/members/TransitionModalMember';

interface Props {
  policyData: PolicyData;
  editStorageConnectorStepData: StorageConnectorStepResponse;
}

const EditStorageConnectorDetails = ({
  policyData,
  editStorageConnectorStepData
}: Props): ReactNode => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { state, next, back, changeMemberData, closeTransitionModal } =
    useEditStorageConnectorState(policyData, editStorageConnectorStepData);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    next();
  };

  return (
    <Stack spacing={2} marginTop={1}>
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
            <StepLabel>Configure Storage Connector</StepLabel>
          </Step>
          <Step>
            <StepLabel>Review and Save</StepLabel>
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
            {state.stagedTransitionModalSchema !== undefined && (
                <TransitionModalMember
                  {...state.modalTransitionState}
                  close={closeTransitionModal}
                  {...state.stagedTransitionModalSchema.props}
                />
              )}
            {state.step === 0 && (
              <>
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
                    This module has no interactive configuration steps required.
                    Hit next to proceed.
                  </Alert>
                )}
                {!state.noTemplateConfig &&
                  state.template !== undefined &&
                  state.payload && (
                    <FormRenderer
                      disabled={state.loading}
                      memberData={state.payload}
                      changeMemberData={changeMemberData}
                      jsonTemplateSchema={state.template}
                    />
                  )}
              </>
            )}

            {state.step === 1 && (
              <PolicyDetailsList
                header='Storage Connector Information'
                list={buildDetails(state.policyDescription!)}
              />
            )}
          </>
        </Box>
        <Box
          sx={{
            padding: '1em'
          }}
        >
          <Stack direction='row' spacing={0.5}>
            <Button
              disabled={
                state.loading ||
                (state.step === 0 &&
                  state.template !== undefined &&
                  state.template.origin) ||
                state.noTemplateConfig
              }
              onClick={back}
              variant='outlined'
            >
              Back
            </Button>
            <Button
              onClick={() => {
                navigate('..', { relative: 'path' });
              }}
              disabled={state.loading}
              variant='outlined'
              sx={{
                marginLeft: 'auto !important'
              }}
            >
              Cancel
            </Button>
            <LoadingButton
              disabled={state.criticalError !== undefined}
              loading={state.loading}
              variant='contained'
              type='submit'
            >
              {state.step === 1 ? 'Save' : 'Next'}
            </LoadingButton>
          </Stack>
        </Box>
      </form>
    </Stack>
  );
};

export default EditStorageConnectorDetails;
