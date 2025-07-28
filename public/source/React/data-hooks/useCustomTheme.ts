import { Theme } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { THEME } from 'constants/queryKeys';
import { checkIfUrlExistsAsync, urlOrigin } from 'lib/url';
import { buildTheme } from 'theme/utils';

const JSON_THEME_URL = `${urlOrigin}/addons/themes/theme.json`;

const getCustomTheme = async () => {
  const customThemeExist = await checkIfUrlExistsAsync(JSON_THEME_URL);
  if (customThemeExist) {
    return axios.get<Theme>(JSON_THEME_URL).then((res) => buildTheme(res.data));
  }
  return Promise.resolve(buildTheme());
};

const useCustomTheme = () => {
  return useQuery({
    queryKey: [THEME],
    queryFn: getCustomTheme,
    retry: false,
    gcTime: Infinity,
    staleTime: Infinity,
    meta: {
      skipGlobalErrorHandler: true
    }
  });
};

export default useCustomTheme;

