type JSON = string;

interface CloudConfiguration {
  cloud_config_status: boolean;
  persistent_storage_limit: number;
  persistent_storage_limit_enabled: boolean;
  scratch_storage_limit: number;
  scratch_storage_limit_enabled: boolean;
  vendor: string;
}

interface AlertCategoryList {
  alertCategory: string;
  alert_types: string[];
}

interface EmailAlert {
  alert_category_list: AlertCategoryList[];
  alert_email_address: string;
}

interface IndexMaintenance {
  id: number;
  reclaimation_day: string;
  reclaimation_hour: number;
  schedid: number;
}

interface InfectionType {
  date: number;
  infection_type: number;
  infection_type_description: string;
  remote_ip: string;
  user: string;
}

interface InfectionTypeHost {
  hostname: string;
  infection_types: InfectionType[];
}

interface Mfa {
  fedid: string;
  otp_setting: 'never' | 'always' | 'ifset';
}

interface PackageVersion {
  dkm_version: string;
  install_time: number;
  packager: string;
  release: string;
  vendor: string;
  version: string;
}

interface Package {
  details: {
    versions: PackageVersion[];
  };
  name: string;
}

interface Session {
  max_idle_minutes: number;
  same_index_access: boolean;
  same_ip_access: boolean;
  session_inactivity_timeout: number;
}

interface StaleHosts {
  interval_secods: number;
}

interface Configurations {
  cloud: CloudConfiguration;
  customization: JSON;
  emailalerts: EmailAlert[];
  index_maintenance: IndexMaintenance;
  infection_type_hosts: InfectionTypeHost[];
  mfa: Mfa;
  packages: Package[];
  session: Session;
  stalehosts: StaleHosts;
  theme_definitions: JSON[];
}

export default Configurations;
