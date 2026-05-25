export async function fetcher<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) {
    throw new Error(`API 요청 실패 (${res.status})`)
  }
  return res.json() as Promise<T>
}
