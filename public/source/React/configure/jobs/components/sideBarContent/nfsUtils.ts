import { getNfsMountFailureException } from '../../helpers/getJobStatusExceptions';

const getNfsMountFailureExceptions = (exceptions: Array<any>) => {
  if (!exceptions) {
    return [];
  }
  let count = 0;
  return exceptions
    .filter((exception) => exception.type === 'mount_failure')
    .map((exception) => {
      const exception2 = getNfsMountFailureException(exception);
      const { exceptionMsg, exceptionSeverity, hostname, nfsPath } = exception2;
      const row = {
        'id': (count += 1),
        exceptionMsg,
        exceptionSeverity,
        hostname,
        nfsPath
      };
      return row;
    });
};

export default getNfsMountFailureExceptions;
