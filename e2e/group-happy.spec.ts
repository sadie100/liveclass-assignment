// 평가 매핑: 1) 요구사항 - 단체 신청 조건부 필드 / 2) 설계 - 참가자 명단 동적 렌더
import { test, expect } from './fixtures'

test('단체 신청 골든패스: 인원수에 따라 참가자 행이 늘어나고 제출까지 성공', async ({ page }) => {
  await page.goto('/enroll')

  await page.getByRole('radio', { name: /백엔드 시스템 디자인/ }).click()
  await page.getByRole('radio', { name: '단체 신청' }).check()
  await page.getByRole('button', { name: '다음' }).click()

  await page.locator('#applicant-name').fill('단체담당')
  await page.locator('#applicant-email').fill('contact@example.com')
  await page.locator('#applicant-phone').fill('01012345678')

  await page.locator('#org-name').fill('라이브클래스')
  await page.locator('#contact-person').fill('01087654321')

  // 기본 인원수 2 → 3으로 변경 시 3번째 참가자 행이 새로 렌더되어야 한다.
  await page.locator('#head-count').fill('3')
  await expect(page.locator('#participant-3-name')).toBeVisible()

  await page.locator('#participant-1-name').fill('참가자1')
  await page.locator('#participant-1-email').fill('p1@example.com')
  await page.locator('#participant-2-name').fill('참가자2')
  await page.locator('#participant-2-email').fill('p2@example.com')
  await page.locator('#participant-3-name').fill('참가자3')
  await page.locator('#participant-3-email').fill('p3@example.com')

  await page.getByRole('button', { name: '다음' }).click()

  await expect(page.getByRole('heading', { name: '입력한 내용을 확인해 주세요' })).toBeVisible()
  await expect(page.getByText('라이브클래스')).toBeVisible()
  await expect(page.getByText('3명')).toBeVisible()

  await page.getByRole('checkbox', { name: /이용약관/ }).check()
  await page.getByRole('button', { name: '신청 제출' }).click()

  await expect(page).toHaveURL(/\/enroll\/done$/)
  await expect(page.getByText('단체 신청')).toBeVisible()
})
