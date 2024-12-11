'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '@/app/lib/supabase'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/signin')
      }
    }
    checkUser()
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <aside className="md:col-span-1">
          <nav className="space-y-2">
            <Link 
              href="/dashboard/profile"
              className={`block p-2 rounded ${
                pathname === '/dashboard/profile'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Profile
            </Link>
            
            <h3 className="font-bold text-gray-900 dark:text-white mt-6 mb-4">Free Calculators</h3>
            <Link
              href="/dashboard/free/basic-calculator"
              className={`block p-2 rounded ${
                pathname === '/dashboard/free/basic-calculator'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Basic Calculator
            </Link>
            <Link
              href="/dashboard/free/percentage-calculator"
              className={`block p-2 rounded ${
                pathname === '/dashboard/free/percentage-calculator'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Percentage Calculator
            </Link>
            
            <h3 className="font-bold text-gray-900 dark:text-white mt-6 mb-4">Premium Calculators</h3>
            <Link
              href="/dashboard/premium/scientific-calculator"
              className={`block p-2 rounded ${
                pathname === '/dashboard/premium/scientific-calculator'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Scientific Calculator
            </Link>
            <Link
              href="/dashboard/premium/graphing-calculator"
              className={`block p-2 rounded ${
                pathname === '/dashboard/premium/graphing-calculator'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              Graphing Calculator
            </Link>
          </nav>
        </aside>
        <div className="md:col-span-3">
          {children}
        </div>
      </div>
    </div>
  )
}
