import { getScsiDeviceException } from '../../helpers/getJobStatusExceptions';

export const getScsiVolumes = (volumes: Array<any>) => {
  if (!volumes) {
    return [];
  }
  let count = 0;
  const result: Array<any> = [];
  volumes.forEach((volume: any) => {
    const volumeRow = {
      'id': (count += 1),
      'lunSerialNumber': volume.lun_serial_number,
      'name': volume.name
    };
    result.push(volumeRow);
  });
  return result;
};

// scsi_device_not_found can be issued for a single device, but we don't assume it in the code,
// which reflects volumes array in the payload of POST command executing policy
export const getScsiDeviceNotFoundExceptions = (exceptions: Array<any>) => {
  if (!exceptions) {
    return [];
  }
  let count = 0;
  return exceptions
    .filter((exception) => exception.type === 'scsi_device_not_found')
    .flatMap((exception) => {
      const exception2 = getScsiDeviceException(exception);
      const { exceptionMsg, exceptionSeverity, listOfDevices } = exception2;
      if (listOfDevices.length === 1) {
        const device = listOfDevices[0];
        const row = {
          'id': (count += 1),
          exceptionMsg,
          exceptionSeverity,
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
        exceptionSeverity
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

// scsi_device_mount_failure can be issued for a single device, but we don't assume it in the code,
// which reflects volumes array in the payload of POST command executing policy
export const getScsiDeviceMountFailureExceptions = (exceptions: Array<any>) => {
  if (!exceptions) {
    return [];
  }
  let count = 0;
  return exceptions
    .filter((exception) => exception.type === 'scsi_device_mount_failure')
    .flatMap((exception) => {
      const exception2 = getScsiDeviceException(exception);
      const { exceptionMsg, exceptionSeverity, listOfDevices } = exception2;
      if (listOfDevices.length === 1) {
        const device = listOfDevices[0];
        const row = {
          'id': (count += 1),
          exceptionMsg,
          exceptionSeverity,
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
        exceptionSeverity
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

// scsi_device_duplicate_filesystem can be issued for a single device, but we don't assume it in the code,
// which reflects volumes array in the payload of POST command executing policy
export const getScsiDeviceDuplicateFilesystemExceptions = (
  exceptions: Array<any>
) => {
  if (!exceptions) {
    return [];
  }
  let count = 0;
  return exceptions
    .filter(
      (exception) => exception.type === 'scsi_device_duplicate_filesystem'
    )
    .flatMap((exception) => {
      const exception2 = getScsiDeviceException(exception);
      const { exceptionMsg, exceptionSeverity, listOfDevices } = exception2;
      if (listOfDevices.length === 1) {
        const device = listOfDevices[0];
        const row = {
          'id': (count += 1),
          exceptionMsg,
          exceptionSeverity,
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
        exceptionSeverity
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

// scsi_device_duplicate_volume can be issued for a single device, but we don't assume it in the code,
// which reflects volumes array in the payload of POST command executing policy
export const getScsiDeviceDuplicateVolumeExceptions = (
  exceptions: Array<any>
) => {
  if (!exceptions) {
    return [];
  }
  let count = 0;
  return exceptions
    .filter((exception) => exception.type === 'scsi_device_duplicate_volume')
    .flatMap((exception) => {
      const exception2 = getScsiDeviceException(exception);
      const { exceptionMsg, exceptionSeverity, listOfDevices } = exception2;
      if (listOfDevices.length === 1) {
        const device = listOfDevices[0];
        const row = {
          'id': (count += 1),
          exceptionMsg,
          exceptionSeverity,
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
        exceptionSeverity
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

// scsi_device_unsupported_device_type can be issued for a single device, but we don't assume it in the code,
// which reflects volumes array in the payload of POST command executing policy
export const getScsiDeviceUnsupportedDeviceTypeExceptions = (
  exceptions: Array<any>
) => {
  if (!exceptions) {
    return [];
  }
  let count = 0;
  return exceptions
    .filter(
      (exception) => exception.type === 'scsi_device_unsupported_device_type'
    )
    .flatMap((exception) => {
      const exception2 = getScsiDeviceException(exception);
      const { exceptionMsg, exceptionSeverity, listOfDevices } = exception2;
      if (listOfDevices.length === 1) {
        const device = listOfDevices[0];
        const row = {
          'id': (count += 1),
          exceptionMsg,
          exceptionSeverity,
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
        exceptionSeverity
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

// scsi_device_corrupted can be issued for a single device, but we don't assume it in the code,
// which reflects volumes array in the payload of POST command executing policy
export const getScsiDeviceCorruptedExceptions = (exceptions: Array<any>) => {
  if (!exceptions) {
    return [];
  }
  let count = 0;
  return exceptions
    .filter((exception) => exception.type === 'scsi_device_corrupted')
    .flatMap((exception) => {
      const exception2 = getScsiDeviceException(exception);
      const { exceptionMsg, exceptionSeverity, listOfDevices } = exception2;
      if (listOfDevices.length === 1) {
        const device = listOfDevices[0];
        const row = {
          'id': (count += 1),
          exceptionMsg,
          exceptionSeverity,
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
        exceptionSeverity
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

// scsi_device_filesystem_recovery_failure can be issued for a single device, but we don't assume it in the code,
// which reflects volumes array in the payload of POST command executing policy
export const getScsiDeviceFilesystemRecoveryFailureExceptions = (
  exceptions: Array<any>
) => {
  if (!exceptions) {
    return [];
  }
  let count = 0;
  return exceptions
    .filter(
      (exception) =>
        exception.type === 'scsi_device_filesystem_recovery_failure'
    )
    .flatMap((exception) => {
      const exception2 = getScsiDeviceException(exception);
      const { exceptionMsg, exceptionSeverity, listOfDevices } = exception2;
      if (listOfDevices.length === 1) {
        const device = listOfDevices[0];
        const row = {
          'id': (count += 1),
          exceptionMsg,
          exceptionSeverity,
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
        exceptionSeverity
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
