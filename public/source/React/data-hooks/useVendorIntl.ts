import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { INTL } from 'constants/queryKeys';
import { themeOrigin } from 'theme/utils';

const origin = themeOrigin();

type IntlData = Record<string, string>;

const getVendorIntl = () =>
  axios.get<IntlData>(`${origin}/skins/intl/en-US.json`);

const useVendorIntl = () => {
  return useQuery({
    queryKey: [INTL],
    queryFn: getVendorIntl,
    retry: false,
    gcTime: Infinity,
    staleTime: Infinity,
    meta: {
      skipGlobalErrorHandler: true
    }
  });
};

export default useVendorIntl;
