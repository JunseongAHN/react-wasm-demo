import "./index.css";
import App from "./App";
import { initializeWASM } from "./wasm/initalizeWASM";
import CreateDOM from 'react-dom/client';


const startApp = async () => {
  // Initialize WASM before rendering the app
  await initializeWASM();
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('Failed to find the root element');
  
  // Now render the App once WASM is initialized
  const root = CreateDOM.createRoot(rootElement);

  root.render(<App />);
};

// Start the app
startApp();