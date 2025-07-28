import { ReactNode, useCallback, useState, useEffect } from 'react';

import {
  DataGridPremium,
  DataGridPremiumProps,
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
  GridFilterModel,
  GridPaginationModel,
  GridSortItem,
  GridSortModel
} from '@mui/x-data-grid-premium';

import usePolicyTableColumns from 'components/Policies/hooks/usePolicyTableColumns';
import JobsTableExpandedPanel from 'components/configure/jobs/components/JobsTable/JobsTableExpandedPanel';
import { ExpandedJob } from 'data-hooks/policies/useJobs';
import IETableFooter from 'components/shared/IETableFooter';
import useLocalStorage from 'hooks/useLocalstorage';
import { LocalStorageKeys } from 'constants/constants';
import CustomLocalExportToolbar from 'components/inc/CustomLocalExportToolbar';
import preprocessPolicies from './PoliciesTableUtils';
import usePolicyData from '../../hooks/usePolicyData';

const { POLICIES_FILTER_MODEL, POLICIES_PAGINATION_MODEL } = LocalStorageKeys;

const PoliciesTable = (): ReactNode => {
  const [selectedPolicyId, setSelectedPolicyId] = useState<
    number | undefined
  >();
  const [filters, setFilters] = useLocalStorage<GridFilterModel>(
    POLICIES_FILTER_MODEL,
    { items: [] }
  );
  const filterModelItems = filters.items;

  const { columns, isPolicyTableColumnsLoading } = usePolicyTableColumns();

  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'lastrun', sort: 'desc' }
  ]);
  const [selectedColumn, setSelectedColumn] = useState();

  const [paginationModel, setPaginationModel] =
    useLocalStorage<GridPaginationModel>(POLICIES_PAGINATION_MODEL, {
      page: 0,
      pageSize: 10
    });

  const {
    formattedData: policies,
    totalPolicies,
    systemTime,
    loading
  } = usePolicyData(paginationModel, sortModel, filterModelItems);

  const handleRowSelection: DataGridPremiumProps['onRowSelectionModelChange'] =
    (newSelection) => {
      setSelectedPolicyId(newSelection[0] as number);
    };

  const policiesMap = preprocessPolicies(policies);

  const onFilterChange = useCallback(
    (model: { items: any[] }) => {
      setFilters(model);
      // console.log(`onFilterChange: model: ${JSON.stringify(model)}`);
      function containsKey(obj: Record<string, number>, key: string) {
        return !!Object.keys(obj).find(
          (k) => k.toLowerCase() === key.toLowerCase()
        );
      }
      function isCompleteValue(item: {
        value: string;
        columnField: string;
        operatorValue: string;
      }) {
        if (
          item.columnField === 'policy' &&
          item.operatorValue === 'equals' &&
          !containsKey(policiesMap, item.value)
        ) {
          return false;
        }
        return true;
      }
      if (model.items.every(isCompleteValue)) {
        if (
          totalPolicies &&
          paginationModel.pageSize * paginationModel.page > totalPolicies
        ) {
          setPaginationModel({ ...paginationModel, page: 0 });
        }
      }
    },
    [policiesMap, paginationModel, totalPolicies]
  );

  // When a column is unsorted from menu, remove that column from sortModel,
  // including before adding it at the beginning of the sortMOdel
  //
  // onSortModelChange is called with empty GridSortModel when toggling the sort order on the column
  const onSortModelChange = useCallback(
    (model: GridSortModel) => {
      // console.log(`onSortModelChange: model: ${JSON.stringify(model)}`);
      // console.log(`onSortModelChange: sortModel: ${JSON.stringify(sortModel)}`);
      if (model.length === 0) {
        if (selectedColumn) {
          // Unsort the column
          const newSortModel = sortModel.filter(
            (item) => item.field !== selectedColumn
          );
          // console.log(`onSortModelChange 1: newSortModel: ${JSON.stringify(newSortModel)}`);
          setSortModel([...newSortModel]);
        } else {
          // Toggle the sort order of the sorted column
          const newSortModel = sortModel.map(
            (item) =>
              ({
                'field': item.field,
                'sort': item.sort === 'desc' ? 'asc' : 'desc'
              }) as GridSortItem
          );
          // console.log(`onSortModelChange 2: newSortModel: ${JSON.stringify(newSortModel)}`);
          setSortModel([...newSortModel]);
        }
      } else {
        // Remove sorted column from sortModel before adding it at the beginning of sortModel
        const curSortModel = sortModel;
        let mergedSortModel = curSortModel.filter(
          (item) => item.field !== model[0].field
        );
        if (mergedSortModel.length !== 0) {
          mergedSortModel = model.concat(mergedSortModel);
          // console.log(`onSortModelChange 3: mergedSortMOdel: ${JSON.stringify(mergedSortModel)}`);
          setSortModel([...mergedSortModel]);
        } else {
          // Set sortModel to model
          // console.log(`onSortModelChange 4: newSortModel: ${JSON.stringify(model)}`);
          setSortModel([...model]);
        }
      }
    },
    [selectedColumn, sortModel]
  );

  const onMenuOpen = (ps: any) => {
    setSelectedColumn(ps?.target?.offsetParent?.dataset?.field);
  };

  useEffect(() => {
    if (policies && policies.length > 0) {
      onFilterChange(filters);
    }
  }, [policies, filters]);

  const getDetailPanelContent = useCallback<
    NonNullable<DataGridPremiumProps['getDetailPanelContent']>
  >(
    ({ row }) => {
      const expandedJob: ExpandedJob = {
        'job_id': row.last_job_number,
        'job_state': row.last_job_state,
        'job_phases': row.last_job_phases,
        'bscompleted_workload': row.last_bscompleted_workload
      };
      return (
        <JobsTableExpandedPanel row={expandedJob} systemTime={systemTime} />
      );
    },
    [systemTime]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <DataGridPremium
        density='compact'
        disableAggregation
        sx={{
          marginTop: '1em',
          '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus':
            {
              outline: 'none'
            }
        }}
        rows={policies}
        columns={columns}
        filterMode='server'
        loading={loading || isPolicyTableColumnsLoading}
        filterModel={filters}
        onFilterModelChange={onFilterChange}
        onMenuOpen={onMenuOpen}
        disableColumnSelector
        disableRowGrouping
        disableColumnPinning
        disableMultipleRowSelection
        pageSizeOptions={[5, 10, 25, 50]}
        rowSelectionModel={selectedPolicyId ? [selectedPolicyId] : []}
        onRowSelectionModelChange={handleRowSelection}
        slots={{
          toolbar: CustomLocalExportToolbar,
          footer: IETableFooter
        }}
        slotProps={{
          footer: {
            totalTableLength: totalPolicies ?? 0,
            paginationModel,
            setPaginationModel
          },
          toolbar: {
            filePrefix: 'policies_'
          }
        }}
        paginationModel={paginationModel}
        onSortModelChange={onSortModelChange}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          sorting: { sortModel: [{ field: 'lastrun', sort: 'desc' }] },
          columns: {
            columnVisibilityModel: {
              last_job_number: false,
              storage_connector_name: false
            }
          },
          // PIN the drop down to the right of the table
          pinnedColumns: {
            right: [GRID_DETAIL_PANEL_TOGGLE_FIELD]
          }
        }}
        getDetailPanelContent={getDetailPanelContent}
        getDetailPanelHeight={() => 'auto'}
      />
    </div>
  );
};

export default PoliciesTable;
