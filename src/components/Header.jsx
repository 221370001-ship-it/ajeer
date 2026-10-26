import { useLanguage } from '../i18n/LanguageContext.jsx'
import { Languages } from 'lucide-react'

export default function Header() {
  const { toggleLanguage, t } = useLanguage()

  return (
    <header className="header" dir="ltr">
      <div className="header-logo">
        <img src="/assets/ajeer-header-logo.png" alt="Ajeer" />
      </div>
      <button className="language-switcher" onClick={toggleLanguage} type="button">
        <Languages size={16} />
        <span>{t('headerLang')}</span>
      </button>
    </header>
  )
}
