'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, FlaskConical, ClipboardCheck, Users, LogIn, User, LogOut, ChevronDown, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Beranda', href: '/', icon: Home },
  { name: 'Materi', href: '/materials', icon: BookOpen },
  { name: 'Praktikum', href: '/practicum', icon: FlaskConical },
  { name: 'Test', href: '/test', icon: ClipboardCheck },
  { name: 'Tentang', href: '/about', icon: Users },
];

// Halaman tes tidak boleh ada navbar
const hiddenPaths = ['/learning-style', '/pretest', '/posttest'];

export default function Navbar() {
  const { user, logout, isTeacher } = useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    document.addEventListener('touchstart', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('touchstart', close);
    };
  }, [menuOpen]);

  if (hiddenPaths.some((p) => pathname.startsWith(p))) return null;
  // Guru hanya melihat navbar di dashboard guru
  if (isTeacher() && !pathname.startsWith('/dashboard/teacher')) return null;

  const items = isTeacher() ? [] : navigation;
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const profileHref = user?.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student';

  const authArea = user ? (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((o) => !o)}
        aria-expanded={menuOpen}
        className="btn btn-sm !shadow-key-sm bg-mint"
      >
        <User className="h-4 w-4" />
        <span className="max-w-[9rem] truncate">{user.name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
      </button>
      {menuOpen && (
        <div className="card absolute right-0 top-full z-50 mt-3 w-60 p-2">
          <div className="px-3 pb-2 pt-1">
            <p className="truncate font-bold">{user.name}</p>
            <p className="text-xs text-muted">{user.role === 'teacher' ? 'Guru' : 'Siswa'}</p>
          </div>
          <Link
            href={profileHref}
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl p-3 hover:bg-mint-soft"
          >
            <User className="h-5 w-5" />
            <span className="font-semibold">Dashboard</span>
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl p-3 text-left text-red-600 hover:bg-coral-soft"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
      )}
    </div>
  ) : (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen((o) => !o)}
        aria-expanded={menuOpen}
        className="btn btn-sm btn-lamp !shadow-key-sm"
      >
        <LogIn className="h-4 w-4" />
        Login
        <ChevronDown className={`h-4 w-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
      </button>
      {menuOpen && (
        <div className="card absolute right-0 top-full z-50 mt-3 w-64 p-2">
          <a href="/login/student" className="flex items-center gap-3 rounded-xl p-3 hover:bg-mint-soft">
            <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-mint">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-bold">Login Siswa</span>
              <span className="block text-xs text-muted">Akses materi dan test</span>
            </span>
          </a>
          <a href="/login" className="flex items-center gap-3 rounded-xl p-3 hover:bg-brand-soft">
            <span className="grid h-10 w-10 place-items-center rounded-xl border-2 border-ink bg-brand text-white">
              <BookOpen className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-bold">Login Guru</span>
              <span className="block text-xs text-muted">Kelola soal dan siswa</span>
            </span>
          </a>
        </div>
      )}
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 z-40 border-b-2 border-ink bg-cream">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2.5 font-display text-2xl font-extrabold text-ink">
            <Image src="/logo.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
            CIRVIA
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`rounded-full border-2 px-4 py-1.5 font-bold text-ink hover:bg-lamp-soft ${
                  isActive(item.href) ? 'border-ink bg-lamp' : 'border-transparent hover:border-ink'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {authArea}
        </div>
      </nav>

      {/* Mobile bottom tabs */}
      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-ink bg-cream md:hidden">
          <div className="grid grid-cols-5">
            {items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.name} href={item.href} className="flex flex-col items-center py-2 text-xs font-bold text-ink">
                  <span className={`rounded-full border-2 px-3 py-0.5 ${active ? 'border-ink bg-lamp' : 'border-transparent'}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
