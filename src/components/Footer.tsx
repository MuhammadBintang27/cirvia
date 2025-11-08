import React from 'react'
import Link from 'next/link'

// Theme variants untuk module pages
export type FooterTheme = 'default' | 'purple' | 'yellow' | 'emerald';

interface FooterProps {
  theme?: FooterTheme;
  className?: string;
}

// Color configurations berdasarkan theme
const themeColors = {
  default: {
    brandGradient: 'from-blue-400 to-cyan-500',
    titleGradient: 'from-blue-300 to-cyan-300',
    subtitle: 'text-blue-200',
    description: 'text-white/70',
    linkButton: 'bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/40',
    heading: 'text-white/90',
    linkText: 'text-white/80 hover:text-white',
    dot: 'bg-white/50 group-hover:bg-white',
    border: 'border-white/10',
    copyright: 'text-white/60',
    statusDot: 'bg-green-400',
    borderTop: 'via-white/20',
  },
  purple: {
    brandGradient: 'from-purple-400 to-pink-500',
    titleGradient: 'from-purple-300 to-pink-300',
    subtitle: 'text-purple-200',
    description: 'text-purple-100/70',
    linkButton: 'bg-purple-500/20 hover:bg-purple-500/30 border-purple-400/30 hover:border-purple-400/50',
    heading: 'text-purple-100/90',
    linkText: 'text-purple-200/80 hover:text-purple-100',
    dot: 'bg-purple-300/50 group-hover:bg-purple-200',
    border: 'border-purple-400/20',
    copyright: 'text-purple-200/60',
    statusDot: 'bg-purple-400',
    borderTop: 'via-purple-400/30',
  },
  yellow: {
    brandGradient: 'from-yellow-400 to-orange-500',
    titleGradient: 'from-yellow-300 to-orange-300',
    subtitle: 'text-blue-200',
    description: 'text-blue-100/70',
    linkButton: 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-400/30 hover:border-blue-400/50',
    heading: 'text-yellow-100/90',
    linkText: 'text-blue-200/80 hover:text-blue-100',
    dot: 'bg-yellow-300/50 group-hover:bg-yellow-200',
    border: 'border-blue-400/20',
    copyright: 'text-blue-200/60',
    statusDot: 'bg-yellow-400',
    borderTop: 'via-yellow-400/30',
  },
  emerald: {
    brandGradient: 'from-emerald-400 to-teal-500',
    titleGradient: 'from-emerald-300 to-teal-300',
    subtitle: 'text-emerald-200',
    description: 'text-emerald-100/70',
    linkButton: 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-400/30 hover:border-emerald-400/50',
    heading: 'text-emerald-100/90',
    linkText: 'text-emerald-200/80 hover:text-emerald-100',
    dot: 'bg-emerald-300/50 group-hover:bg-emerald-200',
    border: 'border-emerald-400/20',
    copyright: 'text-emerald-200/60',
    statusDot: 'bg-emerald-400',
    borderTop: 'via-emerald-400/30',
  },
};

export default function Footer({ theme = 'default', className = '' }: FooterProps) {
  const colors = themeColors[theme];

  return (
    <footer className={`relative text-white overflow-hidden ${className}`}>
      {/* Border Top */}
      <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${colors.borderTop} to-transparent`}></div>

      <div className="relative container mx-auto px-6 pt-16 pb-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`bg-gradient-to-r ${colors.brandGradient} p-2 rounded-xl shadow-lg`}>
                <span className="text-2xl font-bold">⚡</span>
              </div>
              <div>
                <h3 className={`text-2xl font-bold bg-gradient-to-r ${colors.titleGradient} bg-clip-text text-transparent`}>
                  CIRVIA
                </h3>
                <p className={`text-sm ${colors.subtitle}`}>Circuit Vision AI</p>
              </div>
            </div>
            <p className={`${colors.description} mb-6 leading-relaxed text-sm`}>
              Platform pembelajaran fisika rangkaian listrik dengan teknologi Computer Vision. 
              Belajar konsep I, V, R secara interaktif dengan gesture detection.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://github.com/MuhammadBintang27/cirvia" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${colors.linkButton} backdrop-blur-sm p-2 rounded-lg transition-all duration-300 border`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${colors.heading}`}>Menu Utama</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className={`${colors.linkText} transition-colors text-sm group flex items-center`}>
                  <span className={`w-1 h-1 ${colors.dot} rounded-full mr-3 transition-colors`}></span>
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link href="/materials" className={`${colors.linkText} transition-colors text-sm group flex items-center`}>
                  <span className={`w-1 h-1 ${colors.dot} rounded-full mr-3 transition-colors`}></span>
                  Materi Pembelajaran
                </Link>
              </li>
              <li>
                <Link href="/learning-style" className={`${colors.linkText} transition-colors text-sm group flex items-center`}>
                  <span className={`w-1 h-1 ${colors.dot} rounded-full mr-3 transition-colors`}></span>
                  Tes Gaya Belajar
                </Link>
              </li>
              <li>
                <Link href="/practicum" className={`${colors.linkText} transition-colors text-sm group flex items-center`}>
                  <span className={`w-1 h-1 ${colors.dot} rounded-full mr-3 transition-colors`}></span>
                  Praktikum CV
                </Link>
              </li>
            </ul>
          </div>

          {/* Assessment */}
          <div>
            <h4 className={`text-lg font-semibold mb-4 ${colors.heading}`}>Penilaian</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/pretest" className={`${colors.linkText} transition-colors text-sm group flex items-center`}>
                  <span className={`w-1 h-1 ${colors.dot} rounded-full mr-3 transition-colors`}></span>
                  Pre-test
                </Link>
              </li>
              <li>
                <Link href="/posttest" className={`${colors.linkText} transition-colors text-sm group flex items-center`}>
                  <span className={`w-1 h-1 ${colors.dot} rounded-full mr-3 transition-colors`}></span>
                  Post-test
                </Link>
              </li>
              <li>
                <Link href="/progress" className={`${colors.linkText} transition-colors text-sm group flex items-center`}>
                  <span className={`w-1 h-1 ${colors.dot} rounded-full mr-3 transition-colors`}></span>
                  Progress Belajar
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`border-t ${colors.border} pt-6 flex flex-col md:flex-row items-center justify-between`}>
          <div className={`${colors.copyright} text-sm mb-4 md:mb-0`}>
            © {new Date().getFullYear()} CIRVIA - Platform Pembelajaran Fisika Rangkaian Listrik
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 ${colors.statusDot} rounded-full animate-pulse`}></div>
            <span className={`${colors.copyright} text-sm`}>System Online</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
