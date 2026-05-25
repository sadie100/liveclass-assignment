import { z } from 'zod'

const PHONE_REGEX = /^\d{9,11}$/
const PHONE_MESSAGE = '전화번호 9~11자리를 숫자만 입력해 주세요.'

const sharedShape = {
  name: z.string().min(1, '이름을 입력해 주세요'),
  email: z.email('올바른 이메일 형식이 아닙니다'),
  phone: z.string().regex(PHONE_REGEX, PHONE_MESSAGE),
  motivation: z.string().max(300, '최대 300자까지 입력할 수 있어요').optional(),
}

const personalSchema = z.object({
  type: z.literal('personal'),
  ...sharedShape,
})

const groupSchema = z.object({
  type: z.literal('group'),
  ...sharedShape,
  organizationName: z.string().min(1, '단체명을 입력해 주세요'),
  headCount: z
    .number({ message: '숫자를 입력해 주세요' })
    .int('정수만 입력할 수 있어요')
    .min(2, '2명 이상부터 단체 신청이 가능해요')
    .max(10, '최대 10명까지 신청할 수 있어요'),
  contactPerson: z.string().regex(PHONE_REGEX, PHONE_MESSAGE),
  participants: z
    .array(
      z.object({
        name: z.string().min(1, '이름을 입력해 주세요'),
        email: z.email('올바른 이메일 형식이 아닙니다'),
      }),
    )
    .min(2)
    .max(10),
})

export const enrollSchema = z.discriminatedUnion('type', [personalSchema, groupSchema])
export type EnrollFormValues = z.infer<typeof enrollSchema>
export type GroupFormValues = z.infer<typeof groupSchema>
