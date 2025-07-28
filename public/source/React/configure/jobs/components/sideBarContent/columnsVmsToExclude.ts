import { GridColDef } from '@mui/x-data-grid-premium';

const columnsVmsToExclude: GridColDef[] = [
  {
    field: 'name',
    headerName: 'NAME',
    editable: false,
    sortable: false,
    hideable: false
  },
  {
    field: 'uuid',
    headerName: 'VM UUID',
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

export default columnsVmsToExclude;
