import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { FileQuestion, Home } from 'lucide-react'

export default function NotFoundPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        color: '#64748b'
      }}>
        <FileQuestion size={40} />
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a2a3a', marginBottom: '12px' }}>
        404
      </h1>
      <p style={{ fontSize: '16px', color: '#64748b', marginBottom: '24px', maxWidth: '400px' }}>
        {t('notFound')}
      </p>
      <button 
        className="btn btn-primary"
        onClick={() => navigate('/')}
      >
        <Home size={16} />
        {t('backToDashboard')}
      </button>
    </div>
  )
}
