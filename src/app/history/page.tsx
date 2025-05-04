import { HistoryView } from '@/components/history/HistoryView'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Historia korekt',
  description: 'Przeglądaj historię swoich korekt tekstu',
}

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: corrections, error } = await supabase
    .from('corrections')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    // W przypadku błędu, przekażemy pustą tablicę i informację o błędzie
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Historia korekt</h1>
        <HistoryView 
          initialCorrections={[]} 
          initialError="Wystąpił błąd podczas pobierania korekt. Spróbuj ponownie później."
        />
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Historia korekt</h1>
      <HistoryView initialCorrections={corrections} />
    </div>
  )
} 