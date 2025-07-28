import { Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import Modal from 'components/inc/modalContainer/modalContainer';
import { useState } from 'react';
import useFilenameExclusionGet from 'data-hooks/filenameExclusion/useFilenameExclusionGet';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import sx from './addExclusionModal.module.scss';

export const MAX_PATTERNS = 100;

interface AddExclusionModalProps {
  visibility: boolean;
  setVisibility: (value: boolean) => void;
  title: string;
  width: string;
  onSave: (value: string[]) => Promise<void>;
  maxPatterns: number;
}

const ADD_MESSAGE =
  'Add filename patterns (sets of filenames with wildcard characters), separated by <ENTER>.';

const AddExclusionModal = ({
  visibility,
  setVisibility,
  title,
  width,
  onSave,
  maxPatterns
}: AddExclusionModalProps) => {
  const { data: rows } = useFilenameExclusionGet();
  const theme = useTheme();
  const { showErrorSnackbar } = useSnackbarContext();
  const [patterns, setPatterns] = useState<string>('');
  const [lineCount, setLineCount] = useState<number>(0);
  const [saveIsPending, setSaveIsPending] = useState(false);
  const handleChange = (value: string) => {
    return value
      .split('\n')
      .filter((line, index, arr) => {
        return (
          line.trim() !== '' || (index > 0 && arr[index - 1].trim() !== '')
        );
      })
      .join('\n');
  };

  const updatePatterns = async () => {
    setSaveIsPending(true);
    let mergedPatterns: string[] = [];
    const addedPatterns = patterns
      .split('\n')
      .filter((line) => line.trim() !== '');
    if (rows && rows.length > 0) {
      mergedPatterns = [...rows];
      addedPatterns.forEach((pattern) => {
        if (!mergedPatterns.includes(pattern)) mergedPatterns.push(pattern);
      });
    } else {
      mergedPatterns = addedPatterns;
    }
    await onSave(mergedPatterns);
    setSaveIsPending(false);
    setVisibility(false);
    /* This will reset the value. If not, clicking the popup after adding will show recently added patterns. */
    setPatterns('');
    setLineCount(0);
  };

  const handleUpdate = async () => {
    if (lineCount > maxPatterns) {
      showErrorSnackbar(
        `Currently, ${
          MAX_PATTERNS - maxPatterns
        } pattern(s) have been added. You can add ${maxPatterns} more, before reaching the maximum limit of ${MAX_PATTERNS}.`
      );
    } else {
      updatePatterns();
    }
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
      saveDisabled={!lineCount}
      width={width}
      saveText='Save'
      saveIsPending={saveIsPending}
    >
      <Stack id='addExclusion'>
        <Typography className={sx.message}>{ADD_MESSAGE}</Typography>
        <Box className={sx.inputSection}>
          <textarea
            className={sx.textArea}
            placeholder='Enter filename patterns'
            style={{ border: `1px solid ${theme.palette.neutral.dark400}` }}
            value={patterns}
            disabled={saveIsPending}
            onChange={(e) => {
              const patternValues = handleChange(e.target.value);
              setPatterns(patternValues);
              setLineCount(
                patternValues.split('\n').filter((line) => line.trim() !== '')
                  .length
              );
            }}
          />
          <Stack
            id='info'
            className={sx.info}
            bgcolor={`${theme.palette.neutral.primary600}`}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography className={sx.infoTitle}>
                  Supported wildcards:
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography className={sx.infoText}>*</Typography>
              </Grid>
              <Grid item xs={11}>
                <Typography className={sx.infoText}>
                  Matches any number of characters. You can use asterisk (*)
                  anywhere in a character string. Prefix escape character (|)
                  for asterisk that appears in a filename.
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography className={sx.infoText}>?</Typography>
              </Grid>
              <Grid item xs={11}>
                <Typography className={sx.infoText}>
                  Matches a single character in a specific position. Prefix
                  escape character (|) for question mark that appears in a
                  filename.
                </Typography>
              </Grid>
            </Grid>
          </Stack>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Box className={sx.count} pt={1}>
              <Typography
                className={sx.infoText}
                color={
                  lineCount > maxPatterns
                    ? theme.palette.error.main
                    : theme.palette.neutral.dark100
                }
              >
                {`Count: ${lineCount}`}
              </Typography>
              <Typography className={sx.infoText}>
                {`Maximum: ${maxPatterns}`}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Modal>
  );
};

export default AddExclusionModal;
