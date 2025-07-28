import { JobStatus } from 'data-hooks/policies/useJobStatus';
import getNfsMountFailureExceptions from './nfsUtils';
import columnsNfsMountFailureExceptions from './columnsNfsMountFailureExceptions';
import ExceptionsTable from './ExceptionsTable';

const NfsMountFailureExceptionsTable = ({
  jobStatus
}: {
  jobStatus: JobStatus;
}) => {
  return (
    <ExceptionsTable
      jobStatus={jobStatus}
      getExceptions={getNfsMountFailureExceptions}
      columns={columnsNfsMountFailureExceptions}
      title='NFS mount failure exceptions'
    />
  );
};

export default NfsMountFailureExceptionsTable;
