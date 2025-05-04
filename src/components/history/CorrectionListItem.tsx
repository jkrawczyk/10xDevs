import { useState } from 'react'
import { CorrectionDTO } from '@/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface CorrectionListItemProps {
  correction: CorrectionDTO
  onDelete: (id: string) => Promise<void>
}

export function CorrectionListItem({ correction, onDelete }: CorrectionListItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDelete(correction.id)
    setIsDeleting(false)
  }

  const formattedDate = new Date(correction.created_at).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="text-sm text-muted-foreground">
            {formattedDate}
          </div>
          <div className="text-sm font-medium">
            Style: {correction.correction_style === 'formal' ? 'Formal' : 'Natural'}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium mb-1">Original text:</div>
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            {correction.original_text}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium mb-1">Corrected text:</div>
          <div className="text-sm bg-muted p-3 rounded-md">
            {correction.approved_text}
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-end">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" disabled={isDeleting}>
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to delete this correction?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. The correction will be permanently removed from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
} 