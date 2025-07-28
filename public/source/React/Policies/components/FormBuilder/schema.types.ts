/*
  Your JSON structure must validate against 'JsonTemplateSchema'.
*/

export interface JsonTemplateSchema {
  version: '1';
  name: string;
  origin: boolean;
  members: Array<MemberSchema>;
  spacing?: number;
}

export type MemberSchema =
  | InputMemberSchema
  | PasswordInputMemberSchema
  | SelectMemberSchema
  | AutoCompletedMemberSchema
  | CheckboxMemberSchema
  | TableDictionaryMemberSchema
  | CoupledInputMemberSchema
  | TransitionModalSchema;

export interface InputMemberSchema {
  type: 'input';
  props: {
    required?: boolean;
    defaultValue?: string;
    label: string;
    name: string;
    disabled?: boolean;
    showRequiredAsterisk?: boolean;
  };
}

export interface PasswordInputMemberSchema {
  type: 'password';
  props: {
    required?: boolean;
    defaultValue?: string;
    label: string;
    name: string;
    disabled?: boolean;
    showRequiredAsterisk?: boolean;
  };
}

export interface SelectMemberSchema {
  type: 'select';
  props: {
    required?: boolean;
    label: string;
    defaultValue?: string | string[];
    name: string;
    options: Array<{ display: string; value: string }>;
    disabled?: boolean;
    multiple?: boolean;
    showRequiredAsterisk?: boolean;
  };
}

export interface AutoCompletedMemberSchema {
  type: 'autocomplete';
  props: {
    freeSolo?: boolean;
    multiple?: boolean;
    required?: boolean;
    label: string;
    defaultValue?: string | string[];
    name: string;
    options: Array<string>;
    disabled?: boolean;
    showRequiredAsterisk?: boolean;
  };
}

export interface CheckboxMemberSchema {
  type: 'checkbox';
  props: {
    name: string;
    label: string;
    defaultValue?: boolean;
    required?: boolean;
    disabled?: boolean;
  };
}

export interface TableDictionaryMemberSchema {
  type: 'tabledictionary';
  props: TableDictionaryMultiSelectProps | TableDictionarySingleSelectProps;
}

export interface TableDictionaryColumnDef {
  field: string;
  headerName: string;
  required?: boolean;
  tooltipText?: string;
}

interface TableDictionaryMultiSelectProps {
  multiSelect: true;
  name: string;
  label: string;
  required?: boolean;
  showRequiredAsterisk?: boolean;
  disabled?: boolean;
  searchPlaceholder?: string;
  defaultValue?: Array<Record<string, string>>;
  primaryColumnDef: TableDictionaryColumnDef;
  secondaryColumnDef: Array<TableDictionaryColumnDef>;
  rows: Array<Record<string, any>>;
}

interface TableDictionarySingleSelectProps {
  multiSelect: false;
  name: string;
  label: string;
  required?: boolean;
  showRequiredAsterisk?: boolean;
  disabled?: boolean;
  searchPlaceholder?: string;
  defaultValue?: Record<string, string>;
  primaryColumnDef: TableDictionaryColumnDef;
  secondaryColumnDef: Array<TableDictionaryColumnDef>;
  rows: Array<Record<string, any>>;
}

export interface CoupledInputMemberSchema {
  type: 'coupledinput';
  props: {
    name: string;
    label: string;
    required?: boolean;
    showRequiredAsterisk?: boolean;
    disabled?: boolean;
    defaultValue?: {
      primaryInput: string;
      secondarySelect: string;
    };
    secondaryInputOptions: Array<{ display: string; value: string }>;
  };
}

export interface TransitionModalSchema {
  type: 'transitionmodal',
  props: {
    title: string;
    transitionText: string;
    errorBtnText?: string;
    successText: string;
    successBtnText?: string;
  }
}
