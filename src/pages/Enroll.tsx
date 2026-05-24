import { useParams } from 'react-router-dom'

export default function EnrollPage() {
  const { courseId } = useParams<{ courseId: string }>()
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold">수강 신청</h1>
      <p className="text-muted-foreground mt-2 text-sm">courseId: {courseId}</p>
    </main>
  )
}
