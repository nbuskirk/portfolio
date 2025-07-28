import { Box } from '@mui/material';
import useQueryDailyThreshold from 'data-hooks/hosts/useQueryDailyThreshold';
import useConfigInfo from 'data-hooks/useConfigInfo';
import Loader from 'components/inc/loader';
import { Host } from 'data-hooks/useDailyActivity';
import DailyThresholdFormelements from './DailyThresholdFormElements';

interface Props {
  onSave?(): void;
  onCancel?(): void;
  host: Host;
  id?: number | null;
  activityType?: string;
}

const DailyThresholdForm = ({
  onSave,
  onCancel,
  host,
  id,
  activityType
}: Props) => {
  const { data: configInfo } = useConfigInfo();
  const { isFetching, isSuccess, data, dataUpdatedAt } = useQueryDailyThreshold(
    {
      fedId: configInfo?.fedid,
      indexId: configInfo?.indexid,
      thresholdId: id
    }
  );

  // If a daily threshold hasn't been created yet, start fresh and don't wait for load
  if (id === null) {
    return (
      <DailyThresholdFormelements
        onSave={onSave}
        onCancel={onCancel}
        activityType={activityType}
        host={host}
      />
    );
  }

  return (
    <Box>
      {isFetching && (
        <Loader
          sx={{
            minHeight: '400px',
            alignItems: 'center',
            display: 'flex'
          }}
        />
      )}
      {isSuccess && (
        <DailyThresholdFormelements
          id={id}
          host={host}
          onSave={onSave}
          onCancel={onCancel}
          dailyThresholdQueryData={data}
          key={dataUpdatedAt}
          activityType={activityType}
        />
      )}
    </Box>
  );
};

export default DailyThresholdForm;
