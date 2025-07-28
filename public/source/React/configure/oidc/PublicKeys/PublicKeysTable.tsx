import { ExpandMoreOutlined, ExpandLessOutlined } from '@mui/icons-material';
import {
  GridRowParams,
  DataGridPremium,
  DataGridPremiumProps
} from '@mui/x-data-grid-premium';
import { useCallback, ReactNode } from 'react';
import { PublicKey } from 'data-hooks/oidc/oidcConfig.types';
import useSingleRowExpansion from 'components/configure/yara/hooks/useSingleRowExpansion';
import usePublicKeyTableColumns from '../hooks/usePublicKeyTableColumns';
import PublicKeysTableDetailPanel from './PublicKeysTableDetailPanel';

interface Props {
  publicKeys: PublicKey[];
  rowSelectionModel: DataGridPremiumProps['rowSelectionModel'];
  onRowSelectionModelChange?: DataGridPremiumProps['onRowSelectionModelChange'];
}

const PublicKeysTable = ({
  publicKeys,
  rowSelectionModel,
  onRowSelectionModelChange
}: Props) => {
  const { expandedRowId, handleExpansionChange } = useSingleRowExpansion();

  const columns = usePublicKeyTableColumns();

  const getDetailPanelContent = useCallback(
    (params: GridRowParams<PublicKey>): ReactNode => {
      return <PublicKeysTableDetailPanel params={params} />;
    },
    []
  );

  return (
    <DataGridPremium
      slots={{
        detailPanelExpandIcon: ExpandMoreOutlined,
        detailPanelCollapseIcon: ExpandLessOutlined
      }}
      localeText={{ toolbarExport: 'Download' }}
      density='compact'
      disableAggregation
      hideFooter
      rows={publicKeys ?? []}
      columns={columns}
      disableRowGrouping
      rowSelectionModel={rowSelectionModel}
      onRowSelectionModelChange={onRowSelectionModelChange}
      getRowId={(row) => row.kid!}
      getDetailPanelContent={getDetailPanelContent}
      onDetailPanelExpandedRowIdsChange={handleExpansionChange}
      detailPanelExpandedRowIds={expandedRowId}
      getDetailPanelHeight={() => 'auto'}
      checkboxSelection
      initialState={{
        columns: {
          columnVisibilityModel: {
            date_uploaded: false
          }
        }
      }}
    />
  );
};

export default PublicKeysTable;
