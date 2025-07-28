import { useState, useEffect } from 'react';
import { GridFilterModel, GridFilterItem } from '@mui/x-data-grid-premium';
import { useSearchParams } from 'react-router-dom';
import { LocalStorageKeys, SearchParamKeys } from 'constants/constants';
import useLocalStorage from 'hooks/useLocalstorage';

const { JOBS_FILTER_MODEL } = LocalStorageKeys;
const { SELECTED_POLICY } = SearchParamKeys;

const useFilterModel = () => {
  const [searchParams] = useSearchParams();
  let selectedPolicy: string | null = null;
  const pkey = SELECTED_POLICY;
  if (searchParams.has(pkey)) {
    selectedPolicy = searchParams.get(pkey);
  }
  const filterModelItems: GridFilterItem[] = selectedPolicy
    ? [{ field: 'policy', operator: 'equals', value: selectedPolicy }]
    : [];
  const initFilterModel = { items: filterModelItems };
  const [searchFilterModel, setSearchFilterModel] =
    useState<GridFilterModel>(initFilterModel);

  // When search parameters change not as a part of hard reload
  // we need to update the filterModel use state
  // without overwriting other fields
  useEffect(() => {
    const idx = searchFilterModel.items.findIndex(
      (item: GridFilterItem) => item.field === 'policy'
    );
    if (idx > -1) {
      setSearchFilterModel((model) => {
        return {
          items: [
            ...model.items.slice(0, idx),
            { field: 'policy', operator: 'equals', value: selectedPolicy },
            ...searchFilterModel.items.slice(idx + 1)
          ]
        };
      });
    } else {
      setSearchFilterModel((model) => {
        return {
          items: [
            ...model.items,
            { field: 'policy', operator: 'equals', value: selectedPolicy }
          ]
        };
      });
    }
  }, [selectedPolicy]);

  const [filterModel, setFilterModel] = useLocalStorage<GridFilterModel>(
    JOBS_FILTER_MODEL,
    initFilterModel
  );
  return selectedPolicy
    ? ([searchFilterModel, setSearchFilterModel] as const)
    : ([filterModel, setFilterModel] as const);
};
export default useFilterModel;
