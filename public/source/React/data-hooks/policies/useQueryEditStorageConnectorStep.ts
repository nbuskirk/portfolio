import { useQuery } from '@tanstack/react-query';
import { JsonTemplateSchema } from 'components/Policies/components/FormBuilder/schema.types';
import {
  ExecJobType,
  PolicyDescription
} from 'components/Policies/components/PolicyEditor/types';
import { STORAGE_CONNECTOR_EDIT_STEP } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

export interface StorageConnectorStepResponse {
  policy_context: any;
  template?: JsonTemplateSchema;
  error?: { message: string };
  description?: PolicyDescription;
  job_type?: ExecJobType;
}

const queryStorageConnectorStep =
  (
    sessionId: string,
    storageConnector: string,
    policy_context: Record<any, any>,
    display_name: string
  ) =>
  () =>
    API.post<StorageConnectorStepResponse>(
      `/storage_connectors/${storageConnector}`,
      {
        policy_context,
        action: 'edit',
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
  storageConnector?: string;
  policyContext?: Record<any, any>;
  displayName?: string;
}

const useQueryEditStorageConnectorStep = ({
  session,
  storageConnector,
  policyContext,
  displayName
}: Params) => {
  return useQuery({
    queryKey: [
      STORAGE_CONNECTOR_EDIT_STEP,
      session,
      storageConnector,
      policyContext,
      displayName
    ],
    queryFn: queryStorageConnectorStep(
      session,
      storageConnector!,
      policyContext!,
      displayName!
    ),
    enabled:
      session !== '' &&
      storageConnector !== undefined &&
      policyContext !== undefined &&
      displayName !== undefined
  });
};

export default useQueryEditStorageConnectorStep;
