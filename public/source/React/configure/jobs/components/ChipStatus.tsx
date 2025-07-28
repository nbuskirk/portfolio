import { Chip } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid-premium';
import { useTheme } from '@mui/material/styles';

import { JobState } from 'data-hooks/policies/useJobs';

const ChipStatus = ({ value }: GridRenderCellParams<any, JobState>) => {
  const theme = useTheme();
  switch (value) {
    case 'Done': {
      return (
        <Chip
          label={value}
          sx={{
            backgroundColor: theme.palette.success.light,
            color: theme.palette.success.dark
          }}
        />
      );
    }
    case 'Partial': {
      return (
        <Chip
          label={value}
          sx={{
            backgroundColor: theme.palette.graph.e,
            color: theme.palette.graph.a
          }}
        />
      );
    }
    case 'Running': {
      return (
        <Chip
          label={value}
          sx={{
            backgroundColor: theme.palette.neutral.primary500,
            color: theme.palette.primary.main
          }}
        />
      );
    }
    case 'Pending': {
      return (
        <Chip
          label={value}
          sx={{
            backgroundColor: theme.palette.neutral.secondary100,
            color: theme.palette.secondary.main
          }}
        />
      );
    }
    case 'Failed': {
      return (
        <Chip
          label={value}
          sx={{
            backgroundColor: theme.palette.error.main,
            color: theme.palette.white.main
          }}
        />
      );
    }
    case 'Canceled': {
      return (
        <Chip
          label={value}
          sx={{
            backgroundColor: theme.palette.warning.dark,
            color: theme.palette.white.main
          }}
        />
      );
    }
    case 'Canceling': {
      return (
        <Chip
          label={value}
          sx={{
            backgroundColor: theme.palette.warning.dark,
            color: theme.palette.neutral.white200
          }}
        />
      );
    }
    case 'Alert': {
      return (
        <Chip
          label={value}
          sx={{
            backgroundColor: theme.palette.error.main,
            color: theme.palette.white.main
          }}
        />
      );
    }
    default: {
      return (
        <Chip
          label={value}
          sx={{
            backgroundColor: theme.palette.neutral.primary500,
            color: theme.palette.primary.main
          }}
        />
      );
    }
  }
};

export default ChipStatus;
