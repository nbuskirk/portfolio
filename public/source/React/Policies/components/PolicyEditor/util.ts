import { PolicyData } from 'data-hooks/policies/useQueryPolicy';
import {
  PolicyScheduleData,
  ScheduleData,
  ScheduleType
} from 'data-hooks/policies/schedule/schedule.types';
import { JobTypeData } from 'data-hooks/policies/policy/policy.types';
import { StorageConnectorStepResponse } from 'data-hooks/policies/useQueryEditStorageConnectorStep';
import { StorageConnectors } from 'components/Policies/hooks/useStorageConnectors';
import {
  JsonTemplateSchema,
  TransitionModalSchema
} from '../FormBuilder/schema.types';
import {
  Days,
  EditStorageConnectorState,
  EditViewPolicyState,
  ExecFormKey,
  ExecJobType,
  ExecLocalState,
  ExecNfsState,
  ExecSCSIState,
  ExecSharedState,
  ExecSmbState,
  ExecSpecificState,
  ExecVmfsState,
  MemberData,
  NewPolicyState,
  PolicyDescription,
  PolicySchedule,
  VirtualMachine,
  VirtualMachineState
} from './types';
import { tableDictionaryIsValid } from '../FormBuilder/members/TableDictionaryMember';

const buildMemberDataStructureFromTemplate = (template: JsonTemplateSchema) => {
  return template.members.reduce<MemberData>((acc, val) => {
    switch (val.type) {
      case 'input': {
        acc[val.props.name] =
          val.props.defaultValue !== undefined ? val.props.defaultValue : '';
        break;
      }
      case 'password': {
        acc[val.props.name] =
          val.props.defaultValue !== undefined ? val.props.defaultValue : '';
        break;
      }
      case 'select': {
        acc[val.props.name] =
          val.props.defaultValue !== undefined ? val.props.defaultValue : '';
        break;
      }
      case 'autocomplete': {
        if (val.props.multiple) {
          acc[val.props.name] =
            val.props.defaultValue !== undefined ? val.props.defaultValue : [];
        } else {
          acc[val.props.name] =
            val.props.defaultValue !== undefined ? val.props.defaultValue : '';
        }
        break;
      }
      case 'checkbox': {
        acc[val.props.name] =
          val.props.defaultValue !== undefined ? val.props.defaultValue : false;
        break;
      }
      case 'tabledictionary': {
        if (val.props.multiSelect) {
          acc[val.props.name] =
            val.props.defaultValue !== undefined &&
            val.props.defaultValue.length > 0
              ? val.props.defaultValue
              : [];
        } else {
          acc[val.props.name] =
            val.props.defaultValue !== undefined ? val.props.defaultValue : {};
        }
        break;
      }
      case 'coupledinput': {
        acc[val.props.name] =
          val.props.defaultValue !== undefined
            ? val.props.defaultValue
            : {
                primaryInput: '',
                secondarySelect: val.props.secondaryInputOptions[0].value
              };
        break;
      }
      case 'transitionmodal': {
        break;
      }
      default: {
        // eslint-disable-next-line no-console
        console.error(`Unknown member type ${(val as { type: string }).type}`);
      }
    }
    return acc;
  }, {});
};

const buildExecSpecificFormData = (
  execJobType: ExecJobType
): ExecSpecificState => {
  switch (execJobType) {
    case 'local': {
      const localParams: ExecLocalState = {
        job_type: 'local',
        index_as: ''
      };
      return localParams;
    }
    case 'scsi': {
      const scsiParams: ExecSCSIState = {
        job_type: 'scsi',
        index_as: ''
      };
      return scsiParams;
    }
    case 'nfs': {
      const nfsParams: ExecNfsState = {
        job_type: 'nfs',
        index_as: '',
        storage_cont_fmt: 'backups',
        btime_delta_start: 0
      };
      return nfsParams;
    }
    case ExecJobType.SMB: {
      const smbParams: ExecSmbState = {
        job_type: ExecJobType.SMB,
        index_as: '',
        storage_cont_fmt: 'backups',
        btime_delta_start: 0
      };
      return smbParams;
    }
    case 'vmfs': {
      const vmfsParams: ExecVmfsState = {
        job_type: 'vmfs',
        virtualMachines: []
      };
      return vmfsParams;
    }
    default: {
      throw new Error(`Unknown ExecJobType '${execJobType}'`);
    }
  }
};

const buildExecSharedFormData = (): ExecSharedState => {
  return {
    List_of_email_addresses: [],
    filter: {
      include: [],
      exclude: []
    }
  };
};

const getExecSpecificDisplayNameForKey = (key: ExecFormKey): string => {
  switch (key) {
    case 'index_as': {
      return 'Original Data Location';
    }
    case 'storage_cont_fmt': {
      return 'Storage Container Format';
    }
    case 'btime_delta_start': {
      return 'Backup Time Midnight Delta';
    }
    case 'job_type': {
      return 'Job Type';
    }
    case 'virtualMachines': {
      return 'Virtual Machines';
    }
    default: {
      throw new Error(`Unknown ExecFormKey '${key}'`);
    }
  }
};

const getPolicyDescriptionDisplayNameForKey = (key: string): string => {
  switch (key) {
    case 'directory': {
      return 'Directory';
    }
    default:
      return key;
  }
};

const transformExecStateIntoJobTypeData = (
  execSpecificState: ExecSpecificState,
  execSharedState: ExecSharedState
): JobTypeData => {
  switch (execSpecificState.job_type) {
    case ExecJobType.Local:
    case ExecJobType.SCSI:
    case ExecJobType.SMB:
    case ExecJobType.NFS: {
      const jobTypeData: JobTypeData = {
        ...execSpecificState,
        ...execSharedState
      };
      return jobTypeData;
    }
    case ExecJobType.VMFS: {
      const { virtualMachines, excludedVirtualMachines } =
        execSpecificState.virtualMachines.reduce(
          (acc, val) => {
            if (val.include) {
              acc.virtualMachines.push(val.vm);
            } else {
              acc.excludedVirtualMachines.push(val.vm);
            }
            return acc;
          },
          { virtualMachines: [], excludedVirtualMachines: [] } as {
            virtualMachines: Array<VirtualMachine>;
            excludedVirtualMachines: Array<VirtualMachine>;
          }
        );
      const jobTypeData: JobTypeData = {
        ...execSharedState,
        job_type: 'vmfs',
        virtual_machines: virtualMachines,
        excluded_virtual_machines: excludedVirtualMachines,
        list_of_targets: []
      };
      return jobTypeData;
    }
    default: {
      throw new Error(
        `Unknown job_type '${(execSpecificState as any).job_type}'`
      );
    }
  }
};

const newVirtualMachineState = (): VirtualMachineState => {
  const vmState: VirtualMachineState = {
    key: crypto.randomUUID(),
    include: true,
    variant: 'name',
    vm: {
      identifiers: {
        name: '',
        uuid: '',
        datastore_id: '',
        expect_at_least: 0
      },
      vm_options: {
        hostname: ''
      }
    },
    isOpen: true
  };
  return vmState;
};

const getStorageConnectorDisplayName = (
  storageConnector: string,
  storageConnectors: StorageConnectors
): string => {
  return storageConnectors.find((sc) => sc.name === storageConnector)!
    .displayName;
};

const policyDetailsList = (
  newPolicyState: NewPolicyState,
  storageConnectors: StorageConnectors
): Record<string, string | string[]> => {
  const output: Record<string, string | string[]> = {
    'Policy Name': newPolicyState.policyName,
    'Storage Connector': getStorageConnectorDisplayName(
      newPolicyState.storageConnector,
      storageConnectors
    ),
    'Email Addresses':
      newPolicyState.execSharedState?.List_of_email_addresses ?? [],
    'Only Scan': newPolicyState.execSharedState?.filter.include ?? [],
    'Do Not Scan': newPolicyState.execSharedState?.filter.exclude ?? []
  };
  if (newPolicyState.execSpecificState) {
    Object.entries(newPolicyState.execSpecificState).forEach(([key, value]) => {
      if (key === 'job_type') return;
      if (key === 'virtualMachines') return;
      if (key === 'btime_delta_start') return;
      output[getExecSpecificDisplayNameForKey(key as ExecFormKey)] = value;
    });
  }
  newPolicyState.policyDescription?.forEach(({ name, value }) => {
    if (Object.keys(output).includes(name)) {
      output[`Description ${name}`] = value;
    } else {
      output[getPolicyDescriptionDisplayNameForKey(name)] = value;
    }
  });

  return output;
};

const WeekdayFlags = {
  SUNDAY: 1,
  MONDAY: 2,
  TUESDAY: 4,
  WEDNESDAY: 8,
  THURSDAY: 16,
  FRIDAY: 32,
  SATURDAY: 64
} as const;

/* eslint-disable no-bitwise */
const getDaysBitmask = (days: Days): number => {
  let bitmask = 0;
  if (days.sunday) {
    bitmask |= WeekdayFlags.SUNDAY;
  }
  if (days.monday) {
    bitmask |= WeekdayFlags.MONDAY;
  }
  if (days.tuesday) {
    bitmask |= WeekdayFlags.TUESDAY;
  }
  if (days.wednesday) {
    bitmask |= WeekdayFlags.WEDNESDAY;
  }
  if (days.thursday) {
    bitmask |= WeekdayFlags.THURSDAY;
  }
  if (days.friday) {
    bitmask |= WeekdayFlags.FRIDAY;
  }
  if (days.saturday) {
    bitmask |= WeekdayFlags.SATURDAY;
  }
  return bitmask;
};

const getDaysFromBitmask = (bitmask: number): Days => {
  const days: Days = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  };
  if (bitmask & WeekdayFlags.SUNDAY) {
    days.sunday = true;
  }
  if (bitmask & WeekdayFlags.MONDAY) {
    days.monday = true;
  }
  if (bitmask & WeekdayFlags.TUESDAY) {
    days.tuesday = true;
  }
  if (bitmask & WeekdayFlags.WEDNESDAY) {
    days.wednesday = true;
  }
  if (bitmask & WeekdayFlags.THURSDAY) {
    days.thursday = true;
  }
  if (bitmask & WeekdayFlags.FRIDAY) {
    days.friday = true;
  }
  if (bitmask & WeekdayFlags.SATURDAY) {
    days.saturday = true;
  }
  return days;
};
/* eslint-enable no-bitwise */

const buildEditViewPolicyInitialState = (
  policyData: PolicyData,
  policyScheduleData?: PolicyScheduleData
): EditViewPolicyState => {
  let execSpecificState: ExecSpecificState;
  switch (policyData.job_type) {
    case 'local': {
      const execLocalState: ExecLocalState = {
        job_type: 'local',
        index_as: policyData.index_as!
      };
      execSpecificState = execLocalState;
      break;
    }
    case 'scsi': {
      const execScsiState: ExecSCSIState = {
        job_type: 'scsi',
        index_as: policyData.index_as!
      };
      execSpecificState = execScsiState;
      break;
    }
    case 'nfs': {
      const execNfsState: ExecNfsState = {
        job_type: 'nfs',
        index_as: policyData.index_as!,
        storage_cont_fmt: policyData.storage_cont_fmt!,
        btime_delta_start: policyData.btime_delta_start!
      };
      execSpecificState = execNfsState;
      break;
    }
    case ExecJobType.SMB: {
      const execSmbState: ExecSmbState = {
        job_type: ExecJobType.SMB,
        index_as: policyData.index_as!,
        storage_cont_fmt: policyData.storage_cont_fmt!,
        btime_delta_start: policyData.btime_delta_start!
      };
      execSpecificState = execSmbState;
      break;
    }
    case 'vmfs': {
      const vms: Array<VirtualMachineState> = [
        ...(policyData.virtual_machines?.map((vm) => {
          const vmState: VirtualMachineState = {
            variant: vm.identifiers.name !== '' ? 'name' : 'uuid',
            key: crypto.randomUUID(),
            include: true,
            vm,
            isOpen: false
          };
          return vmState;
        }) ?? []),
        ...(policyData.excluded_virtual_machines?.map((vm) => {
          const vmState: VirtualMachineState = {
            variant: vm.identifiers.name !== '' ? 'name' : 'uuid',
            key: crypto.randomUUID(),
            include: false,
            vm,
            isOpen: false
          };
          return vmState;
        }) ?? [])
      ];
      const execVmfsState: ExecVmfsState = {
        job_type: 'vmfs',
        virtualMachines: vms
      };
      execSpecificState = execVmfsState;
      break;
    }
    default: {
      throw new Error('Not Implemented Yet');
    }
  }

  const policySchedule: EditViewPolicyState['policySchedule'] = {
    scheduleEnabled: false,
    frequency: 'hourly',
    hourly: {
      hours: 1,
      mins: 0
    },
    daily: {
      days: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
      },
      hour: 0,
      min: 0
    }
  };
  if (policyScheduleData !== undefined) {
    policySchedule.scheduleId = policyScheduleData.schedid;
    switch (policyScheduleData.schedtype) {
      case ScheduleType.Hourly: {
        policySchedule.frequency = 'hourly';
        policySchedule.scheduleEnabled = true;
        policySchedule.hourly.mins = policyScheduleData.minutes;
        policySchedule.hourly.hours = policyScheduleData.repeat_interval;
        break;
      }
      // Daily and weekly schedules will be represented as 'weekly'
      case ScheduleType.Daily:
      case ScheduleType.Weekly: {
        policySchedule.frequency = 'daily';
        policySchedule.scheduleEnabled = true;
        policySchedule.daily.days = getDaysFromBitmask(
          policyScheduleData.weekday_flags
        );
        policySchedule.daily.hour = policyScheduleData.hour;
        policySchedule.daily.min = policyScheduleData.minutes;
        break;
      }
      default: {
        throw new Error('Unknown policy schedule type');
      }
    }
  }

  const output: EditViewPolicyState = {
    policyId: policyData.policy,
    loading: false,
    policyChanged: false,
    scheduleChanged: false,
    execSharedState: {
      List_of_email_addresses: policyData.List_of_email_addresses ?? [],
      filter: policyData.filter ?? {
        include: [],
        exclude: []
      }
    },
    execSpecificState,
    policyDisplayName: policyData.display_name,
    policySchedule
  };
  return output;
};

const buildPolicyScheduleData = (
  policySchedule: PolicySchedule
): ScheduleData => {
  switch (policySchedule.frequency) {
    case 'hourly': {
      return {
        schedtype: ScheduleType.Hourly,
        repeat_interval: policySchedule.hourly.hours,
        minutes: policySchedule.hourly.mins
      };
    }
    case 'daily': {
      return {
        schedtype: ScheduleType.Weekly, // It has to be weekly for the bitmask flags to work
        weekday_flags: getDaysBitmask(policySchedule.daily.days),
        hour: policySchedule.daily.hour,
        minutes: policySchedule.daily.min
      };
    }
    default: {
      throw new Error(`Unsupported schedule frequency`);
    }
  }
};

const buildEditStorageConnectorInitialState = (
  policyData: PolicyData,
  editStorageConnectorStepData: StorageConnectorStepResponse
): EditStorageConnectorState => {
  let execSpecificState: ExecSpecificState;
  switch (policyData.job_type) {
    case 'local': {
      const execLocalState: ExecLocalState = {
        job_type: 'local',
        index_as: policyData.index_as!
      };
      execSpecificState = execLocalState;
      break;
    }
    case 'scsi': {
      const execScsiState: ExecSCSIState = {
        job_type: 'scsi',
        index_as: policyData.index_as!
      };
      execSpecificState = execScsiState;
      break;
    }
    case 'nfs': {
      const execNfsState: ExecNfsState = {
        job_type: 'nfs',
        index_as: policyData.index_as!,
        storage_cont_fmt: policyData.storage_cont_fmt!,
        btime_delta_start: policyData.btime_delta_start!
      };
      execSpecificState = execNfsState;
      break;
    }
    case ExecJobType.SMB: {
      const execSmbState: ExecSmbState = {
        job_type: ExecJobType.SMB,
        index_as: policyData.index_as!,
        storage_cont_fmt: policyData.storage_cont_fmt!,
        btime_delta_start: policyData.btime_delta_start!
      };
      execSpecificState = execSmbState;
      break;
    }
    case 'vmfs': {
      const vms: Array<VirtualMachineState> = [
        ...(policyData.virtual_machines?.map((vm) => {
          const vmState: VirtualMachineState = {
            variant: vm.identifiers.name !== '' ? 'name' : 'uuid',
            key: crypto.randomUUID(),
            include: true,
            vm,
            isOpen: false
          };
          return vmState;
        }) ?? []),
        ...(policyData.excluded_virtual_machines?.map((vm) => {
          const vmState: VirtualMachineState = {
            variant: vm.identifiers.name !== '' ? 'name' : 'uuid',
            key: crypto.randomUUID(),
            include: false,
            vm,
            isOpen: false
          };
          return vmState;
        }) ?? [])
      ];
      const execVmfsState: ExecVmfsState = {
        job_type: 'vmfs',
        virtualMachines: vms
      };
      execSpecificState = execVmfsState;
      break;
    }
    default: {
      throw new Error('Not Implemented Yet');
    }
  }

  const output: EditStorageConnectorState = {
    step: 0,
    loading: false,
    noTemplateConfig: false,
    policyContext: policyData.policy_context,
    policyDescription: policyData.policy_description,
    execSpecificState,
    execSharedState: {
      List_of_email_addresses: policyData.List_of_email_addresses ?? [],
      filter: policyData.filter ?? {
        include: [],
        exclude: []
      }
    },
    modalTransitionState: {
      state: 'transition',
      open: false
    }
  };

  // If the template is not defined, policy_context is in its final form
  if (editStorageConnectorStepData.template === undefined) {
    // Enforce the required parts (descriptin, policy_context, job_type)
    if (editStorageConnectorStepData.description === undefined) {
      output.criticalError = new Error('Missing value "description"');
      return output;
    }
    if (editStorageConnectorStepData.policy_context === undefined) {
      output.criticalError = new Error('Missing value "policy_context"');
      return output;
    }
    if (editStorageConnectorStepData.job_type === undefined) {
      output.criticalError = new Error('Missing value "job_type"');
      return output;
    }
    output.policyContext = editStorageConnectorStepData.policy_context;
    output.policyDescription = editStorageConnectorStepData.description;
    output.noTemplateConfig = true; // We never got any templates
    output.jobType = editStorageConnectorStepData.job_type;
  } else {
    // Enforce the required parts (policy_context)
    if (editStorageConnectorStepData.policy_context === undefined) {
      output.criticalError = new Error('Missing value "policy_context"');
      return output;
    }
    const { jsonTemplateSchema, transitionMembers } = splitOffTransitionMembers(
      editStorageConnectorStepData.template
    );
    output.policyContext = editStorageConnectorStepData.policy_context;
    output.formError = editStorageConnectorStepData.error;
    output.template = jsonTemplateSchema;
    output.prepedTransitionModalSchema = transitionMembers?.[0]
    output.payload = buildMemberDataStructureFromTemplate(
      editStorageConnectorStepData.template
    );
  }
  return output;
};

const buildDetails = (
  description: PolicyDescription
): Record<string, string | string[]> => {
  return description.reduce(
    (acc, val) => {
      acc[getPolicyDescriptionDisplayNameForKey(val.name)] = val.value;
      return acc;
    },
    {} as Record<string, string | string[]>
  );
};

const scheduleIsValid = (policySchedule: PolicySchedule): boolean => {
  if (!policySchedule.scheduleEnabled) {
    return false;
  }
  if (
    policySchedule.frequency === 'daily' &&
    getDaysBitmask(policySchedule.daily.days) === 0
  ) {
    return false;
  }
  return true;
};

const formMembersIsValid = (
  template: JsonTemplateSchema,
  payload: MemberData
) => {
  for (let i = 0; i < template.members.length; i += 1) {
    const member = template.members[i];
    if (member.type === 'tabledictionary') {
      const value = payload[member.props.name] as
        | Record<string, any>
        | Array<Record<string, any>>;
      const isValid = tableDictionaryIsValid(
        value,
        member.props.multiSelect,
        member.props.required
      );
      if (!isValid) {
        return false;
      }
    }
  }
  return true;
};

/*
  The TransitionModal is technically a template member; however,
  it needs to live longer than the template in the event that the state machine
  advances to step 2 where the form renderer is no longer visibile.
  So we split off the transition modal and render it independent of the
  form renderer.
*/
type OmitType<T, U> = T extends { type: U } ? never : T;
type FormInputMember = OmitType<
  JsonTemplateSchema['members'][number],
  'transitionmodal'
>;

const splitOffTransitionMembers = (jsonTemplateSchema?: JsonTemplateSchema) => {
  if (jsonTemplateSchema === undefined) {
    return {} as const;
  }

  const formInputMembers = jsonTemplateSchema.members.filter(
    (member): member is FormInputMember => member.type !== 'transitionmodal'
  );
  const transitionMembers = jsonTemplateSchema.members.filter(
    (member): member is TransitionModalSchema =>
      member.type === 'transitionmodal'
  );

  return {
    jsonTemplateSchema: {
      ...jsonTemplateSchema,
      members: formInputMembers
    },
    transitionMembers
  } as const;
};

export {
  buildMemberDataStructureFromTemplate,
  buildExecSpecificFormData,
  buildExecSharedFormData,
  getExecSpecificDisplayNameForKey,
  transformExecStateIntoJobTypeData,
  newVirtualMachineState,
  policyDetailsList,
  buildEditViewPolicyInitialState,
  buildPolicyScheduleData,
  WeekdayFlags,
  getDaysBitmask,
  getDaysFromBitmask,
  buildEditStorageConnectorInitialState,
  buildDetails,
  scheduleIsValid,
  formMembersIsValid,
  splitOffTransitionMembers
};
