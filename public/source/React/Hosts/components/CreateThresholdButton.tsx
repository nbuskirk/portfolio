import { Button } from '@mui/material';
import { Link } from 'react-router-dom';

interface CreateThresholdButtonProps {
  disabled: boolean;
}

const CreateThresholdButton = ({ disabled }: CreateThresholdButtonProps) => (
  <Button
    disabled={disabled}
    variant='contained'
    component={Link}
    to='/dashboard/settings/customthresholds/new'
  >
    Create Threshold
  </Button>
);

export default CreateThresholdButton;
