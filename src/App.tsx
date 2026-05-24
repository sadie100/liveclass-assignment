import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CourseListPage from '@/pages/CourseList'
import EnrollPage from '@/pages/Enroll'
import EnrollDonePage from '@/pages/EnrollDone'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CourseListPage />} />
        <Route path="/enroll/:courseId" element={<EnrollPage />} />
        <Route path="/enroll/:courseId/done" element={<EnrollDonePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
