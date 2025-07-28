import { GridColDef } from '@mui/x-data-grid-premium';

const columnsVmfsTargetsNfs: GridColDef[] = [
  {
    field: 'hostname',
    headerName: 'NFS SERVER',
    editable: false,
    sortable: false,
    hideable: false
  },
  {
    field: 'nfsPath',
    headerName: 'NFS EXPORT',
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

export default columnsVmfsTargetsNfs;
