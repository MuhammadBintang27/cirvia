
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { Home, BookOpen, FlaskConical, ClipboardCheck, Users, LogIn, User, LogOut, BarChart3, ChevronDown, GraduationCap, BookOpen as TeacherIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLoginDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Base navigation items
  const baseNavigation = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Materi', href: '/materials', icon: BookOpen },
    { name: 'Praktikum', href: '/practicum', icon: FlaskConical },
    { name: 'Test', href: '/test', icon: ClipboardCheck },
    { name: 'Tentang', href: '/about', icon: Users },
  ];

  // Use base navigation without dashboard menu since it's accessible via user name
  const navigation = baseNavigation;

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
              {user ? (
                <div className="ml-4 pl-4 border-l border-white/20">
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
                </div>
              ) : (
                <div className="ml-4 pl-4 border-l border-white/20 relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30 text-blue-300 rounded-xl font-medium hover:from-blue-500/30 hover:to-cyan-500/30 transition-all"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Login Dropdown */}
                  {isLoginDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl z-50">
                      <div className="p-2">
                        <Link
                          href="/login/student"
                          onClick={() => setIsLoginDropdownOpen(false)}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-left text-white/80 hover:text-white hover:bg-emerald-500/20 rounded-xl transition-all group"
                        >
                          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                            <GraduationCap className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <div className="font-medium text-white">Login Sebagai Siswa</div>
                            <div className="text-xs text-emerald-200/70">Akses materi dan test pembelajaran</div>
                          </div>
                        </Link>
                        
                        <Link
                          href="/login"
                          onClick={() => setIsLoginDropdownOpen(false)}
                          className="flex items-center space-x-3 w-full px-4 py-3 text-left text-white/80 hover:text-white hover:bg-blue-500/20 rounded-xl transition-all group"
                        >
                          <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                            <TeacherIcon className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                            <div className="font-medium text-white">Login Sebagai Guru</div>
                            <div className="text-xs text-blue-200/70">Kelola soal dan monitor siswa</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-t border-white/10 shadow-lg px-4">
        <div className={`grid ${user ? 'grid-cols-6' : 'grid-cols-6'} py-1`}>
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
          
          {/* Mobile Auth */}
          {user ? (
            <Link
              href={user.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student'}
              className={`flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 ${
                user.role === 'teacher' ? 'text-blue-300' : 'text-emerald-300'
              }`}
            >
              <div className="p-1 rounded-lg">
                <User className="w-5 h-5" />
              </div>
              <span className="text-xs mt-1 font-medium truncate max-w-[50px]">
                {user.name.split(' ')[0]}
              </span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 text-white/80 hover:text-white hover:bg-blue-900/10"
            >
              <div className="p-1 rounded-lg">
                <LogIn className="w-5 h-5" />
              </div>
              <span className="text-xs mt-1 font-medium">Login</span>
            </Link>
          )}
        </div>
      </div>

      {/* Spacer for mobile bottom navigation */}
      <div className="md:hidden h-16"></div>
    </>
  );
}
