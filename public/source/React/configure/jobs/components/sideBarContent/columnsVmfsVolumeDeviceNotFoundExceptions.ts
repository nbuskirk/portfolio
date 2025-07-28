import { GridColDef } from '@mui/x-data-grid-premium';

const columnsVmfsVolumeDeviceNotFoundExceptions: GridColDef[] = [
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
    field: 'partitionNumber',
    headerName: 'PARTITION',
    type: 'string',
    sortable: false,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    editable: false
  },
  {
    field: 'uuid',
    headerName: 'UUID',
    type: 'string',
    sortable: false,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    editable: false
  },
  {
    field: 'datastoreId',
    headerName: 'DATASTORE ID',
    type: 'string',
    sortable: false,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    editable: false
  }
];

export default columnsVmfsVolumeDeviceNotFoundExceptions;
