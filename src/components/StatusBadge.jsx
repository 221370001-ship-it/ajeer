import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function StatusBadge({ status }) {
  const { t } = useLanguage()
  const isActive = status === 'active'
  
  return (
    <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
      {isActive ? t('statusActive') : t('statusInactive')}
    </span>
  )
}
