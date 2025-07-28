import {
  GridColDef,
  GridFilterItem,
  GridFilterOperator,
  GridRenderCellParams,
  getGridDateOperators,
  getGridStringOperators
} from '@mui/x-data-grid-premium';
import { useUser } from 'utils/context/UserContext';
import { useIeSystem } from 'data-hooks/useIeSystem';
import DateTimeFilter from 'components/inc/DateTimeFilter';
import { endOfDay, startOfDay } from 'date-fns';
import { Box, Typography } from '@mui/material';
import { getTimeDisplayString } from 'utils/helpers/alertHelpers';
import ThresholdTableActions from '../components/ThresholdTable/ThresholdTableActions';
import { thresholdTableTypeLookup } from '../utils/dailyGraphConfig';

const allowedStringFilters = ['contains', 'equals', 'startsWith', 'endsWith'];

const allowedDateFilters = ['is', 'between', 'after', 'before'];

const betweenTimeOperator: GridFilterOperator = {
  label: 'between',
  value: 'between',
  getApplyFilterFn: (filterItem) => {
    if (!filterItem.field || !filterItem.value || !filterItem.operator) {
      return null;
    }
    return (value) => {
      const [min, max] = filterItem.value;
      return startOfDay(min) <= value && value <= endOfDay(max);
    };
  },
  InputComponent: DateTimeFilter,
  InputComponentProps: {}
};

const stringOperators = getGridStringOperators().filter((operator) =>
  allowedStringFilters.includes(operator.value)
);

const dateOperators = [...getGridDateOperators(), betweenTimeOperator].filter(
  (operator) => allowedDateFilters.includes(operator.value)
);

// For the `type` column, the user sees lookup values from thresholdTableTypeLookup.
// Create a filter that filters on lookup value rather than the raw type value from REST users don't interact with.
const typeFilterOperators = stringOperators.map((operator) => ({
  ...operator,
  getApplyFilterFn: (filterItem: GridFilterItem, gridColumn: GridColDef) => {
    if (!filterItem.field || !filterItem.value || !filterItem.operator) {
      return null;
    }

    // Get the display value users are seeing in the table and will be searching on.
    const getDisplayValue = (rawValue: any) =>
      thresholdTableTypeLookup[
        rawValue as keyof typeof thresholdTableTypeLookup
      ] || (rawValue ? rawValue.toString().replace(/_/g, ' ') : '');

    // Get the original filter function
    const originalFilterFn = operator.getApplyFilterFn?.(
      filterItem,
      gridColumn
    );
    if (!originalFilterFn) return null;

    // Return filter function that applies original logic to display values instead of raw values.
    return (
      value: any,
      row: any,
      column: GridColDef,
      apiRef: React.MutableRefObject<any>
    ) => originalFilterFn(getDisplayValue(value), row, column, apiRef);
  }
}));

const columns: GridColDef[] = [
  /*
  {
    field: 'id',
    headerName: 'ID',
    width: 100,
    editable: false
  },
  */
  {
    field: 'name',
    headerName: 'Name',
    width: 300,
    editable: false,
    hideable: false,
    filterOperators: stringOperators
  },
  {
    field: 'type',
    headerName: 'Type',
    width: 200,
    editable: false,
    valueFormatter: (value?: string) => {
      if (value !== undefined) {
        return (
          thresholdTableTypeLookup[
            value as keyof typeof thresholdTableTypeLookup
          ] || value.replace(/_/g, ' ')
        );
      }
      return '';
    },
    cellClassName: 'type',
    filterOperators: typeFilterOperators
  },
  /*
  {
    field: 't_name',
    headerName: 'Format',
    width: 125,
    editable: false,
    cellClassName: 'format'
  },
  */
  {
    field: 'enabled_state',
    headerName: 'Enabled',
    width: 150,
    editable: false,
    cellClassName: 'enabled',
    type: 'boolean',
    renderCell: (params: GridRenderCellParams) => {
      return params.value ? 'Enabled' : 'Disabled';
    }
  },
  {
    field: 'update_time',
    headerName: 'Last Modified',
    width: 175,
    editable: false,
    hideable: false,
    renderCell: (params) => {
      const { session } = useUser();
      const { data: systemInfo } = useIeSystem({ session });
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography sx={{ fontSize: '14px' }}>
            {systemInfo && params?.row?.update_time
              ? getTimeDisplayString(params?.row?.update_time, systemInfo)
              : 'n/a'}
          </Typography>
        </Box>
      );
    },
    valueGetter: (value) => {
      return new Date(value * 1000);
    },
    filterOperators: dateOperators
  },
  {
    field: 'host',
    headerName: 'Host',
    width: 175,
    editable: false,
    hideable: false,
    filterOperators: stringOperators
  },
  {
    field: 'action',
    headerName: 'Actions',
    width: 115,
    editable: false,
    hideable: false,
    filterable: false,
    disableExport: true,
    renderCell: ({
      api,
      field,
      row,
      id,
      rowNode,
      colDef,
      cellMode,
      hasFocus,
      tabIndex
    }) => {
      if (rowNode.type === 'group') return null;
      return (
        <ThresholdTableActions
          api={api}
          field={field}
          row={row}
          id={id}
          rowNode={rowNode}
          colDef={colDef}
          cellMode={cellMode}
          hasFocus={hasFocus}
          tabIndex={tabIndex}
        />
      );
    }
  }
];

const useThresholdTableColumns = () => {
  return {
    columns
  } as const;
};

export default useThresholdTableColumns;
