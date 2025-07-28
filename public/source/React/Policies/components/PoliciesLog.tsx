import {
  Box,
  Breadcrumbs,
  Grid,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import Jobs from 'components/configure/jobs';
import { NavigateNext } from '@mui/icons-material';
import LinkRouter from 'components/inc/LinkRouter';

const PoliciesLog = () => {
  const theme = useTheme();

  return (
    <Grid container spacing={2} marginTop={1}>
      <Grid item xs={12}>
        <Paper
          sx={{
            boxShadow: 'none'
          }}
        >
          <Box
            sx={{
              borderBottom: `1px solid ${theme.palette.neutral.dark400}`,
              padding: '1em'
            }}
          >
            <Typography fontSize='16px' fontWeight='600'>
              Log
            </Typography>
            <Breadcrumbs
              sx={{
                '.MuiBreadcrumbs-separator': {
                  margin: '4px'
                }
              }}
              separator={<NavigateNext sx={{ fontSize: '14px' }} />}
            >
              <LinkRouter
                underline='hover'
                to='..'
                sx={{
                  fontSize: '12px',
                  display: 'flex',
                  color: theme.palette.primary.main
                }}
              >
                Policies
              </LinkRouter>
              <Typography
                fontSize='12px'
                fontWeight='600'
                color={theme.palette.primary.main}
              >
                Log
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box sx={{ padding: '1em' }}>
            <Jobs />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PoliciesLog;
