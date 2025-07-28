import ListIcon from '@mui/icons-material/List';
import { useNavigate } from 'react-router-dom';
import { useUser } from 'utils/context/UserContext';
import { IconButton, Tooltip } from '@mui/material';
import { Edit } from '@mui/icons-material';
import CancelIcon from '@mui/icons-material/Cancel';
import StopCircleOutlinedIcon from '@mui/icons-material/StopCircleOutlined';
import {
  GridRenderCellParams,
  GridTreeNodeWithRender
} from '@mui/x-data-grid-premium';
import { useTheme } from '@mui/material/styles';
import useCustomization from 'data-hooks/config/useCustomization';
import useMutateRunPolicy from 'data-hooks/policies/useMutateRunPolicy';
import useMutateCancelPolicy from 'data-hooks/policies/useMutateCancelPolicy';
import { JobState } from 'data-hooks/policies/useJobs';
import PlayCircleFilledOutlinedIcon from '@mui/icons-material/PlayCircleFilledOutlined';

import { useQueryClient } from '@tanstack/react-query';
import { POLICIES } from 'constants/queryKeys';
import useStorageConnectors, {
  StorageConnectors
} from 'components/Policies/hooks/useStorageConnectors';
import { Policy } from 'components/Policies/hooks/usePolicyData';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import { isTermJobState } from 'components/configure/jobs/helpers/getJobs';

const generateToolTipText = (
  row: Policy,
  disabled: boolean,
  storageConnectors: StorageConnectors,
  defaultText: string
) => {
  if (storageConnectors.length === 0)
    return 'This action is disabled because no storage connectors are installed.';
  if (row.storage_connector_name === undefined)
    return 'View, Edit, and Delete are not available for this policy';
  if (disabled) return 'You do not have permission for this action';
  return defaultText;
};

const generateRunToolTipText = (
  row: Policy,
  disabled: boolean,
  storageConnectors: StorageConnectors
) => {
  if (storageConnectors.length === 0)
    return 'This action is disabled because no storage connectors are installed.';
  if (row.storage_connector_name === undefined)
    return 'This policy cannot be run from the user interface.';
  if (disabled) return 'You do not have permission for this action';
  return 'Run policy';
};

const isIndexingPhaseStarted = (row: Policy) => {
  const jobPhases = row.last_job_phases;
  const indexingPhase = jobPhases.find(
    (jobPhase) => jobPhase.job_phase_type === 'indexing'
  );
  return indexingPhase && indexingPhase.starttm;
};

const isIndexingPhaseEnded = (row: Policy) => {
  const jobPhases = row.last_job_phases;
  const indexingPhase = jobPhases.find(
    (jobPhase) => jobPhase.job_phase_type === 'indexing'
  );
  return indexingPhase && indexingPhase.endtm;
};

const generateDefaultCancelTooltipText = (row: Policy) => {
  const verb = `${isIndexingPhaseStarted(row) ? 'Stop' : 'Cancel'}`;
  return `${verb} this policy job`;
};

const generateCancelToolTipText = (
  row: Policy,
  disabled: boolean,
  storageConnectors: StorageConnectors
) => {
  if (storageConnectors.length === 0)
    return 'This action is disabled because no storage connectors are installed.';
  if (row.storage_connector_name === undefined)
    return 'This policy cannot be canceled from the user interface.';
  if (disabled) return 'You do not have permission for this action';
  return generateDefaultCancelTooltipText(row);
};

const PlayAction = ({ row, disabled }: any) => {
  const theme = useTheme();
  const { session } = useUser();
  const mutateRunPolicy = useMutateRunPolicy({ session });
  const queryClient = useQueryClient();
  const { showSuccessSnackbar } = useSnackbarContext();

  const runPolicy = async () => {
    await mutateRunPolicy
      .mutateAsync({
        payloadToPatch: {
          start: true
        },
        id: row.name
      })
      .then(() =>
        showSuccessSnackbar(
          `Success: ${row.display_name} policy start requested!`
        )
      )
      .finally(() => {
        queryClient.invalidateQueries({ queryKey: [POLICIES] });
      });
  };
  return (
    <IconButton
      aria-label='play'
      sx={{ color: theme?.palette?.primary?.main }}
      onClick={runPolicy}
      disabled={disabled}
    >
      <PlayCircleFilledOutlinedIcon />
    </IconButton>
  );
};

const StopAction = ({ row, disabled }: any) => {
  const theme = useTheme();
  const { session } = useUser();
  const mutateCancelPolicy = useMutateCancelPolicy({ session });
  const queryClient = useQueryClient();
  const { showSuccessSnackbar } = useSnackbarContext();

  const cancelPolicy = async () => {
    mutateCancelPolicy
      .mutateAsync({
        payloadToPatch: {
          cancel: true
        },
        id: row.name,
        jobid: row.last_job_number
      })
      .then(() =>
        showSuccessSnackbar(
          `Success: ${row.display_name} policy ${
            isIndexingPhaseStarted(row) ? 'stop' : 'cancel'
          }  requested!`
        )
      )
      .finally(() => {
        queryClient.invalidateQueries({ queryKey: ['POLICIES'] });
      });
  };

  return (
    <IconButton
      aria-label='stop'
      sx={{ color: theme?.palette?.primary?.main }}
      onClick={cancelPolicy}
      disabled={disabled}
    >
      {isIndexingPhaseStarted(row) ? (
        <StopCircleOutlinedIcon />
      ) : (
        <CancelIcon />
      )}
    </IconButton>
  );
};

const PoliciesTableActions = ({
  row
}: GridRenderCellParams<Policy, any, any, GridTreeNodeWithRender>) => {
  const { canAccess } = useUser();
  const navigate = useNavigate();
  const noIngestionRun = !canAccess('policyjob');
  const theme = useTheme();
  const { data } = useCustomization();
  const storageConnectorsQuery = useStorageConnectors();

  return (
    <div>
      {data?.policies_disableActionsEdit !== '1' && (
        <Tooltip
          title={generateToolTipText(
            row,
            noIngestionRun,
            storageConnectorsQuery.data ?? [],
            'View, Edit, or Delete'
          )}
          placement='top'
        >
          <span>
            <IconButton
              aria-label='edit'
              disabled={
                noIngestionRun ||
                row.storage_connector_name === undefined ||
                storageConnectorsQuery.isLoading ||
                (storageConnectorsQuery.isSuccess &&
                  storageConnectorsQuery.data.length === 0)
              }
              sx={{ color: theme?.palette?.primary?.main }}
              onClick={() => navigate(`/dashboard/policies/${row.policy}`)}
            >
              <Edit />
            </IconButton>
          </span>
        </Tooltip>
      )}
      <Tooltip title='View Policy Log' placement='top'>
        <span>
          <IconButton
            aria-label='log'
            sx={{ color: theme?.palette?.primary?.main }}
            onClick={() => {
              const params = new URLSearchParams({ policy: row.display_name });
              navigate( `/dashboard/policies/log?${params}`);
            }}
          >
            <ListIcon />
          </IconButton>
        </span>
      </Tooltip>
      {data?.policies_disableActionsRun !== '1' &&
        (row.status === 'Idle' ||
          isTermJobState(row.last_job_state as JobState)) && (
          <Tooltip
            title={generateRunToolTipText(
              row,
              noIngestionRun,
              storageConnectorsQuery.data ?? []
            )}
            placement='top'
          >
            <span>
              <PlayAction
                row={row}
                disabled={
                  noIngestionRun ||
                  row.storage_connector_name === undefined ||
                  row.status !== 'Idle'
                }
              />
            </span>
          </Tooltip>
        )}
      {/* 
        Policy will be in Execute state after job completion while csmail executes,
        possibly retrying SMTP connection for up to 10 minutes
      */}
      {row.status === 'Running' &&
        !isTermJobState(row.last_job_state as JobState) && (
          <Tooltip
            title={generateCancelToolTipText(
              row,
              noIngestionRun,
              storageConnectorsQuery.data ?? []
            )}
            placement='top'
          >
            <span>
              <StopAction
                row={row}
                disabled={
                  noIngestionRun ||
                  row.storage_connector_name === undefined ||
                  isTermJobState(row.last_job_state as JobState) ||
                  isIndexingPhaseEnded(row)
                }
              />
            </span>
          </Tooltip>
        )}
    </div>
  );
};
export default PoliciesTableActions;
