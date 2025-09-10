import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <span className="text-2xl font-bold">⚡</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  CIRVIA
                </h3>
                <p className="text-sm text-gray-300">Circuit Vision AI</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Platform pembelajaran fisika rangkaian listrik dengan teknologi Computer Vision dan AI. 
              Belajar konsep I, V, R dengan cara yang interaktif dan menyenangkan menggunakan gesture detection.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.739.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.747 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.624 0 11.99-5.367 11.99-11.986C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
              <a href="#" className="bg-pink-600 hover:bg-pink-700 p-2 rounded-lg transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://github.com/MuhammadBintang27/cirvia" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-300">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">📖 About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/materials" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">📚 Learning Materials</span>
                </Link>
              </li>
              <li>
                <Link href="/pretest" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">📝 Pre-test</span>
                </Link>
              </li>
              <li>
                <Link href="/posttest" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">✅ Post-test</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Learning Modules */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-purple-300">Learning Modules</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/practicum" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">🔬 CV Practicum</span>
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">🎯 Interactive Quiz</span>
                </Link>
              </li>
              <li>
                <Link href="/test" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">📊 Assessment</span>
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">🏆 Leaderboard</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <h4 className="text-lg font-semibold mb-4 text-center text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
            ✨ Platform Features
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 p-4 rounded-lg border border-blue-500/30">
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-sm text-blue-300 font-medium">AI Vision</div>
              <div className="text-xs text-gray-400">Hand Gesture Detection</div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 p-4 rounded-lg border border-purple-500/30">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-sm text-purple-300 font-medium">Real-time</div>
              <div className="text-xs text-gray-400">Live Calculations</div>
            </div>
            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 p-4 rounded-lg border border-green-500/30">
              <div className="text-2xl mb-2">🎮</div>
              <div className="text-sm text-green-300 font-medium">Interactive</div>
              <div className="text-xs text-gray-400">Circuit Builder</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 p-4 rounded-lg border border-yellow-500/30">
              <div className="text-2xl mb-2">📚</div>
              <div className="text-sm text-yellow-300 font-medium">Educational</div>
              <div className="text-xs text-gray-400">Physics Learning</div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} CIRVIA - Circuit Vision AI Platform. Made with ❤️ for Physics Education.
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>System Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
    </footer>
  )
}
