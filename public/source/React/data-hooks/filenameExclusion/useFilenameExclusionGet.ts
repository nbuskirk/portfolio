import { useQuery } from '@tanstack/react-query';
import useConfigInfo from 'data-hooks/useConfigInfo';
import { useUser } from 'utils/context/UserContext';
import { API } from 'utils/helpers/api';

type FilenameExclusionPattern = string[];

const useFilenameExclusionGet = () => {
  const { session } = useUser();
  const { data: configInfo } = useConfigInfo();
  const fedid: string | undefined = configInfo?.fedid;
  const indexid: number | undefined = configInfo?.indexid;
  return useQuery<FilenameExclusionPattern>({
    queryKey: ['FILENAME_EXCLUSION_PATTERN_GET', session],
    queryFn: async () => {
      const data = await API.get<FilenameExclusionPattern>(
        `federations/${fedid}/indexes/${indexid}/file_exclusion_patterns_list`,
        {
          headers: {
            sessionId: session
          }
        }
      ).then((res) => res.data);
      return data;
    },
    enabled: !!session && !!fedid && !!indexid
  });
};

export default useFilenameExclusionGet;
