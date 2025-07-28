import { useQuery, useMutation } from '@tanstack/react-query';
import { THRESHOLDS } from 'constants/queryKeys';
import { API } from '../utils/helpers/api';

const useThresholds = (fedid, indexid, sessionId, visibility) => {
  // get
  const thresholdQuery = useQuery({
    queryKey: [THRESHOLDS, visibility],
    refetchOnMount: 'always',
    enabled: !!sessionId && !!fedid && !!indexid && visibility,
    queryFn: async () => {
      const data = await API.get(
        `/federations/${fedid}/indexes/${indexid}/thresholds`,
        {
          headers: {
            sessionId
          }
        }
      ).then((res) => res.data);
      return data;
    }
  });

  // post
  const postThreshold = useMutation({
    mutationFn: ({ payloadToPost }) => {
      return API.post(
        `/federations/${fedid}/indexes/${indexid}/thresholds`,
        payloadToPost,
        {
          headers: {
            sessionId
          }
        }
      ).then((response) => {
        if (response.status === 200) {
          thresholdQuery.refetch();
        }
      });
    }
  });

  // delete
  const deleteThreshold = useMutation({
    mutationFn: async ({ id }) => {
      await API.delete(
        `/federations/${fedid}/indexes/${indexid}/thresholds/${id}`,
        {
          headers: {
            sessionId
          }
        }
      ).then((response) => {
        if (response.status === 200) {
          thresholdQuery.refetch();
        }
      });
    }
  });

  // patch
  const patchThreshold = useMutation({
    mutationFn: ({ id, payloadToPatch }) => {
      return API.put(
        `/federations/${fedid}/indexes/${indexid}/thresholds/${id}`,
        payloadToPatch,
        {
          headers: {
            sessionId
          }
        }
      ).then((response) => {
        if (response.status === 200) {
          thresholdQuery.refetch();
        }
      });
    }
  });

  return {
    thresholdQuery,
    postThreshold,
    deleteThreshold,
    patchThreshold
  };
};

export default useThresholds;
