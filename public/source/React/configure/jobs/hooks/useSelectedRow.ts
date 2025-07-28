import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LocalStorageKeys, SearchParamKeys } from 'constants/constants';
import useLocalStorage from 'hooks/useLocalstorage';

const { JOBS_SELECTED_ROW } = LocalStorageKeys;
const { SELECTED_POLICY } = SearchParamKeys;

interface Row {
  row: {
    job_id: number;
    mtype: string;
  };
}

const useSelectedRow = () => {
  const [searchParams] = useSearchParams();
  let selectedPolicy: string | null = null;
  const pkey = SELECTED_POLICY;
  if (searchParams.has(pkey)) {
    selectedPolicy = searchParams.get(pkey);
  }
  const initSelectedRow = { row: { job_id: 0, mtype: '' } };
  const [searchSelectedRow, setSearchSelectedRow] =
    useState<Row>(initSelectedRow);

  const [selectedRow, setSelectedRow] = useLocalStorage<Row>(
    JOBS_SELECTED_ROW,
    initSelectedRow
  );
  return selectedPolicy
    ? ([searchSelectedRow, setSearchSelectedRow] as const)
    : ([selectedRow, setSelectedRow] as const);
};
export default useSelectedRow;
