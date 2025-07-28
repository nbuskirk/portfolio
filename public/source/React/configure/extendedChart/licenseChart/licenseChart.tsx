import { useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import Loader from 'components/inc/loader';

import { refactorLicenseCapacity } from 'utils/useQuery/useLicenses';
import { LicenseCapacityData } from 'components/configure/licenseManagement/types';
import ChartUsage from '../expandedLicenseChart/chartUsage';

const LicenseChart = ({
  dataLicense,
  dataLicenseCapacity
}: {
  dataLicense: any;
  dataLicenseCapacity: any;
}) => {
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
  }, [dataLicenseCapacity]);

  return (
    <Stack mt={1}>
      <Box>
        {!dataLicense || !dataLicenseCapacity ? <Loader /> : null}
        {dataLicense && dataLicenseCapacity && (
          <ChartUsage data={licenseCapacityData} />
        )}
      </Box>
    </Stack>
  );
};

export default LicenseChart;
