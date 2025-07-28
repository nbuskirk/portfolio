import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import { ThresholdLocation } from 'data-hooks/hosts/useThresholds';

interface LocationsProps {
  locations: ThresholdLocation[];
  setFormData: (data: any) => void;
  formState: string;
  error?: string;
}

const Locations = ({
  locations,
  setFormData,
  formState,
  error
}: LocationsProps) => {
  const showError = formState === 'error' && error !== '';

  return (
    <Box sx={{ borderBottom: '1px solid #ccc' }} pb={2}>
      <Typography variant='body2' mt={2}>
        Locations
        <Tooltip
          arrow
          title='Path may be a directory or a path to a file.'
          placement='right'
          sx={{ marginLeft: '0.25rem', marginY: '-.4rem' }}
        >
          <InfoIcon
            color='secondary'
            sx={{ fontSize: '14px', margin: '0 0 -0.2em 0.3em' }}
          />
        </Tooltip>
      </Typography>

      {locations.map((location, index) => (
        <Box key={index} display='flex' alignItems='center' mt={1}>
          <TextField
            sx={{ marginRight: '1em', width: '250px' }}
            value={location.host}
            placeholder='Host'
            onChange={(e) => {
              const newLocations = [...locations];
              newLocations[index].host = e.target.value;
              setFormData((prev: any) => ({
                ...prev,
                locations: newLocations
              }));
            }}
          />
          <TextField
            sx={{ marginRight: '1em', width: '300px' }}
            value={location.path}
            placeholder='Path'
            onChange={(e) => {
              const newLocations = [...locations];
              newLocations[index].path = e.target.value;
              setFormData((prev: any) => ({
                ...prev,
                locations: newLocations
              }));
            }}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={location.recursive}
                onChange={(e) => {
                  const newLocations = [...locations];
                  newLocations[index].recursive = e.target.checked;
                  setFormData((prev: any) => ({
                    ...prev,
                    locations: newLocations
                  }));
                }}
              />
            }
            label={
              <Typography variant='body2'>Include Subdirectories</Typography>
            }
          />

          <IconButton
            sx={{ marginLeft: '1em' }}
            onClick={() => {
              const newLocations = [...locations];
              newLocations.splice(index, 1);
              setFormData((prev: any) => ({
                ...prev,
                locations: newLocations
              }));
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}

      {showError && <FormHelperText error>{error}</FormHelperText>}

      <Button
        sx={{ marginTop: '1em' }}
        onClick={() => {
          setFormData((prev: ThresholdLocation) => ({
            ...prev,
            locations: [...locations, { host: '', path: '', recursive: false }]
          }));
        }}
        variant='contained'
      >
        Add Location <AddIcon sx={{ height: '15px' }} />
      </Button>
    </Box>
  );
};

export default Locations;
