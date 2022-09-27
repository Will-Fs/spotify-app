import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { displayUserInfo } from './App';
require("./imageSize");

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.body.onload = displayUserInfo;
