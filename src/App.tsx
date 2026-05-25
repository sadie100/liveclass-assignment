import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import CourseListPage from '@/pages/courseList'
import EnrollPage from '@/pages/enroll'
import EnrollDonePage from '@/pages/enrollDone'

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
        <Route path="/" element={<CourseListPage />} />
        <Route path="/enroll/:courseId" element={<EnrollPage />} />
        <Route path="/enroll/:courseId/done" element={<EnrollDonePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
