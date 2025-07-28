import { Stack, Typography, useTheme } from '@mui/material';
import LicenseChart from 'components/configure/extendedChart/licenseChart';
import Container from 'components/inc/container';
import { useLicenseCapacity, useLicenses } from 'utils/useQuery/useLicenses';
import { useUser } from 'utils/context/UserContext';
import Loader from 'components/inc/loader';
import sx from './licenseDetails.module.scss';

import LicenseCapacity from './licenseCapacity';

const LicenseDetails = () => {
  const theme = useTheme();
  const { session } = useUser();
  const { data: dataLicense, isLoading: isLoadingDataLicense } = useLicenses({
    session
  });
  const { data: dataLicenseCapacity, isLoading: isLoadingLicenseCapacity } =
    useLicenseCapacity({
      session,
      include_hosts: true,
      enabled: !!dataLicense
    });

  const isLoading = isLoadingDataLicense || isLoadingLicenseCapacity;

  return (
    <Container>
      <Stack className={sx.main}>
        <Typography sx={{ fontSize: 16, fontWeight: 600 }} mb={2}>
          License Status
        </Typography>
        {isLoading && <Loader sx={{ height: 460 }} />}
        {!isLoading && (
          <Stack
            borderRadius={1}
            border={1}
            borderColor={theme.palette.neutral.dark500}
          >
            <LicenseCapacity
              dataLicense={dataLicense}
              dataLicenseCapacity={dataLicenseCapacity}
            />
            <LicenseChart
              dataLicense={dataLicense}
              dataLicenseCapacity={dataLicenseCapacity}
            />
          </Stack>
        )}
      </Stack>
    </Container>
  );
};

export default LicenseDetails;
