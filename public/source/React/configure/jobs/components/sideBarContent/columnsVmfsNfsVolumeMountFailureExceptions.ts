import { GridColDef } from '@mui/x-data-grid-premium';

const columnsVmfsNfsVolumeMountFailureExceptions: GridColDef[] = [
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
    field: 'hostname',
    headerName: 'NFS SERVER',
    type: 'string',
    sortable: false,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    editable: false
  },
  {
    field: 'nfsPath',
    headerName: 'NFS EXPORT',
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

export default columnsVmfsNfsVolumeMountFailureExceptions;
