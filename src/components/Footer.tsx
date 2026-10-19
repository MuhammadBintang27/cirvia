import Link from 'next/link'

const columns = [
  {
    title: 'Menu Utama',
    links: [
      { href: '/about', label: 'Tentang Kami' },
      { href: '/materials', label: 'Materi Pembelajaran' },
      { href: '/learning-style', label: 'Tes Gaya Belajar' },
      { href: '/practicum', label: 'Praktikum CV' },
    ],
  },
  {
    title: 'Penilaian',
    links: [
      { href: '/pretest', label: 'Pre-test' },
      { href: '/posttest', label: 'Post-test' },
    ],
  },
]

export type FooterTheme = 'default' | 'purple' | 'yellow' | 'emerald'

// theme masih diterima supaya halaman modul lama tetap kompilasi; desain baru hanya punya satu tampilan.
export default function Footer(_props: { theme?: FooterTheme | string; className?: string }) {
  return (
    <footer className="relative z-10 border-t-2 border-ink bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-extrabold">CIRVIA</p>
            <p className="label-mono mt-1 text-muted">Circuit Virtual Interactive Application</p>
            <p className="mt-4 max-w-sm text-sm text-muted">
              Platform pembelajaran fisika rangkaian listrik dengan teknologi Computer Vision. Belajar konsep I, V, R secara interaktif dengan deteksi gestur tangan.
            </p>
            <a
              href="https://github.com/MuhammadBintang27/cirvia"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm mt-5 !shadow-key-sm"
            >
              GitHub
            </a>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-lg font-extrabold">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm font-semibold text-muted underline-offset-4 hover:text-ink hover:underline">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 border-t-2 border-ink/10 pt-5 text-sm text-muted">
          © {new Date().getFullYear()} CIRVIA · Platform Pembelajaran Fisika Rangkaian Listrik
        </p>
      </div>
    </footer>
  )
}
