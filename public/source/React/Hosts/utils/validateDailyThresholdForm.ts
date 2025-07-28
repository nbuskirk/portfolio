import { THRESHOLD_ERROR_TEXT } from 'constants/constants';
import { DailyThresholdFormData } from '../components/Forms/types';

interface FormErrors {
  name?: string;
  severity?: string;
  host?: string;
}

const severityOrder = ['critical', 'high', 'medium', 'low'] as const;
const severityNotInDecreasingOrder = (
  values: DailyThresholdFormData
): boolean => {
  let MAX = Infinity;
  for (let i = 0; i < severityOrder.length; i += 1) {
    const level = values.severityLevels[severityOrder[i]];
    if (level.value !== -1) {
      if (MAX > level.value) {
        MAX = level.value;
      } else {
        return true;
      }
    }
  }
  return false;
};

const validateDailyThresholdForm = (values: DailyThresholdFormData) => {
  const errors: FormErrors = {};

  if (
    values.severityLevels.critical.value === -1 &&
    values.severityLevels.high.value === -1 &&
    values.severityLevels.medium.value === -1 &&
    values.severityLevels.low.value === -1
  ) {
    errors.severity = THRESHOLD_ERROR_TEXT.severity;
  } else if (severityNotInDecreasingOrder(values)) {
    errors.severity = THRESHOLD_ERROR_TEXT.severityDecreasing;
  }

  return {
    isValidForm: Object.keys(errors).length === 0,
    formErrors: errors
  };
};

export default validateDailyThresholdForm;
