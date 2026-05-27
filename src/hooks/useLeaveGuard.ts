import { useEffect } from 'react'

const LEAVE_MESSAGE = '입력하신 내용이 사라질 수 있어요. 정말 페이지를 나가시겠어요?'

type Options = {
  enabled: boolean
}

export function useLeaveGuard({ enabled }: Options) {
  // 탭/창 닫기, 새로고침, 외부 URL 이동 시 브라우저 네이티브 확인 다이얼로그를 띄우기 위해 기본 동작을 방지한다.
  // confirm 다이얼로그는 브라우저 단에서 구현(beforeunload 스펙상 preventDefault가 호출되면 confirm 다이얼로그가 표시된다.)
  useEffect(() => {
    if (!enabled) return

    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault()
    }

    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [enabled])

  // 브라우저 뒤로가기/앞으로가기 차단
  // 더미 history entry를 하나 push해두고, popstate가 발생하면 confirm으로 이탈 의사 확인
  // 머무르기를 선택하면 더미를 다시 push해 자리를 복구한다.
  useEffect(() => {
    if (!enabled) return

    window.history.pushState(null, '', window.location.href)

    const onPopState = () => {
      const confirmed = window.confirm(LEAVE_MESSAGE)
      if (confirmed) {
        window.history.back()
      } else {
        window.history.pushState(null, '', window.location.href)
      }
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [enabled])
}
