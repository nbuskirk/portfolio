import { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Box,
  FormControlLabel,
  Switch,
  Stack,
  TextField,
  Radio,
  RadioGroup,
  Button,
  Container
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import CircularProgress from '@mui/material/CircularProgress';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { FED_LOGIN_CONFIG, SESSION_CONFIG } from 'constants/queryKeys';
import useSession from 'utils/hooks/useSession';
import {
  useSessionConfig,
  useUpdateSessionConfigMutation
} from 'data-hooks/config/useSessionConfig';
import useConfigInfo from 'data-hooks/useConfigInfo';
import {
  useFedLoginConfig,
  useUpdateFedLoginConfigMutation,
  FailedLoginLimit,
  FLARule,
  isErrResp
} from 'data-hooks/config/useLoginConfig';
import Loader from 'components/inc/loader';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import { loadCanAccess } from 'lib/loadCanAccess';
import { LoaderFunction, redirect } from 'react-router-dom';
import sx from './login.module.scss';

const SECONDS = 'seconds';
const MINUTES = 'minutes';
const HOURS = 'hours';
const S = 's';
const M = 'm';
const H = 'h';

const timeUnitMap = new Map<string, string>([
  [SECONDS, S],
  [MINUTES, M],
  [HOURS, H],
  [S, SECONDS],
  [M, MINUTES],
  [H, HOURS]
]);

const radioOptions = [SECONDS, MINUTES, HOURS];

const Login = () => {
  const initFLARule: FLARule = {
    attempts: '',
    within: '',
    unit: ''
  };

  const queryClient = useQueryClient();
  const { session } = useSession();
  const { data: configInfo } = useConfigInfo();

  const { data: sessionConfig } = useSessionConfig(session);
  const updateSessionConfig = useUpdateSessionConfigMutation(session);

  const { data: fedLoginConfig, isLoading: fedLoginConfigLoading } =
    useFedLoginConfig(session);
  const updateFedLoginConfig = useUpdateFedLoginConfigMutation(
    session,
    configInfo?.fedid ?? ''
  );

  const [loginTimeout, setLoginTimeout] = useState<string>('');
  const [isLoginTimeout, setIsLoginTimeout] = useState<boolean>(false);
  const [rule1, setRule1] = useState<FLARule>(initFLARule);
  const [rule2, setRule2] = useState<FLARule>(initFLARule);
  const [rule3, setRule3] = useState<FLARule>(initFLARule);
  const [msg, setMsg] = useState<string[]>([]);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [saveClicked, setSaveClicked] = useState<boolean>(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);
  // Preserve the states. Required for "Clear Changes" functionality.
  const [origState, setOrigState] = useState([
    '',
    false,
    '',
    initFLARule,
    initFLARule,
    initFLARule
  ]);
  const { showSuccessSnackbar } = useSnackbarContext();

  useEffect(() => {
    // start : set GET data into variables
    setIsLoadingInitial(true);
    if (!fedLoginConfigLoading && fedLoginConfig) {
      if (isErrResp(fedLoginConfig)) {
        setMsg([fedLoginConfig.detail]);
        setIsLoadingInitial(false);
        return;
      }
      let varLoginTimeout = '';
      let varIsLoginTimeoutAllowed = false;
      let varMinAge = '';
      let varMaxAge = '';
      let varNoReuse = '';
      let varFLARule1 = initFLARule;
      let varFLARule2 = initFLARule;
      let varFLARule3 = initFLARule;
      const data = fedLoginConfig;

      // session config
      if (sessionConfig && sessionConfig.data.session_inactivity_timeout > 0) {
        varLoginTimeout = String(sessionConfig.data.session_inactivity_timeout);
        varIsLoginTimeoutAllowed = true;
      }

      // fed login config
      if (data.password_change_policy) {
        const policy = data.password_change_policy;
        if (policy.min_age && policy.min_age !== '') {
          const minimumAge = policy.min_age.split(' ')[0];
          varMinAge = minimumAge;
        }
        if (policy.max_age && policy.max_age !== '') {
          const maximumAge = policy.max_age.split(' ')[0];
          varMaxAge = maximumAge;
        }
        if (policy.no_reuse) {
          varNoReuse = policy.no_reuse;
        }
      }

      if (data.failed_login_limits) {
        const failedLoginRules = data.failed_login_limits;
        switch (failedLoginRules.length) {
          case 1:
            varFLARule1 = {
              attempts: failedLoginRules[0].attempts,
              within: failedLoginRules[0].within.slice(0, -1),
              unit:
                timeUnitMap.get(
                  failedLoginRules[0].within.substring(
                    failedLoginRules[0].within.length - 1,
                    failedLoginRules[0].within.length
                  )
                ) || ''
            };
            break;
          case 2:
            varFLARule1 = {
              attempts: failedLoginRules[0].attempts,
              within: failedLoginRules[0].within.slice(0, -1),
              unit:
                timeUnitMap.get(
                  failedLoginRules[0].within.substring(
                    failedLoginRules[0].within.length - 1,
                    failedLoginRules[0].within.length
                  )
                ) || ''
            };

            varFLARule2 = {
              attempts: failedLoginRules[1].attempts,
              within: failedLoginRules[1].within.slice(0, -1),
              unit:
                timeUnitMap.get(
                  failedLoginRules[1].within.substring(
                    failedLoginRules[1].within.length - 1,
                    failedLoginRules[1].within.length
                  )
                ) || ''
            };
            break;
          case 3:
            varFLARule1 = {
              attempts: failedLoginRules[0].attempts,
              within: failedLoginRules[0].within.slice(0, -1),
              unit:
                timeUnitMap.get(
                  failedLoginRules[0].within.substring(
                    failedLoginRules[0].within.length - 1,
                    failedLoginRules[0].within.length
                  )
                ) || ''
            };

            varFLARule2 = {
              attempts: failedLoginRules[1].attempts,
              within: failedLoginRules[1].within.slice(0, -1),
              unit:
                timeUnitMap.get(
                  failedLoginRules[1].within.substring(
                    failedLoginRules[1].within.length - 1,
                    failedLoginRules[1].within.length
                  )
                ) || ''
            };

            varFLARule3 = {
              attempts: failedLoginRules[2].attempts,
              within: failedLoginRules[2].within.slice(0, -1),
              unit:
                timeUnitMap.get(
                  failedLoginRules[2].within.substring(
                    failedLoginRules[2].within.length - 1,
                    failedLoginRules[2].within.length
                  )
                ) || ''
            };
            break;
          default:
            break;
        }
      }

      if (varLoginTimeout) {
        setLoginTimeout(varLoginTimeout);
      }
      if (varIsLoginTimeoutAllowed) {
        setIsLoginTimeout(varIsLoginTimeoutAllowed);
      }

      setRule1(varFLARule1 as FLARule);
      setRule2(varFLARule2 as FLARule);
      setRule3(varFLARule3 as FLARule);

      // end

      setOrigState([
        varLoginTimeout,
        Boolean(varIsLoginTimeoutAllowed),
        varMinAge,
        varMaxAge,
        varNoReuse,
        varFLARule1 as FLARule,
        varFLARule2 as FLARule,
        varFLARule3 as FLARule
      ]);
      setIsLoadingInitial(false);
    }
  }, [fedLoginConfigLoading, fedLoginConfig]);

  const saveChanges = () => {
    setIsLoadingUpdate(true);
    let zeroTimeoutMsg: string | null = null;
    let invalidAttemptsMsg: string | null = null;
    if (Number(loginTimeout) === 0 && isLoginTimeout) {
      zeroTimeoutMsg = 'Timeout value cannot blank.';
    }
    const fll = [] as FailedLoginLimit[];
    if (rule1.attempts && rule1.within && rule1.unit) {
      const unit = timeUnitMap.get(rule1.unit);
      if (unit) {
        const limit: FailedLoginLimit = {
          attempts: String(rule1.attempts),
          within: rule1.within + unit
        };
        fll.push(limit);
      }
    } else if (
      (rule1.attempts && rule1.within) ||
      (rule1.attempts && rule1.unit) ||
      (rule1.unit && rule1.within) ||
      rule1.attempts ||
      rule1.within
    ) {
      invalidAttemptsMsg =
        'Failed Login Attempts Limit: Incomplete rule details.';
    }

    if (rule2.attempts && rule2.within && rule2.unit) {
      const unit = timeUnitMap.get(rule2.unit);
      if (unit) {
        const limit: FailedLoginLimit = {
          attempts: String(rule2.attempts),
          within: rule2.within + unit
        };
        fll.push(limit);
      }
    } else if (
      (rule2.attempts && rule2.within) ||
      (rule2.attempts && rule2.unit) ||
      (rule2.unit && rule2.within) ||
      rule2.attempts ||
      rule2.within
    ) {
      invalidAttemptsMsg =
        'Failed Login Attempts Limit: Incomplete rule details.';
    }

    if (rule3.attempts && rule3.within && rule3.unit) {
      const unit = timeUnitMap.get(rule3.unit);
      if (unit) {
        const limit: FailedLoginLimit = {
          attempts: String(rule3.attempts),
          within: rule3.within + unit
        };
        fll.push(limit);
      }
    } else if (
      (rule3.attempts && rule3.within) ||
      (rule3.attempts && rule3.unit) ||
      (rule3.unit && rule3.within) ||
      rule3.attempts ||
      rule3.within
    ) {
      invalidAttemptsMsg =
        'Failed Login Attempts Limit: Incomplete rule details.';
    }

    if (zeroTimeoutMsg || invalidAttemptsMsg) {
      let count: number = 1;
      const errorMessages = [
        'Changes could not be saved. Please try again.',
        'Reason:'
      ];
      if (zeroTimeoutMsg) {
        errorMessages.push(`${count}. ${zeroTimeoutMsg}`);
        count += 1;
      }
      if (invalidAttemptsMsg) {
        errorMessages.push(`${count}. ${invalidAttemptsMsg}`);
        count += 1;
      }

      setMsg(errorMessages);
      setIsLoadingUpdate(false);
      return;
    }

    updateSessionConfig.mutateAsync(
      {
        session_inactivity_timeout: Number(loginTimeout)
      },
      {
        onSuccess: () => {
          updateFedLoginConfig.mutateAsync(
            {
              failed_login_limits: fll,
              password_change_policy: {}
            },
            {
              onSuccess: () => {
                showSuccessSnackbar('Success: Saved login settings');
                setIsLoadingUpdate(false);
                setIsChanged(false);
                queryClient.invalidateQueries({
                  queryKey: [FED_LOGIN_CONFIG, session]
                });
                queryClient.invalidateQueries({
                  queryKey: [SESSION_CONFIG, session]
                });
                setOrigState([
                  loginTimeout,
                  Boolean(isLoginTimeout),
                  rule1 as FLARule,
                  rule2 as FLARule,
                  rule3 as FLARule
                ]);
              },
              onError: () => {
                setIsLoadingUpdate(false);
              }
            }
          );
        },
        onError: () => {
          setIsLoadingUpdate(false);
        }
      }
    );
  };

  function isValidNum(newValue: string): boolean {
    if (
      newValue === '' ||
      (newValue.match(/^[1-9]\d*$/) &&
        parseInt(newValue, 10) > 0 &&
        parseInt(newValue, 10) <= 99999999)
    ) {
      setIsChanged(true);
      setMsg([]);
      return true;
    }
    return false;
  }

  const clearChanges = () => {
    setLoginTimeout(origState[0] as string);
    setIsLoginTimeout(Boolean(origState[1]));
    setRule1(origState[5] as FLARule);
    setRule2(origState[6] as FLARule);
    setRule3(origState[7] as FLARule);
    setIsChanged(false);
    setMsg([]);
  };

  return (
    <Container className={sx.loginContainer}>
      <Typography className={sx.typography_subtitle} display='block'>
        Login
      </Typography>
      {isLoadingInitial && <Loader sx={{ height: 590 }} />}
      {!isLoadingInitial && (
        <Grid className={sx.max_width}>
          <Stack
            direction='row'
            spacing={1}
            alignItems='center'
            className={sx.toggleLable}
          >
            <FormControlLabel
              control={
                <Switch
                  className={sx.switch}
                  checked={isLoginTimeout}
                  disabled={isLoadingUpdate}
                  onChange={() =>
                    setIsLoginTimeout((prev) => {
                      setLoginTimeout('');
                      if (!prev) {
                        setLoginTimeout('15');
                      }
                      setIsChanged(true);
                      setMsg([]);
                      return !prev;
                    })
                  }
                />
              }
              label={
                <Typography className={sx.heading}>
                  Allow Inactivity Timeout
                </Typography>
              }
            />
          </Stack>
          <Box className={sx.box__input}>
            <TextField
              className='chipInput'
              size='medium'
              variant='outlined'
              label='Timeout (in minutes)'
              type='integer'
              disabled={!isLoginTimeout || isLoadingUpdate}
              value={loginTimeout}
              onChange={(e) => {
                if (isValidNum(e.target.value)) {
                  setLoginTimeout(e.target.value);
                }
                setSaveClicked(false);
              }}
              error={isLoginTimeout && saveClicked && !loginTimeout}
            />
          </Box>

          <Box sx={{ gap: '12px', marginTop: '16px' }}>
            <Box>
              <Typography className={sx.typography_subtitle}>
                Failed Login Attempts Limits
                <Tooltip
                  arrow
                  title='Account will be locked after the user exceeds the limit of failed login attempts specified in these fields.'
                  placement='right'
                  sx={{ marginLeft: '0.25rem', marginY: '-.4rem' }}
                >
                  <InfoIcon color='secondary' />
                </Tooltip>
              </Typography>
            </Box>
            <Stack
              className={sx.stack__row}
              sx={{ gap: '12px', marginTop: '12px', width: '100%' }}
            >
              <Box className={sx.boxInput}>
                <TextField
                  className='chipInput'
                  size='medium'
                  variant='outlined'
                  type='integer'
                  label='Attempts'
                  inputProps={{ min: 0 }}
                  value={rule1.attempts}
                  disabled={isLoadingUpdate}
                  onChange={(e) => {
                    if (isValidNum(e.target.value)) {
                      setRule1({ ...rule1, attempts: e.target.value });
                    }
                    setSaveClicked(false);
                  }}
                  error={!!(saveClicked && !rule1.attempts && rule1.within)}
                />
                <TextField
                  className='chipInput'
                  size='medium'
                  variant='outlined'
                  label='Within'
                  value={rule1.within}
                  disabled={isLoadingUpdate}
                  onChange={(e) => {
                    if (isValidNum(e.target.value)) {
                      setRule1({ ...rule1, within: e.target.value });
                    }
                    setSaveClicked(false);
                  }}
                  error={!!(saveClicked && rule1.attempts && !rule1.within)}
                />
                <Box sx={{ marginLeft: '-2rem' }}>
                  <RadioGroup
                    row
                    name='row-radio-buttons-group'
                    onChange={(e) => {
                      setRule1({ ...rule1, unit: e.target.value });
                      setIsChanged(true);
                      setMsg([]);
                    }}
                    className={sx.radioGroup}
                    value={rule1.unit}
                  >
                    {radioOptions.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={option}
                        className={sx.radioOption}
                        disabled={isLoadingUpdate}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              </Box>
              <Box className={sx.boxInput}>
                <TextField
                  className='chipInput'
                  size='medium'
                  variant='outlined'
                  label='Attempts'
                  value={rule2.attempts}
                  disabled={isLoadingUpdate}
                  onChange={(e) => {
                    if (isValidNum(e.target.value)) {
                      setRule2({ ...rule2, attempts: e.target.value });
                    }
                    setSaveClicked(false);
                  }}
                  error={!!(saveClicked && !rule2.attempts && rule2.within)}
                />
                <TextField
                  className='chipInput'
                  size='medium'
                  variant='outlined'
                  label='Within'
                  value={rule2.within}
                  disabled={isLoadingUpdate}
                  onChange={(e) => {
                    if (isValidNum(e.target.value)) {
                      setRule2({ ...rule2, within: e.target.value });
                    }
                    setSaveClicked(false);
                  }}
                  error={!!(saveClicked && rule2.attempts && !rule2.within)}
                />
                <Box sx={{ marginLeft: '-2rem' }}>
                  <RadioGroup
                    row
                    name='row-radio-buttons-group'
                    onChange={(e) => {
                      setRule2({ ...rule2, unit: e.target.value });
                      setIsChanged(true);
                      setMsg([]);
                    }}
                    className={sx.radioGroup}
                    value={rule2.unit}
                  >
                    {radioOptions.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={option}
                        className={sx.radioOption}
                        disabled={isLoadingUpdate}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              </Box>
              <Box className={sx.boxInput}>
                <TextField
                  className='chipInput'
                  size='medium'
                  variant='outlined'
                  label='Attempts'
                  value={rule3.attempts}
                  disabled={isLoadingUpdate}
                  onChange={(e) => {
                    if (isValidNum(e.target.value)) {
                      setRule3({ ...rule3, attempts: e.target.value });
                    }
                    setSaveClicked(false);
                  }}
                  error={!!(saveClicked && !rule3.attempts && rule3.within)}
                />
                <TextField
                  className='chipInput'
                  size='medium'
                  variant='outlined'
                  label='Within'
                  value={rule3.within}
                  disabled={isLoadingUpdate}
                  onChange={(e) => {
                    if (isValidNum(e.target.value)) {
                      setRule3({ ...rule3, within: e.target.value });
                    }
                    setSaveClicked(false);
                  }}
                  error={!!(saveClicked && rule3.attempts && !rule3.within)}
                />
                <Box sx={{ marginLeft: '-2rem' }}>
                  <RadioGroup
                    row
                    name='row-radio-buttons-group'
                    onChange={(e) => {
                      setRule3({ ...rule3, unit: e.target.value });
                      setIsChanged(true);
                      setMsg([]);
                    }}
                    className={sx.radioGroup}
                    value={rule3.unit}
                  >
                    {radioOptions.map((option) => (
                      <FormControlLabel
                        key={option}
                        value={option}
                        control={<Radio />}
                        label={option}
                        className={sx.radioOption}
                        disabled={isLoadingUpdate}
                      />
                    ))}
                  </RadioGroup>
                </Box>
              </Box>
            </Stack>
          </Box>

          <Stack className={sx.cybersense} />

          <Grid className={sx.footer}>
            <Grid
              className={`${sx.loader} ${
                isLoadingUpdate ? sx.visible : sx.hidden
              }`}
            >
              <CircularProgress size={20} />
            </Grid>
            <Grid className={sx.button_container}>
              <Button
                variant='outlined'
                onClick={clearChanges}
                className={`${sx.button} ${
                  !isChanged || isLoadingUpdate
                    ? sx.active_secondary
                    : sx.inactive_secondary
                }`}
                disabled={!isChanged || isLoadingUpdate}
              >
                Clear Changes
              </Button>
              <Button
                variant='contained'
                onClick={() => {
                  saveChanges();
                  setSaveClicked(true);
                }}
                className={`${sx.button} ${
                  !isChanged || isLoadingUpdate
                    ? sx.active_primary
                    : sx.inactive_primary
                }`}
                disabled={!isChanged || isLoadingUpdate}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
          {msg.length > 0 && (
            <Stack sx={{ marginBottom: '10px' }}>
              {msg.map((message) => (
                <Typography key={message} className={sx.typography_subtitle}>
                  {message}
                </Typography>
              ))}
            </Stack>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default Login;

export const loginSettingsLoader =
  (queryClient: QueryClient): LoaderFunction =>
  async () => {
    const canAccess = await loadCanAccess(queryClient);
    if (!canAccess('netsecmgmt')) {
      return redirect('..');
    }
    return null;
  };
