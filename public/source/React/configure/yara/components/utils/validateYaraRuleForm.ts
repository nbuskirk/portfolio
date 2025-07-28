import { YaraRule } from 'data-hooks/yara/yara.types';

export interface FormError {
  fieldName: string;
  error: string;
}

const validateYaraRuleForm = (yaraRule: YaraRule): FormError[] => {
  const errors: FormError[] = [];

  if (!yaraRule.severity) {
    errors.push({
      fieldName: 'severity',
      error: 'Alert Severity is required'
    });
  }

  return errors;
};

export default validateYaraRuleForm;
