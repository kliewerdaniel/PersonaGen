// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated for React 18
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);