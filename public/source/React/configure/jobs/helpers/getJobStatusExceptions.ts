export function useJobStatusExceptions({ jobStatus }: { jobStatus: any }) {
  return jobStatus?.exceptions;
}

interface Exception {
  exceptionMsg: string;
  exceptionSeverity: 'warning' | 'failure';
}
function getException(exception: any): Exception {
  return {
    exceptionMsg: exception.message,
    exceptionSeverity: exception.severity
  };
}

export interface DirectoryNotFoundException extends Exception {
  directory: string;
}
export function getDirectoryNotFoundException(
  exception: any
): DirectoryNotFoundException {
  const { job_type_data: jobTypeData } = exception;
  return {
    ...getException(exception),
    directory: jobTypeData?.directory
  };
}

export interface NfsMountFailureException extends Exception {
  hostname: string;
  nfsPath: string;
}
export function getNfsMountFailureException(
  exception: any
): NfsMountFailureException {
  const { job_type_data: jobTypeData } = exception;
  return {
    ...getException(exception),
    hostname: jobTypeData?.hostname,
    nfsPath: jobTypeData?.nfs_path
  };
}

export interface VmfsNfsVolumeMountFailureException extends Exception {
  hostname: string;
  nfsPath: string;
}
export function getVmfsNfsVolumeMountFailureException(exception: any) {
  const { job_type_data: jobTypeData } = exception;
  return {
    ...getException(exception),
    hostname: jobTypeData?.hostname,
    nfsPath: jobTypeData?.nfs_path
  };
}

export interface Device {
  lunSerialNumber: string;
  partitionNumber: string;
  uuid: string;
}

export interface VmfsVolumeMountFailureException extends Exception {
  datastoreId: string;
  listOfDevices: Array<Device>;
}
export function getVmfsVolumeMountFailureException(
  exception: any
): VmfsVolumeMountFailureException {
  const { job_type_data: jobTypeData } = exception;
  const target = jobTypeData?.list_of_targets[0];
  const { datastore_id: datastoreId, vmfs_target_data: vmfsTargetData } = target;
  const { list_of_devices: listOfDevs } = vmfsTargetData;
  const listOfDevices: Array<Device> = [];
  listOfDevs.forEach((item: any) => {
    const dev = {
      lunSerialNumber: item.lun_serial_number,
      partitionNumber: item.partition_number,
      uuid: item.uuid
    };
    listOfDevices.push(dev);
  });
  return {
    ...getException(exception),
    datastoreId,
    listOfDevices
  };
}

export interface VmfsVolumeDeviceNotFoundException extends Exception {
  datastoreId: string;
  listOfDevices: Array<Device>;
}
export function getVmfsVolumeDeviceNotFoundException(
  exception: any
): VmfsVolumeDeviceNotFoundException {
  const { job_type_data: jobTypeData } = exception;
  const target = jobTypeData?.list_of_targets[0];
  const { datastore_id: datastoreId, vmfs_target_data: vmfsTargetData } =
    target;
  const { list_of_devices: listOfDevs } = vmfsTargetData;
  const listOfDevices: Array<Device> = [];
  listOfDevs.forEach((item: any) => {
    const dev = {
      lunSerialNumber: item.lun_serial_number,
      partitionNumber: item.partition_number,
      uuid: item.uuid
    };
    listOfDevices.push(dev);
  });
  return {
    ...getException(exception),
    datastoreId,
    listOfDevices
  };
}

export interface VmfsSpecNoMatchException extends Exception {
  name: string;
  uuid: string;
  datastoreId: string;
  expectAtLeast: number;
  expectAtMost: number | undefined;
}
export function getVmfsVmSpecNoMatchException(
  exception: any
): VmfsSpecNoMatchException {
  const { job_type_data: jobTypeData } = exception;
  const { virtual_machines: virtualMachines } = jobTypeData;
  const { identifiers: ids } = virtualMachines;
  return {
    ...getException(exception),
    name: ids.name,
    uuid: ids.uuid,
    datastoreId: ids?.datastore_id,
    expectAtLeast: ids?.expect_at_least,
    expectAtMost: ids?.expect_at_most
  };
}

export const isExceptionsNotEmpty = (exceptions: Array<any>) => {
  if (!exceptions) {
    return false;
  }
  return exceptions.length !== 0;
};

export interface ScsiDevice {
  lunSerialNumber: string;
  name: string;
}

export interface ScsiDeviceException extends Exception {
  listOfDevices: Array<ScsiDevice>;
}
export function getScsiDeviceException(exception: any): ScsiDeviceException {
  const { job_type_data: jobTypeData } = exception;
  const { volumes } = jobTypeData;
  const listOfDevices: Array<ScsiDevice> = [];
  volumes.forEach((item: any) => {
    const dev = {
      lunSerialNumber: item.lun_serial_number,
      name: item.name
    };
    listOfDevices.push(dev);
  });
  return {
    ...getException(exception),
    listOfDevices
  };
}
