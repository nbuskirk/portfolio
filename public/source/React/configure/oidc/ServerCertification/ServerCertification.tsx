import { Box, Button } from '@mui/material';
import { ServerCertificate } from 'data-hooks/oidc/oidcConfig.types';
import { useState } from 'react';
import { GridRowSelectionModel } from '@mui/x-data-grid-premium';
import ServerCertificationTable from './ServerCertificationTable';
import ServerCertificationUploadModal from './ServerCertificationUploadModal';
import ServerCertificationDeleteModal from './ServerCertificationDeleteModal';

interface Props {
  serverCertificates: ServerCertificate[];
}

const ServerCertification = ({ serverCertificates }: Props) => {
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  return (
    <>
      <Box sx={{ marginBottom: 2 }}>
        <Button
          variant='contained'
          style={{
            marginRight: 10,
            padding: 8,
            minHeight: 0,
            lineHeight: 1
          }}
          onClick={() => setUploadModalOpen(true)}
        >
          Upload
        </Button>

        <Button
          variant='contained'
          style={{
            padding: 8,
            minHeight: 0,
            lineHeight: 1
          }}
          disabled={rowSelectionModel.length === 0}
          onClick={() => setDeleteModalOpen(true)}
        >
          Delete
        </Button>
      </Box>

      <ServerCertificationTable
        serverCertificates={serverCertificates}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={setRowSelectionModel}
      />

      <ServerCertificationUploadModal
        modalOpen={uploadModalOpen}
        setModalOpen={setUploadModalOpen}
      />

      <ServerCertificationDeleteModal
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        selectedIds={rowSelectionModel as string[]}
      />
    </>
  );
};

export default ServerCertification;
