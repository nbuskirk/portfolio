import {
  GridFilterInputValue,
  GridFilterItem,
  GridFilterOperator
} from '@mui/x-data-grid-premium';

import { validateGetDuration } from '../../helpers/setParams';

const parseDurationValue = (value: string | null) => {
  if (value == null) {
    return null;
  }

  return validateGetDuration(value);
};

const getDurationColumnOperators = (): GridFilterOperator[] => [
  {
    label: '=',
    value: '=',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (filterItem.value == null || Number.isNaN(filterItem.value)) {
        return null;
      }

      return ({ value }: { value?: any }): boolean => {
        return parseDurationValue(value) === filterItem.value;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'string' }
  },
  {
    label: '>',
    value: '>',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (filterItem.value == null || Number.isNaN(filterItem.value)) {
        return null;
      }

      return ({ value }: { value?: any }): boolean => {
        if (value == null) {
          return false;
        }

        return parseDurationValue(value)! > filterItem.value;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'string' }
  },
  {
    label: '<',
    value: '<',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (filterItem.value == null || Number.isNaN(filterItem.value)) {
        return null;
      }

      return ({ value }: { value?: any }): boolean => {
        if (value == null) {
          return false;
        }

        return parseDurationValue(value)! < filterItem.value;
      };
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'string' }
  }
];

export default getDurationColumnOperators;
