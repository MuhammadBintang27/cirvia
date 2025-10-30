'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Halaman yang tidak boleh ada footer
  const excludedPaths = [
    '/login',
    '/login/student',
    '/pretest',
    '/posttest',
    '/learning-style'
  ];
  
  // Cek apakah path saat ini ada dalam daftar exclude
  const shouldHideFooter = excludedPaths.some(path => pathname.startsWith(path));
  
  // Jika harus disembunyikan, return null
  if (shouldHideFooter) {
    return null;
  }
  
  // Jika tidak, tampilkan footer
  return <Footer />;
}