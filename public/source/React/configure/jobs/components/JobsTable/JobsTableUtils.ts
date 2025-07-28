import { format } from 'date-fns';
import changeTimezone, { compDuration } from 'utils/helpers/timezone';

import { Job, PolicyInfo } from 'data-hooks/policies/useJobs';

import { getCurPhaseName, isTermJobState } from '../../helpers/getJobs';

const preprocessJobsInfo = (
  ieTimezone: string | undefined,
  ieTime: number,
  jobs: Job[],
  policies: PolicyInfo[]
) => {
  const policiesMap: Record<string, number> = {};
  if (policies) {
    policies.forEach((item) => {
      policiesMap[item.policy_name] = 1;
    });
  }
  // const curdt = new Date();
  // const curdtIeTz = changeTimezone(curdt, ieTimezone);
  const curtm = ieTime;
  let curtm2: number;
  if (!ieTime) {
    const curdt = new Date();
    const curdtIeTz = changeTimezone(curdt, ieTimezone);
    curtm2 = Math.floor(curdtIeTz.getTime() / 1000);
  }
  const newJobs = jobs.map((item, index) => {
    const newItem = JSON.parse(JSON.stringify(item));
    newItem.id = index;
    policiesMap[item.policy] = 1;
    newItem.current_phase = getCurPhaseName(item.job_phases);
    newItem.start_time_fmt = format(
      changeTimezone(new Date(item.start_time_unix * 1000), ieTimezone),
      'yyyy-MM-dd HH:mm:ss'
    );
    if (item.end_time_unix === 0 && isTermJobState(item.job_state)) {
      newItem.duration = 1;
    } else {
      newItem.duration = compDuration(
        curtm || curtm2,
        item.start_time_unix,
        item.end_time_unix
      );
    }
    return newItem;
  });
  return [newJobs, policiesMap] as const;
};

export default preprocessJobsInfo;
