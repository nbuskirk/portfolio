const validateYaraRuleFile = (file?: File) => {
  let isValidFile = true;
  let fileValidationError;

  if (file && !(file.name.endsWith('.yar') || file.name.endsWith('.yara'))) {
    isValidFile = false;
    fileValidationError =
      'Invalid file extension. Please choose a .yar or .yara file.';
  } else if (file && file.size > 64000) {
    isValidFile = false;
    fileValidationError = 'File size exceeds 64 KB.';
  }

  return {
    isValidFile,
    fileValidationError
  };
};

export default validateYaraRuleFile;
