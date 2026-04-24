import { getWasmInstance } from "../../../wasm/initalizeWASM";


export function countPrimeJS(limit: number): number {
  if (limit < 2) return 0;

  const sieve: boolean[] = new Array(limit).fill(true);
  let count = 0;

  for (let i = 2; i < limit; i++) {
      if (sieve[i]) {
          count++;
          for (let j = i * 2; j < limit; j += i) {
              sieve[j] = false;
          }
      }
  }

  return count;
}

    // Pure cpp fibonacci (same algorithm as C++)
    export function countPrimeCPP(n: number): number {
      const wasmModule = getWasmInstance();
      if (!wasmModule || typeof wasmModule.countPrime !== "function") {
        throw new Error("WASM module is not initialized or fibonacci is not bound.");
      }

      return wasmModule.countPrime(n);
    }

  // Pure JS fibonacci (same algorithm as C++)
export function computeFibonacciJS(n: number): number {
    if (n <= 1) return n;
    return computeFibonacciJS(n - 1) + computeFibonacciJS(n - 2);
  }

    // Pure cpp fibonacci (same algorithm as C++)
export function computeFibonacciCPP(n: number): number {
      const wasmModule = getWasmInstance();
      if (!wasmModule || typeof wasmModule.computeFibonacci !== "function") {
        throw new Error("WASM module is not initialized or fibonacci is not bound.");
      }

      return wasmModule.computeFibonacci(n);
    }