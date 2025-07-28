import { IconButton } from '@mui/material';
import { getGridStringOperators, GridColDef } from '@mui/x-data-grid-premium';
import EditIcon from '@mui/icons-material/Edit';

export type ParrernGridRow = {
  pattern: string;
  id: number;
};

const PatternColumns = (handleEdit: { (row: ParrernGridRow): void }) => {
  const includOperators = ['contains', 'startsWith', 'endsWith', 'equals'];
  const columns: GridColDef[] = [
    {
      field: 'pattern',
      headerName: 'Filename Pattern',
      width: 350,
      editable: false,
      renderCell: (params) => <p>{params.value}</p>,
      filterOperators: getGridStringOperators().filter((operator) =>
        includOperators.includes(operator.value)
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      filterable: false,
      disableExport: true,
      renderCell: (params) => {
        return (
          <IconButton
            aria-label='edit'
            color='primary'
            size='small'
            onClick={() => handleEdit(params.row)}
          >
            <EditIcon fontSize='small' />
          </IconButton>
        );
      }
    }
  ];
  return columns;
};

export default PatternColumns;
