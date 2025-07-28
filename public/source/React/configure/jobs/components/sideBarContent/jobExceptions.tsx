import {
  Typography,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { JobStatus } from 'data-hooks/policies/useJobStatus';

import sx from './renderSideBarContent.module.scss';

import VmfsVmSpecNoMatchExceptionsTable from './VmfsVmSpecNoMatchExceptionsTable';
import VmfsVolumeDeviceNotFoundExceptionsTable from './VmfsVolumeDeviceNotFoundExceptionsTable';
import VmfsVolumeMountFailureExceptionsTable from './VmfsVolumeMountFailureExceptionsTable';
import VmfsNfsVolumeMountFailureExceptionsTable from './VmfsNfsVolumeMountFailureExceptionsTable';
import NfsMountFailureExceptionsTable from './NfsMountFailureExceptionsTable';
import DirectoryNotFoundExceptionsTable from './DirectoryNotFoundExceptionsTable';
import ScsiDeviceNotFoundExceptionsTable from './ScsiDeviceNotFoundExceptionsTable';
import ScsiDeviceMountFailureExceptionsTable from './ScsiDeviceMountFailureExceptionsTable';
import ScsiDeviceDuplicateFilesystemExceptionsTable from './ScsiDeviceDuplicateFilesystemExceptionsTable';
import ScsiDeviceDuplicateVolumeExceptionsTable from './ScsiDeviceDuplicateVolumeExceptionsTable';
import ScsiDeviceUnsupportedDeviceTypeExceptionsTable from './ScsiDeviceUnsupportedDeviceTypeExceptionsTable';
import ScsiDeviceCorruptedExceptionsTable from './ScsiDeviceCorruptedExceptionsTable';
import ScsiDeviceFilesystemRecoveryFailureExceptionsTable from './ScsiDeviceFilesystemRecoveryFailureExceptionsTable';

const JobExceptions = ({ jobStatus }: { jobStatus: JobStatus }) => {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography className={sx.accordionTitle}> Job Exceptions </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Stack className={sx.jobContent}>
          <VmfsVmSpecNoMatchExceptionsTable jobStatus={jobStatus} />
          <VmfsVolumeDeviceNotFoundExceptionsTable jobStatus={jobStatus} />
          <VmfsVolumeMountFailureExceptionsTable jobStatus={jobStatus} />
          <VmfsNfsVolumeMountFailureExceptionsTable jobStatus={jobStatus} />
          <NfsMountFailureExceptionsTable jobStatus={jobStatus} />
          <DirectoryNotFoundExceptionsTable jobStatus={jobStatus} />
          <ScsiDeviceNotFoundExceptionsTable jobStatus={jobStatus} />
          <ScsiDeviceMountFailureExceptionsTable jobStatus={jobStatus} />
          <ScsiDeviceDuplicateFilesystemExceptionsTable jobStatus={jobStatus} />
          <ScsiDeviceDuplicateVolumeExceptionsTable jobStatus={jobStatus} />
          <ScsiDeviceUnsupportedDeviceTypeExceptionsTable
            jobStatus={jobStatus}
          />
          <ScsiDeviceCorruptedExceptionsTable jobStatus={jobStatus} />
          <ScsiDeviceFilesystemRecoveryFailureExceptionsTable
            jobStatus={jobStatus}
          />
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};

export default JobExceptions;
