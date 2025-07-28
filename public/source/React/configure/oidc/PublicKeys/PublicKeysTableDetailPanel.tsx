import { Box, Button, Grid2, useTheme } from '@mui/material';
import { GridRowParams } from '@mui/x-data-grid-premium';
import FileDownload from 'js-file-download';

const PublicKeysTableDetailPanel = ({ params }: { params: GridRowParams }) => {
  const theme = useTheme();

  const formattedJson = JSON.stringify(params.row.value, null, 2);

  const download = () => {
    FileDownload(formattedJson, 'public_key.json');
  };

  return (
    <Grid2
      container
      sx={{
        padding: 2,
        wordWrap: 'break-word',
        border: '2px solid',
        borderColor: theme.palette.secondary.main
      }}
    >
      <Grid2
        size={10}
        sx={{ maxHeight: 600, overflowY: 'auto', margin: 'auto' }}
      >
        <Box>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{formattedJson}</pre>
        </Box>
      </Grid2>
      <Grid2 size={2} sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          variant='contained'
          size='small'
          style={{
            margin: 'auto',
            padding: 8,
            minHeight: 0,
            maxHeight: '35px'
          }}
          onClick={download}
        >
          Download
        </Button>
      </Grid2>
    </Grid2>
  );
};

export default PublicKeysTableDetailPanel;
