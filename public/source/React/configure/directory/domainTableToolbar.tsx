import {
  GridToolbarContainer,
  GridToolbarFilterButton
} from '@mui/x-data-grid-premium';
import { Button, Grid } from '@mui/material';
import sx from './directory.module.scss';

declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    onSave: () => void;
    change: boolean;
  }
}

interface DomainTableToolbarProp {
  onSave: () => void;
  change: boolean;
}

const domainTableToolbar = ({ onSave, change }: DomainTableToolbarProp) => {
  return (
    <Grid>
      <GridToolbarContainer
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          backgroundColor: '#ffffff'
        }}
      >
        <Grid>
          <GridToolbarFilterButton />
          <Button
            variant='contained'
            className={sx.button}
            onClick={() => onSave()}
            disabled={!change}
          >
            Save
          </Button>
        </Grid>
      </GridToolbarContainer>
    </Grid>
  );
};

export default domainTableToolbar;
