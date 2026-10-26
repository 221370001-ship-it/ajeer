import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { LogOut, LayoutDashboard } from 'lucide-react'

export default function AdminLayout() {
  const { logout } = useAuth()
  const { t, dir, language } = useLanguage()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="admin-container" dir={dir} lang={language}>
      <header className="admin-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LayoutDashboard size={22} />
          {t('dashboard')} - Ajeer HRS Permit
        </h1>
        <div className="admin-header-actions">
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>
            <LogOut size={16} />
            {t('logout')}
          </button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
