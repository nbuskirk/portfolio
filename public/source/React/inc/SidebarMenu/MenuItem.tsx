import { useState, KeyboardEvent } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MenuItemData } from 'components/configure/hooks/useSidebarMenuData';
import Notification from './Notification';
import MenuHeader from './MenuHeader';

interface MenuItemProps {
  data: MenuItemData;
}

const MenuItem = ({ data }: MenuItemProps) => {
  const theme = useTheme();
  const location = useLocation();
  const [expanded, setExpanded] = useState<boolean>(false);

  const isActive = data.path && location.pathname.includes(`/${data.path}`);
  const isDisabled = !data.access;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && expanded) {
      event.preventDefault();
      setExpanded(false);
    }
    if ((event.key === 'Enter' || event.key === ' ') && !expanded) {
      event.preventDefault();
      setExpanded(true);
    }
  };

  // submenu
  if (data.children) {
    const ariaRelationshipIdPrefix = `sidebar-${data.title
      .toLowerCase()
      .replace(/\s+/g, '-')}`;

    return (
      <li role='none'>
        <Accordion
          data-testid={data.testId}
          expanded={expanded}
          onChange={() => setExpanded(!expanded)}
          disableGutters
          elevation={0}
          square
          onKeyDown={handleKeyDown}
          sx={{
            '&.MuiAccordion-root': {
              backgroundColor: 'transparent',
              border: 'none',
              '&:before': {
                display: 'none'
              }
            },
            '&.MuiButtonBase-root': {
              border: 'none'
            },
            '&:focus-visible': {
              outline: `2px solid ${theme.palette.primary.main}`,
              outlineOffset: '-2px',
              background: theme.palette.neutral.secondary200
            }
          }}
        >
          <AccordionSummary
            expandIcon={
              <ExpandMoreIcon sx={{ color: theme.palette.primary.main }} />
            }
            aria-controls={`${ariaRelationshipIdPrefix}-content`}
            id={`${ariaRelationshipIdPrefix}-header`}
            aria-expanded={expanded}
            aria-label={`${data.title} submenu`}
            sx={{
              minHeight: 'unset',
              padding: '0.5em 1em 0.5em 1em',
              '&:hover': {
                background: theme.palette.neutral.secondary200
              },
              '& .MuiAccordionSummary-content': {
                margin: 0,
                alignItems: 'center'
              },
              '&:focus-visible': {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: '-2px',
                background: theme.palette.neutral.secondary200
              },
              '&.Mui-focused': {
                background: theme.palette.neutral.secondary200
              }
            }}
          >
            <Box display='flex' alignItems='center'>
              <Typography
                variant='subtitle1'
                sx={{
                  fontSize: '14px',
                  fontWeight: 700,
                  lineHeight: '1.43'
                }}
              >
                {data.title}
              </Typography>
              {data.notification && !expanded && <Notification data={data} />}
            </Box>
          </AccordionSummary>

          <AccordionDetails
            id={`${ariaRelationshipIdPrefix}-content`}
            role='region'
            sx={{
              padding: 0,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box
              component='ul'
              role='menu'
              sx={{
                padding: 0,
                margin: 0,
                listStyle: 'none'
              }}
            >
              {data.children.map((menuItem: MenuItemData) => (
                <MenuItem key={menuItem.title} data={menuItem} />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      </li>
    );
  }

  // menu link
  return (
    <li
      role='none'
      style={{
        padding: 0,
        margin: 0,
        borderTop: data.header
          ? 'none'
          : `1px solid ${theme.palette.neutral.dark500}`
      }}
    >
      {data.header ? (
        <MenuHeader data={data} />
      ) : (
        <>
          {/* disabled link */}
          {isDisabled ? (
            <Box
              data-testid={data.testId}
              role='menuitem'
              aria-disabled='true'
              sx={{
                padding: '0.5em 0.5em 0.5em 1.5em',
                fontSize: '12px',
                fontWeight: 500,
                background: 'transparent',
                color: theme.palette.neutral.primary300,
                cursor: 'default',
                width: '100%',
                '&:focus-visible': {
                  outline: `2px solid ${theme.palette.primary.main}`,
                  outlineOffset: '-2px',
                  background: 'transparent'
                }
              }}
            >
              <Typography sx={{ fontSize: '12px' }}>{data.title}</Typography>
              {data.notification && <Notification data={data} />}
            </Box>
          ) : (
            /* active link */
            <Box
              data-testid={data.testId}
              component={NavLink}
              to={data.path || ''}
              state={{ fromNavLink: true }}
              role='menuitem'
              aria-current={isActive ? 'page' : undefined}
              sx={{
                padding: '0.5em 0.5em 0.5em 1.5em',
                fontSize: '12px',
                fontWeight: isActive ? 600 : 500,
                background: isActive
                  ? theme.palette.neutral.secondary300
                  : 'transparent',
                color: 'inherit',
                cursor: 'pointer',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                '&:hover': {
                  background: theme.palette.neutral.secondary200,
                  transition: '0.2s linear'
                },
                '&:focus-visible': {
                  outline: `2px solid ${theme.palette.primary.main}`,
                  outlineOffset: '-2px',
                  background: theme.palette.neutral.secondary200
                }
              }}
            >
              <Typography sx={{ fontSize: '12px', fontWeight: 'inherit' }}>
                {data.title}
              </Typography>
              {data.notification && <Notification data={data} />}
            </Box>
          )}
        </>
      )}
    </li>
  );
};

export default MenuItem;
export type { MenuItemData };
