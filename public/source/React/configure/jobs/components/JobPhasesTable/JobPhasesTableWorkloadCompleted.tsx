import { BSCompletedWorkload } from 'data-hooks/policies/useJobs';
import { formatWorkloadCompleted } from './JobPhasesUtils';

interface Props {
  workloadCompleted?: Array<BSCompletedWorkload>;
}

interface WorkloadCompletedDisplay {
  label: string;
  count: number;
}

const JobPhasesTableWorkloadCompleted = ({ workloadCompleted }: Props) => {
  if (!workloadCompleted || !workloadCompleted.length) {
    return undefined;
  }

  const workloadCompletedFormatted = formatWorkloadCompleted(workloadCompleted);

  return workloadCompletedFormatted.map(
    (workloadCompletedFormattedItem: WorkloadCompletedDisplay) => {
      return (
        <div style={{ width: '250px' }}>
          <span>{workloadCompletedFormattedItem.label}</span>
          <span style={{ float: 'right' }}>
            {workloadCompletedFormattedItem.count}
          </span>
        </div>
      );
    }
  );
};

export default JobPhasesTableWorkloadCompleted;
