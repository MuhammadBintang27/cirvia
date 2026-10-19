import './globals.css'
import { Bricolage_Grotesque, Nunito_Sans, Fira_Code, Noto_Emoji } from 'next/font/google'
import FloatingChatButton from '@/components/FloatingChatButton'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/components/Toast'
import ConditionalFooter from '@/components/ConditionalFooter'
import AuthLoader from '@/components/AuthLoader'
import TeacherRedirect from '@/components/TeacherRedirect'

const bricolage = Bricolage_Grotesque({
  weight: ['600', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
})

const nunito = Nunito_Sans({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

const firaCode = Fira_Code({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fira-code',
})

// Emoji satu warna sebagai cadangan: teks dari AI atau guru yang memuat emoji tidak tampil warna-warni
const notoEmoji = Noto_Emoji({
  weight: ['400', '700'],
  subsets: ['emoji'],
  display: 'swap',
  variable: '--font-emoji',
})

export const metadata = {
  title: 'CIRVIA - Circuit Virtual Interactive Application',
  description: 'Interactive virtual learning platform for electrical circuits with computer vision hand gesture detection',
  icons: {
    icon: '/logo.png', // Path ke logo kamu di folder public
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${bricolage.variable} ${nunito.variable} ${firaCode.variable} ${notoEmoji.variable}`}>
      <body className="bg-grid font-sans text-ink antialiased pb-16 md:pb-0">
        <AuthProvider>
          <ToastProvider>
            <AuthLoader>
              <TeacherRedirect />
              <div className="min-h-screen flex flex-col relative">
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
