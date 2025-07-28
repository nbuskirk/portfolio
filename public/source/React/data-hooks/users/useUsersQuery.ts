import { useQuery } from '@tanstack/react-query';
import { USERS } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

type Users = Array<User>;

interface User {
  active: number;
  adauth_usr: string;
  expires: number;
  id: number;
  isblocked: string;
  mustchange: boolean;
  role_id: number;
  username: string;
  usertype: number;
}

// This could use some typing
export const getUsers = (fedid: string) => () =>
  API.get<Users>(`/federations/${fedid}/users`, {}).then((res) => res.data);

export const getUsersQuery = (fedid?: string) =>
  ({
    queryKey: [USERS, fedid],
    refetchOnMount: 'always',
    queryFn: getUsers(fedid!),
    enabled: fedid !== undefined
  }) as const;

interface Params {
  fedid?: string;
}

const useUsersQuery = ({ fedid }: Params) => {
  return useQuery(getUsersQuery(fedid));
};

export default useUsersQuery;
