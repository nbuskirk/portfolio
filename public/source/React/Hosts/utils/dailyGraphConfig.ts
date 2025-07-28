import { ThresholdGraphType } from '../components/Forms/types';

export interface DailyGraphConfigItem {
  name: string;
  activityType: string;
  valueType: ThresholdGraphType;
  tableName?: string;
  tooltipText?: string;
}

export interface DailyGraphConfig {
  [key: string]: DailyGraphConfigItem;
}

export const dailyGraphConfig: DailyGraphConfig = {
  /*
  // TODO: coming soon in IE-44738
  addedFilePercent: {
    name: 'Added Files Quantity',
    activityType: 'added_files_count' // TODO: check this in IE-44738
    tooltipText: 'ASK PM SOON',
  },
  addedFileCount: {
    name: 'Added Files Percent',
    activityType: 'added_files_percent', // TODO: check this in IE-44738
    tooltipText: 'ASK PM SOON',
  },
  */
  changedFilePercent: {
    name: 'Changed Files Percent',
    activityType: 'change_qty_percent',
    valueType: 'percent',
    tooltipText:
      'This graph focuses on the percentage of files that have been changed in the last 30 days on the selected host.'
  },
  changedFileCount: {
    name: 'Changed Files Quantity',
    activityType: 'change_qty_count',
    valueType: 'qty',
    tooltipText:
      'This graph focuses on the quantity of files that have been changed in the last 30 days on the selected host.'
  },
  changedFileTypePercent: {
    name: 'Changed File Type Percent',
    activityType: 'change_type_percent',
    valueType: 'percent',
    tooltipText:
      'This graph focuses on the percentage of files that exhibit a different file type based upon full content analysis in the last 30 days on the selected host.'
  },
  changedFileTypeCount: {
    name: 'Changed File Type Quantity',
    activityType: 'change_type_count',
    valueType: 'qty',
    tooltipText:
      'This graph focuses on the quantity of files that exhibit a different file type based upon full content analysis in the last 30 days on the selected host.'
  },
  deletedFilePercent: {
    name: 'Deleted Files Percent',
    activityType: 'deletion_percent',
    valueType: 'percent',
    tooltipText:
      'This graph focuses on the percentage of file deletions that have occurred in the last 30 days on the selected host.'
  },
  deletedFileQuantity: {
    name: 'Deleted Files Quantity',
    activityType: 'deletion_count',
    valueType: 'qty',
    tooltipText:
      'This graph focuses on the quantity of file deletions that have occurred in the last 30 days on the selected host.'
  },
  entropy: {
    name: 'Entropy Average',
    tableName: 'Entropy',
    activityType: 'entropy_average',
    valueType: 'percent',
    tooltipText:
      'This graph focuses on the average entropy of all the files on a host and represents the results of the scans over the last 30 days.'
  }
};

// used in table columns
export const thresholdTableTypeLookup = {
  addition: 'Added Files Percent', // custom // TODO: update to IE-44738
  addition_count: 'Added Files Quantity', // custom // TODO: update to IE-44738
  change_or_delete: dailyGraphConfig.changedFilePercent.name, // custom
  change_or_delete_count: dailyGraphConfig.changedFileCount.name, // custom
  change_qty_count: dailyGraphConfig.changedFileCount.name, // daily
  change_qty_percent: dailyGraphConfig.changedFilePercent.name, // daily
  change_type: dailyGraphConfig.changedFileTypePercent.name, // custom
  change_type_count: dailyGraphConfig.changedFileTypeCount.name, // custom, daily
  change_type_percent: dailyGraphConfig.changedFileTypePercent.name, // daily
  deletion: dailyGraphConfig.deletedFilePercent.name, // custom
  deletion_percent: dailyGraphConfig.deletedFilePercent.name, // daily
  deletion_count: dailyGraphConfig.deletedFileQuantity.name, // custom, daily
  entropy: dailyGraphConfig.entropy.tableName, // custom
  entropy_average: dailyGraphConfig.entropy.tableName // daily
};
