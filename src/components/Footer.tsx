import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-blue-900 to-indigo-900"></div>
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/8 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-6 py-12">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-400 to-cyan-500 p-2 rounded-xl shadow-lg">
                <span className="text-2xl font-bold">⚡</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  CIRVIA
                </h3>
                <p className="text-sm text-blue-200">Circuit Vision AI</p>
              </div>
            </div>
            <p className="text-blue-100 mb-6 leading-relaxed text-sm">
              Platform pembelajaran fisika rangkaian listrik dengan teknologi Computer Vision. 
              Belajar konsep I, V, R secara interaktif dengan gesture detection.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://github.com/MuhammadBintang27/cirvia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-800/30 hover:bg-blue-700/40 backdrop-blur-sm p-2 rounded-lg transition-all duration-300 border border-blue-600/30 hover:border-blue-500/50"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-cyan-300">Menu Utama</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-blue-100 hover:text-white transition-colors text-sm group flex items-center">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/materials" className="text-blue-100 hover:text-white transition-colors text-sm group flex items-center">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  Materi Pembelajaran
                </Link>
              </li>
              <li>
                <Link href="/learning-style" className="text-blue-100 hover:text-white transition-colors text-sm group flex items-center">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  Tes Gaya Belajar
                </Link>
              </li>
              <li>
                <Link href="/practicum" className="text-blue-100 hover:text-white transition-colors text-sm group flex items-center">
                  <span className="w-1 h-1 bg-cyan-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  Praktikum CV
                </Link>
              </li>
            </ul>
          </div>

          {/* Assessment */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-300">Penilaian</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/pretest" className="text-blue-100 hover:text-white transition-colors text-sm group flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  Pre-test
                </Link>
              </li>
              <li>
                <Link href="/posttest" className="text-blue-100 hover:text-white transition-colors text-sm group flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  Post-test
                </Link>
              </li>
              <li>
                <Link href="/progress" className="text-blue-100 hover:text-white transition-colors text-sm group flex items-center">
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:bg-white transition-colors"></span>
                  Progress Belajar
                </Link>
              </li>
            </ul>
          </div>
        </div>

    

        {/* Bottom Section */}
        <div className="border-t border-blue-700/30 pt-6 flex flex-col md:flex-row items-center justify-between">
          <div className="text-blue-200 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} CIRVIA - Platform Pembelajaran Fisika Rangkaian Listrik
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-blue-200 text-sm">System Online</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
