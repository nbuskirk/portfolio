import { API, baseURL } from 'utils/helpers/api';
import { useMutation } from '@tanstack/react-query';

interface UserPreferencesProps {
  fedid: string | undefined;
  id: number;
  payload: { name: string; value: string };
}

const postUserPreferences = ({ fedid, id, payload }: UserPreferencesProps) =>
  API.post(`${baseURL}/federations/${fedid}/users/${id}/preferences`, payload);

const useMutateUserPreferences = () => {
  return useMutation({
    mutationFn: postUserPreferences
  });
};
export default useMutateUserPreferences;
