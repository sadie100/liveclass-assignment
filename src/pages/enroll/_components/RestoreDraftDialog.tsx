import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type Props = {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function RestoreDraftDialog({ open, onConfirm, onCancel }: Props) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onCancel()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>작성 중이던 데이터가 있습니다</AlertDialogTitle>
          <AlertDialogDescription>
            이전에 입력하던 내용을 이어서 작성하시겠습니까? 취소하면 임시로 저장된 데이터가 삭제됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>새로 시작</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>이어서 작성</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
