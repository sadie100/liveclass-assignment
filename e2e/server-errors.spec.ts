// 평가 매핑: 3) 안정성 - 서버 에러 코드 처리, 중복 제출 방지
import { test, expect } from './fixtures'

async function fillPersonal(page: import('@playwright/test').Page, email: string) {
  await page.locator('#applicant-name').fill('홍길동')
  await page.locator('#applicant-email').fill(email)
  await page.locator('#applicant-phone').fill('01012345678')
}

test('DUPLICATE_ENROLLMENT: 같은 강의·이메일로 두 번째 제출 시 에러 배너가 표시된다', async ({
  page,
}) => {
  const email = `dup-${Date.now()}@example.com`

  // 1회차 - 성공
  await page.goto('/enroll')
  await page.getByRole('radio', { name: /콘텐츠 마케팅 글쓰기/ }).click()
  await page.getByRole('radio', { name: '개인 신청' }).check()
  await page.getByRole('button', { name: '다음' }).click()
  await fillPersonal(page, email)
  await page.getByRole('button', { name: '다음' }).click()
  await page.getByRole('checkbox', { name: /이용약관/ }).check()
  await page.getByRole('button', { name: '신청 제출' }).click()
  await expect(page).toHaveURL(/\/enroll\/done$/)

  // 2회차 - 동일 강의·이메일로 재신청 → DUPLICATE_ENROLLMENT
  // MSW worker(enrolledSet)는 페이지 컨텍스트의 모듈 상태이므로 SPA 네비게이션으로 유지한다.
  // 전체 reload(page.goto)를 하면 worker가 재초기화되어 중복 판정이 풀린다.
  await page.getByRole('button', { name: '처음으로' }).click()
  await expect(page).toHaveURL(/\/enroll$/)
  await page.getByRole('radio', { name: /콘텐츠 마케팅 글쓰기/ }).click()
  await page.getByRole('radio', { name: '개인 신청' }).check()
  await page.getByRole('button', { name: '다음' }).click()
  await fillPersonal(page, email)
  await page.getByRole('button', { name: '다음' }).click()
  await page.getByRole('checkbox', { name: /이용약관/ }).check()
  await page.getByRole('button', { name: '신청 제출' }).click()

  const alert = page.getByRole('alert')
  await expect(alert).toBeVisible()
  await expect(alert).toContainText('이미 신청한 강의입니다.')
})

test('COURSE_FULL: 단체 신청 인원이 강의의 잔여 정원을 초과하면 에러 배너가 표시된다', async ({
  page,
}) => {
  // TypeScript 깊이 있게 다루기 (dev-002): 18/20 - 단체 3명 신청 시 21명이 되어 정원 초과
  await page.goto('/enroll')
  await page.getByRole('radio', { name: /TypeScript 깊이 있게/ }).click()
  await page.getByRole('radio', { name: '단체 신청' }).check()
  await page.getByRole('button', { name: '다음' }).click()

  await page.locator('#applicant-name').fill('홍길동')
  await page.locator('#applicant-email').fill(`full-${Date.now()}@example.com`)
  await page.locator('#applicant-phone').fill('01012345678')
  await page.locator('#org-name').fill('라이브클래스')
  await page.locator('#contact-person').fill('01087654321')
  await page.locator('#head-count').fill('3')

  await page.locator('#participant-1-name').fill('참가자1')
  await page.locator('#participant-1-email').fill(`p1-${Date.now()}@example.com`)
  await page.locator('#participant-2-name').fill('참가자2')
  await page.locator('#participant-2-email').fill(`p2-${Date.now()}@example.com`)
  await page.locator('#participant-3-name').fill('참가자3')
  await page.locator('#participant-3-email').fill(`p3-${Date.now()}@example.com`)

  await page.getByRole('button', { name: '다음' }).click()
  await page.getByRole('checkbox', { name: /이용약관/ }).check()
  await page.getByRole('button', { name: '신청 제출' }).click()

  const alert = page.getByRole('alert')
  await expect(alert).toBeVisible()
  await expect(alert).toContainText('선택한 강의의 정원이 초과되었습니다.')
})

test('중복 제출 방지: 제출 직후 버튼이 비활성화되어 추가 제출이 차단된다', async ({ page }) => {
  // MSW가 서비스워커에서 가로채므로 page.route로 카운트할 수 없다.
  // 대신 버튼이 즉시 disabled('제출 중...')로 전환되는지로 검증한다.
  await page.goto('/enroll')
  await page.getByRole('radio', { name: /백엔드 시스템 디자인/ }).click()
  await page.getByRole('radio', { name: '개인 신청' }).check()
  await page.getByRole('button', { name: '다음' }).click()
  await fillPersonal(page, `once-${Date.now()}@example.com`)
  await page.getByRole('button', { name: '다음' }).click()
  await page.getByRole('checkbox', { name: /이용약관/ }).check()

  const submit = page.getByRole('button', { name: '신청 제출' })
  await submit.click()

  // 제출 중 상태: 버튼 라벨이 바뀌고 disabled가 된다.
  await expect(page.getByRole('button', { name: '제출 중...' })).toBeDisabled()
  await expect(page).toHaveURL(/\/enroll\/done$/)
})
