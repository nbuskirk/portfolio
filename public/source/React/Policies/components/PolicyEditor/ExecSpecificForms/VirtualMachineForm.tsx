import {
  Stack,
  TextField,
  Select,
  MenuItem,
  useTheme,
  FormControl,
  Box,
  InputLabel,
  IconButton
} from '@mui/material';
import { ReactNode } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { VirtualMachineState } from '../types';

type SetVirtualMachineState = (
  virtualMachineState: VirtualMachineState
) => void;

interface Props {
  disabled?: boolean;
  setState: SetVirtualMachineState;
  state: VirtualMachineState;
  onDelete: () => void;
}

const VirtualMachineForm = ({
  disabled = false,
  setState,
  state,
  onDelete
}: Props): ReactNode => {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        padding: '0',
        borderRadius: '3px'
      }}
      gap={1}
    >
      <Box display='flex' gap={3}>
        <TextField
          label='Datastore UUID (optional)'
          style={{ width: '300px' }}
          name='datastore_id'
          value={state.vm.identifiers.datastore_id}
          onChange={(event) => {
            setState({
              ...state,
              vm: {
                ...state.vm,
                identifiers: {
                  ...state.vm.identifiers,
                  datastore_id: event.target.value
                }
              }
            });
          }}
        />
        <FormControl style={{ width: '300px' }}>
          <InputLabel id='scan-rule'>Scan Rule</InputLabel>
          <Select
            labelId='scan-rule'
            value={state.include ? 'include' : 'exclude'}
            onChange={(e) => {
              setState({
                ...state,
                include: e.target.value === 'include'
              });
            }}
          >
            <MenuItem value='include'>Include in Scan</MenuItem>
            <MenuItem value='exclude'>Exclude from Scan</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={{ width: '300px' }}>
          <InputLabel id='vm-type'>Virtual Machine ID</InputLabel>
          <Select
            labelId='vm-type'
            value={state.variant}
            onChange={(e) => {
              setState({
                ...state,
                vm: {
                  ...state.vm,
                  identifiers: {
                    ...state.vm.identifiers,
                    name: '',
                    uuid: ''
                  }
                },
                variant: e.target.value as VirtualMachineState['variant']
              });
            }}
          >
            <MenuItem value='name'>Virtual Machine Names</MenuItem>
            <MenuItem value='uuid'>Virtual Machine UUIDs</MenuItem>
          </Select>
        </FormControl>
        {state.variant === 'uuid' && (
          <TextField
            label='Virtual Machine UUID'
            style={{ width: '300px' }}
            name='uuid'
            value={state.vm.identifiers.uuid}
            onChange={(event) => {
              setState({
                ...state,
                vm: {
                  ...state.vm,
                  identifiers: {
                    ...state.vm.identifiers,
                    uuid: event.target.value
                  }
                }
              });
            }}
          />
        )}
        {state.variant === 'name' && (
          <TextField
            label='Virtual Machine Name'
            style={{ width: '300px' }}
            name='name'
            value={state.vm.identifiers.name}
            onChange={(event) => {
              setState({
                ...state,
                vm: {
                  ...state.vm,
                  identifiers: {
                    ...state.vm.identifiers,
                    name: event.target.value
                  }
                }
              });
            }}
          />
        )}
        <IconButton
          disabled={disabled}
          style={{
            marginTop: '15px'
          }}
          color='primary'
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Stack>
  );
};

export default VirtualMachineForm;
