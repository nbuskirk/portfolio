import { useMutation } from '@tanstack/react-query';
import {
  EVENT_DAILY_THRESHOLD,
  EVENT_DB_CORRUPTION,
  EVENT_INFECTION_FOUND,
  EVENT_THRESHOLD
} from 'constants/constants';
import { CLEAR_ALERT } from 'constants/queryKeys';
import { API } from 'utils/helpers/api';

export interface ClearEventPatchParam {
  type: string;
  fedid: string | undefined;
  indexid: number | undefined;
  payload: { clear: boolean; event_ids: string[] };
}

const typeEndpointMap: Map<string, string> = new Map([
  [EVENT_THRESHOLD, 'custom_threshold_events'],
  [EVENT_DAILY_THRESHOLD, 'daily_threshold_events'],
  [EVENT_INFECTION_FOUND, 'infection_found_events'],
  [EVENT_DB_CORRUPTION, 'database_corruption_events']
]);

interface Params {
  session: string;
}

const getURL = (
  type: string,
  fedid: string | undefined,
  indexid: number | undefined
) => {
  const endpoint = typeEndpointMap.get(type);
  return `/federations/${fedid}/indexes/${indexid}/events/${endpoint}`;
};

const useClearEvents = ({ session }: Params) => {
  return useMutation({
    mutationKey: [CLEAR_ALERT, session],
    mutationFn: (params: ClearEventPatchParam) => {
      const { type, fedid, indexid, payload } = params;
      return API.patch(getURL(type, fedid, indexid), payload, {
        headers: {
          sessionId: session
        }
      });
    }
  });
};

export default useClearEvents;
