import { Box, Button } from '@mui/material';
import { useState } from 'react';
import { GridRowSelectionModel } from '@mui/x-data-grid-premium';
import { PublicKey } from 'data-hooks/oidc/oidcConfig.types';
import PublicKeysTable from './PublicKeysTable';
import PublicKeysDeleteModal from './PublicKeysDeleteModal';

interface Props {
  publicKeys: PublicKey[];
}

const PublicKeys = ({ publicKeys }: Props) => {
  const [rowSelectionModel, setRowSelectionModel] =
    useState<GridRowSelectionModel>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  return (
    <>
      <Box sx={{ marginBottom: 2, marginRight: 2 }}>
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

      <PublicKeysTable
        publicKeys={publicKeys}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={setRowSelectionModel}
      />

      <PublicKeysDeleteModal
        modalOpen={deleteModalOpen}
        setModalOpen={setDeleteModalOpen}
        selectedIds={rowSelectionModel as string[]}
      />
    </>
  );
};

export default PublicKeys;
