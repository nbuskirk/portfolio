import { isValidElement } from 'react';
import {
  getGridDateOperators,
  getGridStringOperators,
  getGridSingleSelectOperators,
  GridColDef,
  gridDetailPanelExpandedRowsContentCacheSelector,
  GridFilterOperator,
  GridRenderCellParams,
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
  useGridApiContext,
  useGridSelector
} from '@mui/x-data-grid-premium';
import HelpIcon from '@mui/icons-material/Help';
import { useTheme } from '@mui/material/styles';
import useIsVendor from 'hooks/useIsVendor';
import useCustomization from 'data-hooks/config/useCustomization';
import { useUser } from 'utils/context/UserContext';
import useConfigurations from 'utils/useQuery/useConfigurations';
import InfoIcon from '@mui/icons-material/Info';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Tooltip, Typography } from '@mui/material';
import { formatDuration } from 'utils/helpers/time';
import ChipStatus from 'components/configure/jobs/components/ChipStatus';
import { isJobWithAlert } from 'components/configure/jobs/helpers/getJobs';
import { JOB_PHASES_LINK } from 'constants/constants';
import getDurationColumnOperators from 'components/configure/jobs/components/JobsTable/GetDurationColumnOperators';
import DateTimeFilter from 'components/inc/DateTimeFilter';
import { useIntl } from 'react-intl';
import DeltaBlock from '../components/Deltablock';
import PoliciesTableActions from '../components/PoliciesTable/PoliciesTableActions';

const betweenTimeOperator: GridFilterOperator = {
  label: 'between',
  value: 'between',
  getApplyFilterFn: () => {
    return null;
  },
  InputComponent: DateTimeFilter,
  InputComponentProps: {}
};
const filtDateOps = getGridDateOperators().filter((op) =>
  ['is', 'after', 'before'].includes(op.value)
);

const filtStringOps = getGridStringOperators().filter(
  (op) =>
    !['isEmpty', 'isNotEmpty', 'doesNotContain', 'doesNotEqual'].includes(
      op.value
    )
);
const filtDurationOps = getDurationColumnOperators();
const filtSingleSelectOps = getGridSingleSelectOperators().filter(
  (op) => !['not'].includes(op.value)
);

const CustomDetailPanelToggle = (
  props: Pick<GridRenderCellParams, 'id' | 'value'>
) => {
  const { id, value: isExpanded } = props;
  const apiRef = useGridApiContext();

  // To avoid calling ´getDetailPanelContent` all the time, the following selector
  // gives an object with the detail panel content for each row id.
  const contentCache = useGridSelector(
    apiRef,
    gridDetailPanelExpandedRowsContentCacheSelector
  );

  // If the value is not a valid React element, it means that the row has no detail panel.
  const hasDetail = isValidElement(contentCache[id]);

  return (
    <IconButton
      size='small'
      tabIndex={-1}
      disabled={!hasDetail}
      aria-label={isExpanded ? 'Close' : 'Open'}
    >
      <ExpandMoreIcon
        sx={(theme) => ({
          transform: `rotateZ(${isExpanded ? 180 : 0}deg)`,
          transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest
          })
        })}
        fontSize='inherit'
      />
    </IconButton>
  );
};

const columns: GridColDef[] = [
  {
    field: 'last_job_state',
    headerName: 'Status',
    type: 'singleSelect',
    filterOperators: filtSingleSelectOps,
    valueOptions: [
      'Idle',
      'Pending',
      'Running',
      'Done',
      'Failed',
      'Partial',
      'Canceling',
      'Canceled'
      /* 'Alert' */
    ],
    filterable: true,
    sortable: true,
    groupable: false,
    hideable: false,
    width: 108,
    editable: false,
    renderCell: ChipStatus,
    align: 'left',
    headerAlign: 'left',
    valueGetter: (_, row) => {
      const alertFlags = row?.last_job_alert_flags;
      if (alertFlags && isJobWithAlert(alertFlags)) {
        return 'Alert';
      }
      if (row?.last_job_state === '') {
        return 'Idle';
      }
      return row?.last_job_state;
    }
  },
  {
    field: 'display_name',
    headerName: 'Policy',
    type: 'string',
    filterOperators: filtStringOps,
    filterable: true,
    sortable: true,
    groupable: false,
    hideable: false,
    width: 310,
    editable: false
  },
  {
    field: 'policy_type',
    headerName: 'Policy Type',
    type: 'singleSelect',
    filterOperators: filtSingleSelectOps,
    valueOptions: ['Local', 'NFS', 'SMB', 'VMFS', 'SCSI'],
    filterable: true,
    sortable: true,
    groupable: false,
    hideable: false,
    width: 140,
    editable: false,
    align: 'left',
    headerAlign: 'left'
  },
  {
    field: 'storage_connector_name',
    headerName: 'Storage Connector Name',
    width: 150,
    editable: false,
    filterable: false
  },
  {
    field: 'last_job_number',
    headerName: 'Job Number',
    width: 150,
    editable: false,
    filterable: false
  },
  {
    field: 'current_phase',
    renderHeader: () => {
      const theme = useTheme();
      const intl = useIntl();
      const { data: customizations } = useCustomization();
      const disableHelpLinks = customizations?.disable_help_links === '1';
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}
          >
            Phase
          </Typography>
          <Tooltip
            title={intl.formatMessage({
              id: 'policy.table.phase.tooltip',
              defaultMessage: 'web help'
            })}
            placement='top'
          >
            <span>
              {disableHelpLinks ? (
                <InfoIcon
                  color='secondary'
                  sx={{ fontSize: '14px', margin: '0 0 -0.2em 0.3em' }}
                />
              ) : (
                <IconButton
                  sx={{ color: theme?.palette?.primary?.main }}
                  size='small'
                  href={JOB_PHASES_LINK}
                  target='_blank'
                >
                  <HelpIcon sx={{ height: '16px', width: '16px' }} />
                </IconButton>
              )}
            </span>
          </Tooltip>
        </Box>
      );
    },
    headerName: 'Phase',
    type: 'singleSelect',
    filterOperators: filtSingleSelectOps,
    valueOptions: [
      'Initializing',
      'Scanning',
      'Scanning & Indexing',
      'Indexing',
      'Postprocessing',
      'Generating Statistics',
      'Analyzing Statistics',
      'Canceling'
    ],
    filterable: true,
    sortable: true,
    groupable: false,
    hideable: false,
    width: 130,
    editable: false,
    valueGetter: (_, row) => {
      const currentPhase = row?.current_phase;
      return currentPhase !== '' ? currentPhase : '';
    }
  },
  {
    field: 'lastrun',
    headerName: 'Start Time',
    type: 'number',
    filterable: true,
    filterOperators: [...filtDateOps, betweenTimeOperator],
    sortable: true,
    width: 175,
    editable: false,
    align: 'left',
    headerAlign: 'left'
  },
  {
    field: 'last_job_total_duration',
    headerName: 'Total Duration',
    type: 'string',
    filterOperators: filtDurationOps,
    filterable: true,
    sortable: true,
    groupable: false,
    width: 150,
    editable: false,
    valueGetter: (_value, row) => {
      const duration = row?.last_job_total_duration;
      if (duration === undefined || duration === -1) {
        return 'NA';
      }
      return formatDuration(duration);
    }
  },
  {
    field: 'deltablock',
    headerName: 'Delta Block',
    width: 250,
    editable: false,
    sortable: false,
    renderHeader: () => {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            gap: '5px'
          }}
        >
          <Typography
            sx={{
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase'
            }}
          >
            Delta Block Analysis
          </Typography>
          <Tooltip
            arrow
            title={`"Use CR Setting" is generally recommended, indicating that CyberSense will use Cyber Recovery's Delta Block Analysis (DBA) setting to enable or disable DBA when this policy is run.`}
            placement='right'
            sx={{ marginLeft: '0.25rem', marginY: '-.4rem' }}
          >
            <InfoIcon sx={{ width: '16px', height: '16px' }} />
          </Tooltip>
        </Box>
      );
    },
    renderCell: ({ value, row, rowNode }) => {
      if (rowNode.type === 'group' && value === 'Force Full Scan')
        return 'Force Full Scan';
      if (rowNode.type === 'group' && value === 'Use CR Setting')
        return 'Use CR Setting';
      if (rowNode.type === 'group') return null;
      return <DeltaBlock value={value} name={row.name} />;
    }
  },
  {
    field: 'action',
    headerName: 'Actions',
    width: 125,
    editable: false,
    filterable: false,
    sortable: false,
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
        <PoliciesTableActions
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
    ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
    renderCell: (params) => (
      <CustomDetailPanelToggle id={params.id} value={params.value} />
    )
  }
];

const usePolicyTableColumns = () => {
  const { canAccess } = useUser();
  const { vendor, isLoading } = useIsVendor('dell');
  const { data } = useCustomization();
  const { configurations, configurationsLoading } = useConfigurations();

  const loading = isLoading || configurationsLoading;

  let newcolumns = [...columns];
  if (
    loading ||
    !vendor ||
    configurations?.dba?.allow_dba_disable === '0' ||
    configurations?.dba?.allow_dba_disable === undefined ||
    !canAccess('policyjob')
  ) {
    newcolumns = newcolumns.filter((column) => column.field !== 'deltablock');
  }

  if (data?.policies_disableColumnsProvider === '1' || loading) {
    newcolumns = newcolumns.filter(
      (column) => column.field !== 'storage_connector_name'
    );
  }

  return {
    columns: newcolumns,
    isPolicyTableColumnsLoading: isLoading || configurationsLoading
  } as const;
};

export default usePolicyTableColumns;
