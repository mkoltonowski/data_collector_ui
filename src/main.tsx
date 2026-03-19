import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from "./page/App.tsx";
import ReactQueryProvider from "./providers/ReactQueryProvider.tsx";
import {ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./style/theme.ts";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ThemeProvider theme={theme}>
      <ReactQueryProvider>
          <CssBaseline/>
          <App />
      </ReactQueryProvider>
      </ThemeProvider>
  </StrictMode>,
)
