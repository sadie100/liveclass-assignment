// 평가 매핑: 1) 요구사항 - 개인 신청 골든패스 / 4) UI/UX - 스텝 전환·확인 화면·완료 화면
import { test, expect } from './fixtures'

test('개인 신청 골든패스: 강의 선택부터 완료 화면까지', async ({ page }) => {
  await page.goto('enroll')

  await page.getByRole('radio', { name: /풀스택 웹 개발/ }).click()
  await page.getByRole('radio', { name: '개인 신청' }).check()
  await page.getByRole('button', { name: '다음' }).click()

  await expect(page.getByRole('heading', { name: '수강생 정보를 입력해 주세요' })).toBeVisible()

  await page.locator('#applicant-name').fill('홍길동')
  await page.locator('#applicant-email').fill('hong@example.com')
  await page.locator('#applicant-phone').fill('01012345678')
  await page.locator('#applicant-motivation').fill('실전 풀스택 경험을 쌓고 싶습니다.')

  await page.getByRole('button', { name: '다음' }).click()

  await expect(page.getByRole('heading', { name: '입력한 내용을 확인해 주세요' })).toBeVisible()
  await expect(page.getByText('홍길동')).toBeVisible()
  await expect(page.getByText('hong@example.com')).toBeVisible()

  await page.getByRole('checkbox', { name: /이용약관/ }).check()
  await page.getByRole('button', { name: '신청 제출' }).click()

  await expect(page).toHaveURL(/\/enroll\/done$/)
  await expect(page.getByRole('heading', { name: '신청이 완료되었습니다' })).toBeVisible()
  await expect(page.getByText('신청 번호')).toBeVisible()
})
