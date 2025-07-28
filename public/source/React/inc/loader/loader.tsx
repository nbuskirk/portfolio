import { ReactNode } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { SxProps, Theme } from '@mui/material';
import styles from './loader.module.scss';

interface Props {
  sx?: SxProps<Theme>;
}

const Loader = ({ sx }: Props): ReactNode => {
  return (
    <Box sx={sx}>
      <div className={styles.spinner}>
        <CircularProgress />
      </div>
    </Box>
  );
};

export default Loader;
