import { CorrectionDTO } from '@/types'
import { CorrectionListItem } from './CorrectionListItem'

interface CorrectionListProps {
  corrections: CorrectionDTO[]
  onDelete: (id: string) => Promise<void>
}

export function CorrectionList({ corrections, onDelete }: CorrectionListProps) {
  if (corrections.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nie masz jeszcze żadnych korekt
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {corrections.map((correction) => (
        <CorrectionListItem
          key={correction.id}
          correction={correction}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
} 