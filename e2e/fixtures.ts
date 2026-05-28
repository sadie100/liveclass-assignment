// Playwright는 테스트별로 새 BrowserContext를 띄우므로 localStorage/cookies가 자동 격리된다.
// 별도 정리 로직 없이 표준 test/expect를 그대로 사용한다.
export { test, expect } from '@playwright/test'
