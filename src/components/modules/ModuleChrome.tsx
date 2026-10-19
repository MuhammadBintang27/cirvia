import Link from "next/link";

interface ModuleHeroProps {
  label: string;
  title: string;
  subtitle: string;
  sections: string[];
  onJump: (index: number) => void;
}

// Kepala halaman modul: judul + daftar bagian yang bisa diklik
export function ModuleHero({ label, title, subtitle, sections, onJump }: ModuleHeroProps) {
  return (
    <header className="border-b-2 border-ink">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <Link href="/materials" className="label-mono text-muted hover:text-ink">
          ← Semua materi
        </Link>
        <div className="mt-6 max-w-3xl">
          <span className="tag">
            {label} · {sections.length} bagian
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-[1.05] text-ink">{title}</h1>
          <p className="mt-4 text-lg text-muted">{subtitle}</p>
        </div>
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Daftar bagian">
          {sections.map((name, i) => (
            <button
              key={name}
              onClick={() => onJump(i)}
              className="rounded-full border-2 border-ink bg-paper px-3 py-1 text-sm font-bold text-ink hover:bg-lamp-soft"
            >
              <span className="mr-1.5 font-mono text-muted">{String(i + 1).padStart(2, "0")}</span>
              {name}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}

// Penanda awal tiap bagian, menggantikan pembatas ikon petir
export function SectionLabel({ n, total, name }: { n: number; total: number; name: string }) {
  return (
    <div className="mb-10 flex items-center gap-4">
      <span className="grid h-11 w-11 flex-none place-items-center rounded-full border-2 border-ink bg-lamp font-display text-lg font-extrabold text-ink shadow-key-sm">
        {n}
      </span>
      <span className="label-mono text-muted">
        Bagian {n}/{total} · {name}
      </span>
      <span className="h-0 flex-1 border-t-2 border-dashed border-ink/30" />
    </div>
  );
}
