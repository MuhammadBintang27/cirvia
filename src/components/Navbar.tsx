'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Home, BookOpen, FlaskConical, ClipboardCheck, Users, ArrowLeft } from 'lucide-react'

interface NavbarProps {
  showBackButton?: boolean
  backUrl?: string
  backText?: string
}

export default function Navbar({ showBackButton = false, backUrl = '/', backText = 'Kembali' }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const navigation = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Materi', href: '/materials', icon: BookOpen },
    { name: 'Praktikum', href: '/practicum', icon: FlaskConical },
    { name: 'Test', href: '/test', icon: ClipboardCheck },
    { name: 'Tentang', href: '/about', icon: Users },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="bg-white shadow-lg border-b-4 border-blue-500 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <button
                  onClick={() => router.push(backUrl)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">{backText}</span>
                </button>
              )}
              
              <Link href="/" className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
                  <FlaskConical className="w-6 h-6 text-white" />
                </div>
                <div className="block">
                  <h1 className="text-xl font-bold text-gray-800">CIRVIA</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">Circuit Virtual Interactive</p>
                </div>
              </Link>
            </div>

            {/* Navigation Links - Desktop Only */}
            <div className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="grid grid-cols-5 py-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 ${
                  active
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <div className={`p-1 rounded-lg transition-all ${
                  active ? 'bg-blue-100 scale-110' : ''
                }`}>
                  <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-600'}`} />
                </div>
                <span className={`text-xs mt-1 font-medium ${
                  active ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Spacer for mobile bottom navigation */}
      <div className="md:hidden h-20"></div>
    </>
  )
}
