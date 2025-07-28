export interface YaraRule {
  created?: number;
  creator?: string;
  deleted?: boolean;
  display_name?: string;
  enabled?: boolean;
  last_modified?: number;
  modifier?: string;
  rule?: string;
  rule_id?: string;
  ruleset_name?: string;
  severity?: string;
}

export type YaraRules = Array<YaraRule>;
