import { useQuery } from '@tanstack/react-query';
import { Assets } from 'assets/default.assets';
import { buildAssets } from 'assets/utils';
import axios from 'axios';
import { ASSETS } from 'constants/queryKeys';
import { checkIfUrlExistsAsync, urlOrigin } from 'lib/url';

const JSON_ASSETS_URL = `${urlOrigin}/addons/images/assets.json`;

const getCustomAssets = async () => {
  const customAssetsExist = await checkIfUrlExistsAsync(JSON_ASSETS_URL);
  if (customAssetsExist) {
    return axios
      .get<Assets>(JSON_ASSETS_URL)
      .then((res) => buildAssets(res.data));
  }
  return Promise.resolve(buildAssets());
};

const useCustomAssets = () => {
  return useQuery({
    queryKey: [ASSETS],
    queryFn: getCustomAssets,
    retry: false,
    gcTime: Infinity,
    staleTime: Infinity,
    meta: {
      skipGlobalErrorHandler: true
    }
  });
};

export default useCustomAssets;
