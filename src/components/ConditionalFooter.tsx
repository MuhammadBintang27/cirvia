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
    '/learning-style',
    '/materials/module-1', // ModuleIntroductionPageNew - has integrated footer
    '/materials/module-2', // ModuleSeriesPageNew - has integrated footer
    '/materials/module-3', // ModuleParallelPageNew - has integrated footer
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