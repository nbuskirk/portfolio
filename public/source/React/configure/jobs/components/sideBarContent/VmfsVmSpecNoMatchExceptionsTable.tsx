import { JobStatus } from 'data-hooks/policies/useJobStatus';
import { getVmfsVmSpecNoMatchExceptions } from './vmfsUtils';
import columnsVmfsVmSpecNoMatchExceptions from './columnsVmfsVmSpecNoMatchExceptions';
import ExceptionsTable from './ExceptionsTable';

const VmfsVmSpecNoMatchExceptionsTable = ({
  jobStatus
}: {
  jobStatus: JobStatus;
}) => {
  return (
    <ExceptionsTable
      jobStatus={jobStatus}
      getExceptions={getVmfsVmSpecNoMatchExceptions}
      columns={columnsVmfsVmSpecNoMatchExceptions}
      title='VM specification match exceptions'
    />
  );
};

export default VmfsVmSpecNoMatchExceptionsTable;
