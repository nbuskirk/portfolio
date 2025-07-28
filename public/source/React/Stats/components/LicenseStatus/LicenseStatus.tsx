import { Alert, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Loader from 'components/inc/loader';
import { AxiosError } from 'axios';
import { useLicenses } from 'utils/useQuery/useLicenses';
import { useUser } from 'utils/context/UserContext';

interface Params {
  data:
    | {
        active_data_current_count: number;
        active_data_overdraft_count: number;
        active_data_overdraft_expire_time: number;
        system_license_expire_time: number;
      }
    | undefined;
  isError: boolean;
  isLoading: boolean;
  error: AxiosError<unknown, any> | null;
}

export const getLicenseText = (
  systemLicenseExpireTime: number,
  isExpired: boolean
) => {
  if (systemLicenseExpireTime === -1) {
    return 'License is not installed';
  }

  if (systemLicenseExpireTime > 0) {
    return isExpired
      ? 'Expired'
      : new Date(systemLicenseExpireTime * 1000).toLocaleDateString();
  }

  return 'Perpetual License';
};

const LicenseStatus = ({ data, isError, isLoading, error }: Params) => {
  const theme = useTheme();
  const { session } = useUser();
  const { data: licenseInfo } = useLicenses({ session });

  return (
    <>
      {isError && (
        <Alert
          severity='error'
          variant='filled'
          sx={{
            border: '1px solid rgb(229, 115, 115)',
            color: 'white',
            fontWeight: 800,
            marginBottom: '1em'
          }}
        >
          License stats failed to load. {error?.message}
        </Alert>
      )}
      <Stack
        sx={{
          textAlign: 'center',
          display: 'flex',
          alignContent: 'center',
          justifyContent: 'center',
          height: '295px'
        }}
      >
        {isLoading && <Loader />}
        {!isLoading && !isError && data && (
          <Typography
            variant='h2'
            marginTop={1}
            color={
              licenseInfo?.isSystemLicenseExpired ||
              data.system_license_expire_time === -1
                ? theme.palette.error.dark
                : theme.palette.primary.main
            }
            fontWeight={600}
          >
            {getLicenseText(
              data.system_license_expire_time,
              licenseInfo?.isSystemLicenseExpired
            )}
          </Typography>
        )}
      </Stack>
    </>
  );
};

export default LicenseStatus;
