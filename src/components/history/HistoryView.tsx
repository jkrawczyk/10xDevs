'use client'

import { useState } from 'react'
import { CorrectionDTO } from '@/types'
import { CorrectionList } from './CorrectionList'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface HistoryViewProps {
  initialCorrections: CorrectionDTO[]
  initialError?: string
}

export function HistoryView({ initialCorrections, initialError }: HistoryViewProps) {
  const [corrections, setCorrections] = useState<CorrectionDTO[]>(initialCorrections)
  const [error, setError] = useState<string | null>(initialError || null)

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/corrections/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('An error occurred while deleting the correction')
      }

      setCorrections((prev) => prev.filter((correction) => correction.id !== id))
    } catch (err) {
      setError('An error occurred while deleting the correction. Please try again later.')
    }
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return <CorrectionList corrections={corrections} onDelete={handleDelete} />
} 