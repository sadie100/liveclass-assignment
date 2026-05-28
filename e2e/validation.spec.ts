// 평가 매핑: 1) 요구사항 - 유효성 검증 시점 / 3) 안정성 - 에러 표시
import { test, expect } from './fixtures'

test.beforeEach(async ({ page }) => {
  await page.goto('enroll')
  await page.getByRole('radio', { name: /풀스택 웹 개발/ }).click()
  await page.getByRole('radio', { name: '개인 신청' }).check()
  await page.getByRole('button', { name: '다음' }).click()
  await expect(page.getByRole('heading', { name: '수강생 정보를 입력해 주세요' })).toBeVisible()
})

test('필수 필드 미입력 시 다음으로 진행되지 않고 필드별 에러 메시지가 표시된다', async ({
  page,
}) => {
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

test('단체 신청 시 참가자 이메일이 중복되면 다음 단계로 진행되지 않고 중복된 행 모두에 에러가 표시된다', async ({
  page,
}) => {
  // 위 beforeEach가 폼을 dirty 상태로 만들어 draft가 저장되었을 수 있다.
  // /enroll 재진입 시 복원 다이얼로그가 뜨지 않도록 localStorage를 비워둔다.
  await page.evaluate(() => window.localStorage.clear())
  await page.goto('enroll')
  await page.getByRole('radio', { name: /풀스택 웹 개발/ }).click()
  await page.getByRole('radio', { name: '단체 신청' }).check()
  await page.getByRole('button', { name: '다음' }).click()

  await page.locator('#applicant-name').fill('홍길동')
  await page.locator('#applicant-email').fill('hong@example.com')
  await page.locator('#applicant-phone').fill('01012345678')
  await page.locator('#org-name').fill('라이브클래스')
  await page.locator('#contact-person').fill('01087654321')
  await page.locator('#head-count').fill('2')

  await page.locator('#participant-1-name').fill('참가자1')
  await page.locator('#participant-1-email').fill('dup@example.com')
  await page.locator('#participant-2-name').fill('참가자2')
  await page.locator('#participant-2-email').fill('dup@example.com')

  await page.getByRole('button', { name: '다음' }).click()

  // 다음 단계로 진행되지 않는다.
  await expect(page.getByRole('heading', { name: '수강생 정보를 입력해 주세요' })).toBeVisible()

  // 중복된 행에 에러가 표시된다.
  await expect(page.getByText('참가자 이메일이 중복됩니다')).toHaveCount(1)
})
