import { Outlet } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Footer from '../components/Footer.jsx'
import FixedHelpIcon from '../components/FixedHelpIcon.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function PublicLayout() {
  const { dir, language } = useLanguage()

  return (
    <div dir={dir} lang={language} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
      <FixedHelpIcon />
    </div>
  )
}
