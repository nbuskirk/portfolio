import { GridColDef } from '@mui/x-data-grid-premium';

const columnsScsiVolumes: GridColDef[] = [
  {
    field: 'lunSerialNumber',
    headerName: 'LUN SERIAL NUMBER',
    editable: false,
    sortable: false,
    hideable: false
  },
  {
    field: 'name',
    headerName: 'NAME',
    editable: false,
    sortable: false,
    hideable: false
  }
];

export default columnsScsiVolumes;
