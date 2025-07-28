import { getDirectoryNotFoundException } from '../../helpers/getJobStatusExceptions';

const getDirectoryNotFoundExceptions = (exceptions: Array<any>) => {
  if (!exceptions) {
    return [];
  }
  let count = 0;
  return exceptions
    .filter((exception) => exception.type === 'directory_not_found')
    .map((exception) => {
      const exception2 = getDirectoryNotFoundException(exception);
      const { exceptionMsg, exceptionSeverity, directory } = exception2;
      const row = {
        'id': (count += 1),
        exceptionMsg,
        exceptionSeverity,
        directory
      };
      return row;
    });
};

export default getDirectoryNotFoundExceptions;
