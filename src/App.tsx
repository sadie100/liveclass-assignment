import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import EnrollPage from '@/pages/enroll/EnrollPage'
import EnrollDonePage from '@/pages/enroll/EnrollDonePage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/enroll" replace />} />
        <Route path="/enroll" element={<EnrollPage />} />
        <Route path="/enroll/done" element={<EnrollDonePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
