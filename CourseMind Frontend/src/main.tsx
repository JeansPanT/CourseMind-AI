import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeProvider'; // ✅ Add this line
import GlobalLoader from './components/GlobalLoader';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>  {/* ✅ Wrap the App */}
      <GlobalLoader>
        <App />
      </GlobalLoader>
    </ThemeProvider>
  </StrictMode>
);
