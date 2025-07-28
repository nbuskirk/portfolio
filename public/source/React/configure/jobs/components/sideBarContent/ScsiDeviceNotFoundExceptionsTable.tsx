import { JobStatus } from 'data-hooks/policies/useJobStatus';
import { getScsiDeviceNotFoundExceptions } from './scsiUtils';
import columnsScsiDeviceExceptions from './columnsScsiDeviceExceptions';
import ExceptionsTable from './ExceptionsTable';

const ScsiDeviceNotFoundExceptionsTable = ({
  jobStatus
}: {
  jobStatus: JobStatus;
}) => {
  return (
    <ExceptionsTable
      jobStatus={jobStatus}
      getExceptions={getScsiDeviceNotFoundExceptions}
      columns={columnsScsiDeviceExceptions}
      title='SCSI device not found exceptions'
    />
  );
};

export default ScsiDeviceNotFoundExceptionsTable;
