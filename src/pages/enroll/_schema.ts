import { z } from 'zod'
import type { EnrollmentRequest } from '@/types/enrollment'

const PHONE_REGEX = /^\d{9,11}$/
const PHONE_MESSAGE = '전화번호 9~11자리를 숫자만 입력해 주세요.'

export const MIN_PARTICIPANTS = 2
export const MAX_PARTICIPANTS = 10

const sharedShape = {
  courseId: z.string().min(1, '강의를 선택해 주세요'),
  name: z
    .string()
    .min(2, '이름은 2자 이상 입력해 주세요')
    .max(20, '이름은 20자까지 입력할 수 있어요'),
  email: z.email('올바른 이메일 형식이 아닙니다'),
  phone: z.string().regex(PHONE_REGEX, PHONE_MESSAGE),
  motivation: z.string().max(300, '최대 300자까지 입력할 수 있어요').optional(),
  agreedToTerms: z.boolean().refine((v) => v === true, {
    message: '약관에 동의해 주세요',
  }),
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
    .min(MIN_PARTICIPANTS, `${MIN_PARTICIPANTS}명 이상부터 단체 신청이 가능해요`)
    .max(MAX_PARTICIPANTS, `최대 ${MAX_PARTICIPANTS}명까지 신청할 수 있어요`),
  contactPerson: z.string().regex(PHONE_REGEX, PHONE_MESSAGE),
  participants: z
    .array(
      z.object({
        name: z.string().min(1, '이름을 입력해 주세요'),
        email: z.email('올바른 이메일 형식이 아닙니다'),
      }),
    )
    .min(MIN_PARTICIPANTS)
    .max(MAX_PARTICIPANTS),
})

export const enrollSchema = z.discriminatedUnion('type', [personalSchema, groupSchema])

export type EnrollFormValues = z.infer<typeof enrollSchema>
export type GroupFormValues = z.infer<typeof groupSchema>

export const DEFAULT_VALUES = {
  courseId: '',
  type: 'personal',
  name: '',
  email: '',
  phone: '',
  motivation: '',
  organizationName: '',
  headCount: MIN_PARTICIPANTS,
  contactPerson: '',
  participants: Array.from({ length: MIN_PARTICIPANTS }, () => ({ name: '', email: '' })),
  agreedToTerms: false,
} as unknown as EnrollFormValues

export function toEnrollmentRequest(values: EnrollFormValues): EnrollmentRequest {
  const applicant = {
    name: values.name,
    email: values.email,
    phone: values.phone,
    ...(values.motivation ? { motivation: values.motivation } : {}),
  }

  if (values.type === 'group') {
    return {
      courseId: values.courseId,
      type: 'group',
      applicant,
      group: {
        organizationName: values.organizationName,
        headCount: values.headCount,
        participants: values.participants,
        contactPerson: values.contactPerson,
      },
      agreedToTerms: values.agreedToTerms,
    }
  }

  return {
    courseId: values.courseId,
    type: 'personal',
    applicant,
    agreedToTerms: values.agreedToTerms,
  }
}

export const STEP_FIELDS = {
  step1: ['courseId', 'type'] as const,
  step2Personal: ['name', 'email', 'phone', 'motivation'] as const,
  step2Group: [
    'name',
    'email',
    'phone',
    'motivation',
    'organizationName',
    'headCount',
    'contactPerson',
    'participants',
  ] as const,
  step3: ['agreedToTerms'] as const,
}
