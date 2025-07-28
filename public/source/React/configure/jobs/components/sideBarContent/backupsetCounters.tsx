import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { BackupsetCountersType } from '../../helpers/getJobStatusBackupsetCounters';

import sx from './renderSideBarContent.module.scss';

interface Props {
  title: string;
  counters: BackupsetCountersType;
}

const BackupsetCounters = ({ title, counters }: Props) => {
  const theme = useTheme();
  const { palette }: { palette: any } = theme;
  return (
    <Accordion
      sx={{
        '&.MuiAccordion-root.MuiPaper-root': {
          'borderBottom': 'none'
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel3a-content'
        id='panel3a-header'
      >
        <Typography className={sx.accordionTitle}> {title} </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <>
          {counters.ncorrupt !== 0 && (
            <Box className={sx.jobContentRow}>
              <Typography
                className={sx.jobContentText}
                sx={{ color: palette.dark.main }}
              >
                <Typography
                  component='span'
                  className={sx.jobContentTitle}
                  sx={{ color: palette.neutral.dark200 }}
                >
                  Number of corrupt backups
                </Typography>
                <span>{counters.ncorrupt}</span>
              </Typography>
            </Box>
          )}
          {counters.nunsuppt !== 0 && (
            <Box className={sx.jobContentRow}>
              <Typography
                className={sx.jobContentText}
                sx={{ color: palette.dark.main }}
              >
                <Typography
                  component='span'
                  className={sx.jobContentTitle}
                  sx={{ color: palette.neutral.dark200 }}
                >
                  Number of backups with unsupported components
                </Typography>
                <span>{counters.nunsuppt}</span>
              </Typography>
            </Box>
          )}
          {counters.nencrypt !== 0 && (
            <Box className={sx.jobContentRow}>
              <Typography
                className={sx.jobContentText}
                sx={{ color: palette.dark.main }}
              >
                <Typography
                  component='span'
                  className={sx.jobContentTitle}
                  sx={{ color: palette.neutral.dark200 }}
                >
                  Number of backups with encrypted components
                </Typography>
                <span>{counters.nencrypt}</span>
              </Typography>
            </Box>
          )}
          {counters.ninternalerr !== 0 && (
            <Box className={sx.jobContentRow}>
              <Typography
                className={sx.jobContentText}
                sx={{ color: palette.dark.main }}
              >
                <Typography
                  component='span'
                  className={sx.jobContentTitle}
                  sx={{ color: palette.neutral.dark200 }}
                >
                  Number of backups with internal errors
                </Typography>
                <span>{counters.ninternalerr}</span>
              </Typography>
            </Box>
          )}
          {counters.nwarning !== 0 && (
            <Box className={sx.jobContentRow}>
              <Typography
                className={sx.jobContentText}
                sx={{ color: palette.dark.main }}
              >
                <Typography
                  component='span'
                  className={sx.jobContentTitle}
                  sx={{ color: palette.neutral.dark200 }}
                >
                  Number of backups with warnings
                </Typography>
                <span>{counters.nwarning}</span>
              </Typography>
            </Box>
          )}
          {counters.naborted !== 0 && (
            <Box className={sx.jobContentRow}>
              <Typography
                className={sx.jobContentText}
                sx={{ color: palette.dark.main }}
              >
                <Typography
                  component='span'
                  className={sx.jobContentTitle}
                  sx={{ color: palette.neutral.dark200 }}
                >
                  Number of backups aborted while processing
                </Typography>
                <span>{counters.naborted}</span>
              </Typography>
            </Box>
          )}
          {counters.ndisabled !== 0 && (
            <Box className={sx.jobContentRow}>
              <Typography
                className={sx.jobContentText}
                sx={{ color: palette.dark.main }}
              >
                <Typography
                  component='span'
                  className={sx.jobContentTitle}
                  sx={{ color: palette.neutral.dark200 }}
                >
                  Number of backups with disabled components
                </Typography>
                <span>{counters.ndisabled}</span>
              </Typography>
            </Box>
          )}
          {counters.nmissing !== 0 && (
            <Box className={sx.jobContentRow}>
              <Typography
                className={sx.jobContentText}
                sx={{ color: palette.dark.main }}
              >
                <Typography
                  component='span'
                  className={sx.jobContentTitle}
                  sx={{ color: palette.neutral.dark200 }}
                >
                  Number of backupsets with missing data
                </Typography>
                <span>{counters.nmissing}</span>
              </Typography>
            </Box>
          )}
          {counters.ncancelled !== 0 && (
            <Box className={sx.jobContentRow}>
              <Typography
                className={sx.jobContentText}
                sx={{ color: palette.dark.main }}
              >
                <Typography
                  component='span'
                  className={sx.jobContentTitle}
                  sx={{ color: palette.neutral.dark200 }}
                >
                  Number of backupsets whose processing was cancelled
                </Typography>
                <span>{counters.ncancelled}</span>
              </Typography>
            </Box>
          )}
        </>
      </AccordionDetails>
    </Accordion>
  );
};

export default BackupsetCounters;
