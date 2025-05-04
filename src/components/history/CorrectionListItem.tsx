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

  const formattedDate = new Date(correction.created_at).toLocaleDateString('pl-PL', {
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
            Styl: {correction.correction_style === 'formal' ? 'Formalny' : 'Naturalny'}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-sm font-medium mb-1">Oryginalny tekst:</div>
          <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
            {correction.original_text}
          </div>
        </div>
        <div>
          <div className="text-sm font-medium mb-1">Poprawiony tekst:</div>
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
              {isDeleting ? 'Usuwanie...' : 'Usuń'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Czy na pewno chcesz usunąć tę korektę?</AlertDialogTitle>
              <AlertDialogDescription>
                Ta akcja jest nieodwracalna. Korekta zostanie trwale usunięta z systemu.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Anuluj</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Usuń</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
} 