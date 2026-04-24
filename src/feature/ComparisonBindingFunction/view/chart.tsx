// displayChart.tsx
// View only — all computation delegated to computeDataForChart.ts

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartPoint,
  RunFn,
  computeDataForChart,
} from '../model/calculateChartData';

interface DisplayChartProps {
  label: string;
  inputs: number[];
  runFn: RunFn;
}

const DisplayChart: React.FC<DisplayChartProps> = ({
  label,
  inputs,
  runFn,
}) => {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [running, setRunning] = useState(false);

  const handleRunChart = () => {
    setRunning(true);
    // setTimeout lets React re-render button state before blocking
    setTimeout(() => {
      setData(computeDataForChart(inputs, runFn));
      setRunning(false);
    }, 50);
  };

  return (
    <div>
      <button onClick={handleRunChart} disabled={running}>
        {running ? 'Benchmarking...' : 'Run Chart'}
      </button>

      {data.length > 0 && (
        <>
          <h4>{label} — Time (ms) vs Input</h4>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="n"
                label={{
                  value: 'input (n)',
                  position: 'insideBottom',
                  offset: -10,
                }}
              />
              <YAxis
                label={{
                  value: 'time (ms)',
                  angle: -90,
                  position: 'insideLeft',
                }}
              />
              <Tooltip
                formatter={(val) =>
                  typeof val === 'number' ? `${val} ms` : '-'
                }
              />{' '}
              <Legend verticalAlign="top" />
              <Line
                type="monotone"
                dataKey="wasm"
                stroke="#e05c00"
                dot
                name="WASM"
              />
              <Line
                type="monotone"
                dataKey="js"
                stroke="#0077cc"
                dot
                name="JS"
              />
            </LineChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
};

export default DisplayChart;
