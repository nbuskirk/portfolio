import {
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Tooltip,
  useTheme
} from '@mui/material';
import { ReactNode } from 'react';
import EditIcon from '@mui/icons-material/Edit';

interface Props {
  list: Record<string, string | string[]>;
  header: string;
  onEdit?: () => void;
}

const PolicyDetailsList = ({ list, header, onEdit }: Props): ReactNode => {
  const theme = useTheme();
  return (
    <List
      dense
      sx={{
        border: `1px solid ${theme.palette.neutral.dark400}`,
        borderRadius: '3px',
        padding: 0
      }}
      subheader={
        <ListSubheader
          component='div'
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '14px',
            fontWeight: '600',
            lineHeight: '40px',
            color: theme.palette.dark.main,
            borderBottom: `1px solid ${theme.palette.neutral.dark400}`
          }}
        >
          {header}{' '}
          {onEdit !== undefined && (
            <Tooltip title='Edit Storage Connector Details' enterDelay={400}>
              <IconButton
                onClick={() => {
                  onEdit();
                }}
                sx={{ marginRight: '-8px' }}
              >
                <EditIcon
                  sx={{
                    fontSize: '20px',
                    paddingBottom: '4px'
                  }}
                />
              </IconButton>
            </Tooltip>
          )}
        </ListSubheader>
      }
    >
      {Object.keys(list).map((key, index) => (
        <ListItem
          key={key}
          sx={{
            background:
              index % 2 !== 0
                ? 'transparent'
                : theme.palette.neutral.secondary400
          }}
        >
          <ListItemText
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1em',
              '.MuiListItemText-primary': {
                // fontWeight: 600,
                minWidth: '220px'
              },
              '.MuiListItemText-secondary': {
                overflow: 'hidden',
                wordWrap: 'break-word'
              }
            }}
            primary={key}
            secondary={
              Array.isArray(list[key]) ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '3px',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end'
                  }}
                >
                  {(list[key] as string[]).map((val) => (
                    <Chip key={`${val}`} label={val} />
                  ))}
                </Box>
              ) : (
                list[key]
              )
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default PolicyDetailsList;
