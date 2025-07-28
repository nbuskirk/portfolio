import {
  Box,
  Breadcrumbs,
  Skeleton,
  Typography,
  useTheme
} from '@mui/material';
import LinkRouter from 'components/inc/LinkRouter';
import {
  LoaderFunction,
  redirect,
  useNavigate,
  useParams
} from 'react-router-dom';
import useQueryYaraRule from 'data-hooks/yara/useQueryYaraRule';
import useConfigInfo from 'data-hooks/useConfigInfo';
import { useState } from 'react';
import { YaraRule } from 'data-hooks/yara/yara.types';
import useMutateUpdateYaraRule, {
  UpdateYaraRuleRequest
} from 'data-hooks/yara/useMutateUpdateYaraRule';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import Loader from 'components/inc/loader';
import { QueryClient } from '@tanstack/react-query';
import { loadCanAccess } from 'lib/loadCanAccess';
import sx from './YaraRules.module.scss';
import YaraRuleForm from './YaraRuleForm';
import YaraRulesWebHelpIcon from './YaraRulesHelpIcons/YaraRulesWebHelpIcon';

const YaraRuleEditor = () => {
  const theme = useTheme();
  const { yaraRuleId } = useParams();

  const [isVerifyLoading, setIsVerifyLoading] = useState<boolean>(false);
  const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const { data: configInfo, isLoading: configIsLoading } = useConfigInfo();
  const { fedid, indexid } = configInfo ?? {};
  const [enableQuery, setEnableQuery] = useState<boolean>(true);
  const {
    data: yaraRuleInitialState,
    isLoading: yaraRuleIsLoading,
    isSuccess
  } = useQueryYaraRule({
    enableQuery,
    fedId: fedid,
    indexId: indexid,
    yaraRuleId
  });

  const { mutate } = useMutateUpdateYaraRule({
    fedId: fedid,
    indexId: indexid
  });

  const { showSuccessSnackbar } = useSnackbarContext();

  const isLoading = configIsLoading || yaraRuleIsLoading;

  const getYaraRuleRequest = (yaraRule: YaraRule) => {
    const yaraRuleRequest: UpdateYaraRuleRequest = {};

    if (yaraRule.rule !== yaraRuleInitialState!.rule) {
      yaraRuleRequest.rule = yaraRule.rule;
    }
    if (yaraRule.enabled !== yaraRuleInitialState!.enabled) {
      yaraRuleRequest.enabled = yaraRule.enabled;
    }
    if (yaraRule.display_name !== yaraRuleInitialState!.display_name) {
      yaraRuleRequest.display_name = yaraRule.display_name;
    }
    if (yaraRule.severity !== yaraRuleInitialState!.severity) {
      yaraRuleRequest.severity = yaraRule.severity;
    }

    return yaraRuleRequest;
  };

  const compile = (yaraRule: YaraRule) => {
    setIsVerifyLoading(true);

    mutate(
      {
        yaraRule: getYaraRuleRequest(yaraRule),
        compile_only: true,
        id: yaraRuleInitialState!.ruleset_name!
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
    // Disable the query on submit. This is an unfortunate workaround we have
    // to do because the backend is changing the id if the rule contents
    // change. We get an error snackbar without this...
    setEnableQuery(false);
    setIsSubmitLoading(true);
    mutate(
      {
        yaraRule: getYaraRuleRequest(yaraRule),
        compile_only: false,
        id: yaraRuleInitialState!.ruleset_name!
      },
      {
        onSuccess: () => {
          showSuccessSnackbar('Success: Ruleset updated');
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
          YARA Ruleset Editor
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
            {isLoading && <Skeleton variant='rectangular' width={120} />}
            {isSuccess && yaraRuleInitialState.display_name}
          </Typography>
        </Breadcrumbs>
      </Box>

      {isLoading && <Loader sx={{ height: 650 }} />}
      {isSuccess && (
        <YaraRuleForm
          yaraRuleInitialState={yaraRuleInitialState}
          onVerify={compile}
          onSubmit={submit}
          isVerifyLoading={isVerifyLoading}
          isSubmitLoading={isSubmitLoading}
        />
      )}
    </Box>
  );
};

export default YaraRuleEditor;

export const yaraRuleEditorLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const canAccess = await loadCanAccess(queryClient);
    if (!canAccess('admin') && !canAccess('alertmgmt')) {
      return redirect('..');
    }
    return null;
  };
