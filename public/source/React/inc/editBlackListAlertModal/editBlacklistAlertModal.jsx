import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

import Modal from 'components/inc/modalContainer/modalContainer';
import UploadContainer from 'components/forms/configureAnalysisForm/uploadContainer';

import sx from './editBlacklistModal.module.scss';

const EditBlacklistAlertModal = ({ visibility, setVisibility }) => {
  const [blacklist, setBlacklist] = useState([
    { name: 'Blacklist 1' },
    { name: 'Blacklist 2' },
    { name: 'Blacklist 3' },
    { name: 'Blacklist 4' },
  ]);

  const handleDeleteItem = (index) => {
    const newBlacklist = [...blacklist];
    newBlacklist.splice(index, 1);
    setBlacklist(newBlacklist);
  };

  return (
    <Modal
      setVisibility={setVisibility}
      visibility={visibility}
      title='Edit Blacklist Alert'
      cancelText='Discard Changes'
      onCancel={() => alert('onCancel clicked')}
      saveText='Save Changes'
      onSave={() => alert('onSave clicked')}
      height='426px'
      width='572px'
    >
      <Box className={sx.box__main}>
        <UploadContainer
          uploadedFiles={blacklist}
          onUpload={(e) => setBlacklist(e)}
          handleDeleteItem={handleDeleteItem}
          fullWidth
        />
      </Box>
    </Modal>
  );
};

EditBlacklistAlertModal.propTypes = {
  visibility: PropTypes.bool.isRequired,
  setVisibility: PropTypes.func.isRequired,
}

export default EditBlacklistAlertModal;
