import { useQuery } from '@tanstack/react-query';
import { LICENSES } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

interface LicensesResponse {
  license_components: Array<string>;
  license_engineid: string;
  license_list: Array<{
    inherited: boolean;
    license_components: Array<string>;
    license_ctime: number;
    license_expire_time: number;
    license_id: number;
    license_info: {
      feature_licenses?: {
        feature_license_count: number;
        feature_license_flags: Array<string>;
        feature_license_type: string;
      };
      license_type: string;
      system_licenses?: {
        domains: string;
        flags: Array<any>;
        limits: {
          bifs: number;
          cpumodel: number;
          cpus: number;
          disks: number;
          disksize: number;
          memory: number;
          tapes: number;
        };
        oem_entries: Array<any>;
      };
      query_licenses?: {
        flags: Array<any>;
        maxfullobj: number;
        maxmetaobj: number;
      };
    };
    license_install_time: number;
    license_invalid_bit: Array<any>;
    license_serial: string;
    license_sversion: string;
  }>;
  license_system: {
    domains: any;
    flags: Array<any>;
    limits: {
      bifs: number;
      cpumodel: number;
      cpus: number;
      disks: number;
      disksize: number;
      memory: number;
      tapes: number;
    };
    oem_entries: Array<any>;
  };
  license_term: boolean;
}

const getLicenses = (sessionId: string) => () =>
  API.get<LicensesResponse>('/licenses', {
    headers: {
      sessionId
    }
  }).then((res) => res.data);

interface Params {
  session: string;
}

const useLicenses = ({ session }: Params) => {
  return useQuery({
    queryKey: [LICENSES, session],
    queryFn: getLicenses(session)
  });
};

export default useLicenses;
