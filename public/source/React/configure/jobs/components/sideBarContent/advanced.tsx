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

import { Mtype } from 'data-hooks/policies/useJobs';

import SideBarTable from '../SideBarTable/SideBarTable';

import sx from './renderSideBarContent.module.scss';

import columnsVmsToInclude from './columnsVmsToInclude';
import columnsVmsToExclude from './columnsVmsToExclude';
import columnsFilesDirectoriesGlob from './columnsFilesDirectoriesGlob';

import { computeFlexOfColumns } from './utils';
import { getVms } from './vmfsUtils';

const isMountableJob = (mtype: Mtype | undefined) => {
  if (!mtype) {
    return false;
  }
  return ['NFS Export', 'CIFS Share'].includes(mtype);
};
const isVMFSJob = (mtype: Mtype | undefined) => {
  if (!mtype) {
    return false;
  }
  return ['VMFS'].includes(mtype);
};

const getGlobs = (patStrings: Array<string>) => {
  if (!patStrings) {
    return [];
  }
  return patStrings.map((patStr, index) => {
    const glob = {
      'id': index,
      'pattern': patStr
    };
    return glob;
  });
};

interface Props {
  jobStatus: any;
  mtype: Mtype | undefined;
}
const Advanced = ({ jobStatus, mtype }: Props) => {
  const theme = useTheme();
  const { palette }: { palette: any } = theme;

  const vmsToInclude = getVms(jobStatus?.virtual_machines);
  const vmsToExclude = getVms(jobStatus?.excluded_virtual_machines);

  const includeGlobs = getGlobs(jobStatus?.job_filter?.include);
  const excludeGlobs = getGlobs(jobStatus?.job_filter?.exclude);

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel2a-content'
        id='panel2a-header'
      >
        <Typography className={sx.accordionTitle}>Advanced</Typography>
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
                  Simultaneous Jobs for This Host:
                </Typography>
                <span>{jobStatus?.simultaneous_jobs_for_this_host}</span>
              </Typography>
            </Box>
            {isMountableJob(mtype) && (
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
                    Block Size:
                  </Typography>
                  <span>{jobStatus?.block_size}</span>
                </Typography>
              </Box>
            )}
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
                  Email Addresses for Alerts:
                </Typography>
                <span>
                  {JSON.stringify(jobStatus?.List_of_email_addresses)}
                </span>
              </Typography>
            </Box>
            {isVMFSJob(mtype) && (
              <>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel2a-content'
                    id='panel2a-header'
                  >
                    <Typography className={sx.accordionTitle}>
                      VMs to Include table
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box className={sx.jobContentRow}>
                      <Typography
                        className={sx.jobContentText}
                        sx={{ color: palette.dark.main }}
                      >
                        <Box className={sx.box__emptyTable}>
                          <SideBarTable
                            columns={columnsVmsToInclude}
                            rows={vmsToInclude}
                            rowCount={vmsToInclude.length}
                            preprocessData={computeFlexOfColumns}
                          />
                        </Box>
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel2a-content'
                    id='panel2a-header'
                  >
                    <Typography className={sx.accordionTitle}>
                      VMs to Exclude table
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box className={sx.jobContentRow}>
                      <Typography
                        className={sx.jobContentText}
                        sx={{ color: palette.dark.main }}
                      >
                        <Box className={sx.box__emptyTable}>
                          <SideBarTable
                            columns={columnsVmsToExclude}
                            rows={vmsToExclude}
                            rowCount={vmsToExclude.length}
                            preprocessData={computeFlexOfColumns}
                          />
                        </Box>
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </>
            )}
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel2a-content'
                id='panel2a-header'
              >
                <Typography className={sx.accordionTitle}>
                  Files / Directories to Include table
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box className={sx.jobContentRow}>
                  <Typography
                    className={sx.jobContentText}
                    sx={{ color: palette.dark.main }}
                  >
                    <Box className={sx.box__emptyTable}>
                      <SideBarTable
                        columns={columnsFilesDirectoriesGlob}
                        rows={includeGlobs}
                        rowCount={includeGlobs.length}
                      />
                    </Box>
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
            <Accordion
              sx={{
                '&.MuiAccordion-root.MuiPaper-root': {
                  'borderBottom': 'none'
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel2a-content'
                id='panel2a-header'
              >
                <Typography className={sx.accordionTitle}>
                  Files / Directories to Exclude table
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box className={sx.jobContentRow}>
                  <Typography
                    className={sx.jobContentText}
                    sx={{ color: palette.dark.main }}
                  >
                    <Box className={sx.box__emptyTable}>
                      <SideBarTable
                        columns={columnsFilesDirectoriesGlob}
                        rows={excludeGlobs}
                        rowCount={excludeGlobs.length}
                      />
                    </Box>
                  </Typography>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default Advanced;
