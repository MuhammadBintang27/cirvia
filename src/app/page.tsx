import Link from 'next/link'
import Image from 'next/image'
import { Hand } from 'lucide-react'
import Navbar from '@/components/Navbar'

const features = [
  {
    tag: 'Lab virtual',
    tagBg: 'bg-brand-soft',
    title: 'Susun rangkaian, langsung lihat hasilnya.',
    body: 'Seret komponen ke papan. Lampu menyala atau redup sesuai hitungan, jadi kesalahan menjadi bahan belajar, bukan masalah.',
    points: ['Rangkaian seri dan paralel', 'Tegangan, arus, dan hambatan real-time'],
  },
  {
    tag: 'Hand tracking',
    tagBg: 'bg-mint-soft',
    title: 'Pegang komponennya pakai tangan.',
    body: 'Webcam membaca gerakan jarimu untuk memilih, memindah, dan menyambung komponen. Praktikum terasa seperti sungguhan.',
    points: ['Jalan di browser, tanpa instal', 'Ada log gestur untuk guru'],
  },
  {
    tag: 'Umpan balik AI',
    tagBg: 'bg-coral-soft',
    title: 'Tahu persis bagian mana yang masih keliru.',
    body: 'Setelah mengerjakan, AI menjelaskan kesalahanmu dengan bahasa sederhana dan menyesuaikannya dengan gaya belajarmu.',
    points: ['Tes gaya belajar di awal', 'Progres dan hasil tersimpan'],
  },
]

const steps = [
  { href: '/learning-style', title: 'Tes gaya belajar', desc: 'Kenali cara belajarmu.', bg: 'bg-coral' },
  { href: '/pretest', title: 'Tes diagnostik', desc: 'Cek pengetahuan awal.', bg: 'bg-lamp' },
  { href: '/materials', title: 'Materi', desc: 'Konsep seri dan paralel.', bg: 'bg-mint' },
  { href: '/practicum', title: 'Praktikum', desc: 'Rangkai dan uji sendiri.', bg: 'bg-brand text-white' },
  { href: '/posttest', title: 'Tes sumatif', desc: 'Lihat seberapa naik nilaimu.', bg: 'bg-paper' },
]

const testimonials = [
  {
    name: 'Rafif & Hunatul',
    role: 'Siswa SMAN 5 Banda Aceh',
    image: '/testimoni/testi1.png',
    content: 'CIRVIA benar-benar mengubah cara saya memahami fisika! Simulasinya mudah dipahami.',
    bg: 'bg-lamp-soft',
  },
  {
    name: 'Cut Mardiana',
    role: 'Guru Fisika SMAN 5 Banda Aceh',
    image: '/testimoni/testi2.png',
    content: 'Inovasi baru yang disukai siswa. Pembelajaran lebih menarik dan praktikum lebih mudah dilakukan.',
    bg: 'bg-mint-soft',
  },
  {
    name: 'Dr. Susilawati, S.Pd., M.Ed.',
    role: 'Validator materi, Univ. Syiah Kuala',
    image: '/testimoni/testi3.jpg',
    content: 'Praktikum computer vision, penyesuaian gaya belajar, dan umpan balik AI membuat pembelajaran jauh lebih efektif.',
    bg: 'bg-brand-soft',
  },
]

// Mockup fitur (bukan screenshot asli). Ganti dengan <Image> bila tangkapan layar sudah ada.
function FeatureVisual({ i }: { i: number }) {
  if (i === 0) {
    // Canvas drag & drop: baterai -> resistor -> lampu, tersambung dalam satu loop
    return (
      <svg viewBox="0 0 500 400" className="h-full w-full" role="img" aria-label="Pembuat rangkaian drag and drop">
        <rect width="500" height="400" fill="#14172B" />
        {[...Array(13)].map((_, c) => <line key={`v${c}`} x1={40 * c} y1="0" x2={40 * c} y2="400" stroke="#ffffff" strokeOpacity="0.05" />)}
        {[...Array(10)].map((_, r) => <line key={`h${r}`} x1="0" y1={40 * r} x2="500" y2={40 * r} stroke="#ffffff" strokeOpacity="0.05" />)}
        {/* toolbar komponen */}
        {[['Baterai', '#FF6B5B'], ['Lampu', '#FFC93C'], ['Resistor', '#F28C28'], ['Saklar', '#3DD6A0']].map(([label, fill], k) => (
          <g key={label as string}>
            <rect x={20 + k * 90} y="18" width="80" height="34" rx="9" fill={fill as string} stroke="#1B1B2F" strokeWidth="2" />
            <text x={60 + k * 90} y="40" textAnchor="middle" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#1B1B2F">{label}</text>
          </g>
        ))}
        {/* loop kabel */}
        <path d="M100 320V140H400V320Z" fill="none" stroke="#FFB020" strokeWidth="5" strokeLinejoin="round" />
        {/* baterai */}
        <rect x="74" y="222" width="52" height="54" rx="8" fill="#FF6B5B" stroke="#1B1B2F" strokeWidth="3" />
        <text x="100" y="255" textAnchor="middle" fontFamily="monospace" fontSize="16" fontWeight="700" fill="#fff">9V</text>
        {/* resistor + pita warna */}
        <rect x="200" y="122" width="100" height="36" rx="10" fill="#E8D5A8" stroke="#1B1B2F" strokeWidth="3" />
        <rect x="222" y="122" width="10" height="36" fill="#8B5A2B" /><rect x="244" y="122" width="10" height="36" fill="#1B1B2F" /><rect x="266" y="122" width="10" height="36" fill="#E5483B" />
        {/* lampu menyala */}
        <circle cx="400" cy="230" r="44" fill="#FFC93C" opacity="0.55" />
        <circle cx="400" cy="230" r="26" fill="#FFF0BF" stroke="#1B1B2F" strokeWidth="3" />
        <path d="M388 242l12-24 12 24" fill="none" stroke="#1B1B2F" strokeWidth="3" strokeLinecap="round" />
        {/* kursor drag */}
        <g transform="translate(250 250)"><circle r="26" fill="#D5F7EA" stroke="#1B1B2F" strokeWidth="2.5" strokeDasharray="6 5" /><Hand x={-13} y={-13} width={26} height={26} stroke="#1B1B2F" /></g>
      </svg>
    )
  }
  if (i === 1) {
    // Hand tracking: meniru tata letak praktikum CV (toolbar, kanvas, kamera, hasil)
    // kerangka tangan ringkas untuk kotak kamera
    const camWrist: [number, number] = [68, 150]
    const camFingers: [number, number][][] = [
      [[44, 134], [32, 120]],
      [[54, 116], [50, 86], [48, 66]],
      [[70, 112], [71, 80], [72, 58]],
      [[86, 116], [92, 88], [96, 70]],
      [[98, 128], [110, 108], [117, 94]],
    ]
    return (
      <svg viewBox="0 0 500 400" className="h-full w-full" role="img" aria-label="Praktikum computer vision">
        <rect width="500" height="400" fill="#14172B" />
        {/* toolbar komponen */}
        {[['Baterai', '#3B6FD8'], ['Lampu', '#F5A623'], ['Resistor', '#E5483B'], ['Saklar', '#3DA35D']].map(([label, fill], k) => (
          <g key={label as string}>
            <rect x={16 + k * 82} y="16" width="74" height="30" rx="8" fill={fill as string} stroke="#1B1B2F" strokeWidth="2" />
            <text x={53 + k * 82} y="36" textAnchor="middle" fontFamily="sans-serif" fontSize="12" fontWeight="700" fill="#fff">{label}</text>
          </g>
        ))}
        <rect x="388" y="16" width="96" height="30" rx="8" fill="#2F5BFF" stroke="#1B1B2F" strokeWidth="2" />
        <circle cx="408" cy="31" r="5" fill="#fff" /><text x="420" y="36" fontFamily="sans-serif" fontSize="12" fontWeight="700" fill="#fff">Kamera</text>

        {/* kanvas rangkaian */}
        <rect x="16" y="58" width="322" height="258" rx="10" fill="#0B1020" stroke="#2A3350" strokeWidth="2" />
        <g transform="translate(16 58)">
          {[...Array(8)].map((_, c) => <line key={c} x1={40 * c} y1="0" x2={40 * c} y2="258" stroke="#ffffff" strokeOpacity="0.04" />)}
          {/* loop + komponen */}
          <path d="M70 210V70H250V210Z" fill="none" stroke="#FFB020" strokeWidth="4" strokeLinejoin="round" />
          <rect x="48" y="118" width="44" height="46" rx="7" fill="#FF6B5B" stroke="#1B1B2F" strokeWidth="2.5" /><text x="70" y="146" textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="700" fill="#fff">9V</text>
          <rect x="120" y="54" width="80" height="30" rx="8" fill="#E8D5A8" stroke="#1B1B2F" strokeWidth="2.5" /><rect x="138" y="54" width="8" height="30" fill="#8B5A2B" /><rect x="156" y="54" width="8" height="30" fill="#1B1B2F" /><rect x="174" y="54" width="8" height="30" fill="#E5483B" />
          <circle cx="250" cy="140" r="34" fill="#FFC93C" opacity="0.5" /><circle cx="250" cy="140" r="21" fill="#FFF0BF" stroke="#1B1B2F" strokeWidth="2.5" /><path d="M241 150l9-18 9 18" fill="none" stroke="#1B1B2F" strokeWidth="2.5" strokeLinecap="round" />
          {/* overlay tangan: telunjuk menunjuk resistor */}
          <g stroke="#3DD6A0" strokeWidth="2.5">
            <line x1="150" y1="238" x2="158" y2="150" /><line x1="150" y1="238" x2="120" y2="210" /><line x1="150" y1="238" x2="182" y2="214" />
          </g>
          {[[150, 238], [155, 196], [158, 150], [120, 210], [182, 214], [138, 232]].map((p, k) => <circle key={k} cx={p[0]} cy={p[1]} r="4.5" fill="#FFF0BF" stroke="#1B1B2F" strokeWidth="1.5" />)}
          <circle cx="158" cy="150" r="12" fill="none" stroke="#FFC93C" strokeWidth="2.5" />
        </g>

        {/* kotak kamera */}
        <rect x="350" y="58" width="134" height="180" rx="10" fill="#060912" stroke="#3DD6A0" strokeWidth="2" />
        <g transform="translate(358 70)">
          {camFingers.map((f, fi) => (
            <g key={fi} stroke="#3DD6A0" strokeWidth="2.5">
              <line x1={camWrist[0]} y1={camWrist[1]} x2={f[0][0]} y2={f[0][1]} />
              {f.slice(1).map((pt, j) => <line key={j} x1={f[j][0]} y1={f[j][1]} x2={pt[0]} y2={pt[1]} />)}
            </g>
          ))}
          {[camWrist, ...camFingers.flat()].map((p, k) => <circle key={k} cx={p[0]} cy={p[1]} r="3.5" fill="#FFF0BF" stroke="#1B1B2F" strokeWidth="1" />)}
          <circle cx="12" cy="12" r="5" fill="#FF6B5B" /><text x="24" y="16" fontFamily="monospace" fontSize="10" fontWeight="700" fill="#fff">REC</text>
        </g>
        <rect x="362" y="210" width="110" height="20" rx="10" fill="#1B2A22" /><circle cx="378" cy="220" r="4" fill="#3DD6A0" /><text x="388" y="224" fontFamily="sans-serif" fontSize="11" fontWeight="700" fill="#3DD6A0">Hand OK</text>

        {/* bar hasil + gestur */}
        <rect x="16" y="328" width="468" height="56" rx="10" fill="#0B1020" stroke="#2A3350" strokeWidth="2" />
        <text x="30" y="348" fontFamily="sans-serif" fontSize="10" fontWeight="700" fill="#F5A623">HASIL HUKUM OHM</text>
        {[['V', '9.0'], ['I', '0.09'], ['R', '100']].map(([k2, v], k) => (
          <text key={k} x={30 + k * 86} y="372" fontFamily="monospace" fontSize="14" fill="#8CFF9E">{k2} = {v}</text>
        ))}
        <g transform="translate(300 342)">
          <rect width="170" height="28" rx="14" fill="#140E24" stroke="#7B4FBF" strokeWidth="2" />
          <text x="14" y="19" fontFamily="sans-serif" fontSize="12" fontWeight="700" fill="#C9B6F0">POINT</text>
          <rect x="74" y="11" width="60" height="6" rx="3" fill="#2A2140" /><rect x="74" y="11" width="52" height="6" rx="3" fill="#7B4FBF" />
          <text x="140" y="20" fontFamily="monospace" fontSize="11" fill="#C9B6F0">88%</text>
        </g>
      </svg>
    )
  }
  // Dashboard guru: kartu statistik + progress gaya belajar (tema gelap)
  return (
    <svg viewBox="0 0 500 400" className="h-full w-full" role="img" aria-label="Dashboard guru">
      <rect width="500" height="400" fill="#14172B" />
      {/* header */}
      <circle cx="40" cy="38" r="15" fill="#2F5BFF" stroke="#2A3350" strokeWidth="2.5" />
      <rect x="66" y="28" width="120" height="10" rx="5" fill="#E5E9F5" /><rect x="66" y="44" width="80" height="7" rx="3.5" fill="#8CA0C0" />
      {/* 3 kartu statistik */}
      {[['29', '#8FB0FF', '#3B6FD8'], ['34%', '#FFC93C', '#F5A623'], ['79%', '#C9B6F0', '#7B4FBF']].map(([num, text, border], k) => (
        <g key={k}>
          <rect x={24 + k * 152} y="74" width="134" height="86" rx="14" fill="#0B1020" stroke={border as string} strokeWidth="2.5" />
          <text x={40 + k * 152} y="120" fontFamily="sans-serif" fontSize="30" fontWeight="800" fill={text as string}>{num}</text>
          <rect x={40 + k * 152} y="132" width="70" height="7" rx="3.5" fill="#2A3350" />
        </g>
      ))}
      {/* panel progress */}
      <rect x="24" y="178" width="452" height="198" rx="14" fill="#0B1020" stroke="#2A3350" strokeWidth="2.5" />
      <rect x="44" y="198" width="150" height="10" rx="5" fill="#E5E9F5" />
      {[['Visual', '#5B8CFF', 0.7], ['Auditory', '#9B7BD4', 0.52], ['Kinestetik', '#3DD6A0', 0.34]].map(([label, fill, w], k) => (
        <g key={k}>
          <text x="44" y={244 + k * 42} fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#CBD3E6">{label}</text>
          <rect x="150" y={232 + k * 42} width="300" height="16" rx="8" fill="#2A3350" />
          <rect x="150" y={232 + k * 42} width={300 * (w as number)} height="16" rx="8" fill={fill as string} />
        </g>
      ))}
    </svg>
  )
}

export default function HomePage() {
  return (
    // Halaman lain masih bertema gelap; panel ini menutup latar global sampai semuanya dimigrasi.
    <div className="bg-grid min-h-screen font-sans text-ink">
      <Navbar />

      {/* Hero */}
      <header className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-14 pt-16 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <span className="tag">Fisika SMA · Rangkaian Listrik</span>
          <h1 className="mb-5 mt-5 font-display text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-[1.08] tracking-tight">
            Rangkai listrik pakai{' '}
            <mark className="inline-block -rotate-[1.5deg] rounded-xl border-2 border-ink bg-lamp px-2">tanganmu</mark>{' '}
            sendiri.
          </h1>
          <p className="mb-7 max-w-lg text-xl text-muted">
            CIRVIA adalah lab virtual: susun baterai, resistor, dan lampu di layar, lalu kendalikan dengan gerakan tangan lewat webcam. Tanpa kabel, tanpa takut korslet.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/practicum" className="btn btn-primary">▶ Mulai praktikum</Link>
            <Link href="/materials" className="btn">Lihat materi</Link>
          </div>
          <p className="mt-5 text-[15px] text-muted">Cukup browser dan webcam</p>
        </div>

        <div className="relative">
          <span className="tag absolute -right-3 -top-4 z-10 rotate-[8deg] !bg-coral !text-white">Deteksi tangan</span>
          <div className="card rotate-[1.5deg] overflow-hidden">
            <div className="flex items-center gap-1.5 border-b-2 border-ink bg-brand-soft px-3.5 py-2.5">
              <i className="block h-3 w-3 rounded-full border-2 border-ink bg-coral" />
              <i className="block h-3 w-3 rounded-full border-2 border-ink bg-lamp" />
              <i className="block h-3 w-3 rounded-full border-2 border-ink bg-mint" />
              <span className="ml-2.5 font-mono text-xs text-muted">cirvia / praktikum</span>
            </div>
            <div className="relative grid aspect-[4/3] place-items-center bg-paper">
              {/* TODO: ganti SVG ini dengan <Image src="/assets/screens/praktikum.png" fill alt="..."> kalau screenshot sudah ada */}
              <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Rangkaian seri: baterai, resistor, lampu menyala">
                <path d="M70 150V70H150M250 70H330V150M330 150V230H250M150 230H70V150" fill="none" stroke="#1B1B2F" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="40" y="130" width="60" height="40" rx="8" fill="#FF6B5B" stroke="#1B1B2F" strokeWidth="4" />
                <text x="70" y="157" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="16" fill="#fff">9V</text>
                <rect x="150" y="52" width="100" height="36" rx="10" fill="#FFC93C" stroke="#1B1B2F" strokeWidth="4" />
                <path d="M180 52v36M200 52v36M220 52v36" stroke="#1B1B2F" strokeWidth="4" />
                <text x="200" y="40" textAnchor="middle" fontFamily="monospace" fontSize="13" fill="#5B5B73">R = 100 Ω</text>
                <circle cx="330" cy="190" r="46" fill="#FFC93C" opacity=".6">
                  <animate attributeName="opacity" values=".35;.8;.35" dur="2.4s" repeatCount="indefinite" />
                </circle>
                <circle cx="330" cy="190" r="26" fill="#FFF0BF" stroke="#1B1B2F" strokeWidth="4" />
                <path d="M318 202l12-24 12 24" fill="none" stroke="#1B1B2F" strokeWidth="3" strokeLinecap="round" />
                <text x="200" y="262" textAnchor="middle" fontFamily="monospace" fontSize="14" fill="#2F5BFF">I = 0,09 A →</text>
                <circle cx="170" cy="150" r="30" fill="#D5F7EA" stroke="#1B1B2F" strokeWidth="3" strokeDasharray="6 5" />
                <Hand x={155} y={135} width={30} height={30} stroke="#1B1B2F" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Bukti */}
      <div className="border-y-2 border-ink bg-ink py-3.5 text-cream">
        <div className="label-mono mx-auto flex max-w-6xl flex-wrap justify-center gap-x-9 gap-y-2 px-5">
          <span><b className="text-lamp">Diuji</b> di SMAN 5 Banda Aceh</span>
          <span><b className="text-lamp">Divalidasi</b> dosen Pendidikan Fisika USK</span>
          <span><b className="text-lamp">3</b> gaya belajar dikenali</span>
        </div>
      </div>

      {/* Fitur */}
      <section className="mx-auto max-w-6xl px-5 pt-20">
        <div className="mb-10 max-w-xl">
          <span className="label-mono text-brand">Apa yang bisa dilakukan</span>
          <h2 className="mt-2.5 font-display text-[clamp(1.9rem,4.5vw,2.9rem)] font-extrabold leading-[1.08] tracking-tight">
            Tiga cara belajar yang tidak ada di buku paket.
          </h2>
        </div>

        {features.map((f, i) => (
          <div key={f.tag} className="mb-14 grid items-center gap-10 md:grid-cols-2">
            <div className={i % 2 ? 'md:order-2' : ''}>
              <span className={`tag ${f.tagBg}`}>{f.tag}</span>
              <h3 className="mb-3 mt-3 font-display text-3xl font-extrabold leading-tight tracking-tight">{f.title}</h3>
              <p className="mb-3.5 text-muted">{f.body}</p>
              <ul className="grid gap-2">
                {f.points.map((p) => (
                  <li key={p} className="flex gap-2.5 font-semibold">
                    <span className="mt-1.5 grid h-5 w-5 flex-none place-items-center rounded-full border-2 border-ink bg-mint text-[11px] leading-none">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card aspect-[5/4] overflow-hidden">
              <FeatureVisual i={i} />
            </div>
          </div>
        ))}
      </section>

      {/* Alur belajar */}
      <section className="mx-auto max-w-6xl px-5 pt-20">
        <div className="mb-10 max-w-xl">
          <span className="label-mono text-brand">Alur belajar</span>
          <h2 className="mt-2.5 font-display text-[clamp(1.9rem,4.5vw,2.9rem)] font-extrabold leading-[1.08] tracking-tight">
            Lima langkah, dari nol sampai paham.
          </h2>
        </div>
        <div className="relative grid gap-5 md:grid-cols-5">
          {/* kabel penghubung antar langkah: kabel padat + arus mengalir (lewat tengah node, 60px) */}
          <div aria-hidden className="pointer-events-none absolute left-[27px] top-8 bottom-8 w-1.5 rounded-full bg-ink md:hidden" />
          <div aria-hidden className="pointer-events-none absolute left-[28px] top-8 bottom-8 border-l-[3px] border-dashed border-lamp md:hidden" />
          <div aria-hidden className="pointer-events-none absolute left-[10%] right-[10%] top-[30px] hidden h-1.5 -translate-y-1/2 rounded-full bg-ink md:block" />
          <div aria-hidden className="pointer-events-none absolute left-[10%] right-[10%] top-[30px] hidden -translate-y-1/2 border-t-[3px] border-dashed border-lamp md:block" />
          {steps.map((s, i) => (
            <Link key={s.href} href={s.href} className="group relative grid grid-cols-[60px_1fr] items-center gap-4 text-left md:block md:text-center">
              <div className={`${s.bg} card mx-auto grid h-[60px] w-[60px] place-items-center !rounded-full font-display text-2xl font-extrabold transition-transform group-hover:-rotate-[8deg] md:mb-3.5`}>
                {i + 1}
              </div>
              <div>
                <h4 className="font-display text-lg font-extrabold">{s.title}</h4>
                <p className="text-[15px] leading-snug text-muted">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimoni */}
      <section className="mx-auto max-w-6xl px-5 pt-20">
        <div className="mb-10 max-w-xl">
          <span className="label-mono text-brand">Kata mereka</span>
          <h2 className="mt-2.5 font-display text-[clamp(1.9rem,4.5vw,2.9rem)] font-extrabold leading-[1.08] tracking-tight">
            Dipakai dan dinilai langsung di kelas.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className={`card flex flex-col gap-4 p-6 ${t.bg}`}>
              <blockquote className="text-lg font-semibold leading-relaxed">“{t.content}”</blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <Image src={t.image} alt="" width={52} height={52} className="h-[52px] w-[52px] rounded-full border-2 border-ink bg-brand-soft object-cover" />
                <span className="leading-tight">
                  <b className="block">{t.name}</b>
                  <small className="text-muted">{t.role}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24 pt-24">
        <div className="card bg-brand px-8 py-14 text-center text-white">
          <h2 className="mb-3 font-display text-[clamp(1.9rem,5vw,3rem)] font-extrabold leading-tight tracking-tight">
            Siap menyalakan lampu pertamamu?
          </h2>
          <p className="mb-6 opacity-90">Mulai dari tes gaya belajar, hanya beberapa menit.</p>
          <Link href="/learning-style" className="btn btn-lamp">Mulai sekarang →</Link>
        </div>
      </section>
    </div>
  )
}
