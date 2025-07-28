import { FileStatus } from 'components/inc/CSDropZone/CSDropZone';
import { FileWithPath } from 'react-dropzone';

const validateServerCertificateFile = (file?: FileWithPath) => {
  let fileStatus: FileStatus = 'success';
  let fileValidationError;

  if (
    file &&
    !(
      file.name.endsWith('.crt') ||
      file.name.endsWith('.cer') ||
      file.name.endsWith('.der') ||
      file.name.endsWith('.p12') ||
      file.name.endsWith('.pem') ||
      file.name.endsWith('.pfx')
    )
  ) {
    fileStatus = 'error';
    fileValidationError =
      'Invalid file extension. Please choose a .crt, .cer, .der. .p12, .pem or .pfx file.';
  }

  return {
    fileStatus,
    fileValidationError
  };
};

export default validateServerCertificateFile;
