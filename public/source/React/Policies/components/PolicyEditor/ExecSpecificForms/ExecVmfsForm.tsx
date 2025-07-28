import { Box, Button, Stack, Typography, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SharedInputs from './SharedInputs';
import VirtualMachineForm from './VirtualMachineForm';
import { ExecSharedState, ExecVmfsState } from '../types';
import { newVirtualMachineState } from '../util';

type SetExecSharedState = <T extends keyof ExecSharedState>(
  memberName: T,
  memberValue: ExecSharedState[T]
) => void;

type PartialExecVmfs = Omit<ExecVmfsState, 'job_type'>;
type SetExecVmfsState = <T extends keyof PartialExecVmfs>(
  memberName: T,
  memberValue: PartialExecVmfs[T]
) => void;

interface Props {
  disabled?: boolean;
  execVmfsState: ExecVmfsState;
  setExecVmfsState: SetExecVmfsState;
  execSharedState: ExecSharedState;
  setExecSharedState: SetExecSharedState;
}

const ExecVfmsForm = ({
  disabled = false,
  execSharedState,
  setExecSharedState,
  execVmfsState,
  setExecVmfsState
}: Props): React.ReactNode => {
  const theme = useTheme();
  return (
    <Stack direction='column' spacing={2}>
      <SharedInputs
        disabled={disabled}
        execSharedState={execSharedState}
        setExecSharedState={setExecSharedState}
      />
      <Box>
        <Box sx={{ marginBottom: '1em' }}>
          <Typography fontSize='14px' fontWeight={600}>
            Virtual Machines
          </Typography>
          <Typography fontSize='14px' fontWeight={400}>
            Add rules to include or exclude specific Virtual Machines from
            scanning (optional)
          </Typography>
        </Box>
        {execVmfsState.virtualMachines.length > 0 && (
          <Stack gap={1} sx={{ marginBottom: '0.5em' }}>
            {execVmfsState.virtualMachines.map((vm, index) => (
              <VirtualMachineForm
                key={vm.key}
                state={vm}
                setState={(nextVmState) => {
                  // If the form opens, close all other open forms
                  const allVms =
                    nextVmState.isOpen !== vm.isOpen && nextVmState.isOpen
                      ? execVmfsState.virtualMachines.map((s) => ({
                          ...s,
                          isOpen: false
                        }))
                      : execVmfsState.virtualMachines;
                  setExecVmfsState('virtualMachines', [
                    ...allVms.slice(0, index),
                    nextVmState,
                    ...allVms.slice(index + 1)
                  ]);
                }}
                onDelete={() => {
                  setExecVmfsState('virtualMachines', [
                    ...execVmfsState.virtualMachines.slice(0, index),
                    ...execVmfsState.virtualMachines.slice(index + 1)
                  ]);
                }}
              />
            ))}
          </Stack>
        )}
        <Button
          variant='outlined'
          sx={{ paddingRight: '15px' }}
          onClick={() => {
            const allVms = execVmfsState.virtualMachines.map((s) => ({
              ...s,
              isOpen: false
            }));
            const newVm = newVirtualMachineState();
            setExecVmfsState('virtualMachines', [...allVms, newVm]);
          }}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
      </Box>
    </Stack>
  );
};

export default ExecVfmsForm;
