import { JobStatus } from 'data-hooks/policies/useJobStatus';
import { getScsiDeviceDuplicateFilesystemExceptions } from './scsiUtils';
import columnsScsiDeviceExceptions from './columnsScsiDeviceExceptions';
import ExceptionsTable from './ExceptionsTable';

const ScsiDeviceDuplicateFilesystemExceptionsTable = ({
  jobStatus
}: {
  jobStatus: JobStatus;
}) => {
  return (
    <ExceptionsTable
      jobStatus={jobStatus}
      getExceptions={getScsiDeviceDuplicateFilesystemExceptions}
      columns={columnsScsiDeviceExceptions}
      title='SCSI device duplicate filesystem exceptions'
    />
  );
};

export default ScsiDeviceDuplicateFilesystemExceptionsTable;
