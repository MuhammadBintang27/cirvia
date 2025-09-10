
import Link from 'next/link';
import Image from 'next/image';
import { Home, BookOpen, FlaskConical, ClipboardCheck, Users, ArrowLeft } from 'lucide-react';

export default function Navbar() {
  const navigation = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Materi', href: '/materials', icon: BookOpen },
    { name: 'Praktikum', href: '/practicum', icon: FlaskConical },
    { name: 'Test', href: '/test', icon: ClipboardCheck },
    { name: 'Tentang', href: '/about', icon: Users },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className=" ">
                <Image 
                  src="/logo.png" 
                  alt="CIRVIA Logo" 
                  width={30} 
                  height={30} 
                  className="w-9 h-9"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">CIRVIA</span>
            </Link>
            <div className="hidden md:flex space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href} className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-t border-white/10 shadow-lg">
        <div className="grid grid-cols-5 py-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            // Active state based on window.location.pathname
            const isActive = typeof window !== 'undefined' ? window.location.pathname.startsWith(item.href) : false;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 ${
                  isActive
                    ? 'text-blue-400 bg-blue-900/30'
                    : 'text-white/80 hover:text-white hover:bg-blue-900/10'
                }`}
              >
                <div className={`p-1 rounded-lg transition-all ${
                  isActive ? 'bg-blue-400/20 scale-110' : ''
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-white/80'}`} />
                </div>
                <span className={`text-xs mt-1 font-medium ${
                  isActive ? 'text-blue-400' : 'text-white/80'
                }`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer for mobile bottom navigation */}
      <div className="md:hidden h-16"></div>
    </>
  );
}
