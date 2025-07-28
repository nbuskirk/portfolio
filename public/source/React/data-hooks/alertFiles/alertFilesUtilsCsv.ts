import { IntlShape } from 'react-intl';
import { Customizations } from '../config/useCustomization';

export const Properties = Object.freeze({
  PATH: 2,
  FILENAME: 3,
  SIZE: 4,
  MTIME: 5,
  ATIME: 6,
  OWNER: 15,
  INDEXEDOWNER: 17,
  BACKUPSOFT: 22,
  BACKUPHOST: 23,
  BACKUPPOLICY: 24,
  BACKUPTIME: 26,
  NODE: 27,
  SEGMENT: 28,
  FID: 31,
  CONTSIG: 41,
  PATHID: 42,
  BACKUPLONGID: 87,
  FILETYPEDISP: 90,
  FILEENTROPY: 110,
  STMCORRUPT: 113,
  STMUNSUPPORTED: 114,
  STMENCRYPT: 115,
  STMINTERNALERR: 116,
  STMWARNING: 117,
  STMABORTED: 118,
  STMDISABLED: 119,
  STMMISSING: 120,
  STMCANCELLED: 121,
  FILEENTROPYDELTA: 143,
  MALWARENAME: 157,
  TRUSTED: 178
});

type CSVProperties = {
  [key: number]: { displayName: string };
};
export const getCSVProperties = ({
  hide_backup_policy_in_csv_export
}: Customizations = {}) => {
  const properties = [
    Properties.FILENAME,
    Properties.BACKUPHOST,
    Properties.OWNER,
    Properties.MTIME,
    Properties.ATIME,
    Properties.SIZE,
    Properties.PATH,
    Properties.BACKUPLONGID,
    Properties.FILETYPEDISP,
    Properties.PATHID,
    Properties.BACKUPTIME,
    Properties.BACKUPSOFT,
    Properties.BACKUPPOLICY,
    Properties.INDEXEDOWNER,
    Properties.FILEENTROPY,
    Properties.FILEENTROPYDELTA,
    Properties.CONTSIG,
    Properties.NODE,
    Properties.SEGMENT,
    Properties.FID,
    Properties.STMCORRUPT,
    Properties.STMUNSUPPORTED,
    Properties.STMENCRYPT,
    Properties.STMINTERNALERR,
    Properties.STMWARNING,
    Properties.STMABORTED,
    Properties.STMDISABLED,
    Properties.STMMISSING,
    Properties.STMCANCELLED,
    Properties.MALWARENAME,
    Properties.TRUSTED
  ];
  return hide_backup_policy_in_csv_export === '1'
    ? properties.filter((property) => property !== Properties.BACKUPPOLICY)
    : properties;
};

const getFormattedMessage = (intl: IntlShape, id: string): string => {
  const message = intl.formatMessage({ id, defaultMessage: '' });
  return message === id ? '' : message;
};

export const getCSVPropertiesMap = (intl: IntlShape): CSVProperties => ({
  [Properties.BACKUPLONGID]: {
    displayName: getFormattedMessage(intl, 'csv.column.backupid')
  },
  [Properties.BACKUPTIME]: {
    displayName: getFormattedMessage(intl, 'csv.column.backuptime')
  },
  [Properties.BACKUPHOST]: {
    displayName: getFormattedMessage(intl, 'csv.column.backupphost')
  },
  [Properties.BACKUPSOFT]: {
    displayName: getFormattedMessage(intl, 'csv.column.backupsoft')
  },
  [Properties.FILETYPEDISP]: { displayName: 'File Type' },
  [Properties.ATIME]: { displayName: 'Accessed' },
  [Properties.MTIME]: { displayName: 'Last Modified' },
  [Properties.FILENAME]: { displayName: 'Name' }
});
