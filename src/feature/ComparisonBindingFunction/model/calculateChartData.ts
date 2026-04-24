// computeDataForChart.ts
// Pure computation — no React, no JSX, no side effects

export interface ChartPoint {
  n: string;        // formatted for display on x-axis
  wasm: number;     // timeMs
  js: number;       // timeMs
}

export type RunFn = (n: number) => {
  wasm: { timeMs: number };
  js: { timeMs: number };
};

export function computeDataForChart(inputs: number[], runFn: RunFn): ChartPoint[] {
  return inputs.map((n) => {
    const res = runFn(n);
    return {
      n:    n.toLocaleString(),
      wasm: parseFloat(res.wasm.timeMs.toFixed(4)),
      js:   parseFloat(res.js.timeMs.toFixed(4)),
    };
  });
}
