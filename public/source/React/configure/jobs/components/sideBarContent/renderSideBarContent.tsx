import {
  Alert,
  Box,
  Typography,
  Stack,
  Divider,
  IconButton
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

import { Mtype } from 'data-hooks/policies/useJobs';

import SideBar from 'components/inc/sideBar';

import sx from './renderSideBarContent.module.scss';

import JobDefinition from './jobDefinition';
import Advanced from './advanced';
import IndexingServiceOptions from './indexingServiceOptions';
import JobProperties from './jobProperties';
import JobExceptions from './jobExceptions';

import { isExceptionsNotEmpty } from '../../helpers/getJobStatusExceptions';

interface Props {
  error: Error | null;
  open: boolean;
  onClose: (event: object, reason: string) => void;
  data: any;
  jobStatus: any;
  mtype: Mtype | undefined;
  isCompleted: boolean;
  isTotalBytesZero: boolean;
  sourceName: string;
  sourcePath: string | undefined;
  indexAsPath: string | undefined;
}
const RenderSideBarContent = ({
  error,
  open,
  onClose,
  data,
  jobStatus,
  mtype,
  isCompleted,
  isTotalBytesZero,
  sourceName,
  sourcePath,
  indexAsPath
}: Props) => {
  const theme = useTheme();
  const { palette }: { palette: any } = theme;

  const isExceptions = isExceptionsNotEmpty(jobStatus);

  return (
    <SideBar open={open} onClose={(e: object, r: string) => onClose(e, r)}>
      <Stack className={sx.SideBarWrapper}>
        <Box className={sx.titleContainer}>
          <Box>
            <Typography className={sx.aboveTitle}>
              {data?.row.policy}
            </Typography>
            <Box className={sx.job}>
              <Typography
                sx={{ color: palette.neutral.dark100 }}
                className={sx.jobTitle}
              >
                {data?.row.job_id}
              </Typography>
            </Box>
          </Box>
          <Box className={sx.closeIconContainer}>
            <IconButton onClick={(e) => onClose(e, '')}>
              <CloseIcon
                className={sx.closeIcon}
                sx={{ color: palette.primary.main }}
              />
            </IconButton>
          </Box>
        </Box>
        <Divider orientation='horizontal' flexItem className={sx.divider} />
        <Stack className={sx.sidebarContent}>
          <JobDefinition
            jobStatus={jobStatus}
            mtype={mtype}
            sourceName={sourceName}
            sourcePath={sourcePath}
            indexAsPath={indexAsPath}
          />
          <Advanced jobStatus={jobStatus} mtype={mtype} />
          <IndexingServiceOptions jobStatus={jobStatus} />
          <JobProperties
            jobStatus={jobStatus}
            mtype={mtype}
            isCompleted={isCompleted}
            isTotalBytesZero={isTotalBytesZero}
          />
          {isExceptions && <JobExceptions jobStatus={jobStatus} />}
        </Stack>
      </Stack>
      {!data && error && <Alert severity='info'>{error.message}</Alert>}
    </SideBar>
  );
};

export default RenderSideBarContent;
