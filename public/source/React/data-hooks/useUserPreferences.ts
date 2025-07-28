import { useUser } from 'utils/context/UserContext';
import { USER_PREFERENCES } from 'constants/queryKeys';
import { useQueryClient } from '@tanstack/react-query';
import useConfigInfo from './useConfigInfo';
import useUsersQuery from './users/useUsersQuery';
import useQueryPreferences from './useQueryPreferences';
import useMutatePostUserPreferences from './useMutatePostUserPreferences';
import useMutatePatchUserPreferences from './useMutatePatchUserPreferences';

interface UserPreferencesProps {
  preferenceType: (typeof USER_PREFERENCES)[keyof typeof USER_PREFERENCES];
}

const useUserPreferences = ({ preferenceType }: UserPreferencesProps) => {
  const { user, session } = useUser();
  const configInfoQuery = useConfigInfo();
  const queryClient = useQueryClient();

  const usersQuery = useUsersQuery({
    fedid: configInfoQuery?.data?.fedid
  });

  const { id } = usersQuery.data?.find(
    (currentUser) => currentUser.username === user
  ) ?? { id: undefined };

  const userPreferencesQuery = useQueryPreferences({
    sessionid: session,
    fed_id: configInfoQuery?.data?.fedid,
    id
  });

  const { mutateAsync: postUserPreferences } = useMutatePostUserPreferences();
  const { mutateAsync: patchUserPreferences } = useMutatePatchUserPreferences();

  const setPreference = async (value: string) => {
    if (!usersQuery.isSuccess) {
      throw new Error('Error setting user preference - userQuery not loaded');
    }
    if (!configInfoQuery.isSuccess) {
      throw new Error(
        'Error setting user preference - configInfoQuery not loaded'
      );
    }
    if (!userPreferencesQuery.isSuccess) {
      throw new Error(
        'Error setting user preference - userPreferences not loaded'
      );
    }
    if (!id) {
      throw new Error('id not found');
    }
    const existingPreference = userPreferencesQuery.data.find(
      (pref) => pref.name === preferenceType
    );

    if (existingPreference === undefined) {
      return postUserPreferences({
        fedid: configInfoQuery.data.fedid,
        id,
        payload: {
          name: preferenceType.toString(),
          value
        }
      }).finally(() =>
        queryClient.invalidateQueries({ queryKey: [USER_PREFERENCES] })
      );
    }
    return patchUserPreferences({
      fedid: configInfoQuery.data.fedid,
      id,
      payload: {
        name: existingPreference.name,
        value
      }
    }).finally(() =>
      queryClient.invalidateQueries({ queryKey: [USER_PREFERENCES] })
    );
  };

  return {
    preference: userPreferencesQuery.data?.find(
      (pref) => pref.name === preferenceType
    ),
    setPreference,
    isLoading:
      usersQuery.isLoading ||
      userPreferencesQuery.isLoading ||
      configInfoQuery.isLoading,
    isFetching:
      usersQuery.isFetching ||
      userPreferencesQuery.isFetching ||
      configInfoQuery.isFetching
  } as const;
};

export default useUserPreferences;
