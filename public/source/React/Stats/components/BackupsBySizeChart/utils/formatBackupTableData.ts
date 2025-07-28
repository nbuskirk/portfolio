import { ScanStats } from 'data-hooks/stats/useStats';

type Input = Array<
  {
    date: number;
  } & Record<string, number>
>;

function combineObjectsByDate(arr: Input) {
  const result = arr.reduce((acc, value) => {
    const { date, ...rest } = value;
    const index = acc.findIndex((obj) => obj.date === date);
    if (index === -1) {
      acc.push(value);
      return acc;
    }
    Object.keys(rest).forEach((key) => {
      acc[index][key] =
        acc[index][key] !== undefined ? acc[index][key] + rest[key] : rest[key];
    });
    return acc;
  }, [] as Input);
  return result;
}

const formatBackupTableData = (data: ScanStats | undefined) => {
  if (!data) return [];

  const result = data.daily_total_new_changed_files_per_bkupctype.map(
    (item) => {
      return {
        date: item.date,
        [item.bclienttype]: item.nfiles_created_changed
      };
    }
  );
  result.forEach((obj) => {
    const newobj = obj;
    data.bkupctypes.forEach((type) => {
      if (!(type in obj)) {
        newobj[type] = 0;
      }
    });
  });
  return combineObjectsByDate(result);
};

export default formatBackupTableData;
