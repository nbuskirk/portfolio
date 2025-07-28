import React from 'react';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Box,
  Typography,
  Stack,
  Divider,
  Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

import ChipStatus from 'components/configure/jobs/chipStatus';

// ICONS
import ErrorIcon from '@mui/icons-material/Error';
import CircleIcon from '@mui/icons-material/Circle';

import sx from './tooltips.module.scss';

export const TooltipProcessor = ({ children }) => {
  const theme = useTheme();
  return (
    <Tooltip
      title={
        <Box className={sx.processor}>
          <ErrorIcon sx={{ color: theme.palette.error.dark }} />
          <Box className={sx.processorContent}>
            <Typography className={sx.processorTitle}>
              19 tasks waiting
            </Typography>
            <Typography className={sx.processorDescription}>
              Today at 13:30pm
            </Typography>
          </Box>
        </Box>
      }
      arrow
      placement='left-start'
    >
      {children}
    </Tooltip>
  );
};

export const TooltipAddingChartDisabled = ({ children }) => (
  <Tooltip
    title={
      <Typography className={sx.addingChartText}>
        The current chart type doesn’t support additional charts.
      </Typography>
    }
    arrow
    placement='left-start'
  >
    {children}
  </Tooltip>
);

export const TooltipGanttChart = ({ children }) => {
  const theme = useTheme();
  return (
    <Tooltip
      title={
        <Stack className={sx.ganttChart}>
          <Box className={sx.ganttChartHeader}>
            <Typography className={sx.ganttChartTitle}>
              91bd86a2fead20c79b6ce3884984898
            </Typography>
            <Typography className={sx.ganttChartJobName}>
              Job Name that can be Long and bla bla bla
            </Typography>
            <Box className={sx.ganttChartChipStatus}>
              <ChipStatus value='Completed' />
            </Box>
          </Box>
          <Divider sx={{ marginTop: '4px' }} />
          <Box className={sx.ganttChartContent}>
            <PairRow label='Start:' value='Dec 8 01:30' />
            <PairRow label='Duration' value='12:00' />
            <PairRow
              label='Pending:'
              value='6:30'
              startIcon={
                <CircleIcon
                  className={sx.startIcon}
                  sx={{
                    color: theme.palette.graph.e
                  }}
                />
              }
            />
            <PairRow
              label='Copy:'
              value='0:45'
              startIcon={
                <CircleIcon
                  className={sx.startIcon}
                  sx={{
                    color: theme.palette.graph.d
                  }}
                />
              }
            />
            <PairRow
              label='Index:'
              value='1:15'
              startIcon={
                <CircleIcon
                  className={sx.startIcon}
                  sx={{
                    color: theme.palette.graph.c
                  }}
                />
              }
            />
            <PairRow
              label='Post-Process:'
              value='1:30'
              startIcon={
                <CircleIcon
                  className={sx.startIcon}
                  sx={{
                    color: theme.palette.graph.b
                  }}
                />
              }
            />
            <PairRow
              label='Analyze:'
              value='2:00'
              startIcon={
                <CircleIcon
                  className={sx.startIcon}
                  sx={{
                    color: theme.palette.graph.a
                  }}
                />
              }
            />
          </Box>
        </Stack>
      }
      arrow
      placement='right-start'
    >
      {children}
    </Tooltip>
  );
};

const PairRow = ({ label, value, startIcon }) => (
  <Stack className={sx.pairRow}>
    <Typography className={sx.pairRowContent}>
      {startIcon ? (
        <Box className={sx.pairRowWrapper}>
          {startIcon}
          {label}
        </Box>
      ) : (
        label
      )}
    </Typography>
    <Typography fontSize='12px'>{value}</Typography>
  </Stack>
);

export const TooltipBackupCouldNotFit = ({ children }) => {
  const theme = useTheme();
  return (
    <Tooltip
      title={
        <Box className={sx.backupCouldNotFit}>
          <Box className={sx.backupCouldNotFitHeader}>
            <ErrorIcon sx={{ color: theme.palette.error.dark }} />
            <Box sx={{ transform: 'translateY(4px)' }}>
              <Typography className={sx.backupCouldNotFitTitle}>
                2 backups couldn’t fit
              </Typography>
            </Box>
          </Box>
          <Box className={sx.backupCouldNotFitDividerBox}>
            <Divider width='100%' />
          </Box>
          <Stack className={sx.backupCouldNotFitContent}>
            <Stack className={sx.backupCouldNotFitItems}>
              <Typography fontSize='12px'>Backup 1</Typography>
              <Typography fontSize='12px'>Backup 2</Typography>
            </Stack>
            <Box className={sx.backupCouldNotFitCTA}>
              <Button variant='outlined' >
                Check in the Monitor
              </Button>
            </Box>
          </Stack>
        </Box>
      }
      arrow
      placement='left-start'
    >
      {children}
    </Tooltip>
  );
};

TooltipProcessor.propTypes = {
  children: PropTypes.node.isRequired
};

TooltipAddingChartDisabled.propTypes = {
  children: PropTypes.node.isRequired
};

TooltipGanttChart.propTypes = {
  children: PropTypes.node.isRequired
};

TooltipBackupCouldNotFit.propTypes = {
  children: PropTypes.node.isRequired
};

PairRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  startIcon: PropTypes.node
};
