import { useState, useEffect } from 'react';

import { Stack, Typography, Chip, Divider, Box } from '@mui/material';
import { CSVLink } from 'react-csv';
import { useTheme } from '@mui/material/styles';
import { formatBytes } from 'utils/helpers/size';
import { refactorLicenseCapacity } from 'utils/useQuery/useLicenses';
import { FileDownloadOutlined } from '@mui/icons-material';
import { ctime } from 'utils/helpers/time';
import { getLicenseText } from 'components/Stats/components/LicenseStatus/LicenseStatus';
import sx from './licenseCapacity.module.scss';
import { LicenseCapacityData } from '../types';

interface Measurement {
  file_count: number;
  managed_bytes: number;
  time: number;
}

interface Host {
  hostname: string;
  measurements: Measurement[];
}

interface MeasurementTime {
  hostname: string;
  time: number;
  active_data: number;
  datetime?: string;
}

interface CapacityInfo {
  value: number;
  unit: string;
  labeled: string;
}

const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const licenseStatusDownloadHeaders = [
  {
    'label': 'Client hostname',
    'key': 'hostname'
  },
  {
    'label': 'Date',
    'key': 'datetime'
  },
  {
    'label': 'Active Data',
    'key': 'active_data'
  }
];

const LicenseCapacity = ({
  dataLicense,
  dataLicenseCapacity
}: {
  dataLicense: any;
  dataLicenseCapacity: any;
}) => {
  const [used, setUsed] = useState<CapacityInfo | null>(null);
  const [remaining, setRemaining] = useState({
    value: 0,
    unit: 'GB',
    labeled: '0 GB'
  });
  const [overdraft, setOverdraft] = useState<CapacityInfo | null>({
    value: 0,
    unit: 'GB',
    labeled: 'N/A'
  });
  const [gracePeriod, setGracePeriod] = useState('N/A');
  const [expiration, setExpiration] = useState('');
  const [licenseInstalled, setLicenseInstalled] = useState(true);
  const [downloadData, setDownloadData] = useState([]);

  const [licenseCapacityData, setLicenseCapacityData] =
    useState<LicenseCapacityData | null>(null);

  useEffect(() => {
    if (dataLicenseCapacity) {
      const capacityData = refactorLicenseCapacity({
        licCap: dataLicenseCapacity,
        licenses: dataLicense
      }) as LicenseCapacityData;
      setLicenseCapacityData(capacityData);
    }
  }, [dataLicenseCapacity, dataLicense]);

  useEffect(() => {
    if (
      licenseCapacityData &&
      typeof licenseCapacityData.capacity !== 'undefined'
    ) {
      setLicenseInstalled(licenseCapacityData.licenseInstalled); // no counters = unlimited license
      const { licensedDataCounters } = licenseCapacityData;

      const managedBytes = Number(licensedDataCounters?.managedBytes);
      const availableBytes = Number(licensedDataCounters?.available);
      const overdraftBytes = Number(licensedDataCounters?.overdraft);
      const capacityBytes = Number(licensedDataCounters?.capacity);
      const remainingBytes =
        availableBytes + overdraftBytes - (managedBytes - capacityBytes);
      const remainingFormatBytes = formatBytes({ bytes: remainingBytes });
      const usedFormatBytes = formatBytes({ bytes: managedBytes });
      const overdraftFormatBytes = formatBytes({
        bytes: overdraftBytes < 0 ? overdraftBytes * -1 : 0
      });

      const isExpired =
        licenseCapacityData.systemLicenseExpires! > 0 &&
        licenseCapacityData.systemLicenseExpires! < Date.now() / 1000;
      setExpiration(
        getLicenseText(
          licenseCapacityData.systemLicenseExpires !== undefined
            ? licenseCapacityData.systemLicenseExpires
            : -1,
          isExpired
        )
      );

      if (overdraftBytes !== 0 && licensedDataCounters?.overdraftInstallTime) {
        const ninetyDays = 90 * 24 * 60 * 60;
        const isOverdraftExpired =
          licensedDataCounters.overdraftInstallTime > 0 &&
          licensedDataCounters.overdraftInstallTime + ninetyDays <
            Date.now() / 1000;
        const msg = getLicenseText(
          licensedDataCounters.overdraftInstallTime + ninetyDays,
          isOverdraftExpired
        );
        setGracePeriod(msg);
      }

      // managed_bytes is how much is in use
      setUsed({
        value: Number(usedFormatBytes.split(' ')[0]),
        unit: usedFormatBytes.split(' ')[1],
        labeled: usedFormatBytes
      });
      // sum of counters - (managed_bytes - capacity)
      setRemaining({
        value: Number(remainingFormatBytes.split(' ')[0]),
        unit: remainingFormatBytes.split(' ')[1],
        labeled: remainingFormatBytes
      });
      setOverdraft({
        value: Number(overdraftFormatBytes.split(' ')[0]),
        unit: overdraftFormatBytes.split(' ')[1],
        labeled: overdraftFormatBytes
      });
    }
  }, [licenseCapacityData]);

  const downloadCSV = () => {
    const measurements = dataLicenseCapacity.hosts.flatMap((host: Host) => {
      const pitms: MeasurementTime[] = [];
      host.measurements.forEach((m) => {
        pitms.push({
          'hostname': host.hostname,
          'time': m.time,
          'active_data': m.managed_bytes
        });
      });
      pitms.sort((a, b) => a.time - b.time);
      pitms.forEach((pitm) => {
        const d = new Date(pitm.time * 1000);
        // eslint-disable-next-line no-param-reassign
        pitm.datetime = ctime(d);
      });
      return pitms;
    });
    setDownloadData(measurements);
  };

  const theme = useTheme();

  return (
    <Stack borderBottom={1} borderColor={theme.palette.neutral.dark500}>
      <Box className={sx.main}>
        <Box display='flex' gap={1}>
          <Typography className={sx.typography__subtitle}>
            License Usage
          </Typography>
          {remaining.value > 0 &&
            remaining.value <= 7.5 &&
            sizes.indexOf(remaining.unit) <= sizes.indexOf('GB') && (
              <Chip
                label='Low Licensed Remaining'
                sx={{
                  backgroundColor: theme.palette.error.light,
                  color: theme.palette.error.main
                }}
                className={sx.chip}
              />
            )}
        </Box>
        <Box display='flex' gap={2}>
          <Stack>
            {!licenseInstalled ? (
              <Stack className={sx.stack__titleRow}>
                <Typography
                  className={sx.typography__title}
                  sx={{ color: theme.palette.error.dark }}
                >
                  License is not installed
                </Typography>
              </Stack>
            ) : (
              <Stack className={sx.stack__titleRow}>
                <Typography
                  className={sx.typography__title}
                  sx={{ color: theme.palette.error.dark }}
                >
                  {remaining.value === 0
                    ? ' '
                    : `${remaining.labeled} remaining`}
                </Typography>
              </Stack>
            )}
            {used && (
              <Stack>
                <Typography fontSize={12} color={theme.palette.neutral.dark200}>
                  {used?.labeled} active data
                </Typography>
              </Stack>
            )}
          </Stack>
          <Divider orientation='vertical' flexItem />
          <Stack direction='row' justifyContent='space-between' width='100%'>
            <Stack>
              <Box display='flex' gap={0.5}>
                <Typography fontSize={12} color={theme.palette.neutral.dark200}>
                  Overdraft Data Used:
                </Typography>
                <Typography
                  fontSize={12}
                  fontWeight={700}
                  color={theme.palette.neutral.dark200}
                >
                  {overdraft?.value != null && overdraft?.value !== undefined
                    ? overdraft.labeled
                    : 'N/A'}
                </Typography>
              </Box>
              <Box display='flex' gap={0.5}>
                <Typography fontSize={12} color={theme.palette.neutral.dark200}>
                  Overdraft Grace Period Ends:
                </Typography>
                <Typography
                  fontSize={12}
                  fontWeight={700}
                  color={theme.palette.neutral.dark200}
                >
                  {gracePeriod}
                </Typography>
              </Box>
              <Box display='flex' gap={0.5}>
                <Typography fontSize={12} color={theme.palette.neutral.dark200}>
                  License Expiration:
                </Typography>
                <Typography
                  fontSize={12}
                  fontWeight={700}
                  color={
                    dataLicense.isSystemLicenseExpired || !licenseInstalled
                      ? theme.palette.error.dark
                      : theme.palette.neutral.dark200
                  }
                >
                  {expiration}
                </Typography>
              </Box>
            </Stack>
            <Stack mt='auto'>
              {dataLicenseCapacity && (
                <CSVLink
                  filename='License_status'
                  asyncOnClick
                  onClick={downloadCSV}
                  data={downloadData}
                  headers={licenseStatusDownloadHeaders}
                >
                  <FileDownloadOutlined />
                </CSVLink>
              )}
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Stack>
  );
};

export default LicenseCapacity;
