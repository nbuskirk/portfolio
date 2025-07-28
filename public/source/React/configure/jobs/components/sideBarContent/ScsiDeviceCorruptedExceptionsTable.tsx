import { JobStatus } from 'data-hooks/policies/useJobStatus';
import { getScsiDeviceUnsupportedDeviceTypeExceptions } from './scsiUtils';
import columnsScsiDeviceExceptions from './columnsScsiDeviceExceptions';
import ExceptionsTable from './ExceptionsTable';

const ScsiDeviceCorruptedExceptionsTable = ({
  jobStatus
}: {
  jobStatus: JobStatus;
}) => {
  return (
    <ExceptionsTable
      jobStatus={jobStatus}
      getExceptions={getScsiDeviceUnsupportedDeviceTypeExceptions}
      columns={columnsScsiDeviceExceptions}
      title='SCSI device corrupted exceptions'
    />
  );
};

export default ScsiDeviceCorruptedExceptionsTable;
