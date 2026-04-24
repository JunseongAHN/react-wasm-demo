// comparison.ts
// Compares WASM fibonacci vs pure JS fibonacci

import { BenchmarkResult, calculateBenchmarkFn } from './calculateData';
import {
  computeFibonacciCPP,
  computeFibonacciJS,
  countPrimeCPP,
  countPrimeJS,
} from '../algorithm/logic';

// Measures: result, execution time, and memory usage
export interface ComparisonResult {
  input: number;
  wasm: BenchmarkResult;
  js: BenchmarkResult;
}

function checkInputFibonacci(input: number): void {
  if (!Number.isInteger(input) || input < 0) {
    throw new Error('Input must be a non-negative integer.');
  }

  if (input > 45) {
    throw new Error(
      'Input too large (max 45). Recursive fibonacci above 45 may freeze the browser.'
    );
  }
}

export function compareComputingFibonacci(input: number): ComparisonResult {
  checkInputFibonacci(input);

  const wasmResult = calculateBenchmarkFn(() => computeFibonacciCPP(input));
  const jsResult = calculateBenchmarkFn(() => computeFibonacciJS(input));

  return {
    input,
    wasm: wasmResult,
    js: jsResult,
  };
}

function checkInputPrime(input: number): void {
  if (!Number.isInteger(input) || input < 0) {
    throw new Error('Input must be a non-negative integer.');
  }

  if (input > 100000000) {
    throw new Error(
      'Input too large (max 1,000,000). Recursive fibonacci above 45 may freeze the browser.'
    );
  }
}

export function compareCountingPrime(input: number): ComparisonResult {
  checkInputPrime(input);

  const wasmResult = calculateBenchmarkFn(() => countPrimeCPP(input));
  const jsResult = calculateBenchmarkFn(() => countPrimeJS(input));

  return {
    input,
    wasm: wasmResult,
    js: jsResult,
  };
}
