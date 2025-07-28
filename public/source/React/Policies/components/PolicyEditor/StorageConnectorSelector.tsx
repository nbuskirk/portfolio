import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps
} from '@mui/material';
import { StorageConnectors } from 'components/Policies/hooks/useStorageConnectors';
import { ReactNode, useId } from 'react';

interface Props {
  required?: boolean;
  storageConnectors: StorageConnectors;
  selectedStorageConnector: string;
  setSelectedStorageConnector: (storageConnector: string) => void;
  isLoading: boolean;
  error?: { message: string };
}

const StorageConnectorSelector = ({
  required = false,
  storageConnectors,
  selectedStorageConnector,
  setSelectedStorageConnector,
  isLoading,
  error
}: Props): ReactNode => {
  const id = useId();
  const handleChange: SelectProps<string>['onChange'] = (event) => {
    setSelectedStorageConnector(event.target.value);
  };
  return (
    <FormControl fullWidth error={error !== undefined} required={required}>
      <InputLabel id={id}>
        Storage Connector {isLoading && <CircularProgress size='10px' />}
      </InputLabel>
      <Select
        labelId={id}
        value={selectedStorageConnector}
        onChange={handleChange}
        disabled={isLoading}
      >
        {storageConnectors.map((s) => (
          <MenuItem key={s.name} value={s.name}>
            {s.displayName}
          </MenuItem>
        ))}
      </Select>
      {error !== undefined && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};

export default StorageConnectorSelector;
