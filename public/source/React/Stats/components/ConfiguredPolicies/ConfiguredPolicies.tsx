import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import Loader from 'components/inc/loader';
import { ScanStats } from 'data-hooks/stats/useStats';

const ConfiguredPolicies = ({
  data,
  isLoading
}: {
  data: ScanStats | undefined;
  isLoading: boolean;
}) => {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        textAlign: 'center',
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        height: '295px'
      }}
    >
      {isLoading && <Loader />}
      {!isLoading && (
        <Typography
          variant='h2'
          marginTop={1}
          color={theme?.palette?.primary?.main}
          fontWeight={600}
        >
          {data?.total_policies || 0}
        </Typography>
      )}
    </Stack>
  );
};

export default ConfiguredPolicies;
