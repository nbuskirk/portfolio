import { JobStatus } from 'data-hooks/policies/useJobStatus';
import { getScsiDeviceDuplicateVolumeExceptions } from './scsiUtils';
import columnsScsiDeviceExceptions from './columnsScsiDeviceExceptions';
import ExceptionsTable from './ExceptionsTable';

const ScsiDeviceDuplicateVolumeExceptionsTable = ({
  jobStatus
}: {
  jobStatus: JobStatus;
}) => {
  return (
    <ExceptionsTable
      jobStatus={jobStatus}
      getExceptions={getScsiDeviceDuplicateVolumeExceptions}
      columns={columnsScsiDeviceExceptions}
      title='SCSI device duplicate volume exceptions'
    />
  );
};

export default ScsiDeviceDuplicateVolumeExceptionsTable;
