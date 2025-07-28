import { JobStatus } from 'data-hooks/policies/useJobStatus';
import { getVmfsVolumeDeviceNotFoundExceptions } from './vmfsUtils';
import columnsVmfsVolumeDeviceNotFoundExceptions from './columnsVmfsVolumeDeviceNotFoundExceptions';
import ExceptionsTable from './ExceptionsTable';

const VmfsVolumeDeviceNotFoundExceptionsTable = ({
  jobStatus
}: {
  jobStatus: JobStatus;
}) => {
  return (
    <ExceptionsTable
      jobStatus={jobStatus}
      getExceptions={getVmfsVolumeDeviceNotFoundExceptions}
      columns={columnsVmfsVolumeDeviceNotFoundExceptions}
      title='VMFS volume device not found exceptions'
    />
  );
};

export default VmfsVolumeDeviceNotFoundExceptionsTable;
