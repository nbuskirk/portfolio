export interface PasswordComplexityPayload {
  minimum_length?: number;
  maximum_length?: number;
  lowercase_letters?: number;
  uppercase_letters?: number;
  numerical_chars?: number;
  special_chars?: number;
  max_repetitive_chars?: number;
  no_reuse?: number;
  disallow_username?: number;
  expiration_days?: number;
  daily_changes?: number;
  warning_period?: number;
}

export interface PasswordComplexityResponse {
  minimum_length?: string;
  maximum_length?: string;
  lowercase_letters?: string;
  uppercase_letters?: string;
  numerical_chars?: string;
  special_chars?: string;
  max_repetitive_chars?: string;
  no_reuse?: string;
  disallow_username?: string;
  expiration_days?: string;
  daily_changes?: string;
  mandatory_rules?: string[];
  warning_period?: string;
}

export interface PasswordComplexity extends PasswordComplexityResponse {
  expiration_days_bounds: string;
  maximum_length_bounds: string;
  minimum_length_bounds: string;
  no_reuse_bounds: string;
  daily_changes_bounds: string;
}

export interface PasswordComplexitySettings extends PasswordComplexity {
  minimum_length_check: boolean;
  maximum_length_check: boolean;
  lowercase_letters_check: boolean;
  uppercase_letters_check: boolean;
  numerical_chars_check: boolean;
  special_chars_check: boolean;
  max_repetitive_chars_check: boolean;
  no_reuse_check: boolean;
  disallow_username_check: boolean;
  expiration_days_check: boolean;
  daily_changes_check: boolean;
  warning_period_check: boolean;
  expiration_days_lbound: number;
  maximum_length_lbound: number;
  minimum_length_lbound: number;
  no_reuse_lbound: number;
  expiration_days_ubound: number;
  maximum_length_ubound: number;
  minimum_length_ubound: number;
  no_reuse_ubound: number;
  daily_changes_ubound: number;
  daily_changes_lbound: number;
  /** This indicates that the keys for every attribute in the Interface for all listed types are of the type 'string'. */
  [key: string]: number | boolean | string | string[] | undefined;
}

export const getDefaultPasswordComplexitySettings =
  (): PasswordComplexitySettings => {
    return {
      minimum_length: '',
      maximum_length: '',
      lowercase_letters: '',
      uppercase_letters: '',
      numerical_chars: '',
      special_chars: '',
      max_repetitive_chars: '',
      no_reuse: '',
      disallow_username: '',
      expiration_days: '',
      daily_changes: '',
      warning_period: '',

      // String defaults to ''
      expiration_days_bounds: '',
      maximum_length_bounds: '',
      minimum_length_bounds: '',
      no_reuse_bounds: '',
      daily_changes_bounds: '',

      // Additional numeric bounds defaults to 0
      expiration_days_lbound: 0,
      maximum_length_lbound: 0,
      minimum_length_lbound: 0,
      no_reuse_lbound: 0,
      expiration_days_ubound: 0,
      maximum_length_ubound: 0,
      minimum_length_ubound: 0,
      no_reuse_ubound: 0,
      daily_changes_ubound: 0,
      daily_changes_lbound: 0,

      // Boolean defaults to false
      minimum_length_check: false,
      maximum_length_check: false,
      lowercase_letters_check: false,
      uppercase_letters_check: false,
      numerical_chars_check: false,
      special_chars_check: false,
      max_repetitive_chars_check: false,
      no_reuse_check: false,
      disallow_username_check: false,
      expiration_days_check: false,
      daily_changes_check: false,
      warning_period_check: false
    };
  };

export const checkboxInputMap: { [key: string]: string } = {
  minimum_length: 'minimum_length_check',
  maximum_length: 'maximum_length_check',
  lowercase_letters: 'lowercase_letters_check',
  uppercase_letters: 'uppercase_letters_check',
  numerical_chars: 'numerical_chars_check',
  special_chars: 'special_chars_check',
  max_repetitive_chars: 'max_repetitive_chars_check',
  no_reuse: 'no_reuse_check',
  disallow_username: 'disallow_username_check',
  expiration_days: 'expiration_days_check',
  daily_changes: 'daily_changes_check',
  warning_period: 'warning_period_check'
};
