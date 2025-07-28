import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  Typography,
  useTheme
} from '@mui/material';
import { YaraRule } from 'data-hooks/yara/yara.types';
import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import YaraRulesFileChooserModal from './YaraRulesFileChooserModal/YaraRulesFileChooserModal';
import DeleteYaraRuleModal from './DeleteYaraRuleModal/DeleteYaraRuleModal';
import YaraRuleFormTooltipIcon from './YaraRulesHelpIcons/YaraRuleFormTooltipIcon';
import validateYaraRuleForm, { FormError } from './utils/validateYaraRuleForm';
import getFilenameWithoutExtension from './utils/getFilenameWithoutExtension';

interface Props {
  yaraRuleInitialState: YaraRule;
  onVerify: (yaraRule: YaraRule) => void;
  onSubmit: (yaraRule: YaraRule) => void;
  isVerifyLoading: boolean;
  isSubmitLoading: boolean;
}

const YaraRuleForm = ({
  yaraRuleInitialState,
  onVerify,
  onSubmit,
  isVerifyLoading,
  isSubmitLoading
}: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [yaraRule, setYaraRule] = useState<YaraRule>(yaraRuleInitialState);
  const [fileChooserModalOpen, setFileChooserModalOpen] =
    useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormError[]>([]);

  const isSubmitDisabled = () => {
    return !yaraRule.rule || yaraRule === yaraRuleInitialState;
  };

  const codeMirrorTheme = EditorView.theme({
    '&': {
      border: `1px solid ${theme.palette.neutral.dark400}`
    },
    '&.cm-editor.cm-focused, &.cm-editor:hover': {
      border: `1px solid ${theme.palette.graph.d}`
    }
  });

  const verify = () => {
    const errors = validateYaraRuleForm(yaraRule);
    setFormErrors(errors);

    if (errors.length === 0) {
      onVerify(yaraRule);
    }
  };

  const submit = () => {
    const errors = validateYaraRuleForm(yaraRule);
    setFormErrors(errors);

    if (errors.length === 0) {
      onSubmit(yaraRule);
    }
  };

  const handleAcceptFile = (file: File) => {
    file.text().then((fileContents: string) => {
      setYaraRule({
        ...yaraRule,
        rule: fileContents,
        display_name: getFilenameWithoutExtension(file.name)
      });
    });
  };

  return (
    <>
      <Box
        sx={{
          borderBottom: `1px solid ${theme.palette.neutral.dark400}`,
          padding: '14px 22px 14px 22px'
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={yaraRule.enabled}
              onClick={() =>
                setYaraRule({ ...yaraRule, enabled: !yaraRule.enabled })
              }
            />
          }
          label='Enable Ruleset'
          sx={{ marginRight: 2 }}
        />

        <Button
          variant='contained'
          sx={{ marginRight: 2 }}
          onClick={() => setFileChooserModalOpen(true)}
        >
          {yaraRule.ruleset_name ? 'Replace Ruleset' : 'Select Ruleset'}
        </Button>

        {yaraRule.ruleset_name && (
          <Button
            variant='contained'
            sx={{ marginRight: 2 }}
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete
          </Button>
        )}
      </Box>
      <Box
        sx={{
          borderBottom: `1px solid ${theme.palette.neutral.dark400}`,
          padding: '14px 22px 14px 22px'
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={8} md={4}>
            <InputLabel>Ruleset Name</InputLabel>
            <TextField
              sx={{
                width: '100%',
                marginBottom: '1em',
                marginRight: '1em',
                '& .MuiInputBase-root': { height: '35px' }
              }}
              placeholder='Ruleset Name'
              value={yaraRule.display_name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setYaraRule({ ...yaraRule, display_name: e.target.value })
              }
            />
          </Grid>

          <Grid item xs={8} md={4}>
            <FormControl sx={{ width: '100%' }}>
              <InputLabel>Alert Severity</InputLabel>
              <Select
                sx={{
                  width: '100%'
                }}
                error={formErrors.some(
                  (formError) => formError.fieldName === 'severity'
                )}
                value={yaraRule.severity}
                onChange={(e: SelectChangeEvent<string>) => {
                  setYaraRule({ ...yaraRule, severity: e.target.value });
                  setFormErrors(
                    validateYaraRuleForm({
                      ...yaraRule,
                      severity: e.target.value
                    })
                  );
                }}
                renderValue={(selected) => {
                  if (!selected) {
                    return 'Alert Severity';
                  }
                  return selected;
                }}
                displayEmpty
              >
                <MenuItem value='Critical'>Critical</MenuItem>
                <MenuItem value='High'>High</MenuItem>
                <MenuItem value='Medium'>Medium</MenuItem>
                <MenuItem value='Low'>Low</MenuItem>
              </Select>
              <FormHelperText error>
                {
                  formErrors.find(
                    (formError) => formError.fieldName === 'severity'
                  )?.error
                }
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>

        {!yaraRule.ruleset_name && (
          <Typography
            sx={{
              fontSize: 14,
              marginBottom: '1em',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Type or paste your ruleset in this pane, and verify before
            submitting it to the repository.
            <YaraRuleFormTooltipIcon />
          </Typography>
        )}
        {yaraRule.ruleset_name && (
          <Typography
            sx={{
              fontSize: 14,
              marginBottom: '1em',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            Edit your ruleset in this pane, and verify before submitting it to
            the repository.
            <YaraRuleFormTooltipIcon />
          </Typography>
        )}

        <Box sx={{ width: '100%' }}>
          <CodeMirror
            value={yaraRule.rule}
            height='420px'
            extensions={[EditorView.lineWrapping]}
            onChange={(newValue: string) =>
              setYaraRule({ ...yaraRule, rule: newValue })
            }
            theme={codeMirrorTheme}
          />
        </Box>
      </Box>

      <Box sx={{ padding: '14px 22px 14px 22px' }}>
        <Button variant='outlined' onClick={() => navigate('..')}>
          Back
        </Button>

        <Box sx={{ float: 'right' }}>
          <LoadingButton
            variant='outlined'
            sx={{ marginRight: 2 }}
            onClick={() => verify()}
            disabled={isSubmitDisabled()}
            loading={isVerifyLoading}
          >
            Verify
          </LoadingButton>
          <Button
            variant='outlined'
            sx={{ marginRight: 2 }}
            onClick={() => setYaraRule(yaraRuleInitialState)}
            disabled={yaraRuleInitialState === yaraRule}
          >
            Discard Changes
          </Button>
          <LoadingButton
            variant='contained'
            onClick={() => submit()}
            disabled={isSubmitDisabled()}
            loading={isSubmitLoading}
          >
            Submit Ruleset
          </LoadingButton>
        </Box>
      </Box>

      <YaraRulesFileChooserModal
        modalOpen={fileChooserModalOpen}
        setModalOpen={setFileChooserModalOpen}
        id={yaraRule.ruleset_name}
        onAcceptFile={handleAcceptFile}
      />

      {yaraRule.ruleset_name && (
        <DeleteYaraRuleModal
          modalOpen={deleteModalOpen}
          setModalOpen={setDeleteModalOpen}
          selectedIds={[yaraRule.ruleset_name!]}
        />
      )}
    </>
  );
};

export default YaraRuleForm;
