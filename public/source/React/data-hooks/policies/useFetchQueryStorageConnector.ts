import { useQueryClient } from '@tanstack/react-query';
import { JsonTemplateSchema } from 'components/Policies/components/FormBuilder/schema.types';
import {
  ExecJobType,
  PolicyDescription
} from 'components/Policies/components/PolicyEditor/types';
import { STORAGE_CONNECTOR } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

interface StorageConnectorResponse {
  template?: JsonTemplateSchema;
  policy_context?: any;
  error?: {
    message: string;
  };
  description?: PolicyDescription;
  job_type?: ExecJobType;
}

const getStorageConnector = (params: Params) => () =>
  API.get<StorageConnectorResponse>(
    `/storage_connectors/${params.storageConnector}`,
    {
      headers: {
        sessionId: params.session
      },
      params: {
        display_name: params.display_name
      }
    }
  ).then((res) => res.data);

interface Params {
  session: string;
  storageConnector: string;
  display_name: string;
}

const useFetchQueryStorageConnector = () => {
  const queryClient = useQueryClient();
  return (params: Params) =>
    queryClient.fetchQuery({
      queryKey: [
        STORAGE_CONNECTOR,
        params.storageConnector,
        params.display_name
      ],
      queryFn: getStorageConnector(params)
    });
};

export default useFetchQueryStorageConnector;
