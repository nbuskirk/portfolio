import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { ExpandedJob } from 'data-hooks/policies/useJobs';
import JobPhasesTable from '../JobPhasesTable/JobPhasesTable';
import sx from './jobsTableExpandedPanel.module.scss';

interface Props {
  row: ExpandedJob;
  systemTime: number | undefined;
}

const JobsTableExpandedPanel = ({ row, systemTime }: Props) => {
  const theme = useTheme();
  return (
    <Box
      className={sx.box__sliderContent}
      sx={{
        border: '2px solid',
        borderColor: theme.palette.secondary.main
      }}
    >
      <Grid container>
        <Grid item xs={12}>
          <JobPhasesTable expandedJob={row} systemTime={systemTime} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default JobsTableExpandedPanel;
