import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import html2pdf from 'html2pdf.js';

// Make html2pdf available globally for the PDF download functionality
(window as any).html2pdf = html2pdf;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);