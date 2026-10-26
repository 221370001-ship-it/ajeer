import { Routes, Route } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import PublicPermitPage from './pages/PublicPermitPage.jsx'
import AdminLoginPage from './pages/AdminLoginPage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import CreatePermitPage from './pages/CreatePermitPage.jsx'
import EditPermitPage from './pages/EditPermitPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <Routes>
      {/* Root displays Admin Login page first */}
      <Route path="/" element={<AdminLoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/permits/new" element={<CreatePermitPage />} />
          <Route path="/admin/permits/:permitId/edit" element={<EditPermitPage />} />
        </Route>
      </Route>

      {/* Public Permit Route */}
      <Route element={<PublicLayout />}>
        <Route path="/certificate/:permitId" element={<PublicPermitPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
