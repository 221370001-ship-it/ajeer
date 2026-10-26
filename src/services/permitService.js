import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db, firebaseConfig } from '../lib/firebase.js'

const COLLECTION_NAME = 'permitRecords'
const LOCAL_STORAGE_KEY = 'ajeer_permit_records'

const isFirebaseConfigured = Boolean(
  (firebaseConfig?.apiKey && firebaseConfig.apiKey !== 'YOUR_API_KEY') ||
  (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_API_KEY !== 'YOUR_API_KEY')
)

// Initial sample record based on authentic Ajeer HRS Permit
const INITIAL_DEMO_RECORDS = [
  {
    id: 'AJ-849201',
    employeeName: 'SADAM HUSSAIN SALEEM KHAN',
    employeeNameAr: 'صدام حسين سليم خان',
    status: 'active',
    permitStartDate: '2024-03-28',
    permitEndDate: '2025-03-28',
    facilityName: 'AL-KHALEEJ TRAINING AND EDUCATION COMPANY',
    facilityNameAr: 'شركة الخليج للتدريب والتعليم',
    facilityNumber: '7-512562',
    companyName: 'MADAEN STAR GROUP COMPANY',
    companyNameAr: 'شركة مجموعة نجوم المدائن',
    companyNumber: '6-1978637',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
]

function getLocalRecords() {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!data) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_DEMO_RECORDS))
    return INITIAL_DEMO_RECORDS
  }
  try {
    return JSON.parse(data)
  } catch {
    return INITIAL_DEMO_RECORDS
  }
}

function saveLocalRecords(records) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records))
}

// Create a new permit record
export async function createPermitRecord(data) {
  if (isFirebaseConfigured) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        employeeName: data.employeeName,
        employeeNameAr: data.employeeNameAr || '',
        status: data.status,
        permitStartDate: data.permitStartDate,
        permitEndDate: data.permitEndDate,
        facilityName: data.facilityName,
        facilityNameAr: data.facilityNameAr || '',
        facilityNumber: data.facilityNumber,
        companyName: data.companyName,
        companyNameAr: data.companyNameAr || '',
        companyNumber: data.companyNumber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    } catch (err) {
      console.warn('Firebase error, falling back to local storage:', err)
    }
  }

  // Local storage fallback
  const records = getLocalRecords()
  const newId = 'AJ-' + Math.floor(100000 + Math.random() * 900000)
  const newRecord = {
    id: newId,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  records.unshift(newRecord)
  saveLocalRecords(records)
  return newId
}

// Get a single permit record by ID
export async function getPermitRecord(permitId) {
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, COLLECTION_NAME, permitId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      }
    } catch (err) {
      console.warn('Firebase error, falling back to local storage:', err)
    }
  }

  const records = getLocalRecords()
  const match = records.find(r => r.id === permitId)
  return match || null
}

// Get all permit records
export async function getAllPermitRecords() {
  if (isFirebaseConfigured) {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      const records = []
      querySnapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() })
      })
      if (records.length > 0) return records
    } catch (err) {
      console.warn('Firebase error, falling back to local storage:', err)
    }
  }

  return getLocalRecords()
}

// Update a permit record
export async function updatePermitRecord(permitId, data) {
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, COLLECTION_NAME, permitId)
      await updateDoc(docRef, {
        employeeName: data.employeeName,
        employeeNameAr: data.employeeNameAr || '',
        status: data.status,
        permitStartDate: data.permitStartDate,
        permitEndDate: data.permitEndDate,
        facilityName: data.facilityName,
        facilityNameAr: data.facilityNameAr || '',
        facilityNumber: data.facilityNumber,
        companyName: data.companyName,
        companyNameAr: data.companyNameAr || '',
        companyNumber: data.companyNumber,
        updatedAt: serverTimestamp(),
      })
      return
    } catch (err) {
      console.warn('Firebase error, falling back to local storage:', err)
    }
  }

  const records = getLocalRecords()
  const idx = records.findIndex(r => r.id === permitId)
  if (idx !== -1) {
    records[idx] = {
      ...records[idx],
      ...data,
      updatedAt: new Date().toISOString(),
    }
    saveLocalRecords(records)
  }
}

// Delete a permit record
export async function deletePermitRecord(permitId) {
  if (isFirebaseConfigured) {
    try {
      const docRef = doc(db, COLLECTION_NAME, permitId)
      await deleteDoc(docRef)
      return
    } catch (err) {
      console.warn('Firebase error, falling back to local storage:', err)
    }
  }

  const records = getLocalRecords()
  const filtered = records.filter(r => r.id !== permitId)
  saveLocalRecords(filtered)
}
