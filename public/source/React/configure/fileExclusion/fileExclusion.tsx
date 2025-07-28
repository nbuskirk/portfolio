/* eslint-disable no-console */
import {
  Box,
  Button,
  Divider,
  Stack,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import {
  DataGridPremium,
  GridPaginationModel,
  GridRowSelectionModel
} from '@mui/x-data-grid-premium';
import { useState } from 'react';
import InfoIcon from '@mui/icons-material/Info';
import useLocalStorage from 'hooks/useLocalstorage';
import Modal from 'components/inc/modalContainer/modalContainer';
import useFilenameExclusionGet from 'data-hooks/filenameExclusion/useFilenameExclusionGet';
import useFilenameExclusionPut from 'data-hooks/filenameExclusion/useFilenameExclusionPut';
import { LocalStorageKeys } from 'constants/constants';
import { loadCanAccess } from 'lib/loadCanAccess';
import { QueryClient } from '@tanstack/react-query';
import { LoaderFunction, redirect } from 'react-router-dom';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import { useIntl } from 'react-intl';
import sx from './fileExclusion.module.scss';
import AddExclusionModal, { MAX_PATTERNS } from './addExclusionModal';
import EditExclusionModal from './editExclusionModal';
import FileExclusionToolbar from './fileExclusionToolbar';
import PatternColumns, { ParrernGridRow } from './patternColumns';

const { FILE_EXCLUSION_PAGINATION } = LocalStorageKeys;

const customNoRowsOverlay = () => {
  return (
    <Stack height='100%' alignItems='center' justifyContent='center'>
      No filename pattern is added
    </Stack>
  );
};

const width = '748px';

const FileExclusion = () => {
  const theme = useTheme();
  const intl = useIntl();
  const { showErrorSnackbar } = useSnackbarContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pattern, setPattern] = useState<ParrernGridRow>({
    pattern: '',
    id: 0
  });
  const [deleteIsPending, setDeleteIsPending] = useState(false);
  const [paginationModel, setPaginationModel] =
    useLocalStorage<GridPaginationModel>(FILE_EXCLUSION_PAGINATION, {
      page: 0,
      pageSize: 10
    });
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);
  const {
    data: rows,
    refetch: refetchPatterns,
    isFetching: isTrustedFilesLoading
  } = useFilenameExclusionGet();
  const updateFilenameExclusion = useFilenameExclusionPut();
  const handleEdit = (value: ParrernGridRow) => {
    setPattern(value);
    setShowEditModal(true);
  };

  const columns = PatternColumns(handleEdit);
  const handleRowSelection = (selection: GridRowSelectionModel) => {
    setSelectedRows(selection);
  };

  const handlePatternUpdate = async (patterns: string[]) => {
    const uniquePatterns = patterns.filter(
      (item, index) => patterns.indexOf(item) === index
    );
    try {
      await updateFilenameExclusion.mutateAsync(uniquePatterns);
      await refetchPatterns();
    } catch (error) {
      console.error('Failed to update patterns - ', error);
    }
  };

  return (
    <Stack
      className={sx.main}
      sx={{
        border: `1px solid ${theme.palette.neutral.dark500}`,
        bgcolor: theme.palette.white.main
      }}
    >
      <Box display='flex' padding='15px' alignItems='center' gap={1}>
        <Typography className={sx.title}>Trusted Files</Typography>
        <Tooltip
          arrow
          title={
            <Typography sx={{ whiteSpace: 'pre-line' }}>
              {intl.formatMessage({
                id: 'settings.trustedfiles.title.tooltip',
                defaultMessage:
                  'Enter filename patterns for CyberSense to consider as "trusted" file types. If CyberSense discovers a file whose format it does not recognize and the file’s name matches a pattern in the trusted files list, CyberSense then recognizes the file as a trusted file and modifies its analysis accordingly.'
              })}
            </Typography>
          }
          placement='right'
          slotProps={{
            tooltip: {
              sx: {
                maxWidth: 500
              }
            }
          }}
        >
          <InfoIcon color='secondary' />
        </Tooltip>
      </Box>
      <Divider />
      <Stack padding='15px' gap={3}>
        <Stack id='fileExclusionGrid' gap={2}>
          <Box columnGap={1} display='flex'>
            <Button
              variant='contained'
              onClick={() => {
                if ((rows?.length ?? 0) >= MAX_PATTERNS) {
                  showErrorSnackbar(
                    `Error: A total of ${MAX_PATTERNS} patterns have already been added. No additional patterns can be added.`
                  );
                } else {
                  setShowAddModal(true);
                }
              }}
            >
              Add
            </Button>
            <Button
              variant='contained'
              onClick={() => setShowDeleteModal(true)}
              disabled={selectedRows.length === 0}
            >
              Delete
            </Button>
          </Box>
          <Box height={rows?.length && rows.length > 0 ? 'auto' : 200}>
            <DataGridPremium
              localeText={{
                toolbarExport: 'Download'
              }}
              slots={{
                toolbar: FileExclusionToolbar,
                noRowsOverlay: customNoRowsOverlay
              }}
              columns={columns}
              loading={isTrustedFilesLoading}
              rows={(rows || []).map((filenamePattern, index) => ({
                id: index,
                pattern: filenamePattern
              }))}
              checkboxSelection
              disableRowSelectionOnClick
              onRowSelectionModelChange={handleRowSelection}
              rowSelectionModel={selectedRows}
              density='compact'
              pagination
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              pageSizeOptions={[5, 10, 25, 50]}
            />
          </Box>
          <AddExclusionModal
            visibility={showAddModal}
            setVisibility={setShowAddModal}
            title='Add Filename Patterns'
            width={width}
            onSave={handlePatternUpdate}
            maxPatterns={MAX_PATTERNS - (rows?.length ?? 0)}
          />
          <EditExclusionModal
            visibility={showEditModal}
            setVisibility={setShowEditModal}
            title='Edit Filename Pattern'
            patternRow={pattern}
            setPatternRow={setPattern}
            rows={rows || []}
            width={width}
            onSave={handlePatternUpdate}
          />
          <Modal
            visibility={showDeleteModal}
            setVisibility={setShowDeleteModal}
            title='Delete Filename Pattern(s)'
            onCancel={() => setShowDeleteModal(false)}
            onSave={async () => {
              setDeleteIsPending(true);
              const updatedRows = (rows || []).filter(
                (_, index) => !selectedRows.includes(index)
              );
              await handlePatternUpdate(updatedRows);
              setDeleteIsPending(false);
              setShowDeleteModal(false);
              setSelectedRows([]);
            }}
            saveText='Delete'
            cancelText='Cancel'
            width='647px'
            saveIsPending={deleteIsPending}
          >
            <Typography
              className={sx.warningMessage}
              color={theme.palette.error.dark}
            >
              Warning: Do you want to delete the selected filename pattern(s)?
            </Typography>
          </Modal>
        </Stack>
      </Stack>
    </Stack>
  );
};
export default FileExclusion;

export const fileExclusionLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const canAccess = await loadCanAccess(queryClient);
    if (!canAccess('admin')) {
      return redirect('..');
    }
    return null;
  };
