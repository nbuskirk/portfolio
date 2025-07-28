import { ThresholdLocation } from 'data-hooks/hosts/useThresholds';

export type SeverityLevel =
  | 'critical'
  | 'high'
  | 'medium'
  | 'low'
  | 'csi'
  | 'dba'
  | 'alertlevel';

export type SeverityLevelData = {
  value: number;
  enabled: boolean;
};

export type SeverityConfig = {
  value: number;
  enabled?: boolean;
};

export type SeverityLevels = Partial<Record<SeverityLevel, SeverityConfig>>;

export interface ThresholdTableRow {
  time_date: number;
  value: number;
}

export type ThresholdGraphType = 'qty' | 'percent';

export interface DailyThresholdFormData {
  enabled?: string;
  type: string;
  host: string;
  severityLevels: {
    critical: SeverityLevelData;
    high: SeverityLevelData;
    medium: SeverityLevelData;
    low: SeverityLevelData;
  };
  format: string;
  action: string;
}

export interface CustomThresholdSeverityLevels {
  critical: SeverityLevelData;
  high: SeverityLevelData;
  medium: SeverityLevelData;
  low: SeverityLevelData;
}

export interface CustomThresholdFormData {
  host?: string;
  enabled?: string;
  name?: string;
  type: string;
  severityLevels: CustomThresholdSeverityLevels;
  threshold_value_2: number;
  format: string;
  locations: ThresholdLocation[];
  action: string;
}
