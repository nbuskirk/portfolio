import {
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
  GridColDef
} from '@mui/x-data-grid-premium';

const usePublicKeyTableColumns = () => {
  const columns: GridColDef[] = [
    {
      field: 'kid',
      headerName: 'kid',
      hideable: false,
      flex: 1
    },
    {
      field: 'algorithm',
      headerName: 'algorithm',
      width: 300,
      hideable: false
    },
    { ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF }
  ];
  return columns;
};

export default usePublicKeyTableColumns;
