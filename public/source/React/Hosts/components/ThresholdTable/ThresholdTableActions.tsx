import React from 'react';
import { Edit } from '@mui/icons-material';
import { Box, IconButton, Tooltip } from '@mui/material';
import {
  GridRenderCellParams,
  GridTreeNodeWithRender
} from '@mui/x-data-grid-premium';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUser } from 'utils/context/UserContext';
import DeleteDialog from '../DeleteDialog';

const ThresholdTableActions = ({
  row
}: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [selectedId, setSelectedId] = React.useState<string | undefined>();
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false);
  const { canAccess } = useUser();
  const disabled = !canAccess('thresholdmgmt');

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        height: '100%'
      }}
    >
      <Tooltip
        title={disabled ? 'No Permission' : 'Edit Threshold'}
        placement='top'
      >
        <span>
          <IconButton
            aria-label='edit'
            disabled={disabled}
            sx={{ color: theme?.palette?.primary?.main }}
            onClick={() =>
              navigate(`/dashboard/settings/customthresholds/${row.id}`)
            }
          >
            <Edit />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title={disabled ? 'No Permission' : 'Delete Threshold'}>
        <span>
          <IconButton
            edge='end'
            aria-label='delete'
            disabled={row.id.includes('daily') || disabled}
            sx={{ color: theme.palette.primary.main }}
            onClick={() => {
              setSelectedId(row.id);
              setDialogOpen(true);
            }}
          >
            <DeleteIcon />
          </IconButton>
        </span>
      </Tooltip>
      <DeleteDialog
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        id={selectedId}
        key={`threshold-${selectedId}`}
        name={row.name}
      />
    </Box>
  );
};

export default ThresholdTableActions;
