import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';

interface PatchIndexMaintenance {
  id: number;
  reclaimation_day: string;
  reclaimation_hour: number;
  schedid: number;
}

const patchIndexMaintenance = (payload: PatchIndexMaintenance) =>
  API.patch('/configurations/indexmaintenance', payload).then(
    (res) => res.data
  );

const useMutatePatchIndexMaintenance = () => {
  return useMutation({
    mutationFn: patchIndexMaintenance
  });
};

export default useMutatePatchIndexMaintenance;
