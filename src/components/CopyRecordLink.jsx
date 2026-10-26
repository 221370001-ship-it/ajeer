import { useState } from 'react'
import { Link } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function CopyRecordLink({ permitId }) {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const url = `${window.location.origin}/certificate/${permitId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <button 
        className={`copy-link-btn ${copied ? 'copied' : ''}`}
        onClick={handleCopy}
      >
        <span>{copied ? t('linkCopied') : t('copyPageLink')}</span>
        <Link size={20} />
      </button>
      {copied && (
        <div className="copy-toast">{t('linkCopied')}</div>
      )}
    </>
  )
}
