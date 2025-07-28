import { Box, Divider, Stack, Typography } from '@mui/material';
import Container from 'components/inc/container';
import { useUser } from 'utils/context/UserContext';
import {
  refactorLicenseCapacity,
  useClients,
  useLicenseCapacity,
  useLicenses,
  useServer
} from 'utils/useQuery/useLicenses';
import { useEffect, useState } from 'react';
import Loader from 'components/inc/loader';
import sx from './licenseConfigDetails.module.scss';
import LicenseClientsServer from './licenseClientsServer';
import LicenseConfiguration from './licenseConfiguration';
import { LicenseCapacityData } from '../types';

const LicenseConfigDetails = () => {
  const { session } = useUser();

  const { data: dataLicense } = useLicenses({ session });
  const { data: licenseClients, isLoading: licenseClientsLoading } = useClients(
    { session }
  );
  const {
    data: licenseServer,
    isLoading: licenseServerLoading,
    refetch: licenseServerRefetch
  } = useServer({ session });
  const { data: dataLicenseCapacity } = useLicenseCapacity({
    session,
    include_hosts: true,
    enabled: !!dataLicense
  });

  const [licenseCapacityData, setLicenseCapacityData] =
    useState<LicenseCapacityData | null>(null);

  useEffect(() => {
    if (dataLicenseCapacity) {
      const data = refactorLicenseCapacity({
        licCap: dataLicenseCapacity,
        licenses: dataLicense
      }) as LicenseCapacityData;
      setLicenseCapacityData(data);
    }
  }, [dataLicenseCapacity, dataLicense]);

  return (
    <Container>
      <Box className={sx.main}>
        <Typography sx={{ fontSize: 16, fontWeight: 600 }} mb={2}>
          License Details
        </Typography>
        {licenseClientsLoading && <Loader sx={{ height: 540 }} />}
        {!licenseClientsLoading && (
          <Box>
            <Stack className={sx.content}>
              <Stack>
                <LicenseClientsServer
                  licenseClients={licenseClients}
                  licenseServer={licenseServer}
                  engineId={dataLicense?.license_engineid}
                  isLoading={licenseClientsLoading || licenseServerLoading}
                />
              </Stack>
            </Stack>
            <Divider sx={{ margin: '5px 0 5px 0' }} />
            <Stack>
              <LicenseConfiguration
                licenseInfo={licenseCapacityData}
                licenseServer={licenseServer}
                licenseServerRefetch={licenseServerRefetch}
              />
            </Stack>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default LicenseConfigDetails;
