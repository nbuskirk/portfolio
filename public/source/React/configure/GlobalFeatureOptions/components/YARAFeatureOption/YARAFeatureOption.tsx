import { Box, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { useState } from 'react';
import Loader from 'components/inc/loader';
import { useQueryClient } from '@tanstack/react-query';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import { CONFIGURATIONS } from 'constants/queryKeys';
import SplitButton from 'components/inc/SplitButton/SplitButton';
import useMutateUpdateYaraRules from 'data-hooks/yara/useMutateUpdateYaraRules';
import useConfigInfo from 'data-hooks/useConfigInfo';
import { useUser } from 'utils/context/UserContext';
import YARADisclaimer from './YARADisclaimer';
import ConfirmYaraGlobalEnableDisableModal from './ConfirmYaraGlobalEnableDisableModal';

const YARAFeatureOption = () => {
  const queryClient = useQueryClient();
  const { showSuccessSnackbar } = useSnackbarContext();
  const intl = useIntl();
  const {canAccess} = useUser();

  const { data: configInfo, isLoading, isSuccess } = useConfigInfo();
  const { fedid, indexid } = configInfo ?? {};
  const mutateYaraRules = useMutateUpdateYaraRules({
    fedId: fedid,
    indexId: indexid
  });

  const [featureIsUpdating, setFeatureIsUpdating] = useState(false);
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [enable, setEnable] = useState(true);

  const handleButtonClick = (option: string) => {
    setEnable(option === 'Enable');
    setConfirmModalIsOpen(true);
  };

  const handleCancel = () => {
    setConfirmModalIsOpen(false);
  };

  const handleConfirm = () => {
    setFeatureIsUpdating(true);
    mutateYaraRules
      .mutateAsync({
        enabled: enable
      })
      .then(() => {
        return queryClient.invalidateQueries({ queryKey: [CONFIGURATIONS] });
      })
      .then(() => {
        showSuccessSnackbar(
          intl.formatMessage({
            id: enable
              ? 'globalfeatureoptions.yara.enabledmsg'
              : 'globalfeatureoptions.yara.disabledmsg'
          })
        );
      })
      .finally(() => {
        setFeatureIsUpdating(false);
        setConfirmModalIsOpen(false);
      });
  };

  return (
    <Box sx={{ padding: '10px 0' }}>
      <Typography fontSize={16} fontWeight={600} lineHeight='22px'>
        {intl.formatMessage({ id: 'globalfeatureoptions.yara.header' })}
      </Typography>
      {isLoading && <Loader sx={{ height: 200 }} />}
      {isSuccess && (
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 2,
              marginBottom: 2
            }}
          >
            <SplitButton
              disabled={!canAccess('alertmgmt')}
              options={[
                intl.formatMessage({
                  id: 'globalfeatureoptions.yara.option.enable'
                }),
                intl.formatMessage({
                  id: 'globalfeatureoptions.yara.option.disable'
                })
              ]}
              onClick={handleButtonClick}
            />
            <Typography fontSize={14} marginLeft={1}>
              {intl.formatMessage({
                id: 'globalfeatureoptions.yara.button.label'
              })}
            </Typography>
          </Box>
          <YARADisclaimer />
        </Box>
      )}
      <ConfirmYaraGlobalEnableDisableModal
        open={confirmModalIsOpen}
        enable={enable}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        isSaving={featureIsUpdating}
      />
    </Box>
  );
};

export default YARAFeatureOption;
