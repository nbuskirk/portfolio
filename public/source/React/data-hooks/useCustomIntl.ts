import { useQuery } from '@tanstack/react-query';
import { INTL } from 'constants/queryKeys';
import { checkIfUrlExistsAsync, urlOrigin } from 'lib/url';
import axios from 'axios';
import { buildIntl } from 'intl/utils';

const JSON_INTL_URL = `${urlOrigin}/addons/intl/en-US.json`;

type IntlData = Record<string, string>;

const getCustomIntl = async () => {
  const customIntlExist = await checkIfUrlExistsAsync(JSON_INTL_URL);
  if (customIntlExist) {
    return axios
      .get<IntlData>(JSON_INTL_URL)
      .then((res) => buildIntl(res.data));
  }
  return Promise.resolve(buildIntl());
};

const useCustomIntl = () => {
  return useQuery({
    queryKey: [INTL],
    queryFn: getCustomIntl,
    retry: false,
    gcTime: Infinity,
    staleTime: Infinity,
    meta: {
      skipGlobalErrorHandler: true
    }
  });
};

export default useCustomIntl;
