import { GridColDef } from '@mui/x-data-grid-premium';
import { JobPhaseDurations } from 'data-hooks/policies/useJobs';

import { formatDuration } from 'utils/helpers/time';
import JobPhasesTableWorkloadCompleted from './JobPhasesTableWorkloadCompleted';

const columns: GridColDef[] = [
  {
    field: 'job_id',
    headerName: 'JOB ID',
    type: 'string',
    filterable: false,
    sortable: false,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    headerClassName: 'first-column-header',
    cellClassName: 'border-right',
    width: 80,
    editable: false,
    align: 'left',
    headerAlign: 'left'
  },
  {
    field: 'phase',
    headerName: 'PHASE',
    type: 'string',
    filterable: false,
    sortable: false,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    width: 155,
    editable: false,
    align: 'left',
    headerAlign: 'left',
    renderCell: (params) => {
      return params.row.job_phase_durations
        .map((phase: JobPhaseDurations) => phase.phase)
        .map((phase: string, index: number) => {
          // eslint-disable-next-line react/no-array-index-key
          return <div key={index}>{phase}</div>;
        });
    }
  },
  {
    field: 'duration',
    headerName: 'DURATION',
    type: 'number',
    filterable: false,
    sortable: false,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    cellClassName: 'border-right',
    width: 100,
    editable: false,
    align: 'left',
    headerAlign: 'left',
    renderCell: (params) => {
      return params.row.job_phase_durations
        .map((phase: JobPhaseDurations) => phase.duration)
        .map((duration: number, index: number) => {
          // eslint-disable-next-line react/no-array-index-key
          return <p key={index}>{formatDuration(duration)}</p>;
        });
    }
  },
  {
    field: 'workloadCompleted',
    headerName: 'Workload Completed',
    type: 'number',
    filterable: false,
    sortable: false,
    groupable: false,
    hideable: false,
    disableColumnMenu: true,
    flex: 1,
    editable: false,
    align: 'left',
    headerAlign: 'left',
    renderCell: (params) => {
      return (
        <JobPhasesTableWorkloadCompleted
          workloadCompleted={params.row.bscompleted_workload}
        />
      );
    }
  }
];

export default columns;
