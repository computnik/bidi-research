import * as React from 'react'
import AppBar from '../components/appbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import theme from '../theme';
import { ThemeProvider } from '@mui/material/styles';

import Home from '../pages/home';
import NotFound from '../pages/not-found';


export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
