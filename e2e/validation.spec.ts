// 평가 매핑: 1) 요구사항 - 유효성 검증 시점 / 3) 안정성 - 에러 표시
import { test, expect } from './fixtures'

test.beforeEach(async ({ page }) => {
  await page.goto('/enroll')
  await page.getByRole('radio', { name: /풀스택 웹 개발/ }).click()
  await page.getByRole('radio', { name: '개인 신청' }).check()
  await page.getByRole('button', { name: '다음' }).click()
  await expect(page.getByRole('heading', { name: '수강생 정보를 입력해 주세요' })).toBeVisible()
})

test('필수 필드 미입력 시 다음으로 진행되지 않고 필드별 에러 메시지가 표시된다', async ({ page }) => {
  await page.getByRole('button', { name: '다음' }).click()

  await expect(page.getByText('이름은 2자 이상 입력해 주세요')).toBeVisible()
  await expect(page.getByText('올바른 이메일 형식이 아닙니다')).toBeVisible()
  await expect(page.getByText(/전화번호 9~11자리를 숫자만/)).toBeVisible()

  await expect(page.getByRole('heading', { name: '수강생 정보를 입력해 주세요' })).toBeVisible()
})

test('이메일 형식이 잘못되면 에러 메시지가 나타난다', async ({ page }) => {
  await page.locator('#applicant-name').fill('홍길동')
  await page.locator('#applicant-email').fill('not-an-email')
  await page.locator('#applicant-phone').fill('01012345678')
  await page.getByRole('button', { name: '다음' }).click()

  await expect(page.getByText('올바른 이메일 형식이 아닙니다')).toBeVisible()
})

test('이름이 1자면 길이 에러가 나타난다', async ({ page }) => {
  await page.locator('#applicant-name').fill('홍')
  await page.locator('#applicant-email').fill('hong@example.com')
  await page.locator('#applicant-phone').fill('01012345678')
  await page.getByRole('button', { name: '다음' }).click()

  await expect(page.getByText('이름은 2자 이상 입력해 주세요')).toBeVisible()
})
