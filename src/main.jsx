// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { GlobalProvider } from './hooks/useGlobalContext'; // joylashgan joyingizga qarab
import "./index.css"
ReactDOM.createRoot(document.getElementById('root')).render(
  <GlobalProvider>
    <App />
  </GlobalProvider>
);
