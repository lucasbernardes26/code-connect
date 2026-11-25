import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { LoginPage } from './pages/LoginPage'

/** Root application router. */
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
