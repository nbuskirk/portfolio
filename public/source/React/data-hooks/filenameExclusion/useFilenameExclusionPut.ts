import { useMutation } from '@tanstack/react-query';
import useConfigInfo from 'data-hooks/useConfigInfo';
import { useUser } from 'utils/context/UserContext';
import { API } from 'utils/helpers/api';
import { useSnackbarContext } from 'components/Snackbar/SnackbarContext';

const useFilenameExclusionPut = () => {
  const { session } = useUser();
  const { data: configInfo } = useConfigInfo();
  const { showSuccessSnackbar } = useSnackbarContext();
  const fedid: string | undefined = configInfo?.fedid;
  const indexid: number | undefined = configInfo?.indexid;
  return useMutation({
    mutationKey: ['FILENAME_EXCLUSION_PATTERN_PATCH', session],
    mutationFn: (patterns: string[]) =>
      API.put(
        `federations/${fedid}/indexes/${indexid}/file_exclusion_patterns_list`,
        patterns,
        {
          headers: {
            sessionId: session
          }
        }
      ),
    onSuccess: () => {
      showSuccessSnackbar('Trusted filename patterns updated successfully');
    }
  });
};

export default useFilenameExclusionPut;
