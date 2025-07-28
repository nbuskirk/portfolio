import { useMutation } from '@tanstack/react-query';
import { API } from 'utils/helpers/api';

interface JobDefinitionsPayload {
  qjob: {
    email?: string;
    descript: string;
    format: string;
    formatstr: string;
    global: number;
    ie_index: {
      id: number | undefined;
      indexdb: string | undefined;
      tapedb: string | undefined;
    };
    qname: string;
  };
}

export const getJobDefinitionsPayload = (
  qname: string,
  indexdb: string | undefined,
  id: number | undefined,
  tapedb: string | undefined,
  format: string | null = null,
  formatstr: string | null = null
): JobDefinitionsPayload => {
  return {
    qjob: {
      email: '',
      descript: 'This job aims to locate malware-infected files',
      format: format || 'reports',
      formatstr: formatstr || '',
      global: 1,
      ie_index: {
        id,
        indexdb,
        tapedb
      },
      qname
    }
  };
};

const useJobDefinitions = (sessionId: string) => {
  return useMutation({
    mutationFn: (jobDefinitionsPayload: JobDefinitionsPayload) =>
      API.post('/queries/jobdefinitions', jobDefinitionsPayload, {
        headers: {
          sessionId
        }
      })
  });
};

export default useJobDefinitions;
export type { JobDefinitionsPayload };
