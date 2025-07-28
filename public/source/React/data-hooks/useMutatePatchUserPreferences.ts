import { API, baseURL } from 'utils/helpers/api';
import { useMutation } from '@tanstack/react-query';

interface UserPreferencesProps {
  fedid: string | undefined;
  id: number;
  payload: { name: string; value: string };
}

const patchUserPreferences = ({ fedid, id, payload }: UserPreferencesProps) =>
  API.patch(
    `${baseURL}/federations/${fedid}/users/${id}/preferences/${payload.name}`,
    payload
  );

const useMutatePatchUserPreferences = () => {
  return useMutation({
    mutationFn: patchUserPreferences
  });
};
export default useMutatePatchUserPreferences;
