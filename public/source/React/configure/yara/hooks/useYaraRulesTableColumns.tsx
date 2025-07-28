import {
  getGridDateOperators,
  getGridStringOperators,
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
  GridColDef,
  GridFilterOperator,
  GridRenderCellParams
} from '@mui/x-data-grid-premium';
import { ieTimezone, useIeSystem } from 'data-hooks/useIeSystem';
import { endOfDay, format, startOfDay } from 'date-fns';
import changeTimezone from 'utils/helpers/timezone';
import { useUser } from 'utils/context/UserContext';
import DateTimeFilter from 'components/inc/DateTimeFilter';
import YaraRulesTableActions from '../components/YaraRulesTable/YaraRulesTableActions';
import YaraRulesEnableSwitch from '../components/YaraRulesTable/YaraRulesEnableSwitch';

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

const useYaraRulesTableColumns = () => {
  const { session } = useUser();
  const { data: ie, isLoading } = useIeSystem({ session });

  const columns: GridColDef[] = [
    {
      field: 'display_name',
      headerName: 'Name',
      width: 200,
      hideable: false,
      flex: 1,
      type: 'string',
      filterOperators: stringOperators
    },
    {
      field: 'severity',
      headerName: 'Severity',
      width: 100,
      type: 'singleSelect',
      valueOptions: ['Critical', 'High', 'Medium', 'Low']
    },
    {
      field: 'last_modified',
      headerName: 'Last Modified',
      type: 'date',
      width: 175,
      hideable: false,
      valueGetter: (value) => {
        return new Date(value * 1000);
      },
      valueFormatter: (value) => {
        return format(
          changeTimezone(value, ieTimezone(ie)),
          'yyyy-MM-dd HH:mm:ss'
        );
      },
      filterOperators: dateOperators
    },
    {
      field: 'modifier',
      headerName: 'Modifier',
      width: 100,
      filterOperators: stringOperators
    },
    {
      field: 'created',
      headerName: 'Date Created',
      type: 'date',
      width: 175,
      hideable: false,
      valueGetter: (value) => {
        return new Date(value * 1000);
      },
      valueFormatter: (value) => {
        return format(
          changeTimezone(value, ieTimezone(ie)),
          'yyyy-MM-dd HH:mm:ss'
        );
      },
      filterOperators: dateOperators
    },
    {
      field: 'creator',
      headerName: 'Creator',
      width: 100,
      filterOperators: stringOperators
    },
    {
      field: 'action',
      headerName: 'Actions',
      width: 75,
      disableExport: true,
      disableColumnMenu: true,
      sortable: false,
      hideable: false,
      filterable: false,
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
        return (
          <YaraRulesTableActions
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
    },
    {
      field: 'enabled',
      headerName: 'Enabled',
      width: 150,
      hideable: false,
      type: 'boolean',
      renderCell: (params: GridRenderCellParams) => {
        return <YaraRulesEnableSwitch row={params.row} />;
      }
    },
    { ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF }
  ];

  return {
    columns,
    isLoading
  };
};

export default useYaraRulesTableColumns;
