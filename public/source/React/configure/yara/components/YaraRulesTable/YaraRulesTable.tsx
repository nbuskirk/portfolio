import {
  DataGridPremium,
  DataGridPremiumProps,
  GridColDef,
  GridPaginationModel,
  GridRowParams
} from '@mui/x-data-grid-premium';
import { ReactNode, useCallback, useState } from 'react';
import { ExpandLessOutlined, ExpandMoreOutlined } from '@mui/icons-material';
import IETableFooter from 'components/shared/IETableFooter';
import useQueryYaraRules from 'data-hooks/yara/useQueryYaraRules';
import useConfigInfo from 'data-hooks/useConfigInfo';
import { YaraRule } from 'data-hooks/yara/yara.types';
import { Box } from '@mui/material';
import YaraRulesTableToolbar from './YaraRulesTableToolbar';
import useYaraRulesTableColumns from '../../hooks/useYaraRulesTableColumns';
import YaraRulesTableDetailPanel from './YaraRulesTableDetailPanel';
import useSingleRowExpansion from '../../hooks/useSingleRowExpansion';

interface Props {
  rowSelectionModel: DataGridPremiumProps['rowSelectionModel'];
  onRowSelectionModelChange?: DataGridPremiumProps['onRowSelectionModelChange'];
}

const YaraRulesTable = ({
  rowSelectionModel,
  onRowSelectionModelChange
}: Props) => {
  const { expandedRowId, handleExpansionChange } = useSingleRowExpansion();
  const { columns, isLoading: isColumnsLoading } = useYaraRulesTableColumns();
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10
  });
  const { data: configInfo, isLoading: configIsLoading } = useConfigInfo();
  const { fedid, indexid } = configInfo ?? {};
  const { data: yaraRules, isLoading: yaraRulesIsLoading } = useQueryYaraRules({
    fedId: fedid,
    indexId: indexid
  });

  const getDetailPanelContent = useCallback(
    (params: GridRowParams<YaraRule>): ReactNode => {
      return <YaraRulesTableDetailPanel params={params} />;
    },
    []
  );

  const getTogglableColumns = (cols: GridColDef[]) => {
    return cols
      .filter(
        (column) =>
          column.field !== '__check__' &&
          column.field !== '__detail_panel_toggle__' &&
          column.field !== 'action'
      )
      .map((column) => column.field);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', maxHeight: '600px' }}>
      <DataGridPremium
        slots={{
          toolbar: YaraRulesTableToolbar,
          footer: IETableFooter,
          detailPanelExpandIcon: ExpandMoreOutlined,
          detailPanelCollapseIcon: ExpandLessOutlined
        }}
        slotProps={{
          columnsManagement: {
            getTogglableColumns
          },
          footer: {
            totalTableLength: yaraRules?.length ?? 0,
            paginationModel,
            setPaginationModel
          }
        }}
        localeText={{ toolbarExport: 'Download' }}
        density='compact'
        disableAggregation
        loading={yaraRulesIsLoading || isColumnsLoading || configIsLoading}
        rows={yaraRules ?? []}
        pagination
        paginationModel={paginationModel}
        columns={columns}
        disableRowGrouping
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={onRowSelectionModelChange}
        getRowId={(row) => row.ruleset_name!}
        getDetailPanelContent={getDetailPanelContent}
        onDetailPanelExpandedRowIdsChange={handleExpansionChange}
        detailPanelExpandedRowIds={expandedRowId}
        getDetailPanelHeight={() => 'auto'}
        checkboxSelection
        pageSizeOptions={[5, 10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } }
        }}
      />
    </Box>
  );
};

export default YaraRulesTable;
