import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { GridColDef } from '@mui/x-data-grid-premium';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { JobStatus } from 'data-hooks/policies/useJobStatus';
import { isExceptionsNotEmpty } from '../../helpers/getJobStatusExceptions';
import SideBarTable from '../SideBarTable/SideBarTable';

import sx from './renderSideBarContent.module.scss';

const ExceptionsTable = ({
  jobStatus,
  getExceptions,
  columns,
  title
}: {
  jobStatus: JobStatus;
  getExceptions: (exceptions: Array<any>) => Array<any>;
  columns: GridColDef[];
  title: string;
}) => {
  const theme = useTheme();
  const { palette } = theme;

  const exceptions = getExceptions(jobStatus?.exceptions);
  return (
    isExceptionsNotEmpty(exceptions) && (
      <Accordion
        sx={{
          '&.MuiAccordion-root.MuiPaper-root': {
            'borderBottom': 'none'
          }
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2a-content'
          id='panel2a-header'
        >
          <Typography className={sx.accordionTitle}> {title} </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box className={sx.jobContentRow}>
            <Typography
              className={sx.jobContentText}
              sx={{ color: palette.dark.main }}
            >
              <Box className={sx.box__emptyTable}>
                <SideBarTable
                  columns={columns}
                  rows={exceptions}
                  rowCount={exceptions.length}
                />
              </Box>
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>
    )
  );
};

export default ExceptionsTable;
