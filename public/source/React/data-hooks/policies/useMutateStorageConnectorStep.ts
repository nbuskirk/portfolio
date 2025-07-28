import { useMutation } from '@tanstack/react-query';
import { JsonTemplateSchema } from 'components/Policies/components/FormBuilder/schema.types';
import {
  ExecJobType,
  PolicyDescription
} from 'components/Policies/components/PolicyEditor/types';
import { STORAGE_CONNECTOR_STEP } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

interface SubmitPayload {
  name: string;
  data?: Record<string, any>;
}

type Action = 'next' | 'back' | 'edit';

interface StorageConnectorStepParams {
  display_name: string;
  storageConnector: string;
  policyContext: Record<any, any>;
  payload?: SubmitPayload;
  action: Action;
}

interface StorageConnectorStepResponse {
  policy_context: any;
  template?: JsonTemplateSchema;
  error?: { message: string };
  description?: PolicyDescription;
  job_type?: ExecJobType;
}

const postStorageConnector =
  (sessionId: string) =>
  ({
    storageConnector,
    action,
    policyContext,
    payload,
    display_name
  }: StorageConnectorStepParams) =>
    API.post<StorageConnectorStepResponse>(
      `/storage_connectors/${storageConnector}`,
      {
        policy_context: policyContext,
        action,
        payload,
        display_name
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

const useMutateStorageConnectorStep = ({ session }: Params) => {
  return useMutation({
    mutationKey: [STORAGE_CONNECTOR_STEP, session],
    mutationFn: postStorageConnector(session)
  });
};

export default useMutateStorageConnectorStep;
