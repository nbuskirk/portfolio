import useCustomization, {
  Customizations
} from 'data-hooks/config/useCustomization';
import useIsVendor from 'hooks/useIsVendor';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useUser } from 'utils/context/UserContext';
import { useLicenses } from 'utils/useQuery/useLicenses';

interface Notification {
  content: string;
  message: string;
}
export interface MenuItemData {
  title: string; // Title is mandatory
  icon?: string; // Icon is optional
  path?: string; // Path is optional
  header?: boolean; // Header is optional
  children?: Array<MenuItemData>; // Children is optional and can be an array of MenuItem
  exclude?: {
    key: keyof Customizations;
    value: Customizations[keyof Customizations];
  };
  access?: boolean;
  notification?: Notification;
  testId?: string; // Don't revise these with minor title changes (breaks tests), do revise with major changes
}

const useSideBarMenuData = () => {
  const { session, canAccess } = useUser();
  const intl = useIntl();
  const { data: dataCustomization, isSuccess } = useCustomization();
  const { data: licenseInfo } = useLicenses({ session });
  const licenseNotification = useMemo(() => {
    if (licenseInfo?.isSystemLicenseExpired) {
      return {
        content: '!',
        message: 'License has expired'
      };
    }
    return undefined;
  }, [licenseInfo?.isSystemLicenseExpired]);
  const { vendor: vendorIsDell } = useIsVendor('dell');

  const sidebarMenuData: MenuItemData[] = [
    {
      title: 'Settings',
      testId: 'settings-top-header',
      icon: 'settings',
      header: true
    },
    {
      'title': 'Storage',
      testId: 'settings-storage',
      'children': [
        {
          'title': 'Index Storage',
          testId: 'settings-index-storage',
          'path': 'indexstorage',
          'access': canAccess('indexmgmt')
        },
        {
          'title': 'Scratch Storage',
          testId: 'settings-scratch-storage',
          'path': 'scratchstorage',
          'access': canAccess('enginemgmt'),
          'exclude': { key: 'disable_scratch_storage', value: '1' }
        }
      ]
    },
    {
      'title': 'User Management',
      testId: 'settings-user-management',
      'children': [
        {
          'title': 'User Accounts',
          testId: 'settings-user-accounts',
          'path': 'users',
          'access': canAccess('usermgmt')
        },
        {
          'title': 'Role Privileges',
          testId: 'settings-role-privileges',
          'path': 'roles',
          'access': canAccess('usermgmt')
        }
      ]
    },
    {
      'title': 'Alerts',
      testId: 'settings-alerts',
      'children': [
        {
          'title': 'Special Criteria',
          testId: 'settings-special-criteria',
          'path': 'alerts',
          'access': canAccess('alertmgmt')
        },
        {
          'title': 'Email Notifications',
          testId: 'settings-email-notifications',
          'path': 'emailnotifications',
          'access': canAccess('alertmgmt')
        }
      ]
    },
    {
      'title': 'Network and Security',
      testId: 'settings-network-and-security',
      'children': [
        {
          'title': 'Login',
          testId: 'settings-login',
          'path': 'login',
          'access': canAccess('netsecmgmt')
        },
        {
          'title': 'Password Configuration',
          testId: 'settings-password-configuration',
          'path': 'password',
          'access': canAccess('netsecmgmt')
        },
        {
          'title': 'Active Directory',
          testId: 'settings-active-dictionary',
          'path': 'ad',
          'access': canAccess('netsecmgmt')
        },
        {
          'title': 'Security Certificates',
          testId: 'settings-security-certificates',
          'path': 'ssl',
          'access': canAccess('netsecmgmt')
        },
        {
          'title': 'Diagnostics and Reporting',
          testId: 'settings-diagnostics-and-reporting',
          'path': 'diagnostics',
          'access': canAccess('netsecmgmt')
        }
      ]
    },
    {
      'title': 'License Management',
      testId: 'settings-license-management',
      'notification': licenseNotification,
      'children': [
        {
          'title': 'License Status',
          testId: 'settings-license-status',
          'path': 'licensestatus',
          'access': true,
          'notification': licenseNotification
        },
        {
          'title': 'License Details',
          testId: 'settings-license-details',
          'path': 'licensedetails',
          'access': true
        },
        {
          'title': 'EULA',
          testId: 'settings-eula',
          'path': 'eula',
          'access': true
        }
      ]
    },
    {
      'title': 'Advanced',
      testId: 'settings-advanced',
      'children': [
        {
          'title': 'Custom Thresholds',
          testId: 'settings-custom-thresholds',
          'path': 'customthresholds',
          'access': canAccess('thresholdmgmt')
        },
        {
          'title': 'Custom YARA Rulesets',
          testId: 'settings-custom-yara-rulesets',
          'path': 'yara',
          'access': canAccess('alertmgmt')
        },
        {
          'title': 'Trusted Files',
          testId: 'settings-trusted-files',
          'path': 'trustedfiles',
          'access': canAccess('admin')
        },
        {
          'title': 'Global Resets',
          testId: 'settings-global-resets',
          'path': 'globalresets',
          'access':
            canAccess('thresholdmgmt') ||
            canAccess('indexmgmt') ||
            canAccess('alertmgmt')
        },
        {
          'title': 'Recover from Backup',
          testId: 'settings-recover-from-backup',
          'path': 'restore',
          'access': canAccess('seebackup')
        },
        {
          'title': intl.formatMessage({ id: 'globalfeatureoptions.title' }),
          testId: 'settings-global-feature-options',
          'path': 'options',
          'access': canAccess('policyjob') || canAccess('alertmgmt')
        }
      ]
    }
  ];

  if (vendorIsDell && OIDC_UI_FEATURE_ENABLED) {
    sidebarMenuData
      .find((section) => section.title === 'Network and Security')!
      .children!.push({
        'title': 'OIDC',
        testId: 'settings-oidc',
        'path': 'oidc',
        'access': canAccess('admin')
      });
  }

  if (!isSuccess) {
    return sidebarMenuData;
  }
  const customization = dataCustomization;
  return sidebarMenuData.reduce<MenuItemData[]>((acc, val) => {
    const newData: MenuItemData = { ...val };
    newData.children = newData.children?.filter((child) => {
      if (!child.exclude) {
        return true;
      }
      const { key, value } = child.exclude;
      if (customization && customization[key]) {
        return value !== customization[key];
      }

      return true;
    });
    acc.push(newData);
    return acc;
  }, []);
};

export default useSideBarMenuData;
