import { useState } from 'react';
import { GridPaginationModel } from '@mui/x-data-grid-premium';
import { useSearchParams } from 'react-router-dom';
import { LocalStorageKeys, SearchParamKeys } from 'constants/constants';
import useLocalStorage from 'hooks/useLocalstorage';

const { JOBS_PAGINATION_MODEL } = LocalStorageKeys;
const { SELECTED_POLICY } = SearchParamKeys;

const usePaginationModel = () => {
  const [searchParams] = useSearchParams();
  let selectedPolicy: string | null = null;
  const pkey = SELECTED_POLICY;
  if (searchParams.has(pkey)) {
    selectedPolicy = searchParams.get(pkey);
  }
  const initPaginationModel = { page: 0, pageSize: 10 };
  const [searchPaginationModel, setSearchPaginationModel] =
    useState<GridPaginationModel>(initPaginationModel);

  const [paginationModel, setPaginationModel] =
    useLocalStorage<GridPaginationModel>(
      JOBS_PAGINATION_MODEL,
      initPaginationModel
    );
  return selectedPolicy
    ? ([searchPaginationModel, setSearchPaginationModel] as const)
    : ([paginationModel, setPaginationModel] as const);
};
export default usePaginationModel;
