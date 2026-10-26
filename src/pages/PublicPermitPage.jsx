import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PermitCard from '../components/PermitCard.jsx'
import CopyRecordLink from '../components/CopyRecordLink.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { getPermitRecord, getAllPermitRecords } from '../services/permitService.js'

export default function PublicPermitPage() {
  const { permitId } = useParams()
  const { t } = useLanguage()
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchRecord() {
      if (!permitId) {
        try {
          const all = await getAllPermitRecords()
          if (all && all.length > 0) {
            setRecord(all[0])
            setLoading(false)
            return
          }
        } catch {
          // ignore
        }
        setLoading(false)
        setError('no-id')
        return
      }
      try {
        const data = await getPermitRecord(permitId)
        if (data) {
          setRecord(data)
        } else {
          setError('not-found')
        }
      } catch (err) {
        console.error('Error fetching record:', err)
        setError('error')
      } finally {
        setLoading(false)
      }
    }
    fetchRecord()
  }, [permitId])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('loading')}</p>
      </div>
    )
  }

  if (error === 'no-id') {
    return (
      <div className="error-container">
        <h2>Ajeer HRS Permit</h2>
        <p>Please use a valid permit link to view record details.</p>
      </div>
    )
  }

  if (error === 'not-found') {
    return (
      <div className="error-container">
        <h2>{t('notFound')}</h2>
        <p>The permit record you are looking for does not exist or has been removed.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>{t('error')}</h2>
        <p>Something went wrong while loading this record. Please try again later.</p>
      </div>
    )
  }

  const activeId = record?.id || permitId

  return (
    <div className="page-main-container">
      <div className="permit-content">
        <h1 className="page-title">{t('pageTitle')}</h1>
        
        {/* Card 1: Certificate / Permit Information */}
        <PermitCard type="certificate" data={record} />

        {/* Card 2: Beneficiary Facility */}
        <PermitCard type="facility" data={record} />

        {/* Card 3: Recruitment Company */}
        <PermitCard type="company" data={record} />

        {/* Copy Page Link Button */}
        <div className="copy-link-container">
          <CopyRecordLink permitId={activeId} />
        </div>
      </div>
    </div>
  )
}
