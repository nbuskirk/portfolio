import { JobStatus } from 'data-hooks/policies/useJobStatus';
import getDirectoryNotFoundExceptions from './localUtils';
import columnsNfsMountFailureExceptions from './columnsNfsMountFailureExceptions';
import ExceptionsTable from './ExceptionsTable';

const DirectoryNotFoundExceptionsTable = ({
  jobStatus
}: {
  jobStatus: JobStatus;
}) => {
  return (
    <ExceptionsTable
      jobStatus={jobStatus}
      getExceptions={getDirectoryNotFoundExceptions}
      columns={columnsNfsMountFailureExceptions}
      title='Directory not found exceptions'
    />
  );
};

export default DirectoryNotFoundExceptionsTable;
