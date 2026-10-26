import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { getAllPermitRecords, deletePermitRecord } from '../services/permitService.js'
import { 
  Plus, Search, Eye, Pencil, Trash2, Copy, Share2, 
  FileText, CheckCircle, XCircle 
} from 'lucide-react'

export default function AdminDashboard() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [toast, setToast] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const data = await getAllPermitRecords()
      setRecords(data)
    } catch (err) {
      console.error('Error fetching records:', err)
      showToast('Error loading records', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleCopyLink = async (permitId) => {
    const url = `${window.location.origin}/certificate/${permitId}`
    try {
      await navigator.clipboard.writeText(url)
      showToast(t('linkCopied'))
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      showToast(t('linkCopied'))
    }
  }

  const handleShare = async (permitId, employeeName) => {
    const url = `${window.location.origin}/certificate/${permitId}`
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Ajeer HRS Permit',
          text: `Employee Permit Record: ${employeeName}`,
          url: url
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          handleCopyLink(permitId)
        }
      }
    } else {
      // WhatsApp fallback
      const message = encodeURIComponent(`Ajeer HRS Permit - ${employeeName}: ${url}`)
      window.open(`https://wa.me/?text=${message}`, '_blank')
    }
  }

  const handleDelete = async (permitId) => {
    try {
      await deletePermitRecord(permitId)
      setRecords(prev => prev.filter(r => r.id !== permitId))
      showToast(t('recordDeleted'))
    } catch (err) {
      console.error('Error deleting record:', err)
      showToast('Error deleting record', 'error')
    } finally {
      setDeleteConfirm(null)
    }
  }

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesSearch = searchTerm === '' || 
      (record.employeeName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.facilityName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (record.companyName || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || record.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalRecords = records.length
  const activeRecords = records.filter(r => r.status === 'active').length
  const inactiveRecords = records.filter(r => r.status === 'inactive').length

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>{t('loading')}</p>
      </div>
    )
  }

  return (
    <div className="admin-content">
      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>{toast.message}</div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-dialog">
            <h3>⚠️ Delete Record</h3>
            <p>{t('confirmDelete')}</p>
            <div className="confirm-actions">
              <button className="btn btn-outline" onClick={() => setDeleteConfirm(null)}>
                {t('cancel')}
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-value">{totalRecords}</div>
          <div className="stat-card-label">{t('totalRecords')}</div>
        </div>
        <div className="stat-card active">
          <div className="stat-card-value">{activeRecords}</div>
          <div className="stat-card-label">{t('activeRecords')}</div>
        </div>
        <div className="stat-card inactive">
          <div className="stat-card-value">{inactiveRecords}</div>
          <div className="stat-card-label">{t('inactiveRecords')}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#6c757d'
          }} />
          <input
            type="text"
            className="search-input"
            style={{ paddingLeft: '36px' }}
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <button 
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            {t('all')}
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            {t('active')}
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'inactive' ? 'active' : ''}`}
            onClick={() => setStatusFilter('inactive')}
          >
            {t('inactive')}
          </button>
        </div>

        <button className="btn btn-primary" onClick={() => navigate('/admin/permits/new')}>
          <Plus size={16} />
          {t('createNew')}
        </button>
      </div>

      {/* Records Table */}
      <div className="records-table-container">
        {filteredRecords.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <p>{t('noRecords')}</p>
          </div>
        ) : (
          <table className="records-table">
            <thead>
              <tr>
                <th>{t('employeeName').replace(':', '')}</th>
                <th>{t('status').replace(':', '')}</th>
                <th>{t('permitStartDate').replace(':', '')}</th>
                <th>{t('permitEndDate').replace(':', '')}</th>
                <th>{t('facilityName').replace(':', '')}</th>
                <th>{t('companyName').replace(':', '')}</th>
                <th>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map(record => (
                <tr key={record.id}>
                  <td><strong>{record.employeeName}</strong></td>
                  <td>
                    <span className={`table-status ${record.status}`}>
                      {record.status === 'active' ? t('statusActive') : t('statusInactive')}
                    </span>
                  </td>
                  <td>{record.permitStartDate || '—'}</td>
                  <td>{record.permitEndDate || '—'}</td>
                  <td>{record.facilityName || '—'}</td>
                  <td>{record.companyName || '—'}</td>
                  <td>
                    <div className="table-actions">
                      <button 
                        className="btn btn-icon btn-outline" 
                        title={t('view')}
                        onClick={() => window.open(`/certificate/${record.id}`, '_blank')}
                      >
                        <Eye size={14} />
                      </button>
                      <button 
                        className="btn btn-icon btn-outline" 
                        title={t('edit')}
                        onClick={() => navigate(`/admin/permits/${record.id}/edit`)}
                      >
                        <Pencil size={14} />
                      </button>
                      <button 
                        className="btn btn-icon btn-outline" 
                        title={t('copyLink')}
                        onClick={() => handleCopyLink(record.id)}
                      >
                        <Copy size={14} />
                      </button>
                      <button 
                        className="btn btn-icon btn-outline" 
                        title={t('share')}
                        onClick={() => handleShare(record.id, record.employeeName)}
                      >
                        <Share2 size={14} />
                      </button>
                      <button 
                        className="btn btn-icon btn-outline" 
                        title={t('delete')}
                        onClick={() => setDeleteConfirm(record.id)}
                        style={{ color: '#dc3545' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
