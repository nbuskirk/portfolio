import { useIntl } from 'react-intl';

export interface MenuData {
  name?: string;
  href: string;
  onClick?: () => void;
  dataTestId?: string;
}

/* Menu Links */
const mainMenuLinks = (): readonly MenuData[] => {
  const intl = useIntl();

  return [
    { name: 'Home', href: '/dashboard', dataTestId: 'primary-nav-home' },
    {
      name: 'Alerts',
      href: '/dashboard/alerts',
      dataTestId: 'primary-nav-alerts'
    },
    { name: 'Hosts', href: '/dashboard/hosts', dataTestId: 'primary-hosts' },
    {
      name: intl.formatMessage({
        id: 'navbar.backup.tab.label',
        defaultMessage: 'Backups'
      }),
      href: `/dashboard/${intl.formatMessage({
        id: 'navbar.backup.tab.link',
        defaultMessage: 'backups'
      })}`,
      dataTestId: 'primary-nav-backups'
    },
    {
      name: 'Policies',
      href: '/dashboard/policies',
      dataTestId: 'primary-nav-policies'
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      dataTestId: 'primary-nav-settings'
    }
  ];
};

const useMainMenuLinks = () => {
  return {
    menuLinks: mainMenuLinks()
  } as const;
};

export default useMainMenuLinks;
