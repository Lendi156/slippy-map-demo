import React from 'react'
import App from './App.jsx'
import './index.css'
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  BrowserRouter
} from "react-router-dom";
import { createRoot } from 'react-dom/client'

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);