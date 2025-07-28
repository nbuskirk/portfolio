import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import Loader from 'components/inc/loader';

const TotalCapacityAnalyzed = ({
  value,
  isLoading
}: {
  value: number | undefined;
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
          variant={value! > 1_000_000_000 ? 'h4' : 'h2'}
          marginTop={1}
          color={theme?.palette?.primary?.main}
          fontWeight={600}
        >
          {value?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </Typography>
      )}
    </Stack>
  );
};

export default TotalCapacityAnalyzed;
