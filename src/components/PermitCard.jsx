import StatusBadge from './StatusBadge.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

export default function PermitCard({ type, data }) {
  const { t, language } = useLanguage()

  if (type === 'certificate') {
    return (
      <div className="permit-card">
        <h2 className="permit-card-title">{t('certificateTitle')}</h2>
        
        <div className="permit-field">
          <div className="permit-field-label">{t('employeeName')}</div>
          <div className="permit-field-value">
            {language === 'ar' && data.employeeNameAr ? data.employeeNameAr : data.employeeName}
          </div>
        </div>

        <div className="permit-field">
          <div className="permit-field-label">{t('status')}</div>
          <StatusBadge status={data.status} />
        </div>

        <div className="permit-field">
          <div className="permit-field-label">{t('permitStartDate')}</div>
          <div className="permit-field-value">{data.permitStartDate || '—'}</div>
        </div>

        <div className="permit-field">
          <div className="permit-field-label">{t('permitEndDate')}</div>
          <div className="permit-field-value">{data.permitEndDate || '—'}</div>
        </div>
      </div>
    )
  }

  if (type === 'facility') {
    return (
      <div className="permit-card">
        <h2 className="permit-card-title">{t('beneficiaryTitle')}</h2>
        
        <div className="permit-field">
          <div className="permit-field-label">{t('facilityName')}</div>
          <div className="permit-field-value">
            {language === 'ar' && data.facilityNameAr ? data.facilityNameAr : data.facilityName}
          </div>
        </div>

        <div className="permit-field">
          <div className="permit-field-label">{t('facilityNumber')}</div>
          <div className="permit-field-value">{data.facilityNumber || '—'}</div>
        </div>
      </div>
    )
  }

  if (type === 'company') {
    return (
      <div className="permit-card">
        <h2 className="permit-card-title">{t('recruitmentTitle')}</h2>
        
        <div className="permit-field">
          <div className="permit-field-label">{t('companyName')}</div>
          <div className="permit-field-value">
            {language === 'ar' && data.companyNameAr ? data.companyNameAr : data.companyName}
          </div>
        </div>

        <div className="permit-field">
          <div className="permit-field-label">{t('companyNumber')}</div>
          <div className="permit-field-value">{data.companyNumber || '—'}</div>
        </div>
      </div>
    )
  }

  return null
}
