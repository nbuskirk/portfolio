import { JobStatus } from 'data-hooks/policies/useJobStatus';
import { getVmfsNfsVolumeMountFailureExceptions } from './vmfsUtils';
import columnsVmfsNfsVolumeMountFailureExceptions from './columnsVmfsNfsVolumeMountFailureExceptions';
import ExceptionsTable from './ExceptionsTable';

const VmfsNfsVolumeMountFailureExceptionsTable = ({
  jobStatus
}: {
  jobStatus: JobStatus;
}) => {
  return (
    <ExceptionsTable
      jobStatus={jobStatus}
      getExceptions={getVmfsNfsVolumeMountFailureExceptions}
      columns={columnsVmfsNfsVolumeMountFailureExceptions}
      title='VMFS NFS volume mount failure exceptions'
    />
  );
};

export default VmfsNfsVolumeMountFailureExceptionsTable;
