// 평가 매핑: 1) 공통 요구사항 - 이전 단계 데이터 유지 / 선택 구현 - localStorage 임시 저장 복구
import { test, expect } from './fixtures'

test('스텝 이전/이후 이동 시 입력값이 유지된다', async ({ page }) => {
  await page.goto('enroll')
  await page.getByRole('radio', { name: /풀스택 웹 개발/ }).click()
  await page.getByRole('radio', { name: '개인 신청' }).check()
  await page.getByRole('button', { name: '다음' }).click()

  await page.locator('#applicant-name').fill('홍길동')
  await page.locator('#applicant-email').fill('hong@example.com')
  await page.locator('#applicant-phone').fill('01012345678')

  await page.getByRole('button', { name: '이전' }).click()
  await expect(page.getByRole('heading', { name: '수강할 강의를 선택하세요' })).toBeVisible()

  await page.getByRole('button', { name: '다음' }).click()
  await expect(page.locator('#applicant-name')).toHaveValue('홍길동')
  await expect(page.locator('#applicant-email')).toHaveValue('hong@example.com')
})

test('새로고침 후 임시저장 복구 다이얼로그에서 "이어서 작성"을 선택하면 입력값이 복원된다', async ({
  page,
}) => {
  await page.goto('enroll')
  await page.getByRole('radio', { name: /풀스택 웹 개발/ }).click()
  await page.getByRole('radio', { name: '개인 신청' }).check()
  await page.getByRole('button', { name: '다음' }).click()

  await page.locator('#applicant-name').fill('임시저장맨')
  await page.locator('#applicant-email').fill('draft@example.com')
  await page.locator('#applicant-phone').fill('01012345678')

  // 디바운스(400ms) 이후 localStorage에 기록되도록 충분히 대기
  await page.waitForTimeout(700)

  // beforeunload 가드가 켜져 있어도 Playwright는 reload를 강제 진행한다.
  await page.reload()

  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText('작성 중이던 데이터가 있습니다')

  await dialog.getByRole('button', { name: '이어서 작성' }).click()

  await expect(page.locator('#applicant-name')).toHaveValue('임시저장맨')
  await expect(page.locator('#applicant-email')).toHaveValue('draft@example.com')
})

test('"새로 시작"을 선택하면 임시저장 데이터가 삭제되고 빈 폼으로 시작한다', async ({ page }) => {
  await page.goto('enroll')
  await page.getByRole('radio', { name: /풀스택 웹 개발/ }).click()
  await page.getByRole('radio', { name: '개인 신청' }).check()
  await page.getByRole('button', { name: '다음' }).click()
  await page.locator('#applicant-name').fill('지울이름')
  await page.waitForTimeout(700)
  await page.reload()

  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: '새로 시작' }).click()

  await expect(page.getByRole('heading', { name: '수강할 강의를 선택하세요' })).toBeVisible()
  const draft = await page.evaluate(() => localStorage.getItem('enroll-draft:v1'))
  expect(draft).toBeNull()
})
