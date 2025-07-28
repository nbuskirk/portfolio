import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';

export interface RegisterParams {
  type: 'register';
  hostname: string;
  otp: string;
  password: string;
  userid: string;
}

export interface DeregisterParams {
  type: 'deregister';
}

type PatchConfigurationsLicenseParams = RegisterParams | DeregisterParams;

const patchConfigurationsLicense =
  (sessionId: string) =>
  ({ type, ...rest }: PatchConfigurationsLicenseParams) =>
    API.patch(
      '/configurations/license',
      type === 'register'
        ? rest
        : {
            hostname: null
          },
      {
        headers: {
          sessionId
        }
      }
    ).then((res) => res.data);

interface Params {
  session: string;
}

const useMutateConfigurationsLicense = ({ session }: Params) => {
  return useMutation({
    mutationFn: patchConfigurationsLicense(session)
  });
};

export default useMutateConfigurationsLicense;
