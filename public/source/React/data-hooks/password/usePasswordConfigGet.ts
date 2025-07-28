import { useQuery } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';
import { PasswordComplexitySettings } from './types';

const pattern = /[^-\d]/g;
const getBoundValues = (value: string): number[] => {
  const bounds = value.split(',');
  const lbound = Number(bounds[0].replace(pattern, ''));
  const ubound = Number(bounds[1].replace(pattern, ''));
  return [lbound, ubound];
};

export const createPasswordSettings = (
  data: PasswordComplexitySettings
): PasswordComplexitySettings => {
  const response: PasswordComplexitySettings = data;
  if (Object.keys(response).length === 0) {
    return response;
  }
  if (response.expiration_days) {
    response.expiration_days = response.expiration_days
      .toString()
      .replace(pattern, '');
  }

  if (response.warning_period) {
    response.warning_period = response.warning_period
      .toString()
      .replace(pattern, '');
  }

  response.minimum_length_check = Boolean(Number(response.minimum_length));
  response.maximum_length_check = Boolean(Number(response.maximum_length));
  response.lowercase_letters_check = Boolean(
    Number(response.lowercase_letters)
  );
  response.uppercase_letters_check = Boolean(
    Number(response.uppercase_letters)
  );
  response.numerical_chars_check = Boolean(Number(response.numerical_chars));
  response.special_chars_check = Boolean(Number(response.special_chars));
  response.max_repetitive_chars_check = Boolean(
    Number(response.max_repetitive_chars)
  );
  response.no_reuse_check = Boolean(Number(response.no_reuse));
  response.disallow_username_check = Boolean(
    Number(response.disallow_username)
  );
  response.expiration_days_check = Boolean(Number(response.expiration_days));
  response.daily_changes_check = Boolean(Number(response.daily_changes));

  response.warning_period_check = Boolean(Number(response.warning_period));

  if (response.expiration_days_bounds) {
    [response.expiration_days_lbound, response.expiration_days_ubound] =
      getBoundValues(response.expiration_days_bounds);
  }
  if (response.maximum_length_bounds) {
    [response.maximum_length_lbound, response.maximum_length_ubound] =
      getBoundValues(response.maximum_length_bounds);
  }
  if (response.minimum_length_bounds) {
    [response.minimum_length_lbound, response.minimum_length_ubound] =
      getBoundValues(response.minimum_length_bounds);
  }
  if (response.no_reuse_bounds) {
    [response.no_reuse_lbound, response.no_reuse_ubound] = getBoundValues(
      response.no_reuse_bounds
    );
  }
  if (response.daily_changes_bounds) {
    [response.daily_changes_lbound, response.daily_changes_ubound] =
      getBoundValues(response.daily_changes_bounds);
  }
  return response;
};
const usePasswordConfigGet = (
  sessionId: string,
  fedid: string | undefined,
  category: string
) => {
  return useQuery({
    queryKey: ['PASSWORD_CONFIG', category],
    refetchOnMount: 'always',
    queryFn: async (): Promise<PasswordComplexitySettings> => {
      const data = await API.get(
        `/federations/${fedid}/configurations/password?category=${category}`,
        {
          headers: {
            sessionId
          }
        }
      ).then((res) => res.data);
      return data;
    }
  });
};
export default usePasswordConfigGet;
