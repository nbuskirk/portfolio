import { Box, Breadcrumbs, Typography, useTheme } from '@mui/material';
import LinkRouter from 'components/inc/LinkRouter';
import { useState } from 'react';
import useConfigInfo from 'data-hooks/useConfigInfo';
import useMutateCreateYaraRule from 'data-hooks/yara/useMutateCreateYaraRule';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import { LoaderFunction, redirect, useNavigate } from 'react-router-dom';
import Loader from 'components/inc/loader';
import { YaraRule } from 'data-hooks/yara/yara.types';
import { QueryClient } from '@tanstack/react-query';
import { loadCanAccess } from 'lib/loadCanAccess';
import YaraRuleForm from './YaraRuleForm';
import sx from './YaraRules.module.scss';
import YaraRulesWebHelpIcon from './YaraRulesHelpIcons/YaraRulesWebHelpIcon';

const YaraRuleCreator = () => {
  const theme = useTheme();

  const [isVerifyLoading, setIsVerifyLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const { data: configInfo, isLoading, isSuccess } = useConfigInfo();
  const { fedid, indexid } = configInfo ?? {};
  const { mutate } = useMutateCreateYaraRule({
    fedId: fedid,
    indexId: indexid
  });

  const { showSuccessSnackbar } = useSnackbarContext();

  const compile = (yaraRule: YaraRule) => {
    setIsVerifyLoading(true);
    mutate(
      {
        yaraRule,
        compile_only: true
      },
      {
        onSuccess: () => {
          showSuccessSnackbar('Compiler: No Errors Found');
        },
        onSettled: () => {
          setIsVerifyLoading(false);
        }
      }
    );
  };

  const submit = (yaraRule: YaraRule) => {
    setIsSubmitLoading(true);
    mutate(
      {
        yaraRule,
        compile_only: false
      },
      {
        onSuccess: () => {
          showSuccessSnackbar('Success: Submitted Yara Ruleset');
          navigate('..');
        },
        onSettled: () => {
          setIsSubmitLoading(false);
        }
      }
    );
  };

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.neutral.dark500}`,
        bgcolor: theme.palette.white.main,
        width: '100%'
      }}
    >
      <Box
        sx={{
          borderBottom: `1px solid ${theme.palette.neutral.dark400}`,
          padding: '14px 22px 14px 22px'
        }}
      >
        <Typography className={sx.title} display='flex' alignItems='center'>
          YARA Ruleset Creator
          <YaraRulesWebHelpIcon />
        </Typography>
        <Breadcrumbs
          aria-label='breadcrumb'
          separator='>'
          sx={{ fontSize: 14, marginTop: 1 }}
        >
          <LinkRouter underline='hover' to='..'>
            Custom YARA Rulesets
          </LinkRouter>
          <Typography
            sx={{ color: 'text.primary', fontSize: 14, fontWeight: 600 }}
          >
            Create a New YARA Ruleset
          </Typography>
        </Breadcrumbs>
      </Box>

      {isLoading && <Loader sx={{ height: 650 }} />}
      {isSuccess && (
        <YaraRuleForm
          yaraRuleInitialState={{
            enabled: true,
            severity: '',
            display_name: '',
            rule: ''
          }}
          onVerify={compile}
          onSubmit={submit}
          isVerifyLoading={isVerifyLoading}
          isSubmitLoading={isSubmitLoading}
        />
      )}
    </Box>
  );
};

export default YaraRuleCreator;

export const yaraRuleCreatorLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const canAccess = await loadCanAccess(queryClient);
    if (!canAccess('admin') && !canAccess('alertmgmt')) {
      return redirect('..');
    }
    return null;
  };
