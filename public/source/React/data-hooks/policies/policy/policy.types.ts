import {
  StorageContFmt,
  VirtualMachine
} from 'components/Policies/components/PolicyEditor/types';

export interface ExecSharedParams {
  List_of_email_addresses: Array<string>;
  filter: {
    include: Array<string>;
    exclude: Array<string>;
  };
}

export interface ExecLocalParams {
  job_type: 'local';
  index_as: string;
}

export interface ExecNfsParams {
  job_type: 'nfs';
  index_as: string;
  storage_cont_fmt: (typeof StorageContFmt)[number];
  btime_delta_start: number;
}

export interface ExecSmbParams {
  job_type: 'smb';
  index_as: string;
  storage_cont_fmt: (typeof StorageContFmt)[number];
  btime_delta_start: number;
}

export interface ExecVmfsParams {
  job_type: 'vmfs';
  virtual_machines: Array<VirtualMachine>;
  excluded_virtual_machines: Array<VirtualMachine>;
  list_of_targets: [];
}
export interface ExecSCSIParams {
  job_type: 'scsi';
  index_as: string;
}

export type JobTypeData = (
  | ExecLocalParams
  | ExecNfsParams
  | ExecVmfsParams
  | ExecSmbParams
  | ExecSCSIParams
) &
  ExecSharedParams;
