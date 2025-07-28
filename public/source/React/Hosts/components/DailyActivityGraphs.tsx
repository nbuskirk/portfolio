import useDailyActivity, {
  ActivityAlertLevel,
  Host
} from 'data-hooks/useDailyActivity';
import DailyThresholdGraph from './Graphs/DailyThresholdGraph';
import {
  dailyGraphConfig,
  DailyGraphConfigItem
} from '../utils/dailyGraphConfig';

interface DailyActivityGraphsProps {
  host?: Host;
}

interface DailyGraphDataItem extends DailyGraphConfigItem {
  key: string;
  enabled: boolean;
  data?: ActivityAlertLevel;
}

export const DailyActivityGraphs = ({
  host
}: DailyActivityGraphsProps): React.ReactNode[] => {
  const { getDailyActivity } = useDailyActivity(host);

  //  Return "empty shell" graphs until host is selected
  if (!host?.hostname) {
    return Object.keys(dailyGraphConfig).map((configKey) => {
      if (dailyGraphConfig[configKey].valueType === 'percent') {
        return (
          <DailyThresholdGraph
            id={0}
            key={configKey}
            name={dailyGraphConfig[configKey].name}
            valueType='percent'
            valueDecimalPlaces={2}
            minY={0}
            maxY={100}
            data={[]}
            enabled={false}
            host={undefined}
            activityType={dailyGraphConfig[configKey].activityType}
            tooltipText={dailyGraphConfig[configKey].tooltipText}
          />
        );
      }

      // If not percent, return empty count graph
      return (
        <DailyThresholdGraph
          id={0}
          host={undefined}
          key={configKey}
          name={dailyGraphConfig[configKey].name}
          minY={0}
          maxY={100}
          data={[]}
          enabled={false}
          activityType={dailyGraphConfig[configKey].activityType}
          tooltipText={dailyGraphConfig[configKey].tooltipText}
        />
      );
    });
  }

  // Assign graph data with associated labels and UI toggle settings
  const dailyGraphs: DailyGraphDataItem[] = [];
  if (getDailyActivity?.data?.activity_alert_levels) {
    Object.keys(dailyGraphConfig).forEach((configKey) => {
      const graphData = getDailyActivity?.data?.activity_alert_levels.find(
        (item: ActivityAlertLevel) =>
          item.activity_type === dailyGraphConfig[configKey].activityType
      );
      dailyGraphs.push({
        key: configKey,
        activityType: dailyGraphConfig[configKey].activityType,
        name: dailyGraphConfig[configKey].name,
        valueType: dailyGraphConfig[configKey].valueType,
        data: graphData,
        enabled: graphData?.enabled_state === 'enabled',
        tooltipText: dailyGraphConfig[configKey].tooltipText
      });
    });
  }

  // Return graphs
  return dailyGraphs.map((graph) => {
    if (graph.valueType === 'percent') {
      return (
        <DailyThresholdGraph
          id={graph.data?.id}
          host={host}
          activityType={graph.activityType}
          key={graph.key}
          name={graph.name}
          valueType='percent'
          valueDecimalPlaces={2}
          minY={0}
          maxY={100}
          enabled={graph.enabled}
          data={graph.data?.points || []}
          severityLevels={
            graph.data?.severity_levels || {
              critical: { enabled: false, value: 0 },
              high: { enabled: false, value: 0 },
              medium: { enabled: false, value: 0 },
              low: { enabled: false, value: 0 }
            }
          }
          tooltipText={graph.tooltipText}
        />
      );
    }

    // If not percent, it's a count graph
    return (
      <DailyThresholdGraph
        id={graph.data?.id}
        activityType={graph.activityType}
        key={graph.key}
        name={graph.name}
        enabled={graph.enabled}
        host={host}
        data={graph.data?.points || []}
        severityLevels={
          graph.data?.severity_levels || {
            critical: { enabled: false, value: 0 },
            high: { enabled: false, value: 0 },
            medium: { enabled: false, value: 0 },
            low: { enabled: false, value: 0 }
          }
        }
        tooltipText={graph.tooltipText}
      />
    );
  });
};
