import { Box, Stack } from '@mui/material';

import useIndexStorage from 'utils/useQuery/useIndexStorage';
import { INDEX_STORAGE_MIN_DATA } from 'constants/constants';

import { useUser } from 'utils/context/UserContext';
import { useMemo } from 'react';
import { convertTimeToAmPm } from 'utils/helpers/time';
import useRetainIndexMaintenance from 'utils/useQuery/useRetainIndexMaintenance';
import { QueryClient } from '@tanstack/react-query';
import { LoaderFunction, redirect } from 'react-router-dom';
import { loadCanAccess } from 'lib/loadCanAccess';
import useQueryIndexMaintanance from 'data-hooks/useQueryIndexMaintanance';
import ExtendedChartLayout from '../../extendedChart/extendedChartLayout';
import IndexStorage from './indexStorage';
import ExpandedIndexStorageChart from '../../extendedChart/expandedIndexStorageChart';

import sx from './indexStorage.module.scss';
import IndexStorageEdit from './indexStorageEdit';

const IndexStorageDetails = () => {
  const { session } = useUser();
  const { data: dataIndexStorage } = useIndexStorage({
    session,
    count: INDEX_STORAGE_MIN_DATA
  });

  const { data: initialData, isLoading: isLoadingIndexMaintenance } =
    useQueryIndexMaintanance();
  const {
    data: retainData,
    isLoading: isLoadingRetain,
    refetch: refetchRetain
  } = useRetainIndexMaintenance(session);

  const date = useMemo(
    () =>
      initialData
        ? {
            day: initialData.reclaimation_day as string,
            hour: convertTimeToAmPm(initialData.reclaimation_hour)
          }
        : undefined,
    [initialData]
  );
  const retainExists = retainData ? retainData.interval_seconds >= 0 : false;

  return (
    <Box flexGrow={1}>
      <Stack className={sx.stack__main}>
        <ExtendedChartLayout ref={null}>
          <ExpandedIndexStorageChart />
        </ExtendedChartLayout>
        <Box
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'stretch' }}
          gap={2}
        >
          <Stack flexBasis='10%' className={sx.stack__card}>
            <IndexStorage
              used={dataIndexStorage?.used}
              capacity={dataIndexStorage?.capacity}
            />
          </Stack>
          {date && retainExists && (
            <Stack flexBasis='45%' className={sx.stack__card}>
              <IndexStorageEdit
                initialData={initialData!}
                retainData={retainData}
                refetchRetain={refetchRetain}
                date={date}
                isLoadingRetain={isLoadingRetain}
                isLoadingIndexMaintenance={isLoadingIndexMaintenance}
              />
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default IndexStorageDetails;

export const indexStorageDetailsLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const canAccess = await loadCanAccess(queryClient);
    if (!canAccess('indexmgmt')) {
      return redirect('..');
    }
    return null;
  };
