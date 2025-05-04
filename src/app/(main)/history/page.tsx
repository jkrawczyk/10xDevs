import { HistoryView } from '@/components/history/HistoryView'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Correction History',
  description: 'Browse your text correction history'
}

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: corrections, error } = await supabase
    .from('corrections')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    // In case of error, we'll pass an empty array and error message
    return (
      <div className="py-8">
        <HistoryView 
          initialCorrections={[]} 
          initialError="An error occurred while fetching corrections. Please try again later."
        />
      </div>
    )
  }

  return (
    <div className="py-8">
      <HistoryView initialCorrections={corrections} />
    </div>
  )
} 