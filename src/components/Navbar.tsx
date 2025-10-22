
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Home, BookOpen, FlaskConical, ClipboardCheck, Users, LogIn, User, LogOut, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  
  // Base navigation items
  const baseNavigation = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Materi', href: '/materials', icon: BookOpen },
    { name: 'Praktikum', href: '/practicum', icon: FlaskConical },
    { name: 'Test', href: '/test', icon: ClipboardCheck },
    { name: 'Tentang', href: '/about', icon: Users },
  ];

  // Add Progress menu only if user is logged in
  const navigation = user 
    ? [...baseNavigation.slice(0, 4), { name: 'Progress', href: '/progress', icon: BarChart3 }, ...baseNavigation.slice(4)]
    : baseNavigation;

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="container mx-auto px-8 py-4">
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
            <div className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href} className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {/* Auth Section */}
              {user && (
                <div className="ml-4 pl-4 border-l border-white/20">
                  <div className="flex items-center space-x-4">
                    <Link 
                      href={user.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student'}
                      className={`flex items-center space-x-2 hover:text-white transition-colors ${
                        user.role === 'teacher' ? 'text-blue-300' : 'text-emerald-300'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">{user.name}</span>
                      {user.role === 'student' && (
                        <span className="text-xs bg-emerald-500/20 px-2 py-1 rounded-full border border-emerald-400/30">
                          Siswa
                        </span>
                      )}
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center space-x-1 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 rounded-lg text-red-300 hover:text-white transition-all text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-t border-white/10 shadow-lg px-4">
        <div className="grid grid-cols-6 py-1">
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
