import { JobStatus } from 'data-hooks/policies/useJobStatus';
import { getVmfsVolumeMountFailureExceptions } from './vmfsUtils';
import columnsVmfsVolumeMountFailureExceptions from './columnsVmfsVolumeMountFailureExceptions';
import ExceptionsTable from './ExceptionsTable';

const VmfsVolumeMountFailureExceptionsTable = ({
  jobStatus
}: {
  jobStatus: JobStatus;
}) => {
  return (
    <ExceptionsTable
      jobStatus={jobStatus}
      getExceptions={getVmfsVolumeMountFailureExceptions}
      columns={columnsVmfsVolumeMountFailureExceptions}
      title='VMFS volume mount failure exceptions'
    />
  );
};

export default VmfsVolumeMountFailureExceptionsTable;
