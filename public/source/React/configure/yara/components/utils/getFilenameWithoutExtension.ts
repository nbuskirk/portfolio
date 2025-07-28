const getFilenameWithoutExtension = (filename: string): string => {
  return filename.replace(/\.[^/.]+$/, '');
};

export default getFilenameWithoutExtension;
