import { Box, Stack } from '@mui/material';

import ExpandedScratchStorageChart from 'components/configure/extendedChart/expandedScratchStorageChart';
import { QueryClient } from '@tanstack/react-query';
import { LoaderFunction, redirect } from 'react-router-dom';
import { getCustomizationQuery } from 'data-hooks/config/useCustomization';
import ExtendedChartLayout from '../../extendedChart/extendedChartLayout';

import sx from './scratchStorage.module.scss';
import ScratchStorageEdit from './scratchStorageEdit';

const ScratchStorageDetails = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <Stack className={sx.stack__main}>
        <ExtendedChartLayout ref={null}>
          <ExpandedScratchStorageChart />
        </ExtendedChartLayout>
        <Box style={{ display: 'flex', flexDirection: 'row' }}>
          <Stack width='100%'>
            <ScratchStorageEdit />
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default ScratchStorageDetails;

export const scratchStorageDetailsLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const customization = await queryClient.ensureQueryData(
      getCustomizationQuery()
    );
    if (customization.disable_scratch_storage === '1') {
      return redirect('..');
    }
    return null;
  };
