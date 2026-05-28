import { EnrollmentErrorCode } from '@/types/enrollment'

export type SubmitErrorReason = EnrollmentErrorCode | 'SOLD_OUT' | 'UNKNOWN'

export const KNOWN_ERROR_CODES = Object.values(EnrollmentErrorCode) as string[]

export const SUBMIT_ERROR_CONTENT: Record<
  SubmitErrorReason,
  { title: string; description: string }
> = {
  COURSE_FULL: {
    title: '선택한 강의의 정원이 초과되었습니다.',
    description: '다른 강의를 선택해 다시 신청해 주세요.',
  },
  DUPLICATE_ENROLLMENT: {
    title: '이미 신청한 강의입니다.',
    description: '한 강의는 한 번만 신청할 수 있어요. 다른 강의를 둘러보세요.',
  },
  INVALID_INPUT: {
    title: '입력값을 다시 확인해 주세요.',
    description: '입력 정보로 돌아가 값을 확인한 뒤 다시 제출해 주세요.',
  },
  SOLD_OUT: {
    title: '선택한 강의가 마감되었습니다.',
    description: '신청을 진행할 수 없어요. 다른 강의를 선택해 주세요.',
  },
  UNKNOWN: {
    title: '신청 처리 중 문제가 발생했습니다.',
    description: '잠시 후 다시 시도해 주세요. 문제가 계속되면 고객센터로 문의해 주세요.',
  },
}
