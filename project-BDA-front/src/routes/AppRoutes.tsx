import { Route, Routes } from 'react-router-dom'

import ProtectedRoute from '../components/ProtectedRoute'
import CrudPage from '../pages/CrudPage'
import LoginPage from '../pages/LoginPage'
import MonitoringPage from '../pages/MonitoringPage'
import RegisterPage from '../pages/RegisterPage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/manage"
        element={
          <ProtectedRoute>
            <CrudPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/monitor"
        element={
            <MonitoringPage />
        }
      />
    </Routes>
  )
}

export default AppRoutes
