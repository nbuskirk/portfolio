export interface HistoryItem {
  date: number;
  size: number;
  capacity?: number;
}

export interface LicensedDataCounters {
  overdraft: number;
  available: number;
  expires: number;
  capacity: number;
  managedBytes: number;
  overdraftInstallTime?: number;
}

export interface HostHistoryItem {
  date: string;
  size: number;
}

export interface Host {
  hostname: string;
  history: HostHistoryItem[];
}

export interface LicenseCapacityData {
  expires: number;
  licensedDataCounters: LicensedDataCounters | undefined;
  licenseInstalled: boolean;
  capacity: number;
  used: number;
  label: string;
  history: HistoryItem[];
  license_engineid: string;
  hosts?: Host[];
  systemLicenseExpires: number;
  overdraftInstallTime: number;
}
