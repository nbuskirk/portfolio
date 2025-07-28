import useSession from 'utils/hooks/useSession';
import { useJobStatus } from 'data-hooks/policies/useJobStatus';
import { Mtype } from 'data-hooks/policies/useJobs';
// import { mockNetworkError, mockTimeout } from '_mocks_/jobstatus_error';

import RenderSideBarContent from './renderSideBarContent';

interface Props {
  open: boolean;
  onClose: (event: object, reason: string) => void;
  data: { row: { job_id: number; mtype: string } };
}

const SideBarContent = ({ open, onClose, data }: Props): JSX.Element => {
  const { session } = useSession();

  const dataJobId = data ? data.row.job_id : 0;
  const mtype: Mtype | undefined = data ? (data.row.mtype as Mtype) : undefined;
  // mockNetworkError(mtype, dataJobId);
  const { error, data: jobStatus } = useJobStatus({
    session,
    dataJobId,
    mtype
  });

  const isCompleted = ['Done', 'Partial', 'Failed', 'Canceled'].includes(
    jobStatus?.state!
  );
  const isTotalBytesZero = jobStatus
    ? jobStatus.total_bytes_in_backups === 0
    : true;

  let sourceName: string | undefined;
  let sourcePath: string | undefined;
  switch (mtype) {
    case 'NFS Export':
      sourceName = 'NFS Export:';
      sourcePath = jobStatus?.nfs_export ?? '';
      break;
    case 'CIFS Share':
      sourceName = 'CIFS Share:';
      sourcePath = jobStatus?.cifs_share ?? '';
      break;
    case 'Local':
      sourceName = 'Directory:';
      sourcePath = jobStatus?.directory ?? '';
      break;
    default:
      sourceName = '';
      break;
  }

  const indexAsPath = jobStatus?.index_as_path;

  return (
    <RenderSideBarContent
      error={error}
      open={open}
      onClose={onClose}
      data={data}
      jobStatus={jobStatus}
      mtype={mtype}
      isCompleted={isCompleted}
      isTotalBytesZero={isTotalBytesZero}
      sourceName={sourceName}
      sourcePath={sourcePath}
      indexAsPath={indexAsPath}
    />
  );
};

export default SideBarContent;
