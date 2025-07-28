import { useState } from 'react';
import {
  DataGridPremium,
  GridColumnVisibilityModel,
  GridColDef
} from '@mui/x-data-grid-premium';

interface Props {
  columns: Array<GridColDef>;
  rows: Array<any>;
  rowCount: number;
  preprocessData?: (columns: Array<GridColDef>, rows: Array<any>) => Array<any>;
}

const SideBarTable = ({ columns, rows, rowCount, preprocessData }: Props) => {
  const [visibilityModel, setVisibilityModel] =
    useState<GridColumnVisibilityModel>({
      segment: false // Hide segment by default
    });

  const tableColumns = preprocessData?.(columns, rows) ?? columns;

  return (
    <DataGridPremium
      columnVisibilityModel={visibilityModel}
      onColumnVisibilityModelChange={setVisibilityModel}
      columns={tableColumns}
      rows={rows}
      pagination
      rowCount={rowCount}
      disableColumnSelector
      disableDensitySelector
      disableColumnFilter
      disableColumnMenu
      density='compact'
      rowHeight={48}
    />
  );
};

export default SideBarTable;
