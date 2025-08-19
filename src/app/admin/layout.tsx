'use client'

import { SessionProvider } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminProviders } from './providers'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin/login'

  return (
    <>
      {/* Sonner Toaster mounted once at admin root to avoid nested mounts */}
      <div id="admin-toaster-root" className="fixed z-[9999]">
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      </div>
      <AdminProviders>
        <SessionProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {!isLoginPage && <AdminSidebar />}
            <div className={isLoginPage ? '' : 'lg:pl-64'}>
              {!isLoginPage && <AdminHeader />}
              <main className={isLoginPage ? '' : 'py-6'}>
                <div className={isLoginPage ? '' : 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'}>
                  {children}
                </div>
              </main>
            </div>
          </div>
        </SessionProvider>
      </AdminProviders>
    </>
  )
}
