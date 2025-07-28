import {
  Box,
  Button,
  Checkbox,
  Divider,
  Stack,
  Grid2,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import Loader from 'components/inc/loader';
import { useEffect, useState } from 'react';
import useSession from 'utils/hooks/useSession';
import useConfigInfo from 'data-hooks/useConfigInfo';
import {
  checkboxInputMap,
  getDefaultPasswordComplexitySettings,
  PasswordComplexityPayload,
  PasswordComplexitySettings
} from 'data-hooks/password/types';
import usePasswordConfigPatch from 'data-hooks/password/usePasswordConfigPatch';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';
import usePasswordConfigGet, {
  createPasswordSettings
} from 'data-hooks/password/usePasswordConfigGet';
import { QueryClient } from '@tanstack/react-query';
import { LoaderFunction, redirect } from 'react-router-dom';
import { loadCanAccess } from 'lib/loadCanAccess';
import { useUser } from 'utils/context/UserContext';
import { showPasswordExpirationMessage } from 'utils/helpers/passwordExpirationNotification';
import { sessionInfoQuery } from 'data-hooks/auth/useSessionInfo';
import { queryClient } from 'queryClient';
import { useIntl } from 'react-intl';
import useUsers from 'components/Users/hooks/useUsers';
import CSTextField from './CSTextField';
import sx from './password.module.scss';

const PASSWORD_LENGTH_TOOLTIP = 'Set the minimum and maximum password length.';
const PASSWORD_UNIQUENESS_TOOLTIP = 'Options to ensure password uniqueness.';
const PASSWORD_EXPIRATION_TOOLTIP =
  'Set the password expiration period and limit the number of password changes allowed within a 24-hour period.';
const MIN_CHARS = 'Minimum Characters';
const MAX_CHARS = 'Maximum Characters';
const LOWER_CASE = 'Lowercase Letters';
const UPPER_CASE = 'Uppercase Letters';
const NUMERIC_CHARS = 'Numerical Characters';
const SPECIAL_CHARS = 'Special Characters';
const EXPIRY_DAYS = 'Expiry (days)';
const WARNING_PERIOD = 'Password expiry warning (days)';

const PASSWORD_COMPLEXITY_TOOLTIP = `Configure the minimum number of ${UPPER_CASE}, ${LOWER_CASE}, ${NUMERIC_CHARS} and ${SPECIAL_CHARS}.`;

const SectionTitle = ({
  title,
  tooltip
}: {
  title: string;
  tooltip: string;
}) => {
  return (
    <Box display='flex' m={1}>
      <Typography className={sx.stitle}>{title}</Typography>
      <Tooltip
        className={sx.tooltip}
        title={<Box>{tooltip}</Box>}
        placement='right'
      >
        <InfoIcon color='secondary' />
      </Tooltip>
    </Box>
  );
};

const Password = () => {
  const intl = useIntl();
  const { setPasswordExpiration } = useUser();
  const { showSuccessSnackbar, showErrorSnackbar } = useSnackbarContext();
  const { session } = useSession();
  const { data: configInfo } = useConfigInfo();
  const {
    usersQuery: { data: users }
  } = useUsers(session);
  const { user } = useUser();
  const {
    data: complexitySetting,
    isFetching: isPasswordComplexityLoading,
    refetch: refechcomplexitySettings
  } = usePasswordConfigGet(session, configInfo?.fedid, 'password');
  const {
    data: defaultComplexitySetting,
    isFetching: isDefaultComplexityLoading
  } = usePasswordConfigGet(session, configInfo?.fedid, 'pwd_dflt');
  const [submissionStarted, setSubmissionStarted] = useState(false);
  const theme = useTheme();
  const [complexity, setComplexity] = useState<PasswordComplexitySettings>(
    getDefaultPasswordComplexitySettings()
  );
  const [complexityOrginal, setComplexityOriginal] =
    useState<PasswordComplexitySettings>(
      getDefaultPasswordComplexitySettings()
    );

  const updateComplexitySettings = usePasswordConfigPatch(
    session,
    configInfo?.fedid
  );

  const [minimumLengthError, setMinimumLengthError] = useState(false);
  const [maximumLengthError, setMaximumLengthError] = useState(false);
  const [noreuseError, setNoreuseError] = useState(false);
  const [expirationDaysError, setExpirationDaysError] = useState(false);
  const [dailyChangesError, setDailyChangesError] = useState(false);
  const [mandatoryInputs, setMandatoryInputs] = useState<string[]>([]);

  const inputSection = {
    border: `1px solid ${theme.palette.neutral.dark500}`,
    borderRadius: '4px',
    padding: '10px'
  };

  useEffect(() => {
    if (
      !isPasswordComplexityLoading &&
      !isDefaultComplexityLoading &&
      complexitySetting &&
      defaultComplexitySetting
    ) {
      const complexitySettingsMerged = {
        ...defaultComplexitySetting,
        ...complexitySetting
      };

      const passwordComplexityMerged = createPasswordSettings(
        complexitySettingsMerged
      );

      if (defaultComplexitySetting.mandatory_rules) {
        setMandatoryInputs(defaultComplexitySetting.mandatory_rules);
      }

      setComplexityOriginal(passwordComplexityMerged);
      setComplexity(passwordComplexityMerged);
    }
  }, [
    complexitySetting,
    defaultComplexitySetting,
    isPasswordComplexityLoading,
    isDefaultComplexityLoading
  ]);

  const handleChange = (key: string, inputValue: string) => {
    const numericValue = inputValue.replace(/\D/g, '');

    if (
      (numericValue === '' || /^[0-9]\d*$/.test(numericValue)) &&
      complexity
    ) {
      setComplexity({
        ...complexity,
        [key]: numericValue === '' ? numericValue : Number(numericValue)
      });
    }
  };

  const handleCheckboxChange = (key: string, inputValue: boolean) => {
    if (complexity) {
      setComplexity({
        ...complexity,
        [key]: inputValue
      });
    }
  };

  const getBoundValue = (value: number): number =>
    Number(value ?? 0) < 0 ? Number.MAX_SAFE_INTEGER : Number(value ?? 0);

  const validateInput = (): [boolean, string] => {
    let isValid = true;
    let error = 'Error: One or more input values are beyond the allowed range.';
    setMinimumLengthError(false);
    setMaximumLengthError(false);
    setNoreuseError(false);
    setExpirationDaysError(false);
    setDailyChangesError(false);

    /** Validate against bounds if they are specified. */
    const minLength = Number(complexity.minimum_length ?? 0);
    const maxLength = Number(complexity.maximum_length ?? 0);
    const noReuseCount = Number(complexity.no_reuse ?? 0);
    const expirationDays = Number(complexity.expiration_days ?? 0);
    const lcLetters = Number(complexity.lowercase_letters ?? 0);
    const ucLetters = Number(complexity.uppercase_letters ?? 0);
    const numericChars = Number(complexity.numerical_chars ?? 0);
    const specialChars = Number(complexity.special_chars ?? 0);
    const dailyChanges = Number(complexity.daily_changes ?? 0);

    const minLengthUbound = getBoundValue(complexity.minimum_length_ubound);
    const maxLengthUbound = getBoundValue(complexity.maximum_length_ubound);
    const noReusetUbound = getBoundValue(complexity.no_reuse_ubound);
    const expirationDaysUbound = getBoundValue(
      complexity.expiration_days_ubound
    );
    const dailyChangesUbound = getBoundValue(complexity.daily_changes_ubound);

    if (
      complexity.minimum_length_check &&
      complexity.minimum_length_lbound &&
      complexity.minimum_length_ubound
    ) {
      if (
        minLength < Number(complexity.minimum_length_lbound ?? 0) ||
        minLength > minLengthUbound
      ) {
        isValid = false;
        setMinimumLengthError(true);
      }
    }

    if (
      complexity.maximum_length_check &&
      complexity.maximum_length_lbound &&
      complexity.maximum_length_ubound
    ) {
      if (
        maxLength < Number(complexity.maximum_length_lbound ?? 0) ||
        maxLength > maxLengthUbound
      ) {
        isValid = false;
        setMaximumLengthError(true);
      }
    }

    if (
      complexity.no_reuse_check &&
      complexity.no_reuse_lbound &&
      complexity.no_reuse_ubound
    ) {
      if (
        noReuseCount < Number(complexity.no_reuse_lbound ?? 0) ||
        noReuseCount > noReusetUbound
      ) {
        isValid = false;
        setNoreuseError(true);
      }
    }

    if (
      complexity.expiration_days_check &&
      complexity.expiration_days_lbound &&
      complexity.expiration_days_ubound
    ) {
      if (
        expirationDays < Number(complexity.expiration_days_lbound ?? 0) ||
        expirationDays > expirationDaysUbound
      ) {
        isValid = false;
        setExpirationDaysError(true);
      }
    }

    if (
      complexity.daily_changes_check &&
      complexity.daily_changes_ubound &&
      complexity.daily_changes_lbound
    ) {
      if (
        dailyChanges < Number(complexity.daily_changes_lbound ?? 0) ||
        dailyChanges > dailyChangesUbound
      ) {
        isValid = false;
        setDailyChangesError(true);
      }
    }

    if (isValid && complexity.maximum_length_check) {
      const lc = complexity.lowercase_letters_check ? lcLetters : 0;
      const uc = complexity.uppercase_letters_check ? ucLetters : 0;
      const nc = complexity.numerical_chars_check ? numericChars : 0;
      const sc = complexity.special_chars_check ? specialChars : 0;
      if (lc + uc + nc + sc > maxLength) {
        setMaximumLengthError(true);
        error = `Error: The ${MAX_CHARS} value is set to ${maxLength}. The sum of ${LOWER_CASE}, ${UPPER_CASE}, ${NUMERIC_CHARS}, and ${SPECIAL_CHARS} cannot exceed ${maxLength}.`;
        isValid = false;
      }
    }

    if (isValid && complexity.warning_period_check) {
      if (!complexity.expiration_days_check) {
        isValid = false;
        error =
          'Error: Password expiry warning duration cannot be configured without setting the password expiry duration.';
      } else if (
        Number(complexity.warning_period) >= Number(complexity.expiration_days)
      ) {
        isValid = false;
        error =
          'Error: Password expiry warning duration must be less than the password expiry duration.';
      }
    }

    if (isValid && mandatoryInputs.length > 0) {
      isValid = mandatoryInputs.every(
        (input) =>
          complexity[checkboxInputMap[input]] && Number(complexity[input]) > 0
      );
      if (!isValid) {
        error = 'Error: One or more mandatory input values are missing.';
      }
    }

    return [isValid, error];
  };
  const handleSubmission = async () => {
    const [isValid, error] = validateInput();
    if (!isValid) {
      showErrorSnackbar(error);
      return;
    }
    setSubmissionStarted(true);
    const payload: PasswordComplexityPayload = {};

    payload.disallow_username = Number(complexity.disallow_username_check ?? 0);

    payload.expiration_days = complexity.expiration_days_check
      ? Number(complexity.expiration_days ?? 0)
      : 0;

    payload.lowercase_letters = complexity.lowercase_letters_check
      ? Number(complexity.lowercase_letters ?? 0)
      : 0;

    payload.max_repetitive_chars = complexity.max_repetitive_chars_check
      ? Number(complexity.max_repetitive_chars ?? 0)
      : 0;

    payload.maximum_length = complexity.maximum_length_check
      ? Number(complexity.maximum_length ?? 0)
      : 0;

    payload.minimum_length = complexity.minimum_length_check
      ? Number(complexity.minimum_length ?? 0)
      : 0;

    payload.no_reuse = complexity.no_reuse_check
      ? Number(complexity.no_reuse ?? 0)
      : 0;

    payload.numerical_chars = complexity.numerical_chars_check
      ? Number(complexity.numerical_chars ?? 0)
      : 0;

    payload.special_chars = complexity.special_chars_check
      ? Number(complexity.special_chars ?? 0)
      : 0;

    payload.uppercase_letters = complexity.uppercase_letters_check
      ? Number(complexity.uppercase_letters ?? 0)
      : 0;

    payload.daily_changes = complexity.daily_changes_check
      ? Number(complexity.daily_changes ?? 0)
      : 0;

    payload.warning_period = complexity.warning_period_check
      ? Number(complexity.warning_period ?? 0)
      : 0;

    await updateComplexitySettings.mutateAsync(payload, {
      onSuccess: async () => {
        refechcomplexitySettings();
        showSuccessSnackbar('Success: Saved password configuration.');
        /* Show password expiration message only if the user is not an AD user
         and the password expiration is set */
        if (!users?.find((u) => u.username === user)?.adauth_usr) {
          const { data } = await queryClient.ensureQueryData({
            ...sessionInfoQuery({
              session,
              filter: ['user'],
              enforceRefetch: true
            })
          });

          if (data && data.user) {
            const { expires, expiry_warning_days: expiryWarningDays } =
              data.user;
            setPasswordExpiration({
              expires,
              expiry_warning_days: expiryWarningDays
            });
            showPasswordExpirationMessage(expires, expiryWarningDays, intl);
          }
        }

        setSubmissionStarted(false);
      },

      onError: (err: any) => {
        const text = err.response?.data?.error?.message?.text;
        showErrorSnackbar(
          text || 'Fail: Failed to save password configuration.'
        );
        setSubmissionStarted(false);
      }
    });
  };

  const getLabel = (label: string, key: string) => {
    if (mandatoryInputs.includes(key)) {
      return `${label} *`;
    }
    return label;
  };

  const getRangeLabel = (lower: number, upper: number) => {
    let range;
    if (lower !== upper) {
      if (lower < 0) {
        range = `Less than ${upper}`;
      } else if (upper < 0) {
        range = `At least ${lower}`;
      } else {
        range = `${lower}-${upper}`;
      }
    }
    range = range ? `Range [ ${range} ]` : '';
    return range;
  };

  return (
    <Stack
      className={sx.main}
      sx={{
        border: `1px solid ${theme.palette.neutral.dark500}`,
        bgcolor: theme.palette.white.main,
        pointerEvents:
          isPasswordComplexityLoading ||
          isDefaultComplexityLoading ||
          submissionStarted
            ? 'none'
            : 'auto'
      }}
    >
      <Stack padding='15px' gap={2}>
        <Box display='flex'>
          <Typography className={sx.title}>Password Configuration</Typography>
          {isPasswordComplexityLoading && isDefaultComplexityLoading && (
            <Loader />
          )}
        </Box>
        <Grid2 container spacing={2}>
          <Grid2 size={6} sx={inputSection}>
            <Grid2 container>
              <Grid2 size={12}>
                <SectionTitle
                  title='Password Length'
                  tooltip={PASSWORD_LENGTH_TOOLTIP}
                />
              </Grid2>
              <Grid2 size={6} display='flex' alignItems='center'>
                <Checkbox
                  checked={complexity?.minimum_length_check}
                  onClick={() => {
                    handleCheckboxChange(
                      'minimum_length_check',
                      !complexity?.minimum_length_check
                    );
                  }}
                  disabled={
                    (complexity?.minimum_length_lbound &&
                      complexity?.minimum_length_lbound ===
                        complexity?.minimum_length_ubound) ||
                    false
                  }
                />
                <CSTextField
                  className={sx.textField}
                  value={
                    Number(complexity.minimum_length)
                      ? complexity.minimum_length
                      : ''
                  }
                  onChange={(e) =>
                    handleChange('minimum_length', e.target.value)
                  }
                  error={minimumLengthError}
                  disabled={
                    (complexity?.minimum_length_lbound &&
                      complexity?.minimum_length_lbound ===
                        complexity?.minimum_length_ubound) ||
                    !complexity?.minimum_length_check
                  }
                  label={getLabel(MIN_CHARS, 'minimum_length')}
                  helperText={
                    complexity?.minimum_length_lbound &&
                    complexity?.minimum_length_ubound
                      ? getRangeLabel(
                          complexity.minimum_length_lbound,
                          complexity.minimum_length_ubound
                        )
                      : ''
                  }
                />
              </Grid2>
              <Grid2 size={6} display='flex' alignItems='center'>
                <Checkbox
                  checked={complexity?.maximum_length_check}
                  onClick={() => {
                    handleCheckboxChange(
                      'maximum_length_check',
                      !complexity?.maximum_length_check
                    );
                  }}
                  disabled={
                    (complexity?.maximum_length_lbound &&
                      complexity?.maximum_length_lbound ===
                        complexity?.maximum_length_ubound) ||
                    false
                  }
                />
                <CSTextField
                  className={sx.textField}
                  value={
                    Number(complexity.maximum_length)
                      ? complexity.maximum_length
                      : ''
                  }
                  onChange={(e) =>
                    handleChange('maximum_length', e.target.value)
                  }
                  error={maximumLengthError}
                  disabled={
                    (complexity?.maximum_length_lbound &&
                      complexity?.maximum_length_lbound ===
                        complexity?.maximum_length_ubound) ||
                    !complexity?.maximum_length_check
                  }
                  label={getLabel(MAX_CHARS, 'maximum_length')}
                  helperText={
                    complexity?.maximum_length_lbound &&
                    complexity?.maximum_length_ubound
                      ? getRangeLabel(
                          complexity.maximum_length_lbound,
                          complexity.maximum_length_ubound
                        )
                      : ''
                  }
                />
              </Grid2>
            </Grid2>
          </Grid2>
          <Grid2 size={6} sx={inputSection}>
            <Grid2 container>
              <Grid2 size={12}>
                <SectionTitle
                  title='Password Uniqueness'
                  tooltip={PASSWORD_UNIQUENESS_TOOLTIP}
                />
              </Grid2>
              <Grid2
                size={12}
                display='flex'
                alignItems='center'
                fontSize={14}
                fontWeight={400}
              >
                <Checkbox
                  checked={complexity.disallow_username_check}
                  onClick={() => {
                    handleCheckboxChange(
                      'disallow_username_check',
                      !complexity.disallow_username_check
                    );
                  }}
                />
                Password must not include username
              </Grid2>
              <Grid2
                size={12}
                display='flex'
                alignItems='center'
                fontSize={14}
                fontWeight={400}
              >
                <Checkbox
                  checked={complexity?.no_reuse_check}
                  onClick={() => {
                    handleCheckboxChange(
                      'no_reuse_check',
                      !complexity?.no_reuse_check
                    );
                  }}
                  disabled={
                    (complexity?.no_reuse_lbound &&
                      complexity?.no_reuse_lbound ===
                        complexity?.no_reuse_ubound) ||
                    false
                  }
                />
                New password must be different from
                <Box marginX={1}>
                  <CSTextField
                    sx={{ width: '95px' }}
                    value={
                      Number(complexity.no_reuse) ? complexity.no_reuse : ''
                    }
                    onChange={(e) => handleChange('no_reuse', e.target.value)}
                    error={noreuseError}
                    disabled={
                      (complexity?.no_reuse_lbound &&
                        complexity?.no_reuse_lbound ===
                          complexity?.no_reuse_ubound) ||
                      !complexity?.no_reuse_check
                    }
                    label=''
                    helperText={
                      complexity?.no_reuse_lbound && complexity?.no_reuse_ubound
                        ? getRangeLabel(
                            complexity.no_reuse_lbound,
                            complexity.no_reuse_ubound
                          )
                        : ''
                    }
                  />
                </Box>
                previous passwords
              </Grid2>
            </Grid2>
          </Grid2>
          <Grid2 size={6} sx={inputSection}>
            <Grid2 container rowGap={1}>
              <Grid2 size={12}>
                <SectionTitle
                  title='Password Complexity'
                  tooltip={PASSWORD_COMPLEXITY_TOOLTIP}
                />
              </Grid2>

              <Grid2 size={6} display='flex' alignItems='center'>
                <Checkbox
                  checked={complexity?.lowercase_letters_check}
                  onClick={() => {
                    handleCheckboxChange(
                      'lowercase_letters_check',
                      !complexity?.lowercase_letters_check
                    );
                  }}
                />
                <CSTextField
                  className={sx.textField}
                  value={
                    Number(complexity.lowercase_letters)
                      ? complexity.lowercase_letters
                      : ''
                  }
                  onChange={(e) =>
                    handleChange('lowercase_letters', e.target.value)
                  }
                  disabled={!complexity?.lowercase_letters_check}
                  label={getLabel(LOWER_CASE, 'lowercase_letters')}
                />
              </Grid2>
              <Grid2 size={6} display='flex' alignItems='center'>
                <Checkbox
                  checked={complexity?.uppercase_letters_check}
                  onClick={() => {
                    handleCheckboxChange(
                      'uppercase_letters_check',
                      !complexity?.uppercase_letters_check
                    );
                  }}
                />
                <CSTextField
                  className={sx.textField}
                  value={
                    Number(complexity.uppercase_letters)
                      ? complexity.uppercase_letters
                      : ''
                  }
                  onChange={(e) =>
                    handleChange('uppercase_letters', e.target.value)
                  }
                  disabled={!complexity?.uppercase_letters_check}
                  label={getLabel(UPPER_CASE, 'uppercase_letters')}
                />
              </Grid2>
              <Grid2 size={6} display='flex' alignItems='center'>
                <Checkbox
                  checked={complexity?.numerical_chars_check}
                  onClick={() => {
                    handleCheckboxChange(
                      'numerical_chars_check',
                      !complexity?.numerical_chars_check
                    );
                  }}
                />
                <CSTextField
                  className={sx.textField}
                  value={
                    Number(complexity.numerical_chars)
                      ? complexity.numerical_chars
                      : ''
                  }
                  onChange={(e) =>
                    handleChange('numerical_chars', e.target.value)
                  }
                  disabled={!complexity?.numerical_chars_check}
                  label={getLabel(NUMERIC_CHARS, 'numerical_chars')}
                />
              </Grid2>
              <Grid2 size={6} display='flex' alignItems='center'>
                <Checkbox
                  checked={complexity?.special_chars_check}
                  onClick={() =>
                    handleCheckboxChange(
                      'special_chars_check',
                      !complexity?.special_chars_check
                    )
                  }
                />
                <CSTextField
                  className={sx.textField}
                  value={
                    complexity.special_chars !== undefined &&
                    Number(complexity.special_chars)
                      ? complexity.special_chars
                      : ''
                  }
                  onChange={(e) =>
                    handleChange('special_chars', e.target.value)
                  }
                  disabled={!complexity.special_chars_check}
                  label={getLabel(SPECIAL_CHARS, 'special_chars')}
                />
              </Grid2>
              <Grid2 size={12} display='flex' alignItems='center'>
                <Checkbox
                  checked={complexity?.max_repetitive_chars_check}
                  onClick={() => {
                    handleCheckboxChange(
                      'max_repetitive_chars_check',
                      !complexity?.max_repetitive_chars_check
                    );
                  }}
                />
                <CSTextField
                  className={sx.textField}
                  value={
                    Number(complexity.max_repetitive_chars)
                      ? complexity.max_repetitive_chars
                      : ''
                  }
                  onChange={(e) =>
                    handleChange('max_repetitive_chars', e.target.value)
                  }
                  disabled={!complexity?.max_repetitive_chars_check}
                  label={getLabel(
                    'Maximum Number of Consecutive Repeated Characters',
                    'max_repetitive_chars'
                  )}
                />
              </Grid2>
            </Grid2>
          </Grid2>
          <Grid2 size={6} sx={inputSection}>
            <Grid2 container rowGap={1}>
              <Grid2 size={12}>
                <SectionTitle
                  title='Password Change Policy'
                  tooltip={PASSWORD_EXPIRATION_TOOLTIP}
                />
              </Grid2>
              <Grid2 size={6} display='flex' alignItems='center'>
                <Checkbox
                  checked={complexity?.expiration_days_check}
                  onClick={() => {
                    handleCheckboxChange(
                      'expiration_days_check',
                      !complexity?.expiration_days_check
                    );
                  }}
                  disabled={
                    (complexity?.expiration_days_lbound &&
                      complexity?.expiration_days_lbound ===
                        complexity?.expiration_days_ubound) ||
                    false
                  }
                />
                <CSTextField
                  className={sx.textField}
                  value={
                    Number(complexity.expiration_days)
                      ? complexity.expiration_days
                      : ''
                  }
                  onChange={(e) =>
                    handleChange('expiration_days', e.target.value)
                  }
                  error={expirationDaysError}
                  disabled={
                    (complexity?.expiration_days_lbound &&
                      complexity?.expiration_days_lbound ===
                        complexity?.expiration_days_ubound) ||
                    !complexity?.expiration_days_check
                  }
                  label={getLabel(EXPIRY_DAYS, 'expiration_days')}
                  helperText={
                    complexity?.expiration_days_lbound &&
                    complexity?.expiration_days_ubound
                      ? getRangeLabel(
                          complexity.expiration_days_lbound,
                          complexity.expiration_days_ubound
                        )
                      : ''
                  }
                />
              </Grid2>
              <Grid2 size={6} display='flex' alignItems='center'>
                <Checkbox
                  checked={complexity?.daily_changes_check}
                  onClick={() => {
                    handleCheckboxChange(
                      'daily_changes_check',
                      !complexity?.daily_changes_check
                    );
                  }}
                  disabled={
                    (complexity?.daily_changes_lbound &&
                      complexity?.daily_changes_lbound ===
                        complexity?.daily_changes_ubound) ||
                    false
                  }
                />
                <CSTextField
                  className={sx.textField}
                  value={
                    Number(complexity.daily_changes)
                      ? complexity.daily_changes
                      : ''
                  }
                  onChange={(e) =>
                    handleChange('daily_changes', e.target.value)
                  }
                  error={dailyChangesError}
                  disabled={
                    (complexity.daily_changes_lbound &&
                      complexity.daily_changes_lbound ===
                        complexity.daily_changes_ubound) ||
                    !complexity.daily_changes_check
                  }
                  label={getLabel(
                    'Changes allowed within 24 hours',
                    'daily_changes'
                  )}
                  helperText={
                    complexity.daily_changes_lbound &&
                    complexity.daily_changes_ubound
                      ? getRangeLabel(
                          complexity.daily_changes_lbound,
                          complexity.daily_changes_ubound
                        )
                      : ''
                  }
                />
              </Grid2>
              <Grid2 size={6} display='flex' alignItems='center'>
                <Checkbox
                  checked={complexity.warning_period_check}
                  onClick={() => {
                    handleCheckboxChange(
                      'warning_period_check',
                      !complexity.warning_period_check
                    );
                  }}
                />
                <CSTextField
                  className={sx.textField}
                  value={
                    Number(complexity.warning_period)
                      ? complexity.warning_period
                      : ''
                  }
                  onChange={(e) =>
                    handleChange('warning_period', e.target.value)
                  }
                  disabled={!complexity.warning_period_check}
                  label={WARNING_PERIOD}
                />
              </Grid2>
            </Grid2>
          </Grid2>
        </Grid2>
        <Divider />
        <Stack id='footer'>
          <Box className={sx.footer}>
            <Box>{submissionStarted && <Loader />}</Box>
            <Stack direction='row' spacing={1}>
              <Button
                variant='outlined'
                disabled={
                  complexityOrginal === undefined ||
                  JSON.stringify(complexityOrginal) ===
                    JSON.stringify(complexity)
                }
                onClick={() => {
                  setMinimumLengthError(false);
                  setMaximumLengthError(false);
                  setNoreuseError(false);
                  setExpirationDaysError(false);
                  setDailyChangesError(false);
                  setComplexity(complexityOrginal); // reset to original state
                }}
              >
                Clear Changes
              </Button>
              <Button
                variant='contained'
                disabled={
                  complexityOrginal === undefined ||
                  JSON.stringify(complexityOrginal) ===
                    JSON.stringify(complexity) ||
                  (complexity.minimum_length_check &&
                    !Number(complexity.minimum_length)) ||
                  (complexity.maximum_length_check &&
                    !Number(complexity.maximum_length)) ||
                  (complexity.lowercase_letters_check &&
                    !Number(complexity.lowercase_letters)) ||
                  (complexity.uppercase_letters_check &&
                    !Number(complexity.uppercase_letters)) ||
                  (complexity.numerical_chars_check &&
                    !Number(complexity.numerical_chars)) ||
                  (complexity.special_chars_check &&
                    !Number(complexity.special_chars)) ||
                  (complexity.max_repetitive_chars_check &&
                    !Number(complexity.max_repetitive_chars)) ||
                  (complexity.no_reuse_check && !Number(complexity.no_reuse)) ||
                  (complexity.expiration_days_check &&
                    !Number(complexity.expiration_days)) ||
                  (complexity.daily_changes_check &&
                    !Number(complexity.daily_changes)) ||
                  (complexity.warning_period_check &&
                    !Number(complexity.warning_period)) ||
                  !(
                    complexity.minimum_length_check ||
                    complexity.minimum_length_check !==
                      complexityOrginal.minimum_length_check ||
                    complexity.maximum_length_check ||
                    complexity.maximum_length_check !==
                      complexityOrginal.maximum_length_check ||
                    complexity.lowercase_letters_check ||
                    complexity.lowercase_letters_check !==
                      complexityOrginal.lowercase_letters_check ||
                    complexity.uppercase_letters_check ||
                    complexity.uppercase_letters_check !==
                      complexityOrginal.uppercase_letters_check ||
                    complexity.numerical_chars_check ||
                    complexity.numerical_chars_check !==
                      complexityOrginal.numerical_chars_check ||
                    complexity.special_chars_check ||
                    complexity.special_chars_check !==
                      complexityOrginal.special_chars_check ||
                    complexity.max_repetitive_chars_check ||
                    complexity.max_repetitive_chars_check !==
                      complexityOrginal.max_repetitive_chars_check ||
                    complexity.no_reuse_check ||
                    complexity.no_reuse_check !==
                      complexityOrginal.no_reuse_check ||
                    complexity.disallow_username_check ||
                    complexity.disallow_username_check !==
                      complexityOrginal.disallow_username_check ||
                    complexity.expiration_days_check ||
                    complexity.expiration_days_check !==
                      complexityOrginal.expiration_days_check ||
                    complexity.daily_changes_check ||
                    complexity.daily_changes_check !==
                      complexityOrginal.daily_changes_check
                  )
                }
                onClick={handleSubmission}
              >
                Save Changes
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};
export default Password;

export const passwordSettingsLoader =
  (client: QueryClient): LoaderFunction =>
  async () => {
    const canAccess = await loadCanAccess(client);
    if (!canAccess('netsecmgmt')) {
      return redirect('..');
    }
    return null;
  };
