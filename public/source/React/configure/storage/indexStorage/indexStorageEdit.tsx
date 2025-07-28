import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Stack,
  Box,
  Typography,
  Button,
  Select,
  MenuItem,
  Divider,
  useTheme,
  Grid2
} from '@mui/material';

import InputDateHour, {
  IEDate
} from 'components/inc/inputDateHour/InputDateHour';

import { convertTimeTo24 } from 'utils/helpers/time';
import { retainArray } from 'utils/helpers/helpers';
import { SELECT_MENU_PROPS } from 'constants/constants';

import { submitData } from 'utils/api/submitWithRQ';
import Switch from 'components/inc/switch';
import Loader from 'components/inc/loader';
import { useUser } from 'utils/context/UserContext';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import sx from './indexStorageEdit.module.scss';

interface InitialData {
  id: number;
  reclaimation_day: string;
  reclaimation_hour: number;
  schedid: number;
}

interface RetainData {
  interval_seconds: number;
}

interface Date {
  day: string;
  hour: string;
}

interface IndexStorageEditProps {
  initialData: InitialData;
  retainData: RetainData;
  date: Date;
  refetchRetain: () => void;
  isLoadingRetain: boolean;
  isLoadingIndexMaintenance: boolean;
}
const IndexStorageEdit = ({
  initialData,
  retainData,
  refetchRetain,
  date,
  isLoadingRetain,
  isLoadingIndexMaintenance
}: IndexStorageEditProps) => {
  const theme = useTheme();
  const { session, canAccess } = useUser();
  const indexmgmt = canAccess('indexmgmt');

  const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>();
  const queryClient = useQueryClient();
  const [newDate, setNewDate] = useState(date);
  const [changed, setChanged] = useState(false);

  const { showSuccessSnackbar, showAxiosErrorSnackbar } = useSnackbarContext();

  const isLoadingInitial = isLoadingRetain || isLoadingIndexMaintenance;

  const placeholderDay = retainData
    ? retainData.interval_seconds / 24 / 60 / 60
    : 0;
  const placeholderDayValue = placeholderDay || 60;

  const [staleValue, setStale] = useState(placeholderDayValue);

  const enableStaleHostsInitial = !!(
    retainData && retainData.interval_seconds > 0
  );

  const [enableStaleHosts, setEnableStaleHosts] = useState(
    enableStaleHostsInitial
  );
  const onSubmit = async () => {
    const payloadIndex = {
      'reclaimation_day': newDate?.day,
      'reclaimation_hour': Number(convertTimeTo24(newDate?.hour)),
      id: initialData?.id,
      schedid: initialData?.schedid
    };

    const payloadStaleHosts = {
      interval_seconds: enableStaleHosts ? staleValue * 24 * 60 * 60 : 0
    };

    const promises = [];

    if (
      payloadIndex.reclaimation_day !== date?.day ||
      payloadIndex.reclaimation_hour !== Number(convertTimeTo24(date?.hour))
    ) {
      setIsLoadingUpdate(true);

      promises.push(
        new Promise((resolve, reject) => {
          submitData({
            url: '/configurations/indexmaintenance',
            session,
            payload: payloadIndex,
            method: 'PATCH',
            setSuccess: () => {
              setChanged(false);
              setIsLoadingUpdate(false);
            },
            callback: () => {
              queryClient.setQueryData(['indexmaintenance'], () => {
                return {
                  ...payloadIndex
                };
              });
              resolve({ ...payloadIndex });
            },
            errorCallback: (error) => {
              setIsLoadingUpdate(false);
              reject(error);
            }
          });
        })
      );
    }

    if (payloadStaleHosts.interval_seconds !== placeholderDay * 24 * 60 * 60) {
      setIsLoadingUpdate(true);

      promises.push(
        new Promise((resolve, reject) => {
          submitData({
            url: '/configurations/stalehosts',
            session,
            payload: payloadStaleHosts,
            method: 'PUT',
            setSuccess: () => {
              refetchRetain();
              setChanged(false);
              setIsLoadingUpdate(false);
            },
            callback: () => {
              queryClient.setQueryData(['stalehosts'], () => {
                return { interval_seconds: staleValue * 24 * 60 * 60 };
              });
              resolve({ interval_seconds: staleValue * 24 * 60 * 60 });
            },
            errorCallback: (error) => {
              setIsLoadingUpdate(false);
              reject(error);
            }
          });
        })
      );
    }

    Promise.all(promises)
      .then(() => {
        showSuccessSnackbar('Success: Saved index maintenance settings');
      })
      .catch((error) => {
        showAxiosErrorSnackbar(error);
      });
  };

  return (
    <Stack
      className={sx.container}
      sx={{
        border: `1px solid ${theme.palette.neutral.dark500}`,
        bgcolor: theme.palette.white.main
      }}
    >
      <Stack className={sx.main}>
        <Typography className={sx.title}>Index Maintenance Settings</Typography>

        {isLoadingInitial && <Loader sx={{ height: 266 }} />}
        {!isLoadingInitial && (
          <>
            <Box>
              <Typography fontSize={14}>
                Reclaim index storage every:
              </Typography>
              <InputDateHour
                id='indexStorage'
                label=''
                date={newDate as IEDate}
                onChange={(e) => {
                  setChanged(true);
                  setNewDate(e);
                }}
                disabled={isLoadingUpdate || !indexmgmt}
              />
            </Box>

            <Box ml={-1}>
              <Switch
                staticLabel='Enable unindexed host removal'
                value={enableStaleHosts}
                onChange={(e) => {
                  setChanged(true);
                  setEnableStaleHosts(e);
                }}
                disabled={isLoadingUpdate || !indexmgmt}
                labelClass={sx.switchLabel}
              />
            </Box>
            <Box flexGrow={1}>
              <Typography fontSize={14}>
                Remove hosts not indexed in:
              </Typography>
              <Select
                fullWidth
                labelId='retain'
                id='retain'
                value={staleValue}
                notched={false}
                variant='outlined'
                label='Select Hour'
                onChange={(e) => {
                  setChanged(true);
                  setStale(Number(e.target.value));
                }}
                required
                MenuProps={SELECT_MENU_PROPS}
                disabled={!enableStaleHosts || isLoadingUpdate || !indexmgmt}
              >
                {retainArray().map((i) => (
                  <MenuItem key={i} value={i}>
                    {i} days
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </>
        )}
      </Stack>
      {!isLoadingInitial && (
        <Stack p='15px 15px 0 15px'>
          <Box>
            <Divider />
          </Box>
          <Grid2 pt={2} pb={2}>
            <Box className={sx.changes}>
              {isLoadingUpdate && (
                <Box sx={{ position: 'absolute', left: 0 }}>
                  <Loader />
                </Box>
              )}
              <Button
                variant='outlined'
                className={sx.footerButton}
                disabled={isLoadingUpdate || !changed || !indexmgmt}
                onClick={() => {
                  setChanged(false);
                  setNewDate({ day: date?.day || '', hour: date?.hour || '' });
                  setStale(placeholderDayValue);
                  setEnableStaleHosts(enableStaleHostsInitial);
                }}
              >
                Clear Changes
              </Button>
              <Button
                variant='contained'
                className={sx.footerButton}
                onClick={() => onSubmit()}
                disabled={isLoadingUpdate || !changed || !indexmgmt}
              >
                Save Changes
              </Button>
            </Box>
          </Grid2>
        </Stack>
      )}
    </Stack>
  );
};

export default IndexStorageEdit;
