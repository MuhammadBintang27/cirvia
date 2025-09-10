import './globals.css'
import { Inter } from 'next/font/google'
import FloatingChatButton from '@/components/FloatingChatButton'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="id">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        <FloatingChatButton />
      </body>
    </html>
  )
}
