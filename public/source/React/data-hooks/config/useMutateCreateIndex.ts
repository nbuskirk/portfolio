import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';

interface CreateIndexPayload {
  fedid: string;
  indexname: string;
}

interface CreateIndexResponse {
  indexid: number;
}

const createIndex = (sessionId: string) => (payload: CreateIndexPayload) =>
  API.post<CreateIndexResponse>(
    `/federations/${payload.fedid}/indexes`,
    {
      indexname: payload.indexname
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

const useMutateCreateIndex = ({ session }: Params) => {
  return useMutation({
    mutationFn: createIndex(session)
  });
};

export default useMutateCreateIndex;
