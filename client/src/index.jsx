import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import App from './App.jsx'
import store from './redux/store.jsx'
import {setupResponseInterceptor} from './api/api.js'
import { Routes, Route, BrowserRouter } from "react-router";
import { PDFViewer } from '@react-pdf/renderer';
import { ThemeProvider } from './context/themeContext.jsx';

setupResponseInterceptor(store);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
  <StrictMode>
  <BrowserRouter>
  <ThemeProvider>
    <App />
  </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
  </Provider>
)
