export interface BenchmarkResult {
  result: number;
  timeMs: number;
}

export function calculateBenchmarkFn(fn: () => number): BenchmarkResult {
  const start = performance.now();
  const result = fn();
  const timeMs = performance.now() - start;

  return { result, timeMs };
}
