import { Stack, TextField, Tooltip, Typography, useTheme } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SharedInputs from './SharedInputs';
import { ExecSmbState, ExecSharedState } from '../types';

type SetExecSharedState = <T extends keyof ExecSharedState>(
  memberName: T,
  memberValue: ExecSharedState[T]
) => void;

type PartialExecSmb = Omit<ExecSmbState, 'job_type'>;
type SetExecSmbState = <T extends keyof PartialExecSmb>(
  memberName: T,
  memberValue: PartialExecSmb[T]
) => void;

interface Props {
  disabled?: boolean;
  execSharedState: ExecSharedState;
  setExecSharedState: SetExecSharedState;
  execSmbState: ExecSmbState;
  setExecSmbState: SetExecSmbState;
}

const ExecSmbForm = ({
  disabled = false,
  execSharedState,
  setExecSharedState,
  execSmbState,
  setExecSmbState
}: Props): React.ReactNode => {
  const theme = useTheme();

  return (
    <Stack direction='column' spacing={1}>
      <SharedInputs
        disabled={disabled}
        execSharedState={execSharedState}
        setExecSharedState={setExecSharedState}
      />
      <Typography
        display='inline'
        fontSize='0.875rem'
        fontWeight={400}
        lineHeight={1.357}
      >
        Original Data Location{' '}
        <Tooltip
          title='Hostname and path that Index Engines software will use to represent the source of this data in its index and present to you in reports and CyberSense analyses.'
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
        disabled={disabled}
        sx={{
          '.MuiFormLabel-asterisk': {
            display: 'none'
          }
        }}
        name='index_as'
        value={execSmbState.index_as}
        helperText='Use “hostname/path” format'
        onChange={(event) => {
          setExecSmbState('index_as', event.target.value);
        }}
      />
    </Stack>
  );
};

export default ExecSmbForm;
