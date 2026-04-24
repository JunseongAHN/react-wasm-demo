// Declare a global variable to store the WASM instance
let wasmInstance: any = null;

declare global {
  interface Window {
    createModule: () => Promise<any>;
  }
}

// let moduleInstance: any = null; // cache the instance

export const initializeWASM = (): Promise<any> => {
  // Return cached instance if already initialized
  if (wasmInstance) {
    return Promise.resolve(wasmInstance);
  }

  return new Promise((resolve, reject) => {
    if (window.createModule) {
      window
        .createModule()
        .then((mod: any) => {
          wasmInstance = mod;
          resolve(wasmInstance);
        })
        .catch(reject);
      return;
    }

    const script = document.createElement('script');
    script.src = '/calc.js';
    script.onload = () => {
      window
        .createModule()
        .then((mod: any) => {
          wasmInstance = mod; // cache it
          resolve(wasmInstance);
        })
        .catch(reject);
    };
    script.onerror = () => reject(new Error('Failed to load calc.js'));
    document.body.appendChild(script);
  });
};

// export default initializeWASM;

// Export the WASM instance directly to use it elsewhere
export const getWasmInstance = (): any => wasmInstance;
