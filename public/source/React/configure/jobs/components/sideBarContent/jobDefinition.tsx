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

import columnsVmfsTargetsDevices from './columnsVmfsTargetsDevices';
import columnsVmfsTargetsNfs from './columnsVmfsTargetsNfs';

import columnsScsiVolumes from './columnsScsiVolumes';

import { getVmfsTargetsDevices, getVmfsTargetsNfs } from './vmfsUtils';
import { getScsiVolumes } from './scsiUtils';
import { computeFlexOfColumns } from './utils';

const jobType = (val: 'incremental' | 'full') => {
  if (val === undefined) {
    return '';
  }
  return val === 'incremental' ? 'Incremental' : 'Full';
};

const isVMFSJob = (mtype: Mtype | undefined) => {
  if (!mtype) {
    return false;
  }
  return ['VMFS'].includes(mtype);
};

const isSCSIJob = (mtype: Mtype | undefined) => {
  if (!mtype) {
    return false;
  }
  return ['SCSI'].includes(mtype);
};

interface Props {
  jobStatus: any;
  mtype: Mtype | undefined;
  sourceName: string;
  sourcePath: string | undefined;
  indexAsPath: string | undefined;
}
const JobDefinition = ({
  jobStatus,
  mtype,
  sourceName,
  sourcePath,
  indexAsPath
}: Props) => {
  const theme = useTheme();
  const { palette }: { palette: any } = theme;

  const vmfsTargetsDevices = getVmfsTargetsDevices(jobStatus?.list_of_targets);
  const vmfsTargetsNfs = getVmfsTargetsNfs(jobStatus?.list_of_targets);

  const volumes = getScsiVolumes(jobStatus?.volumes);
  const host = jobStatus?.index_as ?? '';

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography className={sx.accordionTitle}> Job Definition </Typography>
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
                  Job Type:
                </Typography>
                <span>{jobType(jobStatus?.ie_idx_job_type)}</span>
              </Typography>
            </Box>
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
                  {sourceName}
                </Typography>
                <span>{sourcePath}</span>
              </Typography>
            </Box>
            {indexAsPath && indexAsPath !== sourcePath && (
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
                    Original Data Location:
                  </Typography>
                  <span>{indexAsPath}</span>
                </Typography>
              </Box>
            )}
            {isVMFSJob(mtype) && (
              <>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel2a-content'
                    id='panel2a-header'
                  >
                    <Typography className={sx.accordionTitle}>
                      VMFS Volumes table
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
                            columns={columnsVmfsTargetsDevices}
                            rows={vmfsTargetsDevices}
                            rowCount={vmfsTargetsDevices.length}
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
                      NFS Storage table
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
                            columns={columnsVmfsTargetsNfs}
                            rows={vmfsTargetsNfs}
                            rowCount={vmfsTargetsNfs.length}
                            preprocessData={computeFlexOfColumns}
                          />
                        </Box>
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </>
            )}
            {isSCSIJob(mtype) && (
              <>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls='panel2a-content'
                    id='panel2a-header'
                  >
                    <Typography className={sx.accordionTitle}>
                      {`Storage Volumes table of ${host}`}
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
                            columns={columnsScsiVolumes}
                            rows={volumes}
                            rowCount={volumes.length}
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
                      NFS Storage table
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
                            columns={columnsVmfsTargetsNfs}
                            rows={vmfsTargetsNfs}
                            rowCount={vmfsTargetsNfs.length}
                            preprocessData={computeFlexOfColumns}
                          />
                        </Box>
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </>
            )}
          </Box>
          <Box />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default JobDefinition;
