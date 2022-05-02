import * as React from 'react'
import AppBar from './components/appbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import theme from './theme'
import { ThemeProvider } from '@mui/material/styles'

import routes from './client-routes'

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <AppBar />
        <Routes>
          {routes.map((R, i) => (
            <Route key={`route-id-${i}`} path={R.path} element={<R.component />} />
          ))}
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
