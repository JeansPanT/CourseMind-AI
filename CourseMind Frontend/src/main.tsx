import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './context/ThemeProvider'; // ✅ Add this line

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>  {/* ✅ Wrap the App */}
      <App />
    </ThemeProvider>
  </StrictMode>
);
