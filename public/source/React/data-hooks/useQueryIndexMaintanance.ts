import { useQuery } from '@tanstack/react-query';
import { INDEX_MAINTANANCE } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';
import { IEDate } from 'components/inc/inputDateHour/InputDateHour';

interface GetIndexMaintananceResponse {
  id: number;
  reclaimation_day: IEDate['day'];
  reclaimation_hour: number;
  schedid: number;
}

const getIndexMaintanance = () =>
  API.get<GetIndexMaintananceResponse>('/configurations/indexmaintenance').then(
    (res) => res.data
  );

export const queryIndexMaintanance = () =>
  ({
    queryKey: [INDEX_MAINTANANCE],
    queryFn: getIndexMaintanance
  }) as const;

const useQueryIndexMaintanance = () => {
  return useQuery(queryIndexMaintanance());
};

export default useQueryIndexMaintanance;
