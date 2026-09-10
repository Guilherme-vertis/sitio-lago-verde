import { Suspense } from 'react'
import ConfirmacaoContent from './confirmacao-content'

function ConfirmacaoLoading() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-600">Carregando...</p>
    </main>
  )
}

export default function ConfirmacaoPage() {
  return (
    <Suspense fallback={<ConfirmacaoLoading />}>
      <ConfirmacaoContent />
    </Suspense>
  )
}
