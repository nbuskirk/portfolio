import { GridColDef } from '@mui/x-data-grid-premium';
import useCommonAlertsTableColumnDef from 'components/Alerts/components/AlertListTable/hooks/useCommonAlertsTableColumnDef';

// Hook to get localized values for column definitions
const useJobAlertsTableColumnDef = () => {
  const commonAlertsTableColumnDef = useCommonAlertsTableColumnDef();

  const columns: GridColDef[] = [
    commonAlertsTableColumnDef.GRID_COLUMN_SEVERITY,
    commonAlertsTableColumnDef.GRID_COLUMN_TYPE,
    commonAlertsTableColumnDef.GRID_COLUMN_BACKUPTIME,
    commonAlertsTableColumnDef.GRID_COLUMN_ALERTTIME,
    commonAlertsTableColumnDef.GRID_COLUMN_STATUS,
    commonAlertsTableColumnDef.GRID_COLUMN_HOST
  ];

  return columns;
};

export default useJobAlertsTableColumnDef;
