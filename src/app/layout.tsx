import './globals.css'
import { Poppins, Fira_Code } from 'next/font/google'
import FloatingChatButton from '@/components/FloatingChatButton'
import Footer from '@/components/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/components/Toast'
import ConditionalFooter from '@/components/ConditionalFooter'
import AuthLoader from '@/components/AuthLoader'
import TeacherRedirect from '@/components/TeacherRedirect'

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
})

const firaCode = Fira_Code({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code',
})

export const metadata = {
  title: 'CIRVIA - Circuit Virtual Interactive Application',
  description: 'Interactive virtual learning platform for electrical circuits with computer vision hand gesture detection',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${poppins.variable} ${firaCode.variable}`}>
      <body className="font-sans bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 antialiased">
        <AuthProvider>
          <ToastProvider>
            <AuthLoader>
              <TeacherRedirect />
              <div className="min-h-screen flex flex-col relative overflow-hidden">
                {/* Animated Background Elements - Global */}
                <div className="fixed inset-0 pointer-events-none">
                  <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute top-40 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                </div>
                
                <main className="flex-grow relative z-10">
                  {children}
                </main>
                <ConditionalFooter />
              </div>
              <FloatingChatButton />
            </AuthLoader>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
