import {
  Autocomplete,
  Chip,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { ExecSharedState } from '../types';

type SetExecSharedState = <T extends keyof ExecSharedState>(
  memberName: T,
  memberValue: ExecSharedState[T]
) => void;

interface Props {
  disabled?: boolean;
  execSharedState: ExecSharedState;
  setExecSharedState: SetExecSharedState;
}

const SharedInputs = ({
  disabled = false,
  execSharedState,
  setExecSharedState
}: Props): React.ReactNode => {
  const theme = useTheme();
  return (
    <>
      <Autocomplete
        disabled={disabled}
        clearOnBlur
        multiple
        freeSolo
        options={[]}
        value={execSharedState.List_of_email_addresses}
        onChange={(_e, value) => {
          setExecSharedState('List_of_email_addresses', value);
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            return option ? (
              <Chip
                variant='filled'
                label={option}
                sx={{
                  backgroundColor: theme.palette.neutral.primary500,
                  borderColor: theme.palette.neutral.primary500,
                  color: theme.palette.primary.main,
                  fontWeight: 600
                }}
                {...getTagProps({ index })}
                deleteIcon={<CloseIcon />}
              />
            ) : (
              ''
            );
          })
        }
        renderInput={(params) => (
          <>
            <Typography
              display='inline'
              fontSize='0.875rem'
              fontWeight={400}
              lineHeight={1.357}
            >
              Email Notifications (optional) {' '}
              <Tooltip
                title='Email list to receive status information when the policy runs.'
                placement='right'
                arrow
              >
                <InfoIcon
                  sx={{
                    fontSize: '12px',
                    color: theme.palette.secondary.main,
                    cursor: 'pointer'
                  }}
                />
              </Tooltip>
            </Typography>
            <TextField
              {...params}
              className='chipInput'
              size='medium'
              variant='outlined'
              helperText='Add email and press Enter.'
              name='List_of_email_addresses'
            />
          </>
        )}
      />
      <Autocomplete
        disabled={disabled}
        clearOnBlur
        multiple
        freeSolo
        options={[]}
        value={execSharedState.filter.include}
        onChange={(_e, value) => {
          setExecSharedState('filter', {
            exclude: execSharedState.filter.exclude,
            include: value
          });
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            return option ? (
              <Chip
                variant='filled'
                label={option}
                sx={{
                  backgroundColor: theme.palette.neutral.primary500,
                  borderColor: theme.palette.neutral.primary500,
                  color: theme.palette.primary.main,
                  fontWeight: 600
                }}
                {...getTagProps({ index })}
                deleteIcon={<CloseIcon />}
              />
            ) : (
              ''
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            className='chipInput'
            size='medium'
            variant='outlined'
            label='Only scan files or paths that match these patterns (optional)'
            helperText='Add path/file name and press Enter'
            name='job_filter_include'
          />
        )}
      />
      <Autocomplete
        disabled={disabled}
        clearOnBlur
        multiple
        freeSolo
        options={[]}
        value={execSharedState.filter.exclude}
        onChange={(_e, value) => {
          setExecSharedState('filter', {
            include: execSharedState.filter.include,
            exclude: value
          });
        }}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            return option ? (
              <Chip
                variant='filled'
                label={option}
                sx={{
                  backgroundColor: theme.palette.neutral.primary500,
                  borderColor: theme.palette.neutral.primary500,
                  color: theme.palette.primary.main,
                  fontWeight: 600
                }}
                {...getTagProps({ index })}
                deleteIcon={<CloseIcon />}
              />
            ) : (
              ''
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            className='chipInput'
            size='medium'
            variant='outlined'
            label='Do not scan files or paths that match these patterns (optional)'
            helperText='Add path/file name and press Enter.'
            name='job_filter_exclude'
          />
        )}
      />
    </>
  );
};

export default SharedInputs;
