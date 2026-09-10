import { Suspense } from 'react'
import CheckoutContent from './checkout-content'

function CheckoutLoading() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-600">Carregando...</p>
    </main>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  )
}
