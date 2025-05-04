import { HistoryView } from '@/components/history/HistoryView'

export const metadata = {
  title: 'Historia korekt',
  description: 'Przeglądaj historię swoich korekt tekstu',
}

export default function HistoryPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Historia korekt</h1>
      <HistoryView />
    </div>
  )
} 