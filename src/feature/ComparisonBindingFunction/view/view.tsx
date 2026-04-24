// // AddComponent.tsx

// import React, { useState } from 'react';
// import {
//   compareCountingPrime,
//   compareComputingFibonacci,
//   ComparisonResult,
// } from '../model/compareFunctions';

// // ─── Formatter ────────────────────────────────────────────────────────────────

// function formatResult(label: string, result: ComparisonResult): string {
//   const { input, wasm, js } = result;

//   const speedDiff =
//     wasm.timeMs > 0 ? (js.timeMs / wasm.timeMs).toFixed(2) : '∞';

//   const faster = wasm.timeMs < js.timeMs ? 'WASM' : 'JS';

//   return `
// === ${label}(input: ${input.toLocaleString()}) Benchmark ===

// [WASM]
//   Result : ${wasm.result.toLocaleString()}
//   Time   : ${wasm.timeMs.toFixed(4)} ms

// [JS]
//   Result : ${js.result.toLocaleString()}
//   Time   : ${js.timeMs.toFixed(4)} ms

// [Summary]
//   ${faster} is faster — JS/WASM ratio: ${speedDiff}x
// `.trim();
// }

// // ─── Benchmark Panel (one per function) ──────────────────────────────────────

// interface BenchmarkPanelProps {
//   label: string;
//   inputLabel: string;
//   maxInput: number;
//   runFn: (input: number) => Promise<ComparisonResult> | ComparisonResult;
// }

// const BenchmarkPanel: React.FC<BenchmarkPanelProps> = ({
//   label,
//   inputLabel,
//   maxInput,
//   runFn,
// }) => {
//   const [input, setInput] = useState<number>(0);
//   const [result, setResult] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const handleRun = async () => {
//     setError(null);
//     setResult(null);
//     setLoading(true);
//     try {
//       const res = await runFn(input);
//       setResult(formatResult(label, res));
//     } catch (e: any) {
//       setError(e.message ?? 'Unknown error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h2>{label}</h2>
//       <label>
//         {inputLabel}:&nbsp;
//         <input
//           type="number"
//           value={input}
//           min={0}
//           max={maxInput}
//           onChange={(e) => setInput(Number(e.target.value))}
//         />
//       </label>
//       <span style={{ marginLeft: 8, fontSize: '0.85em', color: '#888' }}>
//         max: {maxInput.toLocaleString()}
//       </span>
//       <br />
//       <button onClick={handleRun} disabled={loading}>
//         {loading ? 'Running...' : 'Compare'}
//       </button>


//       {error && (
//         <pre style={{ color: 'red' }}>Error: {error}</pre>
//       )}
//       {result && (
//         <pre>{result}</pre>
//       )}
//     </div>
//   );
// };

// // ─── Main Component ───────────────────────────────────────────────────────────

// const ComparisionFunction: React.FC = () => {
//   return (
//     <div>
//       <h1>WASM vs JS Benchmark</h1>
//       <hr />

//       <BenchmarkPanel
//         label="Fibonacci"
//         inputLabel="n"
//         maxInput={45}
//         runFn={compareComputingFibonacci}
//       />

//       <hr />

//       <BenchmarkPanel
//         label="Count Primes"
//         inputLabel="limit"
//         maxInput={10_000_000}
//         runFn={compareCountingPrime}
//       />
//     </div>
//   );
// };

// export default ComparisionFunction;


// view.tsx

import React, { useState } from 'react';
import {
  compareCountingPrime,
  compareComputingFibonacci,
  ComparisonResult,
} from '../model/compareFunctions';
import DisplayChart from './chart';

// ─── Formatter ────────────────────────────────────────────────────────────────

function formatResult(label: string, result: ComparisonResult): string {
  const { input, wasm, js } = result;

  const speedDiff =
    wasm.timeMs > 0 ? (js.timeMs / wasm.timeMs).toFixed(2) : '∞';

  const faster = wasm.timeMs < js.timeMs ? 'WASM' : 'JS';

  return `
=== ${label}(input: ${input.toLocaleString()}) Benchmark ===

[WASM]
  Result : ${wasm.result.toLocaleString()}
  Time   : ${wasm.timeMs.toFixed(4)} ms

[JS]
  Result : ${js.result.toLocaleString()}
  Time   : ${js.timeMs.toFixed(4)} ms

[Summary]
  ${faster} is faster — JS/WASM ratio: ${speedDiff}x
`.trim();
}

// ─── Benchmark Panel ──────────────────────────────────────────────────────────

interface BenchmarkPanelProps {
  label: string;
  inputLabel: string;
  maxInput: number;
  chartInputs: number[];
  runFn: (input: number) => Promise<ComparisonResult> | ComparisonResult;
}

const BenchmarkPanel: React.FC<BenchmarkPanelProps> = ({
  label,
  inputLabel,
  maxInput,
  chartInputs,
  runFn,
}) => {
  const [input, setInput] = useState<number>(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);

  const handleRun = async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const res = await runFn(input);
      setResult(formatResult(label, res));
    } catch (e: any) {
      setError(e.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Adapt runFn to the shape DisplayChart expects
  const chartRunFn = (n: number) => {
    const res = runFn(n) as ComparisonResult;
    return {
      wasm: { timeMs: res.wasm.timeMs },
      js:   { timeMs: res.js.timeMs },
    };
  };

  return (
    <div>
      <h2>{label}</h2>
      <label>
        {inputLabel}:&nbsp;
        <input
          type="number"
              value={input}
          min={0}
          max={maxInput}
          onChange={(e) => setInput(Number(e.target.value))}
        />
      </label>
      <span style={{ marginLeft: 8, fontSize: '0.85em', color: '#888' }}>
        max: {maxInput.toLocaleString()}
      </span>
      <br />
      <br />

      <button onClick={handleRun} disabled={loading}>
        {loading ? 'Running...' : 'Compare'}
      </button>
      &nbsp;
      <button onClick={() => setShowChart((v) => !v)}>
        {showChart ? 'Hide Chart' : 'Show Chart'}
      </button>

      {error  && <pre style={{ color: 'red' }}>Error: {error}</pre>}
      {result && <pre>{result}</pre>}

      {showChart && (
        <DisplayChart
          label={label}
          inputs={chartInputs}
          runFn={chartRunFn}
        />
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const ComparisionFunction: React.FC = () => {
  return (
    <div>
      <h1>WASM vs JS Benchmark</h1>
      <hr />

      <BenchmarkPanel
        label="Fibonacci"
        inputLabel="n"
        maxInput={45}
        chartInputs={[10, 20, 25, 30, 35, 38, 40, 42, 45]}
        runFn={compareComputingFibonacci}
      />

      <hr />

      <BenchmarkPanel
        label="Count Primes"
        inputLabel="limit"
        maxInput={10_000_000}
        chartInputs={[100_000, 500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000]}
        runFn={compareCountingPrime}
      />
    </div>
  );
};

export default ComparisionFunction;
