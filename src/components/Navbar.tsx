
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, FlaskConical, ClipboardCheck, Users, LogIn, User, LogOut, BarChart3, ChevronDown, GraduationCap, BookOpen as TeacherIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout, isTeacher } = useAuth();
  const pathname = usePathname();
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mobileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  // Reset navbar visibility when pathname changes
  useEffect(() => {
    setIsVisible(true);
    setIsLoginDropdownOpen(false);
    window.scrollTo(0, 0); // Scroll to top on page change
  }, [pathname]);

  // Handle scroll to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Clear previous timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Always show navbar at top (scroll position < 100px)
      if (currentScrollY < 100) {
        setIsVisible(true);
        setLastScrollY(currentScrollY);
        return;
      }
      
      // Show navbar when scrolling (up or down)
      setIsVisible(true);
      
      // Hide navbar after user stops scrolling for 1.5 seconds
      scrollTimeoutRef.current = setTimeout(() => {
        if (window.scrollY >= 100) {
          setIsVisible(false);
        }
      }, 1500);
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside both desktop and mobile dropdowns/buttons
      const clickedOutsideDesktop = dropdownRef.current && !dropdownRef.current.contains(target) &&
                                      buttonRef.current && !buttonRef.current.contains(target);
      
      const clickedOutsideMobile = mobileDropdownRef.current && !mobileDropdownRef.current.contains(target) &&
                                    mobileButtonRef.current && !mobileButtonRef.current.contains(target);
      
      // Only close if clicked outside BOTH (since only one is visible at a time)
      if (clickedOutsideDesktop && clickedOutsideMobile) {
        setIsLoginDropdownOpen(false);
      }
    };

    if (isLoginDropdownOpen) {
      // Add a small delay to prevent immediate closure
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside as any);
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside as any);
    };
  }, [isLoginDropdownOpen]);

  // Update dropdown position when button position changes
  useEffect(() => {
    if (isLoginDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 12,
        right: window.innerWidth - rect.right
      });
    }
  }, [isLoginDropdownOpen]);

  // Halaman yang tidak boleh ada navbar (halaman tes)
  const excludedPaths = [
    '/learning-style',
    '/pretest',
    '/posttest',
  ];
  
  // Cek apakah path saat ini ada dalam daftar exclude
  const shouldHideNavbar = excludedPaths.some(path => pathname.startsWith(path));
  
  // Jika harus disembunyikan, return null
  if (shouldHideNavbar) {
    return null;
  }

  // If user is a teacher, only show navbar on dashboard page
  if (isTeacher() && !pathname.startsWith('/dashboard/teacher')) {
    return null;
  }
  
  // Base navigation items (for students only)
  const baseNavigation = [
    { name: 'Beranda', href: '/', icon: Home },
    { name: 'Materi', href: '/materials', icon: BookOpen },
    { name: 'Praktikum', href: '/practicum', icon: FlaskConical },
    { name: 'Test', href: '/test', icon: ClipboardCheck },
    { name: 'Tentang', href: '/about', icon: Users },
  ];

  // Teachers don't see navigation menu, only their profile/logout
  const navigation = isTeacher() ? [] : baseNavigation;

  return (
    <>
      {/* Spacer for fixed navbar - prevents content overlap (desktop only) */}
      <div className="hidden md:block h-24"></div>

      {/* Desktop Navbar - Floating Pill Style with Glow */}
      <nav 
        className={`hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-20'
        }`}
        style={{ pointerEvents: isVisible || isLoginDropdownOpen ? 'auto' : 'none' }}
      >
        <div className="relative overflow-visible">
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity"></div>
          
          {/* Navbar Content */}
          <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-2xl border-2 border-blue-400/30 rounded-full px-8 py-4 shadow-2xl overflow-visible">
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <Image 
                    src="/logo.png" 
                    alt="CIRVIA Logo" 
                    width={32} 
                    height={32} 
                    className="relative w-8 h-8"
                    style={{ width: 'auto', height: 'auto' }}
                  />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  CIRVIA
                </span>
              </Link>

              {/* Divider - Only show if there are navigation items */}
              {navigation.length > 0 && (
                <div className="h-8 w-px bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"></div>
              )}

              {/* Navigation Items - Only for students */}
              {navigation.length > 0 && (
                <div className="hidden md:flex items-center space-x-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link 
                        key={item.name} 
                        href={item.href} 
                        className={`group relative flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-white' 
                            : 'text-white/70 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-sm"></div>
                        )}
                        <Icon className="relative w-4 h-4" />
                        <span className="relative text-sm font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* Divider */}
              <div className="h-8 w-px bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"></div>

              {/* Auth Section */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link 
                    href={user.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student'}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                      user.role === 'teacher' 
                        ? 'bg-blue-500/20 border border-blue-400/30 text-blue-300 hover:bg-blue-500/30' 
                        : 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user.name}</span>
                    {user.role === 'student' && (
                      <span className="text-xs bg-emerald-400/20 px-2 py-0.5 rounded-full">
                        Siswa
                      </span>
                    )}
                    {user.role === 'teacher' && (
                      <span className="text-xs bg-blue-400/20 px-2 py-0.5 rounded-full">
                        Guru
                      </span>
                    )}
                  </Link>
                  
                  {/* Logout Button for Teacher */}
                  {user.role === 'teacher' && (
                    <button
                      onClick={logout}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-400/30 text-red-300 rounded-full transition-all duration-300 hover:bg-red-500/30"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <button
                    ref={buttonRef}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Desktop button clicked, current state:', isLoginDropdownOpen);
                      setIsLoginDropdownOpen(!isLoginDropdownOpen);
                    }}
                    className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border border-blue-400/40 text-white rounded-full font-medium hover:from-blue-500/40 hover:to-cyan-500/40 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm">Login</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Login Dropdown - Fixed Position Outside Navbar */}
      {isLoginDropdownOpen && !user && (
        <div 
          ref={dropdownRef}
          className="hidden md:block fixed w-64 bg-slate-900/98 backdrop-blur-xl border-2 border-blue-400/50 rounded-2xl shadow-2xl z-[9999] overflow-hidden"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-2">
            <a
              href="/login/student"
              className="flex items-center space-x-3 w-full px-4 py-3 text-left text-white/80 hover:text-white hover:bg-emerald-500/20 rounded-xl transition-all group cursor-pointer no-underline"
              onClick={(e) => {
                console.log('Desktop Login Siswa clicked');
                e.preventDefault();
                setIsLoginDropdownOpen(false);
                window.location.href = '/login/student';
              }}
            >
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors border border-emerald-400/30">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="font-medium text-white">Login Sebagai Siswa</div>
                <div className="text-xs text-emerald-200/70">Akses materi dan test</div>
              </div>
            </a>
            
            <a
              href="/login"
              className="flex items-center space-x-3 w-full px-4 py-3 text-left text-white/80 hover:text-white hover:bg-blue-500/20 rounded-xl transition-all group cursor-pointer no-underline"
              onClick={(e) => {
                console.log('Desktop Login Guru clicked');
                e.preventDefault();
                setIsLoginDropdownOpen(false);
                window.location.href = '/login';
              }}
            >
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors border border-blue-400/30">
                <TeacherIcon className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <div className="font-medium text-white">Login Sebagai Guru</div>
                <div className="text-xs text-blue-200/70">Kelola soal dan siswa</div>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-t border-white/10 shadow-lg px-4">
        <div className={`grid ${user ? 'grid-cols-5' : 'grid-cols-5'} py-1`}>
          {navigation.map((item) => {
            const Icon = item.icon;
            // Active state - exact match for home, startsWith for others
            const isActive = item.href === '/' 
              ? pathname === '/' 
              : pathname.startsWith(item.href);
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

      {/* Mobile Top Bar - Logo & Login */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative w-8 h-8">
              <Image 
                src="/logo.png" 
                alt="CIRVIA Logo" 
                width={32} 
                height={32} 
                className="w-full h-full"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              CIRVIA
            </span>
          </Link>

          {/* Auth Button */}
          {user ? (
            <Link
              href={user.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student'}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 ${
                user.role === 'teacher' 
                  ? 'bg-blue-500/20 border border-blue-400/30 text-blue-300' 
                  : 'bg-emerald-500/20 border border-emerald-400/30 text-emerald-300'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <button
              ref={mobileButtonRef}
              onClick={(e) => {
                e.stopPropagation();
                console.log('Mobile button clicked, current state:', isLoginDropdownOpen);
                setIsLoginDropdownOpen(!isLoginDropdownOpen);
              }}
              className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 active:shadow-blue-500/50 transition-all active:scale-95 touch-manipulation z-[100]"
            >
              <LogIn className="w-4 h-4" />
              <span className="text-sm font-medium">Login</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Login Dropdown - Outside parent container for proper z-index */}
      {isLoginDropdownOpen && !user && (
        <>
          {/* Backdrop overlay */}
          <div 
            className="md:hidden fixed inset-0 z-[98]"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
            onClick={() => {
              console.log('Backdrop clicked');
              setIsLoginDropdownOpen(false);
            }}
            onTouchEnd={() => {
              console.log('Backdrop touched');
              setIsLoginDropdownOpen(false);
            }}
          />
          
          {/* Dropdown menu */}
          <div 
            ref={mobileDropdownRef}
            className="md:hidden fixed top-16 right-4 w-64 z-[99]"
            style={{ 
              animation: 'slideDown 0.2s ease-out',
              backgroundColor: 'rgb(15 23 42 / 0.98)',
              backdropFilter: 'blur(12px)',
              border: '2px solid rgb(96 165 250 / 0.5)',
              borderRadius: '1rem',
              boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-2">
              <a
                href="/login/student"
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all border-b border-white/10"
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  console.log('Login Siswa clicked');
                  e.preventDefault();
                  setIsLoginDropdownOpen(false);
                  window.location.href = '/login/student';
                }}
                onTouchEnd={(e) => {
                  console.log('Login Siswa touched');
                  e.preventDefault();
                  setIsLoginDropdownOpen(false);
                  setTimeout(() => {
                    window.location.href = '/login/student';
                  }, 100);
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: 'rgb(16 185 129 / 0.2)',
                    border: '1px solid rgb(52 211 153 / 0.3)'
                  }}
                >
                  <GraduationCap className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">Login Siswa</div>
                  <div className="text-xs text-emerald-200/70">Akses materi & test</div>
                </div>
              </a>
              <a
                href="/login"
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl transition-all"
                style={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
                onClick={(e) => {
                  console.log('Login Guru clicked');
                  e.preventDefault();
                  setIsLoginDropdownOpen(false);
                  window.location.href = '/login';
                }}
                onTouchEnd={(e) => {
                  console.log('Login Guru touched');
                  e.preventDefault();
                  setIsLoginDropdownOpen(false);
                  setTimeout(() => {
                    window.location.href = '/login';
                  }, 100);
                }}
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: 'rgb(59 130 246 / 0.2)',
                    border: '1px solid rgb(96 165 250 / 0.3)'
                  }}
                >
                  <TeacherIcon className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">Login Guru</div>
                  <div className="text-xs text-blue-200/70">Kelola soal & siswa</div>
                </div>
              </a>
            </div>
          </div>
        </>
      )}

      {/* Spacer for mobile top bar */}
      <div className="md:hidden h-14"></div>

      {/* Spacer for mobile bottom navigation */}
      <div className="md:hidden h-16"></div>
    </>
  );
}
