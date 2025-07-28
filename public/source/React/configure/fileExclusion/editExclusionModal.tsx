import { Stack, TextField, Typography, useTheme } from '@mui/material';
import Modal from 'components/inc/modalContainer/modalContainer';
import { useState } from 'react';
import sx from './addExclusionModal.module.scss';
import { ParrernGridRow } from './patternColumns';

interface AddExclusionModalProps {
  visibility: boolean;
  setVisibility: (value: boolean) => void;
  title: string;
  patternRow: ParrernGridRow;
  setPatternRow: (value: ParrernGridRow) => void;
  width: string;
  rows: string[];
  onSave: (value: string[]) => Promise<void>;
}

const EditExclusionModal = ({
  visibility,
  setVisibility,
  title,
  patternRow,
  setPatternRow,
  rows,
  width,
  onSave
}: AddExclusionModalProps) => {
  const theme = useTheme();
  const [saveIsPending, setSaveIsPending] = useState(false);
  const handleUpdate = async () => {
    setSaveIsPending(true);
    const updatedRows = JSON.parse(JSON.stringify(rows));
    updatedRows[patternRow.id] = patternRow.pattern;
    await onSave(updatedRows);
    setSaveIsPending(false);
    setVisibility(false);
  };

  return (
    <Modal
      setVisibility={() => setVisibility}
      visibility={visibility}
      title={title}
      onSave={handleUpdate}
      cancelText='Cancel'
      onCancel={() => setVisibility(false)}
      cancelVariant='text'
      saveDisabled={
        patternRow.pattern.length === 0 ||
        patternRow.pattern === rows[patternRow.id]
      }
      width={width}
      saveText='Save'
      saveIsPending={saveIsPending}
    >
      <Stack id='editExclusion' gap={1}>
        <Typography className={sx.message}>
          Edit the filename pattern.
        </Typography>
        <TextField
          value={patternRow.pattern}
          className={sx.textField}
          style={{ borderColor: theme.palette.neutral.dark400 }}
          onPaste={(e) => e.preventDefault()}
          onChange={(e) => {
            setPatternRow({ ...patternRow, pattern: e.target.value });
          }}
        />
      </Stack>
    </Modal>
  );
};

export default EditExclusionModal;
