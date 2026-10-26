import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { getPermitRecord, updatePermitRecord } from '../services/permitService.js'
import { ArrowLeft, Save } from 'lucide-react'

export default function EditPermitPage() {
  const { permitId } = useParams()
  const { t } = useLanguage()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeNameAr: '',
    status: 'active',
    permitStartDate: '',
    permitEndDate: '',
    facilityName: '',
    facilityNameAr: '',
    facilityNumber: '',
    companyName: '',
    companyNameAr: '',
    companyNumber: '',
  })

  useEffect(() => {
    async function loadRecord() {
      try {
        const record = await getPermitRecord(permitId)
        if (record) {
          setFormData({
            employeeName: record.employeeName || '',
            employeeNameAr: record.employeeNameAr || '',
            status: record.status || 'active',
            permitStartDate: record.permitStartDate || '',
            permitEndDate: record.permitEndDate || '',
            facilityName: record.facilityName || '',
            facilityNameAr: record.facilityNameAr || '',
            facilityNumber: record.facilityNumber || '',
            companyName: record.companyName || '',
            companyNameAr: record.companyNameAr || '',
            companyNumber: record.companyNumber || '',
          })
        } else {
          showToast(t('notFound'), 'error')
        }
      } catch (err) {
        console.error('Error fetching record:', err)
        showToast(t('error'), 'error')
      } finally {
        setLoading(false)
      }
    }
    loadRecord()
  }, [permitId])

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.employeeName.trim()) newErrors.employeeName = t('required')
    if (!formData.permitStartDate) newErrors.permitStartDate = t('required')
    if (!formData.permitEndDate) newErrors.permitEndDate = t('required')
    if (!formData.facilityName.trim()) newErrors.facilityName = t('required')
    if (!formData.facilityNumber.trim()) newErrors.facilityNumber = t('required')
    if (!formData.companyName.trim()) newErrors.companyName = t('required')
    if (!formData.companyNumber.trim()) newErrors.companyNumber = t('required')

    if (formData.permitStartDate && formData.permitEndDate) {
      if (new Date(formData.permitEndDate) < new Date(formData.permitStartDate)) {
        newErrors.permitEndDate = t('invalidDate')
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    
    setSaving(true)
    try {
      await updatePermitRecord(permitId, formData)
      showToast(t('recordUpdated'))
      setTimeout(() => navigate('/admin'), 1200)
    } catch (err) {
      console.error('Error updating record:', err)
      showToast('Error updating record', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('loading')}</p>
      </div>
    )
  }

  return (
    <div className="form-container">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin')}>
          <ArrowLeft size={16} />
          {t('backToDashboard')}
        </button>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a2a3a' }}>
          {t('editPermit')}
        </h2>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Card 1: Certificate/Permit Information */}
        <div className="form-card">
          <h3 className="form-card-title">{t('certificateTitle')}</h3>

          <div className="form-group">
            <label className="form-label">{t('employeeName')}</label>
            <input
              type="text"
              className={`form-input ${errors.employeeName ? 'error' : ''}`}
              value={formData.employeeName}
              onChange={(e) => handleChange('employeeName', e.target.value)}
              placeholder="e.g. SADAM HUSSAIN SALEEM KHAN"
            />
            {errors.employeeName && <div className="form-error">{errors.employeeName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Employee Name (Arabic)</label>
            <input
              type="text"
              className="form-input"
              value={formData.employeeNameAr}
              onChange={(e) => handleChange('employeeNameAr', e.target.value)}
              placeholder="اسم الموظف بالعربي"
              dir="rtl"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('status')}</label>
            <select
              className="status-select"
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
            >
              <option value="active">{t('statusActive')}</option>
              <option value="inactive">{t('statusInactive')}</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('permitStartDate')}</label>
              <input
                type="date"
                className={`form-input ${errors.permitStartDate ? 'error' : ''}`}
                value={formData.permitStartDate}
                onChange={(e) => handleChange('permitStartDate', e.target.value)}
              />
              {errors.permitStartDate && <div className="form-error">{errors.permitStartDate}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">{t('permitEndDate')}</label>
              <input
                type="date"
                className={`form-input ${errors.permitEndDate ? 'error' : ''}`}
                value={formData.permitEndDate}
                onChange={(e) => handleChange('permitEndDate', e.target.value)}
              />
              {errors.permitEndDate && <div className="form-error">{errors.permitEndDate}</div>}
            </div>
          </div>
        </div>

        {/* Card 2: Beneficiary Facility */}
        <div className="form-card">
          <h3 className="form-card-title">{t('beneficiaryTitle')}</h3>

          <div className="form-group">
            <label className="form-label">{t('facilityName')}</label>
            <input
              type="text"
              className={`form-input ${errors.facilityName ? 'error' : ''}`}
              value={formData.facilityName}
              onChange={(e) => handleChange('facilityName', e.target.value)}
            />
            {errors.facilityName && <div className="form-error">{errors.facilityName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Facility Name (Arabic)</label>
            <input
              type="text"
              className="form-input"
              value={formData.facilityNameAr}
              onChange={(e) => handleChange('facilityNameAr', e.target.value)}
              dir="rtl"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('facilityNumber')}</label>
            <input
              type="text"
              className={`form-input ${errors.facilityNumber ? 'error' : ''}`}
              value={formData.facilityNumber}
              onChange={(e) => handleChange('facilityNumber', e.target.value)}
              placeholder="e.g. 7-512562"
            />
            {errors.facilityNumber && <div className="form-error">{errors.facilityNumber}</div>}
          </div>
        </div>

        {/* Card 3: Recruitment Company */}
        <div className="form-card">
          <h3 className="form-card-title">{t('recruitmentTitle')}</h3>

          <div className="form-group">
            <label className="form-label">{t('companyName')}</label>
            <input
              type="text"
              className={`form-input ${errors.companyName ? 'error' : ''}`}
              value={formData.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
            />
            {errors.companyName && <div className="form-error">{errors.companyName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Company Name (Arabic)</label>
            <input
              type="text"
              className="form-input"
              value={formData.companyNameAr}
              onChange={(e) => handleChange('companyNameAr', e.target.value)}
              dir="rtl"
            />
          </div>

          <div className="form-group">
            <label className="form-label">{t('companyNumber')}</label>
            <input
              type="text"
              className={`form-input ${errors.companyNumber ? 'error' : ''}`}
              value={formData.companyNumber}
              onChange={(e) => handleChange('companyNumber', e.target.value)}
              placeholder="e.g. 6-1978637"
            />
            {errors.companyNumber && <div className="form-error">{errors.companyNumber}</div>}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={() => navigate('/admin')}>
            {t('cancel')}
          </button>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            <Save size={16} />
            {saving ? t('loading') : t('updateRecord')}
          </button>
        </div>
      </form>
    </div>
  )
}
