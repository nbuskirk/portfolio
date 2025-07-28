import { isValidElement } from 'react';
import {
  getGridStringOperators,
  getGridNumericOperators,
  getGridDateOperators,
  getGridSingleSelectOperators,
  GridColDef,
  gridDetailPanelExpandedRowsContentCacheSelector,
  GridFilterOperator,
  GridRenderCellParams,
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
  useGridApiContext,
  useGridSelector
} from '@mui/x-data-grid-premium';

import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpIcon from '@mui/icons-material/Help';
import { Box, Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

import { formatDuration } from 'utils/helpers/time';
import { useTheme } from '@mui/material/styles';
import useCustomization from 'data-hooks/config/useCustomization';
import { useIntl } from 'react-intl';
import { JOB_PHASES_LINK } from 'constants/constants';
import DateTimeFilter from 'components/inc/DateTimeFilter';
import ChipStatus from '../ChipStatus';

import { isJobWithAlert } from '../../helpers/getJobs';

import getDurationColumnOperators from './GetDurationColumnOperators';

const filtStringOps = getGridStringOperators().filter(
  (op) =>
    !['isEmpty', 'isNotEmpty', 'doesNotContain', 'doesNotEqual'].includes(
      op.value
    )
);
const filtNumericOps = getGridNumericOperators().filter(
  (op) => !['isEmpty', 'isNotEmpty'].includes(op.value)
);
const filtDurationOps = getDurationColumnOperators();

const filtDateOps = getGridDateOperators().filter((op) =>
  ['is', 'after', 'before'].includes(op.value)
);
const betweenTimeOperator: GridFilterOperator = {
  label: 'between',
  value: 'between',
  getApplyFilterFn: () => {
    return null;
  },
  InputComponent: DateTimeFilter,
  InputComponentProps: {}
};

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
    field: 'job_state',
    headerName: 'Status',
    type: 'singleSelect',
    filterOperators: filtSingleSelectOps,
    /* Excluding running job states: Idle, Pending, Running, Canceling */
    valueOptions: [
      'Done',
      'Failed',
      'Partial',
      'Canceled'
      /* 'Alert' */
    ],
    filterable: true,
    sortable: true,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    width: 108,
    editable: false,
    renderCell: ChipStatus,
    align: 'left',
    headerAlign: 'left',
    valueGetter: (_value, row) => {
      const alertFlags = row?.alert_flags;
      if (isJobWithAlert(alertFlags)) {
        return 'Alert';
      }
      return row?.job_state;
    }
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
    disableColumnMenu: true,
    width: 130,
    editable: false,
    align: 'left',
    headerAlign: 'left',
    valueGetter: (_value, row) => {
      const currentPhase = row?.current_phase;
      return currentPhase !== '' ? currentPhase : '';
    }
  },
  {
    field: 'job_id',
    headerName: 'Job ID',
    type: 'number',
    filterOperators: filtNumericOps,
    filterable: true,
    sortable: true,
    sortingOrder: ['asc', 'desc'],
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    width: 98,
    editable: false,
    align: 'left',
    headerAlign: 'left'
  },
  {
    field: 'start_time_fmt',
    headerName: 'Start Time',
    type: 'string',
    filterOperators: [...filtDateOps, betweenTimeOperator],
    filterable: true,
    sortable: true,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    width: 160,
    editable: false,
    align: 'left',
    headerAlign: 'left'
  },
  {
    field: 'duration',
    headerName: 'Total Duration',
    type: 'string',
    filterOperators: filtDurationOps,
    filterable: true,
    sortable: true,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    width: 150,
    editable: false,
    align: 'left',
    headerAlign: 'left',
    valueGetter: (_value, row) => {
      return formatDuration(row?.duration);
    }
  },
  {
    field: 'policy',
    headerName: 'Policy',
    type: 'string',
    filterOperators: filtStringOps,
    filterable: true,
    sortable: true,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    width: 715,
    editable: false,
    align: 'left',
    headerAlign: 'left'
  },
  {
    ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
    renderCell: (params) => (
      <CustomDetailPanelToggle id={params.id} value={params.value} />
    )
  }
];

export default columns;
