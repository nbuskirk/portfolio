import FileDownload from '@mui/icons-material/FileDownload';
import { Box, Button } from '@mui/material';
import {
  GridToolbarContainer,
  GridToolbarFilterButton,
  useGridApiContext
} from '@mui/x-data-grid-premium';

const FileExclusionToolbar = () => {
  const apiRef = useGridApiContext();
  return (
    <GridToolbarContainer>
      <Box>
        <GridToolbarFilterButton />
        <Button
          startIcon={<FileDownload />}
          disabled={apiRef.current.getRowsCount() === 0}
          onClick={() =>
            apiRef.current.exportDataAsCsv({ fileName: 'File_Exclusions' })
          }
        >
          Download
        </Button>
      </Box>
    </GridToolbarContainer>
  );
};

export default FileExclusionToolbar;
