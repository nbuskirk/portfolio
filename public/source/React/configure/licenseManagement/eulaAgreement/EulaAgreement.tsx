import { useTheme } from '@mui/material/styles';
import { Typography, Grid, Stack, Box } from '@mui/material';
import { useUser } from 'utils/context/UserContext';
import { useEula } from 'data-hooks/config/useEula';
import Loader from 'components/inc/loader';
import sx from './eulaAgreement.module.scss';

const EulaAgreement = () => {
  const theme = useTheme();
  const { session } = useUser();
  const { data: eula, isLoading: eulaLoading } = useEula(session);

  return (
    <Box
      className={sx.eulaContainer}
      sx={{ border: `1px solid ${theme.palette.neutral.dark400}` }}
    >
      <Stack direction='row' alignItems='center'>
        <Typography className={sx.title} display='block'>
          End User License Agreement (EULA)
        </Typography>
      </Stack>
      {eulaLoading && <Loader sx={{ height: window.innerHeight - 200 }} />}
      {!eulaLoading && (
        <Grid
          className={sx.body}
          sx={{ border: `1px solid ${theme.palette.neutral.dark400}` }}
        >
          <Grid
            dangerouslySetInnerHTML={{
              __html: eula?.data?.eula_html as string
            }}
          />
        </Grid>
      )}
    </Box>
  );
};

export default EulaAgreement;
