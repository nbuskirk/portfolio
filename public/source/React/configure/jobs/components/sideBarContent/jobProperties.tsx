import {
  Box,
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useTheme } from '@mui/material/styles';
import { FormattedMessage } from 'react-intl';
import { Mtype } from 'data-hooks/policies/useJobs';
import sx from './renderSideBarContent.module.scss';

import {
  isLanBackupsetCounterNonZero,
  isOffloadedBackupsetCounterNonZero,
  getLanBackupsetCounters,
  getOffloadedBackupsetCounters
} from './backupsetCountersUtils';

import BackupsetCounters from './backupsetCounters';

const computePercent = (numerator: number, denominator: number) => {
  if (numerator === 0 || denominator === 0) {
    return 0;
  }
  return Math.trunc((numerator / denominator) * 100);
};

interface Props {
  jobStatus: any;
  mtype: Mtype | undefined;
  isCompleted: boolean;
  isTotalBytesZero: boolean;
}
const JobProperties = ({
  jobStatus,
  mtype,
  isCompleted,
  isTotalBytesZero
}: Props) => {
  const theme = useTheme();
  const { palette }: { palette: any } = theme;
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel3a-content'
        id='panel3a-header'
      >
        <Typography className={sx.accordionTitle}> Job Properties </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack className={sx.jobContentFlex}>
          <Box className={sx.jobContentRow}>
            <Typography
              className={sx.jobContentTextMultiline}
              sx={{ color: palette.dark.main }}
            >
              <Typography
                component='span'
                className={sx.jobContentTitle}
                sx={{ color: palette.neutral.dark200 }}
              >
                Status Message:
              </Typography>
              <span>{jobStatus?.statemsg}</span>
            </Typography>
          </Box>
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
                <FormattedMessage id='settings.advanced.jobs.jobproperties.backupset.group.analyzed' />
              </Typography>
              <span>{jobStatus?.nnew_groups}</span>
            </Typography>
          </Box>
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
                <FormattedMessage id='settings.advanced.jobs.jobproperties.backupset.analyzed' />
              </Typography>
              <span>{jobStatus?.nnew}</span>
            </Typography>
          </Box>
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
                New Infections Found
              </Typography>
              <span>{jobStatus?.nnew_infected}</span>
            </Typography>
          </Box>
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
                Total Bytes
              </Typography>
              <span>{jobStatus?.total_bytes_in_backups}</span>
            </Typography>
          </Box>
          {mtype !== Mtype.VMFS && (
            <>
              {isCompleted &&
                !isTotalBytesZero &&
                'total_unknown_unsupported_bytes' in jobStatus &&
                'total_bytes_in_backups' in jobStatus &&
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
                      Unsupported Bytes / Pct
                    </Typography>
                    <span>
                      {isCompleted &&
                        !isTotalBytesZero &&
                        'total_unknown_unsupported_bytes' in jobStatus &&
                        'total_bytes_in_backups' in jobStatus &&
                        `${jobStatus.total_unknown_unsupported_bytes} /
                      ${computePercent(
                        jobStatus.total_unknown_unsupported_bytes,
                        jobStatus.total_bytes_in_backups
                      )}%`}
                    </span>
                  </Typography>
                </Box>
              }
              {isCompleted &&
                !isTotalBytesZero &&
                'total_missing_data_bytes' in jobStatus &&
                'total_bytes_in_backups' in jobStatus &&
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
                      Missing Data Bytes / Pct
                    </Typography>
                    <span>
                      {isCompleted &&
                        !isTotalBytesZero &&
                        'total_missing_data_bytes' in jobStatus &&
                        'total_bytes_in_backups' in jobStatus &&
                        `${jobStatus.total_missing_data_bytes} /
                      ${computePercent(
                        jobStatus.total_missing_data_bytes,
                        jobStatus.total_bytes_in_backups
                      )}%`}
                    </span>
                  </Typography>
                </Box>
              }
            </>
          )}
          {isOffloadedBackupsetCounterNonZero(jobStatus) && (
            <BackupsetCounters
              title='Offloaded backup counters'
              counters={getOffloadedBackupsetCounters(jobStatus)}
            />
          )}
          {isLanBackupsetCounterNonZero(jobStatus) && (
            <BackupsetCounters
              title='LAN backup counters'
              counters={getLanBackupsetCounters(jobStatus)}
            />
          )}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default JobProperties;

