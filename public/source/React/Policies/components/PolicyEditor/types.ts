import { CoupledInputMemberValue } from '../FormBuilder/members/CoupledInputMember';
import { ModalTransitionState } from '../FormBuilder/members/TransitionModalMember';
import {
  JsonTemplateSchema,
  TransitionModalSchema
} from '../FormBuilder/schema.types';

export type OmitType<T, U> = T extends { type: U } ? never : T;

export type MemberData = Record<
  string,
  | string
  | number
  | boolean
  | string[]
  | Array<Record<string, any>>
  | Record<string, any>
  | CoupledInputMemberValue
>;

export type JsonTemplateSchemaWithoutModalTransition = Omit<
  JsonTemplateSchema,
  'members'
> & {
  members: Array<
    OmitType<JsonTemplateSchema['members'][number], 'transitionmodal'>
  >;
};

type ModalTransitionStateWithoutClose = Omit<ModalTransitionState, 'close'>;

export interface NewPolicyState {
  initialLoad: boolean;
  step: number;
  criticalError?: Error;
  formError?: { message: string };
  noTemplateConfig: boolean;
  policyName: string;
  policyNameError?: Error;
  storageConnector: string;
  storageConnectorError?: Error;
  policyContext?: any;
  template?: JsonTemplateSchemaWithoutModalTransition;
  payload?: MemberData;
  policyDescription?: PolicyDescription;
  loading: boolean;
  execSpecificState?: ExecSpecificState;
  execSharedState?: ExecSharedState;
  policySchedule: PolicySchedule;
  policyError?: Error;
  modalTransitionState: ModalTransitionStateWithoutClose;
  prepedTransitionModalSchema?: TransitionModalSchema;
  stagedTransitionModalSchema?: TransitionModalSchema;
}

export type PolicyDescription = Array<{
  name: string;
  value: string;
}>;

export type NewPolicyAction =
  | {
      type: 'criticalError';
      criticalError: NonNullable<NewPolicyState['criticalError']>;
    }
  | {
      type: 'policyError';
      policyError: NonNullable<NewPolicyState['policyError']>;
    }
  | { type: 'loading' }
  | { type: 'policyName'; policyName: NewPolicyState['policyName'] }
  | {
      type: 'storageConnector';
      storageConnector: NewPolicyState['storageConnector'];
    }
  | {
      type: 'step0error';
      storageConnectorError: NewPolicyState['storageConnectorError'];
      policyNameError: NewPolicyState['policyNameError'];
    }
  | { type: 'nextStep1' }
  | {
      type: 'policyConfig';
      policyContext: NonNullable<NewPolicyState['policyContext']>;
      template: JsonTemplateSchema;
      formError: NewPolicyState['formError'];
      payload: MemberData;
    }
  | {
      type: 'finalContext';
      policyContext: NonNullable<NewPolicyState['policyContext']>;
      policyDescription: NonNullable<NewPolicyState['policyDescription']>;
      jobType: ExecJobType;
      noTemplateConfig: NonNullable<NewPolicyState['noTemplateConfig']>;
    }
  | {
      type: 'changeMemberData';
      memberName: string;
      memberValue: MemberData[string];
    }
  | {
      type: 'changeExecSpecificState';
      memberName: keyof AllExecSpecificStateParts;
      memberValue: AllExecSpecificStateParts[keyof AllExecSpecificStateParts];
    }
  | {
      type: 'changeExecSharedState';
      memberName: keyof ExecSharedState;
      memberValue: ExecSharedState[keyof ExecSharedState];
    }
  | {
      type: 'changePolicySchedule';
      memberName: keyof PolicySchedule;
      memberValue: PolicySchedule[keyof PolicySchedule];
    }
  | ({
      type: 'changeModalTransitionState';
      stageTransitionModal?: boolean;
    } & ModalTransitionStateWithoutClose)
  | {
      type: 'nextStep2';
    }
  | {
      type: 'nextStep3';
    }
  | {
      type: 'backStep1';
    }
  | {
      type: 'backStep2';
    }
  | {
      type: 'backStep3';
    };

export enum ExecJobType {
  Local = 'local',
  NFS = 'nfs',
  VMFS = 'vmfs',
  SCSI = 'scsi',
  SMB = 'smb'
}

export interface ExecSharedState {
  List_of_email_addresses: Array<string>;
  filter: {
    include: Array<string>;
    exclude: Array<string>;
  };
}

export interface ExecLocalState {
  job_type: 'local';
  index_as: string;
}

export interface ExecSCSIState {
  job_type: 'scsi';
  index_as: string;
}

export const StorageContFmt = [
  'backups',
  'filesystem data',
  'databases'
] as const;

export interface ExecNfsState {
  job_type: 'nfs';
  index_as: string;
  storage_cont_fmt: (typeof StorageContFmt)[number];
  btime_delta_start: number;
}

export interface ExecSmbState {
  job_type: ExecJobType.SMB;
  index_as: string;
  storage_cont_fmt: (typeof StorageContFmt)[number];
  btime_delta_start: number;
}

export interface ExecVmfsState {
  job_type: 'vmfs';
  virtualMachines: Array<VirtualMachineState>;
}

export type ExecSpecificState =
  | ExecLocalState
  | ExecSCSIState
  | ExecNfsState
  | ExecVmfsState
  | ExecSmbState;

export type AllExecSpecificStateParts = Omit<ExecLocalState, 'job_type'> &
  Omit<ExecNfsState, 'job_type'> &
  Omit<ExecVmfsState, 'job_type'> &
  Omit<ExecSCSIState, 'job_type'> &
  Omit<ExecSmbState, 'job_type'>;

export interface VirtualMachine {
  identifiers: {
    name: string;
    uuid: string;
    datastore_id: string;
    expect_at_least: number;
    expect_at_most?: number;
  };
  vm_options: {
    hostname: string;
  };
}

export interface VirtualMachineState {
  key: string;
  variant: 'name' | 'uuid';
  include: boolean;
  vm: VirtualMachine;
  isOpen?: boolean;
}

export type ExecFormKey =
  | keyof ExecLocalState
  | keyof ExecNfsState
  | keyof ExecVmfsState
  | keyof ExecSmbState
  | keyof ExecSCSIState;

export interface EditViewPolicyState {
  policyId: string;
  loading: boolean;
  policyChanged: boolean;
  scheduleChanged: boolean;
  execSharedState: ExecSharedState;
  execSpecificState: ExecSpecificState;
  policyDisplayName: string;
  policyNameError?: Error;
  policySchedule: PolicySchedule;
  policyScheduleError?: Error;
  policyError?: Error;
}

export interface Days {
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface PolicySchedule {
  scheduleId?: number;
  scheduleEnabled: boolean;
  frequency: 'hourly' | 'daily';
  hourly: {
    hours: number;
    mins: number;
  };
  daily: {
    days: Days;
    hour: number;
    min: number;
  };
}

export type EditViewAction =
  | {
      type: 'changeExecSpecificState';
      memberName: keyof AllExecSpecificStateParts;
      memberValue: AllExecSpecificStateParts[keyof AllExecSpecificStateParts];
    }
  | {
      type: 'changeExecSharedState';
      memberName: keyof ExecSharedState;
      memberValue: ExecSharedState[keyof ExecSharedState];
    }
  | {
      type: 'changePolicyDisplayName';
      policyDisplayName: EditViewPolicyState['policyDisplayName'];
    }
  | {
      type: 'resetState';
      initialState: EditViewPolicyState;
    }
  | {
      type: 'changePolicySchedule';
      memberName: keyof PolicySchedule;
      memberValue: PolicySchedule[keyof PolicySchedule];
    }
  | {
      type: 'loading';
      loading: EditViewPolicyState['loading'];
    }
  | {
      type: 'updateError';
      policyError: EditViewPolicyState['policyError'];
      scheduleError: EditViewPolicyState['policyScheduleError'];
    }
  | {
      type: 'closeInfoAlert';
    };

export interface EditStorageConnectorState {
  step: number;
  loading: boolean;
  criticalError?: Error;
  formError?: { message: string };
  noTemplateConfig: boolean;
  template?: JsonTemplateSchemaWithoutModalTransition;
  payload?: MemberData;
  jobType?: ExecJobType;
  policyContext: any;
  policyDescription: PolicyDescription;
  execSpecificState: ExecSpecificState;
  execSharedState: ExecSharedState;
  modalTransitionState: ModalTransitionStateWithoutClose;
  prepedTransitionModalSchema?: TransitionModalSchema;
  stagedTransitionModalSchema?: TransitionModalSchema;
}

export type EditStorageConnectorAction =
  | {
      type: 'loading';
      loading: EditStorageConnectorState['loading'];
    }
  | {
      type: 'criticalError';
      criticalError: NonNullable<EditStorageConnectorState['criticalError']>;
    }
  | {
      type: 'nextStep1';
    }
  | {
      type: 'backStep1';
    }
  | {
      type: 'policyConfig';
      policyContext: NonNullable<EditStorageConnectorState['policyContext']>;
      template: JsonTemplateSchema;
      formError: EditStorageConnectorState['formError'];
      payload: MemberData;
    }
  | {
      type: 'finalContext';
      policyContext: NonNullable<EditStorageConnectorState['policyContext']>;
      policyDescription: NonNullable<
        EditStorageConnectorState['policyDescription']
      >;
      jobType: ExecJobType;
      noTemplateConfig: NonNullable<
        EditStorageConnectorState['noTemplateConfig']
      >;
    }
  | {
      type: 'changeMemberData';
      memberName: string;
      memberValue: MemberData[string];
    }
  | ({
      type: 'changeModalTransitionState';
      stageTransitionModal?: boolean;
    } & ModalTransitionStateWithoutClose);
