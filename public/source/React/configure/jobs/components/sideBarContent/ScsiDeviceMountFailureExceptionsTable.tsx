import { JobStatus } from 'data-hooks/policies/useJobStatus';
import { getScsiDeviceMountFailureExceptions } from './scsiUtils';
import columnsScsiDeviceExceptions from './columnsScsiDeviceExceptions';
import ExceptionsTable from './ExceptionsTable';

const ScsiDeviceMountFailureExceptionsTable = ({
  jobStatus
}: {
  jobStatus: JobStatus;
}) => {
  return (
    <ExceptionsTable
      jobStatus={jobStatus}
      getExceptions={getScsiDeviceMountFailureExceptions}
      columns={columnsScsiDeviceExceptions}
      title='SCSI device mount failure exceptions'
    />
  );
};

export default ScsiDeviceMountFailureExceptionsTable;
