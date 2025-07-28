import DeleteConfirmationModal from 'components/inc/DeleteConfirmationModal/DeleteConfirmationModal';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import useMutateDeletePublicKeys from 'data-hooks/oidc/useMutateDeletePublicKeys';
import { useState } from 'react';

interface Props {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedIds: string[];
}

const PublicKeysDeleteModal = ({
  modalOpen,
  setModalOpen,
  selectedIds
}: Props) => {
  const { mutate: mutateDelete } = useMutateDeletePublicKeys();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const { showSuccessSnackbar } = useSnackbarContext();

  const deleteEntity = selectedIds.length > 1 ? 'public keys' : 'public key';

  const deleteServerCertifications = () => {
    setDeleteLoading(true);

    mutateDelete(
      {
        keys: selectedIds
      },
      {
        onSuccess: () => {
          showSuccessSnackbar(`Success: Deleted ${deleteEntity}`);
          setModalOpen(false);
        }
      }
    );
  };

  return (
    <DeleteConfirmationModal
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      entity={deleteEntity}
      onDeleteClicked={deleteServerCertifications}
      deleteLoading={deleteLoading}
    />
  );
};

export default PublicKeysDeleteModal;
