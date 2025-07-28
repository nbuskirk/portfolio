import {
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
  GridColDef
} from '@mui/x-data-grid-premium';
import { ieTimezone, useIeSystem } from 'data-hooks/useIeSystem';
import { format } from 'date-fns';
import { useUser } from 'utils/context/UserContext';
import changeTimezone from 'utils/helpers/timezone';

const useServerCertificationTableColumns = () => {
  const { session } = useUser();
  const { data: ie } = useIeSystem({ session });

  const columns: GridColDef[] = [
    {
      field: 'parsedCertificate',
      headerName: 'Certificate',
      width: 200,
      hideable: false,
      flex: 1
    },
    {
      // Need to keep this column "as is" (without formatting) because it is
      // used as the key for the DELETE API. This column is hidden from the UI.
      // The dateUploadedFormatted column below is visible and has the
      // standard format and timezone
      field: 'date_uploaded',
      type: 'string'
    },
    {
      field: 'dateUploadedFormatted',
      headerName: 'Date Uploaded',
      type: 'date',
      width: 175,
      valueGetter: (value) => {
        return new Date(value);
      },
      valueFormatter: (value) => {
        return format(
          changeTimezone(value, ieTimezone(ie)),
          'yyyy-MM-dd HH:mm:ss'
        );
      }
    },
    { ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF }
  ];
  return columns;
};

export default useServerCertificationTableColumns;
