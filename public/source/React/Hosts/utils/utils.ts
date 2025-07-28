import { ThresholdResponse } from 'data-hooks/hosts/useThresholds';
import { ThresholdLocation } from 'data-hooks/useDailyActivityAlertLevels';
import {
  CustomThresholdFormData,
  DailyThresholdFormData,
  SeverityConfig,
  SeverityLevel,
  SeverityLevelData,
  SeverityLevels
} from '../components/Forms/types';

interface FormattedDailyThresholdFormData {
  enabled_state?: string;
  activity_type: string;
  host: string;
  severity_levels: {
    critical: SeverityLevelData;
    high: SeverityLevelData;
    medium: SeverityLevelData;
    low: SeverityLevelData;
  };
}

interface FormattedCustomThresholdFormData {
  enabled_state?: string;
  name?: string;
  threshold_type: string;
  severity_levels: {
    critical: SeverityLevelData;
    high: SeverityLevelData;
    medium: SeverityLevelData;
    low: SeverityLevelData;
  };
  locations: ThresholdLocation[];
}

export const doCombinedData = (
  csidata: { time_date: number; value?: number }[],
  dbadata: { time_date: number; value?: number }[]
) => {
  const combineddata: {
    time_date: number;
    value?: number;
    dbavalue?: number;
  }[] = [];
  const csidataMap: { [key: number]: number | undefined } = {};
  const dbadataMap: { [key: number]: number | undefined } = {};

  csidata.forEach((cdata) => {
    csidataMap[cdata.time_date] = cdata.value;
  });

  dbadata.forEach((ddata) => {
    dbadataMap[ddata.time_date] = ddata.value;
  });

  const allDates = new Set([
    ...csidata.map((cdata) => cdata.time_date),
    ...dbadata.map((ddata) => ddata.time_date)
  ]);

  allDates.forEach((date) => {
    combineddata.push({
      time_date: date,
      value: csidataMap[date],
      dbavalue: dbadataMap[date]
    });
  });

  return combineddata;
};

export const getActiveSeverityLevels = (
  enabled: boolean,
  severityLevels: SeverityLevels = {}
): SeverityLevel[] => {
  return (Object.entries(severityLevels) as [SeverityLevel, SeverityConfig][])
    .filter(([, config]) => config?.value > 0 && config?.enabled && enabled)
    .map(([level]) => level);
};

export const getDailyThresholdType = (type?: string) => {
  if (type?.includes('change_qty')) {
    return 'change_qty';
  }
  if (type?.includes('deletion')) {
    return 'deletion';
  }
  if (type?.includes('change_type')) {
    return 'change_type';
  }
  if (type?.includes('entropy')) {
    return 'entropy_average';
  }
  return 'none';
};

export const getThresholdFormat = (type?: string) => {
  if (type?.includes('count')) {
    return 'quantity';
  }
  if (type === 'entropy') {
    return 'percent';
  }
  if (type && !type?.includes('count')) {
    return 'percent';
  }
  return 'none';
};
export const getDailyPostThresholdType = (
  action: string,
  format: string,
  type: string
) => {
  if (action === 'create' && type.includes('entropy')) {
    return 'entropy_average';
  }
  if (action === 'create' && format === 'quantity') {
    return `${type}_count`;
  }
  if (action === 'create' && format === 'percent') {
    return `${type}_percent`;
  }
  return type;
};
export const getThresholdType = (format: string, type: string) => {
  if (type === 'entropy') {
    return 'entropy';
  }
  if (format === 'quantity') {
    return `${type}_count`;
  }
  return type;
};
export const parseHomogenizedType = (
  homogenizedType: string
): { type: string; format: string } => {
  // Entropy can only be a percent value
  if (homogenizedType === 'entropy') {
    return { type: 'entropy', format: 'percent' };
  }
  const parts = homogenizedType.split('_');
  const formatIndentifier = parts.at(-1);
  return {
    type:
      formatIndentifier === 'count'
        ? parts.slice(0, -1).join('_')
        : parts.join('_'),
    format: formatIndentifier === 'count' ? 'quantity' : 'percent'
  };
};
export const encodePartsPerMillionFromPercent = (
  severityLevels: ThresholdResponse['severity_levels']
) => {
  const output = {
    critical: { ...severityLevels.critical },
    high: { ...severityLevels.high },
    medium: { ...severityLevels.medium },
    low: { ...severityLevels.low }
  };
  if (output.critical.value !== -1) {
    output.critical.value *= 10000;
  }
  if (output.high.value !== -1) {
    output.high.value *= 10000;
  }
  if (output.medium.value !== -1) {
    output.medium.value *= 10000;
  }
  if (output.low.value !== -1) {
    output.low.value *= 10000;
  }
  return output;
};
export const decodePartsPerMillionIntoPercent = (
  severityLevels: ThresholdResponse['severity_levels']
) => {
  const output: ThresholdResponse['severity_levels'] = {
    critical: { ...severityLevels.critical },
    high: { ...severityLevels.high },
    medium: { ...severityLevels.medium },
    low: { ...severityLevels.low }
  };
  if (output.critical.value !== -1) {
    output.critical.value /= 10000;
  }
  if (output.high.value !== -1) {
    output.high.value /= 10000;
  }
  if (output.medium.value !== -1) {
    output.medium.value /= 10000;
  }
  if (output.low.value !== -1) {
    output.low.value /= 10000;
  }
  return output;
};
export const preProcessDailyFormData = (
  formData: DailyThresholdFormData
): FormattedDailyThresholdFormData => {
  const formattedFormData = {
    host: formData.host,
    activity_type: getDailyPostThresholdType(
      formData.action,
      formData.format,
      formData.type
    ),
    enabled_state: formData.enabled,
    severity_levels: {
      critical: { ...formData.severityLevels.critical },
      high: { ...formData.severityLevels.high },
      medium: { ...formData.severityLevels.medium },
      low: { ...formData.severityLevels.low }
    }
  };
  if (formData.format === 'percent') {
    formattedFormData.severity_levels = encodePartsPerMillionFromPercent(
      formattedFormData.severity_levels
    );
  }
  return formattedFormData;
};

export const preProcessCustomFormData = (
  formData: CustomThresholdFormData
): FormattedCustomThresholdFormData => {
  const formattedFormData = {
    name: formData.name,
    locations: formData.locations,
    threshold_type: getThresholdType(formData.format, formData.type),
    enabled_state: formData.enabled,
    severity_levels: {
      critical: { ...formData.severityLevels.critical },
      high: { ...formData.severityLevels.high },
      medium: { ...formData.severityLevels.medium },
      low: { ...formData.severityLevels.low }
    },
    threshold_value_2: formData.threshold_value_2
  };
  if (formData.format === 'percent') {
    formattedFormData.severity_levels = encodePartsPerMillionFromPercent(
      formattedFormData.severity_levels
    );
  }
  return formattedFormData;
};
export const calculateSegments = (data: number, severityLevels: any) => {
  const segments = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0
  };

  // If data is less than the lowest severity level, lowest segment is the data
  if (data < severityLevels?.low?.value) {
    segments.low = data;
    segments.medium = 0;
    segments.high = 0;
    segments.critical = 0;
  }

  // If data is greater than medium, but lower than high
  if (data > severityLevels.medium.value && data < severityLevels.high.value) {
    segments.low = severityLevels.low.value;
    segments.medium = data - severityLevels.low.value;
    segments.high = 0;
    segments.critical = 0;
  }

  // If data is greater than high, but lower than critical
  if (
    data > severityLevels?.high?.value &&
    data < severityLevels?.critical?.value
  ) {
    segments.low = severityLevels.low.value;
    segments.medium = severityLevels.medium.value - severityLevels.low.value;
    segments.high = data - severityLevels.medium.value;
    segments.critical = 0;
  }

  // If data is greater than the highest severity level, add the difference to the critical segment
  if (data > severityLevels.critical.value) {
    segments.low = severityLevels.low.value;
    segments.medium = severityLevels.medium.value - severityLevels.low.value;
    segments.high = severityLevels.high.value - severityLevels.medium.value;
    segments.critical = data - severityLevels.high.value;
  }

  return segments;
};
