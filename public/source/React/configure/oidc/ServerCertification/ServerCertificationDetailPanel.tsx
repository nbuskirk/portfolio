import { Box, Button, Grid, useTheme } from '@mui/material';
import { GridRowParams } from '@mui/x-data-grid-premium';
import FileDownload from 'js-file-download';

const ServerCertificationTableDetailPanel = ({
  params
}: {
  params: GridRowParams;
}) => {
  const theme = useTheme();

  const html = params.row.certificate.replaceAll('\n', '<br>');

  const download = () => {
    FileDownload(
      params.row.certificate,
      `server_certificate_${params.row.date_uploaded}.txt`
    );
  };

  return (
    <Grid
      container
      sx={{
        padding: 2,
        wordWrap: 'break-word',
        border: '2px solid',
        borderColor: theme.palette.secondary.main
      }}
    >
      <Grid item xs={10} sx={{ maxHeight: 500, overflowY: 'auto' }}>
        <Box dangerouslySetInnerHTML={{ __html: html }} />
      </Grid>
      <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          variant='contained'
          size='small'
          style={{
            margin: 'auto',
            padding: 8,
            minHeight: 0,
            maxHeight: '35px',
            lineHeight: 1
          }}
          onClick={download}
        >
          Download
        </Button>
      </Grid>
    </Grid>
  );
};

export default ServerCertificationTableDetailPanel;
