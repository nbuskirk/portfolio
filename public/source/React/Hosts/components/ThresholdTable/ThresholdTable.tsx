import {
  DataGridPremium,
  DataGridPremiumProps,
  GridFilterModel,
  GridPaginationModel,
  GridColDef
} from '@mui/x-data-grid-premium';
import useThresholdTableColumns from 'components/Hosts/hooks/useThresholdTableColumns';
import useThresholdTableData from 'components/Hosts/hooks/useThresholdTableData';
import React, { useState } from 'react';
import { Box } from '@mui/material';
import IETableFooter from 'components/shared/IETableFooter';
import ThresholdTableToolbar from './ThresholdTableToolbar';
import ThresholdTableExpandedPanel from './ThresholdTableExpandedPanel';

const ThresholdTable = () => {
  const [filters, setFilters] = useState<GridFilterModel>(() => {
    return {
      items: []
    };
  });
  const { columns } = useThresholdTableColumns();
  const { thresholds, thresholdsIsLoading } = useThresholdTableData();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10
  });

  const getDetailPanelContent = React.useCallback<
    NonNullable<DataGridPremiumProps['getDetailPanelContent']>
  >(({ row }) => <ThresholdTableExpandedPanel row={row} />, []);

  const getTogglableColumns = (cols: GridColDef[]) => {
    return cols
      .filter((column) => column.field !== '__detail_panel_toggle__')
      .map((column) => column.field);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <DataGridPremium
        density='compact'
        disableAggregation
        sx={{
          marginTop: '1em',
          '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus':
            {
              outline: 'none'
            },
          '& .enabled, & .format, & .type': {
            textTransform: 'capitalize'
          },
          width: '100%'
        }}
        loading={thresholdsIsLoading}
        rows={thresholds || []}
        pagination
        paginationModel={paginationModel}
        columns={columns}
        filterModel={filters}
        onFilterModelChange={(filterArray: GridFilterModel) => {
          setFilters(filterArray);
        }}
        disableMultipleRowSelection
        pageSizeOptions={[5, 10, 25, 50]}
        slots={{ toolbar: ThresholdTableToolbar, footer: IETableFooter }}
        slotProps={{
          footer: {
            totalTableLength: thresholds?.length ?? 0,
            paginationModel,
            setPaginationModel
          },
          columnsManagement: {
            getTogglableColumns
          }
        }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
          columns: {
            columnVisibilityModel: {
              id: false
            }
          },
          sorting: {
            sortModel: [{ field: 'update_time', sort: 'desc' }]
          }
        }}
        getDetailPanelContent={getDetailPanelContent}
        getDetailPanelHeight={() => 'auto'}
      />
    </Box>
  );
};

export default ThresholdTable;
