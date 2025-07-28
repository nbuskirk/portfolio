import { GridColDef } from '@mui/x-data-grid-premium';

export const enabledOrDisabled = (val: 'enabled' | 'disabled' | undefined) => {
  if (val === undefined) {
    return '';
  }
  return val === 'enabled' ? 'enabled' : 'disabled';
};

export const computePercent = (numerator: number, denominator: number) => {
  if (numerator === 0 || denominator === 0) {
    return 0;
  }
  return Math.trunc((numerator / denominator) * 100);
};

export const computeFlexOfColumns = (
  columns: Array<GridColDef>,
  tableData: Array<any>
) => {
  const columnSizes: any = {};

  columns.forEach((column) => {
    columnSizes[column.field] = column?.headerName?.length;
    tableData.forEach((dataRow) => {
      if (dataRow[column.field] === undefined) {
        return;
      }
      const sz = dataRow[column.field]?.length;
      if (sz && sz > columnSizes[column.field]) {
        columnSizes[column.field] = sz;
      }
    });
  });

  const sizeColumns = Object.keys(columnSizes).map((key) => [
    key,
    columnSizes[key]
  ]);
  sizeColumns.sort((first, second) => second[1] - first[1]);

  const maxSize = sizeColumns[0][1];
  return columns.map((column) => {
    const result = { ...column };
    result.flex = columnSizes[column.field] / maxSize;
    return result;
  });
};
