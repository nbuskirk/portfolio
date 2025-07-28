import { Switch, Tooltip } from '@mui/material';
import Loader from 'components/inc/loader';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import useConfigInfo from 'data-hooks/useConfigInfo';
import useMutateUpdateYaraRule from 'data-hooks/yara/useMutateUpdateYaraRule';
import { YaraRule } from 'data-hooks/yara/yara.types';
import useHasEditYaraRulesPermission from '../../hooks/useHasEditYaraRulesPermission';

const YaraRulesEnableSwitch = ({ row }: { row: YaraRule }) => {
  const { data: configInfo, isLoading, isSuccess } = useConfigInfo();
  const { fedid, indexid } = configInfo ?? {};
  const { mutate } = useMutateUpdateYaraRule({
    fedId: fedid,
    indexId: indexid
  });
  const { showSuccessSnackbar } = useSnackbarContext();
  const hasPermission = useHasEditYaraRulesPermission();

  const handleEnabledClick = (yaraRule: YaraRule) => {
    // eslint-disable-next-line no-param-reassign
    yaraRule.enabled = !yaraRule.enabled;
    mutate(
      {
        id: yaraRule.ruleset_name!,
        yaraRule: {
          enabled: yaraRule.enabled
        }
      },
      {
        onSuccess: () =>
          showSuccessSnackbar(
            `Success: ${yaraRule.enabled ? 'Enabled' : 'Disabled'} YARA Rule ${
              yaraRule.display_name
            }`
          )
      }
    );
  };

  return (
    <>
      {isLoading && <Loader />}
      {isSuccess && (
        <Tooltip
          title={hasPermission ? 'Enable or Disable' : 'No permission'}
          placement='top'
        >
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, 
              jsx-a11y/no-static-element-interactions */}
          <span
            onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
              e.stopPropagation()
            }
          >
            <Switch
              disabled={!hasPermission}
              checked={row.enabled}
              onClick={() => handleEnabledClick(row)}
              sx={{ cursor: hasPermission ? 'pointer' : 'default' }}
            />
          </span>
        </Tooltip>
      )}
    </>
  );
};

export default YaraRulesEnableSwitch;
