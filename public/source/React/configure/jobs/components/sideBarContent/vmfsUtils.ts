import {
  getVmfsNfsVolumeMountFailureException,
  getVmfsVolumeMountFailureException,
  getVmfsVolumeDeviceNotFoundException,
  getVmfsVmSpecNoMatchException
} from '../../helpers/getJobStatusExceptions';

export const getVmfsTargetsDevices = (listOfTargets: Array<any>) => {
  if (!listOfTargets) {
    return [];
  }
  let first = true;
  let count = 0;
  return listOfTargets.reduce((result: Array<any>, target: any) => {
    if (target.target_type === 'devices') {
      if (!first) {
        const deviceRow = {
          'id': (count += 1),
          'lunSerialNumber': undefined,
          'partitionNumber': undefined,
          'uuid': undefined,
          'datastoreId': undefined
        };
        result.push(deviceRow);
      } else {
        first = false;
      }
      const datastoreId = target.datastore_id;
      target.list_of_devices.forEach((device: any) => {
        const deviceRow = {
          'id': (count += 1),
          'lunSerialNumber': device.lun_serial_number,
          'partitionNumber': device.partition_number,
          'uuid': device.uuid,
          'datastoreId': datastoreId
        };
        result.push(deviceRow);
      });
    }
    return result;
  }, []);
};

export const getVmfsTargetsNfs = (listOfTargets: Array<any>) => {
  if (!listOfTargets) {
    return [];
  }
  return listOfTargets.reduce((results, target, index) => {
    if (target.target_type === 'nfs') {
      const datastoreId = target.datastore_id;
      const nfs = {
        'id': index,
        'hostname': target.nfs_export.hostname,
        'nfsPath': target.nfs_export.nfs_path,
        'datastoreId': datastoreId
      };
      results.push(nfs);
    }
    return results;
  }, []);
};

export const getVms = (vms: Array<any>) => {
  if (!vms) {
    return [];
  }
  return vms.map((vm, index) => {
    const vmRow: any = {
      'id': index,
      'name': vm.identifiers.name,
      'uuid': vm.identifiers.uuid,
      'datastoreId': vm.identifiers.datastore_id
    };
    const hostname = vm.options?.hostname;
    if (hostname) {
      vmRow.hostname = hostname;
    }
    return vmRow;
  });
};

export const getVmfsVmSpecNoMatchExceptions = (exceptions: Array<any>) => {
  if (!exceptions) {
    return [];
  }
  let count = 0;
  return exceptions
    .filter((exception) => exception.type === 'vmfs_vm_spec_no_match')
    .map((exception) => {
      const exceptionRow = getVmfsVmSpecNoMatchException(exception);
      const row = {
        'id': (count += 1),
        ...exceptionRow
      };
      return row;
    });
};

// vmfs_volume_device_not_found can be issued for a single device, but we don't assume it in the code
export const getVmfsVolumeDeviceNotFoundExceptions = (
  exceptions: Array<any>
) => {
  if (!exceptions) {
    return [];
  }
  let count = 0;
  return exceptions
    .filter((exception) => exception.type === 'vmfs_volume_device_not_found')
    .flatMap((exception) => {
      const exception2 = getVmfsVolumeDeviceNotFoundException(exception);
      const { exceptionMsg, exceptionSeverity, datastoreId, listOfDevices } =
        exception2;
      if (listOfDevices.length === 1) {
        const device = listOfDevices[0];
        const row = {
          'id': (count += 1),
          exceptionMsg,
          exceptionSeverity,
          datastoreId,
          ...device
        };
        return row;
      }
      // For multiple devices returned row with exception columns,
      // followed by rows with device columns
      const out: Array<any> = [];
      const row = {
        'id': (count += 1),
        exceptionMsg,
        exceptionSeverity,
        datastoreId
      };
      out.push(row);
      listOfDevices.forEach((item) => {
        const row2 = {
          'id': (count += 1),
          ...item
        };
        out.push(row2);
      });
      return out;
    });
};

export const getVmfsVolumeMountFailureExceptions = (exceptions: Array<any>) => {
  if (!exceptions) {
    return [];
  }
  let count = 0;
  return exceptions
    .filter((exception) => exception.type === 'vmfs_volume_mount_failure')
    .flatMap((exception) => {
      const exception2 = getVmfsVolumeMountFailureException(exception);
      const { exceptionMsg, exceptionSeverity, datastoreId, listOfDevices } =
        exception2;
      if (listOfDevices.length === 1) {
        const device = listOfDevices[0];
        const row = {
          'id': (count += 1),
          exceptionMsg,
          exceptionSeverity,
          datastoreId,
          ...device
        };
        return row;
      }
      // For multiple devices returned row with exception columns,
      // followed by rows with device columns
      const out: Array<any> = [];
      const row = {
        'id': (count += 1),
        exceptionMsg,
        exceptionSeverity,
        datastoreId
      };
      out.push(row);
      listOfDevices.forEach((item) => {
        const row2 = {
          'id': (count += 1),
          ...item
        };
        out.push(row2);
      });
      return out;
    });
};

export const getVmfsNfsVolumeMountFailureExceptions = (
  exceptions: Array<any>
) => {
  if (!exceptions) {
    return [];
  }
  let count = 0;
  return exceptions
    .filter((exception) => exception.type === 'vmfs_volume_mount_failure')
    .map((exception) => {
      const exception2 = getVmfsNfsVolumeMountFailureException(exception);
      const { exceptionMsg, exceptionSeverity, hostname, nfsPath } = exception2;
      const row = {
        'id': (count += 1),
        exceptionMsg,
        exceptionSeverity,
        hostname,
        nfsPath
      };
      return row;
    });
};
