import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { DoodleProvider } from './context/DoodleContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DoodleProvider>
      <App />
    </DoodleProvider>
  </StrictMode>,
);
