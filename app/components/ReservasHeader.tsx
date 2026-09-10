'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export default function ReservasHeader() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUserEmail(user?.email || null)
      setLoading(false)
    }
    loadUser()
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Sítio Lago Verde"
            width={90}
            height={60}
            className="object-contain"
            priority
          />
        </div>

        <div className="flex items-center gap-4">
          {!loading && userEmail && (
            <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
              <span className="text-sm text-green-700">
                ✅ Logado como <span className="font-semibold">{userEmail}</span>
              </span>
            </div>
          )}

          <Link
            href="/cliente/dashboard"
            className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {userEmail ? 'Minha Conta' : 'Entrar'}
          </Link>
        </div>
      </div>
    </header>
  )
}
