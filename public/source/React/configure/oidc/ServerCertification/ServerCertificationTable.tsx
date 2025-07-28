import { ExpandMoreOutlined, ExpandLessOutlined } from '@mui/icons-material';
import {
  GridRowParams,
  DataGridPremium,
  DataGridPremiumProps
} from '@mui/x-data-grid-premium';
import { useCallback, ReactNode } from 'react';
import { ServerCertificate } from 'data-hooks/oidc/oidcConfig.types';
import useSingleRowExpansion from 'components/configure/yara/hooks/useSingleRowExpansion';
import ServerCertificationTableDetailPanel from './ServerCertificationDetailPanel';
import formatServerCertificates, {
  ServerCertificateFormatted
} from '../utils/formatServerCertificates';
import useServerCertificationTableColumns from '../hooks/useServerCertificationTableColumns';

interface Props {
  serverCertificates: ServerCertificate[];
  rowSelectionModel: DataGridPremiumProps['rowSelectionModel'];
  onRowSelectionModelChange?: DataGridPremiumProps['onRowSelectionModelChange'];
}

const ServerCertificationTable = ({
  serverCertificates,
  rowSelectionModel,
  onRowSelectionModelChange
}: Props) => {
  const { expandedRowId, handleExpansionChange } = useSingleRowExpansion();

  const columns = useServerCertificationTableColumns();

  const serverCertificatesFormatted =
    formatServerCertificates(serverCertificates);

  const getDetailPanelContent = useCallback(
    (params: GridRowParams<ServerCertificateFormatted>): ReactNode => {
      return <ServerCertificationTableDetailPanel params={params} />;
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
      rows={serverCertificatesFormatted ?? []}
      autoHeight
      columns={columns}
      disableRowGrouping
      rowSelectionModel={rowSelectionModel}
      onRowSelectionModelChange={onRowSelectionModelChange}
      getRowId={(row) => row.date_uploaded!}
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

export default ServerCertificationTable;
