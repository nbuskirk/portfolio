import { THRESHOLD_ERROR_TEXT } from 'constants/constants';
import { CustomThresholdFormData } from '../components/Forms/types';

interface FormErrors {
  name?: string;
  type?: string;
  format?: string;
  severity?: string;
  locations?: string;
  host?: string;
}

const severityOrder = ['critical', 'high', 'medium', 'low'] as const;
const severityNotInDecreasingOrder = (
  values: CustomThresholdFormData
): boolean => {
  let MAX = Infinity;
  for (let i = 0; i < severityOrder.length; i += 1) {
    const level = values.severityLevels[severityOrder[i]];
    if (level.value !== -1 && level.value) {
      if (MAX > level.value) {
        MAX = level.value;
      } else {
        return true;
      }
    }
  }
  return false;
};

const validateCustomThresholdForm = (values: CustomThresholdFormData) => {
  const errors: FormErrors = {};
  if (!values.name) {
    errors.name = THRESHOLD_ERROR_TEXT.name;
  }
  if (values.type === 'none') {
    errors.type = THRESHOLD_ERROR_TEXT.type;
  }
  if (values.format === 'none') {
    errors.format = THRESHOLD_ERROR_TEXT.format;
  }

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

  if (!values.locations || values.locations.length === 0) {
    errors.locations = THRESHOLD_ERROR_TEXT.locations;
  }

  return {
    isValidForm: Object.keys(errors).length === 0,
    formErrors: errors
  };
};

export default validateCustomThresholdForm;
