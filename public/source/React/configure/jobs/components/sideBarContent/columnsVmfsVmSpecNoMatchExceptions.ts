import { GridColDef } from '@mui/x-data-grid-premium';

const columnsVmfsVmSpecNoMatch: GridColDef[] = [
  {
    field: 'exceptionMsg',
    headerName: 'EXCEPTION_MSG',
    type: 'string',
    sortable: false,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    editable: false
  },
  {
    field: 'exceptionSeverity',
    headerName: 'EXCEPTION_SEVERITY',
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
  },
  {
    field: 'uuid',
    headerName: 'VM UUID',
    type: 'string',
    sortable: false,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    editable: false
  },
  {
    field: 'datastoreId',
    headerName: 'DATASTORE_ID',
    type: 'string',
    sortable: false,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    editable: false
  },
  {
    field: 'expectAtLeast',
    headerName: 'EXPECT_AT_LEAST',
    type: 'number',
    sortable: false,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    editable: false
  },
  {
    field: 'expectAtMost',
    headerName: 'EXPECT_AT_MOST',
    type: 'number',
    sortable: false,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    editable: false
  }
];

export default columnsVmfsVmSpecNoMatch;
