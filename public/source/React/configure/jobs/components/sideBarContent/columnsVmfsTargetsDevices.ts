import { GridColDef } from '@mui/x-data-grid-premium';

const columnsVmfsTargetsDevices: GridColDef[] = [
  {
    field: 'lunSerialNumber',
    headerName: 'LUN SERIAL NUMBER',
    editable: false,
    sortable: false,
    hideable: false
  },
  {
    field: 'partitionNumber',
    headerName: 'PARTITION',
    editable: false,
    sortable: false,
    hideable: false
  },
  {
    field: 'uuid',
    headerName: 'FILESYSTEM UUID',
    editable: false,
    sortable: false,
    hideable: false
  },
  {
    field: 'datastoreId',
    headerName: 'DATASTORE ID',
    editable: false,
    sortable: false,
    hideable: false
  }
];

export default columnsVmfsTargetsDevices;
