import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import App from './App.jsx'
import store from './redux/store.jsx'
import { Routes, Route, BrowserRouter } from "react-router";
import { PDFViewer } from '@react-pdf/renderer';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <StrictMode>
    <App />
  </StrictMode>
  </Provider>
)
