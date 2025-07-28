import { Box, Button, Tooltip, Typography, useTheme } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { GridRowSelectionModel } from '@mui/x-data-grid-premium';
import { LoaderFunction, redirect, useNavigate } from 'react-router-dom';
import { QueryClient } from '@tanstack/react-query';
import { loadCanAccess } from 'lib/loadCanAccess';
import sx from './YaraRules.module.scss';
import YaraRulesTable from './YaraRulesTable/YaraRulesTable';
import DeleteYaraRuleModal from './DeleteYaraRuleModal/DeleteYaraRuleModal';
import YaraRulesWebHelpIcon from './YaraRulesHelpIcons/YaraRulesWebHelpIcon';
import useHasEditYaraRulesPermission from '../hooks/useHasEditYaraRulesPermission';

const YaraRules = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const hasPermission = useHasEditYaraRulesPermission();

  return (
    <Box
      sx={{
        border: `1px solid ${theme.palette.neutral.dark500}`,
        bgcolor: theme.palette.white.main,
        width: '100%'
      }}
    >
      <Helmet>
        <title>Custom YARA Rulesets</title>
      </Helmet>

      <Typography
        className={sx.title}
        display='flex'
        alignItems='center'
        sx={{
          borderBottom: `1px solid ${theme.palette.neutral.dark400}`,
          padding: '14px 22px 14px 22px'
        }}
      >
        Custom YARA Rulesets
        <YaraRulesWebHelpIcon />
      </Typography>

      <Box className={sx.container}>
        <Box sx={{ marginTop: 2, marginBottom: 2 }}>
          <Tooltip
            title={hasPermission ? undefined : 'No permission'}
            placement='top'
          >
            <span>
              <Button
                variant='contained'
                size='small'
                sx={{ marginRight: 2 }}
                onClick={() => navigate('new')}
                disabled={!hasPermission}
              >
                Create New Ruleset
              </Button>
            </span>
          </Tooltip>
          <Tooltip
            title={hasPermission ? undefined : 'No permission'}
            placement='top'
          >
            <span>
              <Button
                variant='contained'
                size='small'
                disabled={!hasPermission || rowSelectionModel.length === 0}
                onClick={() => setDeleteModalOpen(true)}
              >
                Delete
              </Button>
            </span>
          </Tooltip>
        </Box>

        <YaraRulesTable
          rowSelectionModel={rowSelectionModel}
          onRowSelectionModelChange={setRowSelectionModel}
        />

        <DeleteYaraRuleModal
          modalOpen={deleteModalOpen}
          setModalOpen={setDeleteModalOpen}
          selectedIds={rowSelectionModel as string[]}
        />
      </Box>
    </Box>
  );
};

export default YaraRules;

export const yaraRulesLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const canAccess = await loadCanAccess(queryClient);
    if (!canAccess('alertmgmt')) {
      return redirect('..');
    }
    return null;
  };
