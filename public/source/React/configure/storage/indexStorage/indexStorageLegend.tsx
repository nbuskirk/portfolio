import { Box, Typography, useTheme } from '@mui/material';
import { bytesToGiga } from 'utils/helpers/size';
import sx from './indexStorageEdit.module.scss';

const IndexStorageLegend = ({
  used,
  capacity
}: {
  used: number;
  capacity: number;
}) => {
  const theme = useTheme();
  return (
    <Box borderTop={`1px solid ${theme.palette.neutral.dark500}`}>
      <Typography
        color={theme.palette.error.dark}
        padding='5px'
        className={sx.legendText}
      >
        Available:{' '}
        {used !== undefined &&
          capacity !== undefined &&
          bytesToGiga(capacity - used)}
        GB
      </Typography>
      <Typography className={sx.legendText}>
        Used: {bytesToGiga(used || 0)} GB
      </Typography>
      <Typography className={sx.legendText}>
        Total: {bytesToGiga(capacity || 0)} GB
      </Typography>
    </Box>
  );
};

export default IndexStorageLegend;
