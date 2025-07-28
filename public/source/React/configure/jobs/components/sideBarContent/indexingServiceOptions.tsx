import {
  Box,
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { FormattedMessage } from 'react-intl';

import { JobStatus } from 'data-hooks/policies/useJobStatus';

import sx from './renderSideBarContent.module.scss';

import { enabledOrDisabled } from './utils';

const wordstyleToCaseHandling = (wordstyle: number | undefined) => {
  if (wordstyle === undefined) {
    return '';
  }
  switch (wordstyle) {
    case 1: // HDB_WORDSTYLE_UNICODE
      return 'Map to Lowercase';
    case 2: // HDB_WORDSTYLE_UNICODE_CASE
      return 'Preserve Case';
    default: // includes HDB_WORDSTYLE_LATIN1
      return 'Unsupported';
  }
};

const IndexingServiceOptions = ({ jobStatus }: { jobStatus: JobStatus }) => {
  const theme = useTheme();
  const { palette }: { palette: any } = theme;

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel3a-content'
        id='panel3a-header'
      >
        <Typography className={sx.accordionTitle}>
          Indexing Service Options
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack className={sx.jobContent}>
          <Box>
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
                  Indexing Mode:
                </Typography>
                <span>{jobStatus?.indexing_mode}</span>
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
                  Case Handling:
                </Typography>
                <span> {wordstyleToCaseHandling(jobStatus?.wordstyle)} </span>
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
                  OCR:
                </Typography>
                <span>{enabledOrDisabled(jobStatus?.ocr)}</span>
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
                  <FormattedMessage id='settings.advanced.jobs.jobproperties.datacollection' />
                  :
                </Typography>
                <span> {enabledOrDisabled(jobStatus?.cs_data_collection)}</span>
              </Typography>
            </Box>
          </Box>
          <Box>
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
                  Use Change Time for Incremental Indexing:
                </Typography>
                <span>
                  {enabledOrDisabled(
                    jobStatus?.use_change_time_for_incremental_indexing
                  )}
                </span>
              </Typography>
            </Box>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default IndexingServiceOptions;
