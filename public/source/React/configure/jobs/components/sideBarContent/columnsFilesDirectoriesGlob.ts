import { GridColDef } from '@mui/x-data-grid-premium';

const columnsFilesDirectoriesGlob: GridColDef[] = [
  {
    field: 'pattern',
    headerName: 'GLOB PATTERN',
    width: 140,
    editable: false,
    sortable: false,
    hideable: false
  }
];

export default columnsFilesDirectoriesGlob;
