import React, { useState, useEffect } from 'react';
import Modal from 'components/inc/modalContainer/modalContainer';
import { Box, Typography, Switch, Stack } from '@mui/material';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { useTheme } from '@mui/material/styles';

import { API } from 'utils/helpers/api';
import useSession from 'utils/hooks/useSession';
import Loader from 'components/inc/loader';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';

const AlertConfigurationModal = ({
  visibility,
  setOpenAlertConfigurationModal
}) => {
  const [hostsFromFetch, setHostsFromFetch] = useState();
  const [hostsFromFetchLoading, setHostsFromFetchLoading] = useState();
  const [selectedRows, setSelectedRows] = useState();
  const [tableRows, setTableRows] = useState([]);
  const [disableDatabaseCorruption, setDisableDatabaseCorruption] = useState();
  const { showSuccessSnackbar, showAxiosErrorSnackbar } = useSnackbarContext();

  const { session } = useSession();

  const fetchHosts = async () => {
    setHostsFromFetchLoading(true);
    await API.get('/configurations/infection_type_hosts', {
      headers: { sessionid: session }
    })
      .then((res) => {
        setHostsFromFetchLoading(false);
        if (res.status === 200) {
          // const hff = [...res.data, { hostname: '*ALL*' }]; // mock global disable
          setHostsFromFetch(res?.data);
        }
      })
      .catch((error) => {
        setHostsFromFetchLoading(false);
        console.log(error);
      });
  };

  /* Fetch host data from REST API, but only if there's actually chart data */
  useEffect(() => {
    if (visibility === true) {
      fetchHosts();
    }
  }, [visibility]);

  useEffect(() => {
    if (hostsFromFetch?.find((host) => host.hostname === '*ALL*')) {
      setDisableDatabaseCorruption(true);
      setHostsFromFetch(
        hostsFromFetch?.filter((host) => host.hostname !== '*ALL*')
      );
    } else if (hostsFromFetch?.length > 0) {
      const rows = [];
      hostsFromFetch.forEach((host, index) => {
        rows.push({ id: index, hostname: host.hostname });
      });
      setTableRows(rows);
    }
  }, [hostsFromFetch]);

  const onSave = async () => {
    const hostsToEnable = [];
    const hostsToDisable = [];

    if (disableDatabaseCorruption) {
      hostsToDisable.push('*ALL*');
      // hostsToEnable.push('*ALL*');
    } else {
      hostsToEnable.push('*ALL*');
      // console.log(selectedRows);
      selectedRows?.forEach((row) => {
        // console.log(row);
        hostsToEnable.push(tableRows[row].hostname);
      });
    }
    const response = await patchHosts(hostsToEnable, hostsToDisable);
    setSelectedRows([]);
    setOpenAlertConfigurationModal(false);
    setTableRows([]);
  };

  const patchHosts = async (hostsToEnable, hostsToDisable) => {
    console.log('PATCHING: ', hostsToEnable);
    console.log('DELETING: ', hostsToDisable);
    try {
      const response = await API.patch(
        `/configurations/infection_type_hosts`,
        {
          hostnames_to_disable: hostsToDisable,
          hostnames_to_enable: hostsToEnable,
          infection_types_to_disable: ['Possible corruption of a database']
        },
        {
          headers: {
            sessionid: session
          }
        }
      )
        .then(() => {
          showSuccessSnackbar(
            'Success: Saved database corruption alerting criteria'
          );
        })
        .catch((err) => {
          showAxiosErrorSnackbar(err);
          console.log(err.message);
        });
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  // const deleteHosts = async (hosts) => {
  //   console.log('POSTING: ', hosts);
  //   try {
  //     const response = await API.delete(
  //       `/configurations/infection_type_hosts`,
  //       {
  //         headers: {
  //           sessionid: session
  //         },
  //         data: {
  //           hostnames: hosts
  //         }
  //       }
  //     ).catch((err) => {
  //       setPostError(err.message);
  //       console.log(err.message);
  //     });
  //     return response;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  /* Static datatable columns */
  const columns = [
    {
      field: 'hostname',
      headerName: 'HOST NAME',
      width: 375,
      editable: false,
      sortable: true
    }
  ];

  const theme = useTheme();

  return (
    <Modal
      setVisibility={() => {
        setOpenAlertConfigurationModal(false);
      }}
      visibility={visibility}
      title='Enable Alert: Database Corruption'
      cancelText='Discard Changes'
      onCancel={() => {
        setOpenAlertConfigurationModal(false);
      }}
      saveText='Save Changes'
      onSave={onSave}
      width='572px'
    >
      <Box
        sx={{
          height: 400,
          width: '100%',
          paddingBottom: '16px',
          marginBottom: '20px'
        }}
      >
        <Typography fontSize={14} paddingBottom={2}>
          Include the following hosts in database corruption alerts
        </Typography>
        {hostsFromFetchLoading && <Loader />}
        {disableDatabaseCorruption && !hostsFromFetchLoading && (
          <Typography fontSize={14}>
            <strong>All hosts are disabled</strong>
          </Typography>
        )}
        {tableRows.length > 0 &&
          !hostsFromFetchLoading &&
          !disableDatabaseCorruption && (
            <DataGridPremium
              theme={theme}
              rows={tableRows}
              columns={columns}
              disableRowSelectionOnClick
              pagination={false}
              hideFooter
              disableColumnFilter
              disableColumnSelector
              disableColumnMenu
              disableColumnReorder
              disableColumnResize
              checkboxSelection
              keepNonExistentRowsSelected
              onRowSelectionModelChange={(rowID) => {
                setSelectedRows(rowID);
              }}
              selectionModel={selectedRows}
            />
          )}
        {tableRows.length === 0 &&
          !hostsFromFetchLoading &&
          !disableDatabaseCorruption && (
            <Typography fontSize={14}>
              No hosts are currently excluded from database corruption reporting
            </Typography>
          )}
      </Box>
      {!hostsFromFetchLoading && (
        <Box style={{ borderTop: '1px dotted #ccc' }}>
          <Typography fontSize={14} paddingTop={2}>
            Database corruption reporting for all hosts
          </Typography>
          <Stack direction='row' spacing={1} alignItems='center' paddingTop={2}>
            <Switch
              checked={disableDatabaseCorruption || false}
              onChange={(e) => setDisableDatabaseCorruption(e.target.checked)}
            />
            <Typography>Disable reporting for all hosts</Typography>
          </Stack>
        </Box>
      )}
    </Modal>
  );
};

export default AlertConfigurationModal;
