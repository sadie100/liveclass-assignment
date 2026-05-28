// 평가 매핑: 1) 요구사항 - 강의 정보 표시·카테고리 필터링 / 4) UI/UX - 3단계 수정 동선
import { test, expect } from './fixtures'

test('강의 카드에 제목·가격·일정·강사가 표시된다', async ({ page }) => {
  await page.goto('enroll')

  const card = page.getByRole('radio', { name: /풀스택 웹 개발/ })

  await expect(card.getByRole('heading', { name: '풀스택 웹 개발 부트캠프' })).toBeVisible()
  await expect(card).toContainText('₩450,000')
  await expect(card).toContainText('2026.06.01 - 2026.08.30')
  await expect(card).toContainText('김지훈 강사')
})

test('카테고리 탭을 전환하면 해당 카테고리 강의만 노출된다', async ({ page }) => {
  await page.goto('enroll')

  // 초기(전체): 개발/디자인 강의가 모두 보인다.
  await expect(page.getByRole('radio', { name: /풀스택 웹 개발/ })).toBeVisible()
  await expect(page.getByRole('radio', { name: /프로덕트 디자인 입문/ })).toBeVisible()

  // 디자인 탭 선택: 디자인 강의만 보이고 개발 강의는 사라진다.
  await page.getByRole('tab', { name: '디자인' }).click()
  await expect(page.getByRole('radio', { name: /프로덕트 디자인 입문/ })).toBeVisible()
  await expect(page.getByRole('radio', { name: /풀스택 웹 개발/ })).toHaveCount(0)

  // 개발 탭으로 다시 전환: 개발 강의가 다시 보인다.
  await page.getByRole('tab', { name: '개발' }).click()
  await expect(page.getByRole('radio', { name: /풀스택 웹 개발/ })).toBeVisible()
  await expect(page.getByRole('radio', { name: /프로덕트 디자인 입문/ })).toHaveCount(0)
})

test('3단계 "강의 변경" 클릭 시 1단계로, "정보 수정" 클릭 시 2단계로 이동하고 입력값이 유지된다', async ({
  page,
}) => {
  await page.goto('enroll')
  await page.getByRole('radio', { name: /풀스택 웹 개발/ }).click()
  await page.getByRole('radio', { name: '개인 신청' }).check()
  await page.getByRole('button', { name: '다음' }).click()

  await page.locator('#applicant-name').fill('홍길동')
  await page.locator('#applicant-email').fill('hong@example.com')
  await page.locator('#applicant-phone').fill('01012345678')
  await page.getByRole('button', { name: '다음' }).click()

  await expect(page.getByRole('heading', { name: '입력한 내용을 확인해 주세요' })).toBeVisible()

  // "강의 변경" → 1단계로 이동
  await page.getByRole('button', { name: '강의 변경' }).click()
  await expect(page.getByRole('heading', { name: '수강할 강의를 선택하세요' })).toBeVisible()

  // 다시 3단계로 진입: 입력값 유지 확인
  await page.getByRole('button', { name: '다음' }).click()
  await expect(page.locator('#applicant-name')).toHaveValue('홍길동')
  await page.getByRole('button', { name: '다음' }).click()
  await expect(page.getByRole('heading', { name: '입력한 내용을 확인해 주세요' })).toBeVisible()

  // "정보 수정" → 2단계로 이동, 입력값 유지
  await page.getByRole('button', { name: '정보 수정' }).click()
  await expect(page.getByRole('heading', { name: '수강생 정보를 입력해 주세요' })).toBeVisible()
  await expect(page.locator('#applicant-name')).toHaveValue('홍길동')
  await expect(page.locator('#applicant-email')).toHaveValue('hong@example.com')
})
