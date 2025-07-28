import { JobStatus } from 'data-hooks/policies/useJobStatus';
import { getScsiDeviceUnsupportedDeviceTypeExceptions } from './scsiUtils';
import columnsScsiDeviceExceptions from './columnsScsiDeviceExceptions';
import ExceptionsTable from './ExceptionsTable';

const ScsiDeviceUnsupportedDeviceTypeExceptionsTable = ({
  jobStatus
}: {
  jobStatus: JobStatus;
}) => {
  return (
    <ExceptionsTable
      jobStatus={jobStatus}
      getExceptions={getScsiDeviceUnsupportedDeviceTypeExceptions}
      columns={columnsScsiDeviceExceptions}
      title='SCSI device unsupported device type exceptions'
    />
  );
};

export default ScsiDeviceUnsupportedDeviceTypeExceptionsTable;
