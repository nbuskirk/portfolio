import { Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

import Container from 'components/inc/container';

import { bytesToGiga } from 'utils/helpers/size';
import { useEffect, useState } from 'react';
import Loader from 'components/inc/loader';
import sx from './indexStorage.module.scss';
import IndexStorageLegend from './indexStorageLegend';

type IndexStorageProps = {
  name: string;
  value: number;
};

const IndexStorage = ({
  used,
  capacity
}: {
  used: number;
  capacity: number;
}) => {
  const theme = useTheme();

  const [indexChartData, setIndexChartData] = useState<IndexStorageProps[]>([]);
  useEffect(() => {
    if (capacity && used) {
      setIndexChartData([
        {
          'name': 'Available',
          'value': Number(bytesToGiga(capacity - used))
        },
        { 'name': 'Used', 'value': Number(bytesToGiga(used)) }
      ]);
    }
  }, [capacity, used]);

  const COLORS = [theme.palette.graph.g, theme.palette.graph.b];

  return (
    <Container className={sx.container__main}>
      <Stack padding='15px'>
        <Typography className={sx.typography__title}>Index Storage</Typography>
        <Stack alignItems='center'>
          {!(used && capacity) ? (
            <Loader sx={{ height: 275 }} />
          ) : (
            <PieChart width={250} height={300}>
              <Legend
                verticalAlign='bottom'
                align='right'
                content={<IndexStorageLegend used={used} capacity={capacity} />}
              />
              <Pie
                data={indexChartData}
                labelLine={false}
                startAngle={-270}
                outerRadius={70}
                innerRadius={50}
                dataKey='value'
              >
                {indexChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}-${entry.value}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              {/* TODO: Tooltip should appear similar to expanded chart tooltip */}
              <Tooltip />
            </PieChart>
          )}
        </Stack>
      </Stack>
    </Container>
  );
};

export default IndexStorage;
