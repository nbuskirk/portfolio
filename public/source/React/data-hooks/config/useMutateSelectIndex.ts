import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';

interface SelectIndexPayload {
  fedid: string;
  indexid: number;
}

interface SelectIndexResponse {}

const selectIndex = (sessionId: string) => (payload: SelectIndexPayload) =>
  API.patch<SelectIndexResponse>(
    `/federations/${payload.fedid}/indexes`,
    {
      index_id: payload.indexid
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

const useMutateSelectIndex = ({ session }: Params) => {
  return useMutation({
    mutationFn: selectIndex(session)
  });
};

export default useMutateSelectIndex;
