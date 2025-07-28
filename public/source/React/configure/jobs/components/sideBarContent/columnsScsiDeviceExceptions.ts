import { GridColDef } from '@mui/x-data-grid-premium';

const columnsScsiDeviceExceptions: GridColDef[] = [
  {
    field: 'exceptionMsg',
    headerName: 'MESSAGE',
    type: 'string',
    sortable: false,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    editable: false
  },
  {
    field: 'exceptionSeverity',
    headerName: 'SEVERITY',
    type: 'string',
    sortable: false,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    editable: false
  },
  {
    field: 'lunSerialNumber',
    headerName: 'LUN SERIAL NUMBER',
    type: 'string',
    sortable: false,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    editable: false
  },
  {
    field: 'name',
    headerName: 'NAME',
    type: 'string',
    sortable: false,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    editable: false
  }
];

export default columnsScsiDeviceExceptions;
