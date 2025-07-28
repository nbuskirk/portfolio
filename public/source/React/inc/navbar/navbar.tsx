import React, { useMemo, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import HelpIcon from '@mui/icons-material/Help';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { LocalStorageKeys } from 'constants/constants';

import {
  AppBar,
  Container,
  IconButton,
  MenuList,
  MenuItem,
  Typography,
  Popover,
  useTheme,
  Badge,
  Alert,
  Tooltip,
  CircularProgress,
  Box,
  styled
} from '@mui/material';

import { useUser } from 'utils/context/UserContext';
import useEndSession from 'hooks/useEndSession';
import useEventsData from 'components/Alerts/hooks/useEventsData';
import { useIeSystem } from 'data-hooks/useIeSystem';
import { useLicenses } from 'utils/useQuery/useLicenses';
import useCleanQueries from 'components/Alerts/hooks/useCleanQueries';
import { QueryHistory } from 'components/Alerts/types';
import WarningIcon from '@mui/icons-material/Warning';
import { FormattedMessage } from 'react-intl';
import Info from '@mui/icons-material/Info';
import styles from './navLink/navLink.module.scss';
import useMainMenuLinks, { MenuData } from './hooks/useMainMenuLinks';
import useHelpLinks from './hooks/useHelpLinks';
import Loader from '../loader';
import ThemeIcon from '../ThemeIcon';

interface CustomMenuItem {
  anchorEl: null | HTMLElement;
  data?: MenuData[];
}

const urlParams = new URLSearchParams(window.location.search);
const settings = urlParams.get('settings');

const SkipLink = styled('a')(({ theme }) => ({
  position: 'absolute',
  top: '-40px',
  left: 0,
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: '8px',
  textDecoration: 'none',
  '&:focus': {
    top: 0
  }
}));

const NavBar = () => {
  const theme = useTheme();
  const { user, session, passwordExpiration } = useUser();
  const endSession = useEndSession();
  const { menuLinks } = useMainMenuLinks();
  const { helpLinks, isLoading: helpLinksIsLoading, error } = useHelpLinks();
  const { newEvents } = useEventsData({});
  const { data: licenseInfo } = useLicenses({ session });
  const {
    data: ieSystem,
    isLoading: ieSystemIsLoading,
    isSuccess: ieSystemIsSuccess
  } = useIeSystem({
    session
  });

  const [popover1, setPopover1] = useState<CustomMenuItem>({
    anchorEl: null
  });

  const [popover2, setPopover2] = useState<CustomMenuItem>({
    anchorEl: null
  });

  const [popover3, setPopover3] = useState<CustomMenuItem>({
    anchorEl: null
  });

  const [requestInitiated, setrequestInitiated] = useState(false);

  const [shouldClosePopover, setShouldClosePopover] = useState(true);

  // Enable a way to accessibly skip to first nav item when opening a popover
  const firstHelpMenuItemRef = useRef<HTMLLIElement>(null);
  const firstUserMenuItemRef = useRef<HTMLLIElement>(null);
  const firstSettingsMenuItemRef = useRef<HTMLLIElement>(null);

  const handleHelpPopoverEntered = () => {
    firstHelpMenuItemRef.current?.querySelector('a')?.focus();
  };

  const handleUserPopoverEntered = () => {
    firstUserMenuItemRef.current?.querySelector('a')?.focus();
  };

  const handleSettingsPopoverEntered = () => {
    firstSettingsMenuItemRef.current?.querySelector('a')?.focus();
  };

  const showPasswordWarning =
    passwordExpiration.expires > 0 &&
    passwordExpiration.expiry_warning_days > 0 &&
    passwordExpiration.expiry_warning_days >= passwordExpiration.expires;

  const passwordExpired = passwordExpiration.expires === 0;

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  const version = ieSystem?.ie_release;
  const { cleanupQueries } = useCleanQueries();
  const { QUERY_HISTORY } = LocalStorageKeys;
  const queryHistory = JSON.parse(
    localStorage.getItem(`${QUERY_HISTORY}`) || '{}'
  ) as QueryHistory;

  const cleanup = async () => cleanupQueries(queryHistory);

  /* Functions */
  const logout = () => {
    endSession(() => {
      window.location.reload();
    });
  };

  const handlePopoverClose = () => {
    if (shouldClosePopover) {
      setPopover2({ ...popover2, anchorEl: null });
    }
  };

  const handleLogout = async () => {
    setShouldClosePopover(false);
    setrequestInitiated(true);
    await cleanup();
    setShouldClosePopover(true);
    logout();
  };

  const notificationSx = useMemo(
    () => ({
      container: {
        display: 'flex',
        alignItems: 'center',
        bgcolor: showPasswordWarning
          ? theme.palette.warning.main
          : theme.palette.error.main,
        margin: '5px 5px 0 5px',
        borderRadius: '4px'
      },
      icon: {
        fill: theme.palette.error.contrastText,
        margin: '0 5px',
        fontSize: '20px'
      },
      text: {
        margin: '10px 10px 10px 0',
        fontSize: '12px',
        color: theme.palette.error.contrastText
      }
    }),
    [showPasswordWarning]
  );

  const renderPasswordExpirationAlert = () => {
    if ((!showPasswordWarning && !passwordExpired) || !notificationSx) {
      return null;
    }

    const isWarning = showPasswordWarning;

    const message = (
      <FormattedMessage
        id={
          isWarning
            ? 'password.expiration.warning'
            : 'password.expiration.error'
        }
        values={isWarning ? { days: passwordExpiration.expires } : undefined}
      />
    );

    return (
      <Box sx={notificationSx.container}>
        {isWarning ? (
          <WarningIcon sx={notificationSx.icon} />
        ) : (
          <Info sx={notificationSx.icon} />
        )}
        <Typography sx={notificationSx.text}>{message}</Typography>
      </Box>
    );
  };

  return (
    <>
      <SkipLink
        href='#main-content'
        id='skip-to-main-content'
        data-testid='skip-to-main-content'
      >
        Skip to main content
      </SkipLink>

      <AppBar position='static'>
        <Container
          disableGutters
          maxWidth='xl'
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <NavLink
            to='/dashboard'
            aria-label='CyberSense logo. Powered by Index Engines'
            data-testid='primary-nav-logo'
          >
            <ThemeIcon
              type='logo'
              sx={{ width: '150px', height: '35px', margin: '0 20px' }}
            />
          </NavLink>

          <nav id='main-menu' aria-label='Main Navigation'>
            <ul
              style={{
                display: 'flex',
                listStyle: 'none',
                margin: 0,
                padding: 0
              }}
              data-testid='primary-nav'
            >
              {menuLinks.map((link) => (
                <li key={link.href} style={{ height: '100%' }}>
                  <NavLink
                    end={
                      !link.href.includes('settings') &&
                      !link.href.includes('policies') &&
                      !link.href.includes('hosts')
                    }
                    to={link.href}
                    className={({ isActive }: { isActive: boolean }) =>
                      `${styles.navLink} ${isActive ? styles.active : ''}`
                    }
                    data-testid={link.dataTestId || ''}
                  >
                    {link.name}
                    {link.name === 'Alerts' && newEvents?.length > 0 && (
                      <Badge
                        badgeContent={
                          newEvents.length > 99 ? '99+' : newEvents.length
                        }
                        aria-label={`${newEvents.length} new alerts`}
                        color='primary'
                        sx={{
                          '.MuiBadge-badge': {
                            position: 'relative',
                            transform: 'none'
                          }
                        }}
                      />
                    )}
                    {link.name === 'Settings' &&
                      licenseInfo?.isSystemLicenseExpired && (
                        <Tooltip title='License has expired'>
                          <IconButton sx={{ marginRight: '15px' }}>
                            <Badge badgeContent='!' color='primary' />
                          </IconButton>
                        </Tooltip>
                      )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div
            id='secondary-menu'
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center'
            }}
            role='navigation'
            aria-label='Help Menu'
          >
            <Tooltip title='Help'>
              <IconButton
                onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                  setPopover1({
                    ...popover1,
                    anchorEl: event.currentTarget
                  })
                }
                aria-label='Help'
                aria-haspopup='true'
                aria-expanded={Boolean(popover1.anchorEl)}
                id='help-menu-button'
                data-testid='primary-help-menu-icon'
              >
                <HelpIcon
                  sx={{
                    color: theme.palette.neutral.dark400,
                    fontSize: '32px'
                  }}
                />
              </IconButton>
            </Tooltip>

            <div
              style={{
                borderLeft: `1px solid ${theme.palette.neutral.dark400}`,
                height: '26px',
                margin: '0 15px 0 10px'
              }}
              aria-hidden='true'
            />
            {user && (
              <Typography
                fontSize={12}
                sx={{
                  marginRight: '10px',
                  display: 'inline'
                }}
                component='span'
              >
                Welcome {user}
              </Typography>
            )}
            {settings && (
              <Tooltip title='Settings'>
                <IconButton
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                    setPopover3({ ...popover3, anchorEl: event.currentTarget })
                  }
                  aria-label='Settings'
                  aria-haspopup='true'
                  aria-expanded={Boolean(popover3.anchorEl)}
                  data-testid='primary-settings-menu-icon'
                >
                  <SettingsIcon
                    sx={{
                      color: theme.palette.neutral.dark400,
                      fontSize: '32px'
                    }}
                  />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title='User Options'>
              <IconButton
                onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                  setPopover2({ ...popover2, anchorEl: event.currentTarget })
                }
                aria-label='User Options'
                aria-haspopup='true'
                aria-expanded={Boolean(popover2.anchorEl)}
                id='user-menu-button'
                data-testid='primary-user-menu-icon'
              >
                {showPasswordWarning || passwordExpired ? (
                  <Badge badgeContent='!' color='primary' overlap='circular'>
                    <AccountCircleIcon
                      sx={{
                        color: theme.palette.neutral.dark400,
                        fontSize: '32px'
                      }}
                    />
                  </Badge>
                ) : (
                  <AccountCircleIcon
                    sx={{
                      color: theme.palette.neutral.dark400,
                      fontSize: '32px'
                    }}
                  />
                )}
              </IconButton>
            </Tooltip>

            <Popover
              id='helpMenu'
              open={Boolean(popover1.anchorEl)}
              onClose={() => setPopover1({ ...popover1, anchorEl: null })}
              anchorEl={popover1.anchorEl}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              aria-labelledby='help-menu-button'
              TransitionProps={{
                onEntered: handleHelpPopoverEntered
              }}
            >
              {ieSystemIsLoading || helpLinksIsLoading ? (
                <Loader
                  sx={{ width: 150, height: 100 }}
                  aria-label='Loading help content'
                />
              ) : (
                <>
                  {popover1?.data?.length !== 0 && (
                    <>
                      <MenuList
                        component='ul'
                        aria-label='help menu'
                        data-testid='primary-help-menu'
                      >
                        {helpLinks?.map((link, index) => (
                          <MenuItem
                            key={link.name}
                            component='li'
                            ref={index === 0 ? firstHelpMenuItemRef : null}
                          >
                            <a
                              href={link.href}
                              target='_blank'
                              rel='noreferrer'
                            >
                              {link.name}
                            </a>
                          </MenuItem>
                        ))}
                      </MenuList>

                      <div style={{ borderBottom: '1px solid #eee' }} />
                    </>
                  )}
                  <div
                    style={{
                      padding: '8px 12px',
                      color: theme.palette.primary.main
                    }}
                  >
                    {ieSystemIsSuccess ? (
                      `Version: ${version}`
                    ) : (
                      <Alert
                        severity='error'
                        variant='outlined'
                        sx={{
                          border: '1px solid rgb(229, 115, 115)',
                          color: 'rgb(229, 115, 115)',
                          padding: '0 3px 0 3px',
                          fontWeight: 800
                        }}
                      >
                        Version failed to load.
                      </Alert>
                    )}
                  </div>
                </>
              )}
            </Popover>

            <Popover
              id='profileMenu'
              open={Boolean(popover2.anchorEl)}
              onClose={handlePopoverClose}
              anchorEl={popover2.anchorEl}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              aria-labelledby='help-menu-button'
              TransitionProps={{
                onEntered: handleUserPopoverEntered
              }}
            >
              {renderPasswordExpirationAlert()}
              <MenuList
                component='ul'
                aria-label='user options'
                data-testid='primary-user-menu'
              >
                <MenuItem component='li' ref={firstUserMenuItemRef}>
                  <NavLink
                    to='/change_password'
                    data-testid='user-menu-password'
                  >
                    Change Password
                  </NavLink>
                </MenuItem>
                <MenuItem component='li'>
                  <Box
                    component='button' // otherwise <MenuItem> would want an href specified for a <Button> here
                    onClick={handleLogout}
                    disabled={requestInitiated}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      textAlign: 'left',
                      font: 'inherit',
                      color: 'inherit',
                      cursor: requestInitiated ? 'default' : 'pointer'
                    }}
                    data-testid='user-menu-logout'
                  >
                    Logout
                    {requestInitiated && (
                      <CircularProgress size={20} aria-label='Logging out' />
                    )}
                  </Box>
                </MenuItem>
              </MenuList>
            </Popover>

            <Popover
              id='settingsMenu'
              open={Boolean(popover3.anchorEl)}
              onClose={() => setPopover3({ ...popover3, anchorEl: null })}
              anchorEl={popover3.anchorEl}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              TransitionProps={{
                onEntered: handleSettingsPopoverEntered
              }}
            >
              <MenuList
                component='ul'
                aria-label='settings'
                data-testid='primary-settings-menu'
              >
                <MenuItem component='li' ref={firstSettingsMenuItemRef}>
                  <NavLink
                    to='/settings/users'
                    data-testid='settings-menu-users'
                  >
                    User Management
                  </NavLink>
                </MenuItem>
                <MenuItem component='li'>
                  <NavLink
                    to='/settings/emails'
                    data-testid='settings-menu-emails'
                  >
                    Email Subscriptions
                  </NavLink>
                </MenuItem>
              </MenuList>
            </Popover>
          </div>
        </Container>
      </AppBar>
    </>
  );
};

export default NavBar;
