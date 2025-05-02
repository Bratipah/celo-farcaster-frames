import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip } from 'chart.js';
import { FC } from 'react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip);

type Props = {
  data: number[];
};

const ActivityChart: FC<Props> = ({ data }) => {
  const chartData = {
    labels: data.map((_, i) => `Day ${i + 1}`),
    datasets: [
      {
        label: 'Contributions',
        data,
        borderColor: '#4caf50',
        backgroundColor: '#81c784',
      },
    ],
  };

  return <Line data={chartData} />;
};

export default ActivityChart;
