import DeleteConfirmationModal from 'components/inc/DeleteConfirmationModal/DeleteConfirmationModal';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import useMutateDeleteServerCertificate from 'data-hooks/oidc/useMutateDeleteServerCertificate';
import { useState } from 'react';

interface Props {
  modalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedIds: string[];
}

const ServerCertificationDeleteModal = ({
  modalOpen,
  setModalOpen,
  selectedIds
}: Props) => {
  const { mutateAsync: mutateDelete } = useMutateDeleteServerCertificate();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const { showSuccessSnackbar } = useSnackbarContext();

  const deleteEntity =
    selectedIds.length > 1 ? 'server certifications' : 'server certification';

  const deleteServerCertifications = () => {
    setDeleteLoading(true);

    const promises = selectedIds.map((date_uploaded: string) => {
      return mutateDelete({
        date_uploaded
      });
    });
    Promise.all(promises)
      .then(() => {
        showSuccessSnackbar(`Success: Deleted ${deleteEntity}`);
        setModalOpen(false);
      })
      .finally(() => {
        setDeleteLoading(false);
      });
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

export default ServerCertificationDeleteModal;
