import { JobStatus } from 'data-hooks/policies/useJobStatus';
import { getScsiDeviceFilesystemRecoveryFailureExceptions } from './scsiUtils';
import columnsScsiDeviceExceptions from './columnsScsiDeviceExceptions';
import ExceptionsTable from './ExceptionsTable';

const ScsiDeviceFilesystemRecoveryFailureExceptionsTable = ({
  jobStatus
}: {
  jobStatus: JobStatus;
}) => {
  return (
    <ExceptionsTable
      jobStatus={jobStatus}
      getExceptions={getScsiDeviceFilesystemRecoveryFailureExceptions}
      columns={columnsScsiDeviceExceptions}
      title='SCSI device corrupted exceptions'
    />
  );
};

export default ScsiDeviceFilesystemRecoveryFailureExceptionsTable;
