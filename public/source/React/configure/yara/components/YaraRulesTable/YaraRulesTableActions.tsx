import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import { Edit } from '@mui/icons-material';
import {
  GridRenderCellParams,
  GridTreeNodeWithRender
} from '@mui/x-data-grid-premium';
import { useTheme } from '@mui/material/styles';
import { YaraRule } from 'data-hooks/yara/yara.types';
import useHasEditYaraRulesPermission from '../../hooks/useHasEditYaraRulesPermission';

const YaraRulesTableActions = ({
  row
}: GridRenderCellParams<YaraRule, any, any, GridTreeNodeWithRender>) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const hasPermission = useHasEditYaraRulesPermission();

  return (
    <Tooltip
      title={hasPermission ? 'View or Edit' : 'No permission'}
      placement='top'
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, 
          jsx-a11y/no-static-element-interactions */}
      <span
        // Stop clicks on any icons from selecting the row
        onClick={(e: React.MouseEvent<HTMLSpanElement>) => e.stopPropagation()}
        style={{ cursor: hasPermission ? 'pointer' : 'default' }}
      >
        <IconButton
          aria-label='edit'
          sx={{ color: theme?.palette?.primary?.main }}
          onClick={() => navigate(`${row.ruleset_name}`)}
          disabled={!hasPermission}
        >
          <Edit />
        </IconButton>
      </span>
    </Tooltip>
  );
};
export default YaraRulesTableActions;
