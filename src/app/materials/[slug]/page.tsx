'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import AudioPlayer from '@/components/AudioPlayer'
import InteractiveCircuitDemo from '@/components/InteractiveCircuitDemo'
import { useProgressTracking } from '@/hooks/useProgressTracking'

// Data modules
const modulesData = {
  'konsep-dasar-listrik': {
    id: 'module-1',
    title: 'Konsep Dasar Listrik',
    subtitle: 'Memahami arus, tegangan, dan resistansi',
    description: 'Pelajari dasar-dasar listrik dengan cara yang mudah dipahami',
    content: `
      <h4>Apa itu Listrik?</h4>
      <p>Listrik adalah energi yang kita gunakan setiap hari. Bayangkan listrik seperti air yang mengalir di dalam pipa. Air membutuhkan tekanan untuk bisa mengalir, begitu juga listrik membutuhkan "tekanan" yang disebut <strong>tegangan</strong>.</p>
      
      <h4>Tiga Hal Penting dalam Listrik:</h4>
      <ul>
        <li><strong>Arus Listrik (I)</strong>: Seperti air yang mengalir, arus listrik adalah aliran muatan listrik. Diukur dalam Ampere (A).</li>
        <li><strong>Tegangan (V)</strong>: Seperti tekanan air, tegangan adalah "dorongan" yang membuat arus mengalir. Diukur dalam Volt (V).</li>
        <li><strong>Resistansi (R)</strong>: Seperti pipa yang sempit menghambat aliran air, resistansi menghambat aliran listrik. Diukur dalam Ohm (Ω).</li>
      </ul>
      
      <h4>Hukum Ohm - Rumus Ajaib</h4>
      <p>Georg Ohm menemukan hubungan sederhana: <strong>V = I × R</strong></p>
      <p>Artinya: Tegangan = Arus × Resistansi</p>
      <p>Contoh: Jika lampu memiliki resistansi 10Ω dan dialiri arus 2A, maka tegangannya adalah 10 × 2 = 20V</p>
      
      <h4>Contoh dalam Kehidupan Sehari-hari:</h4>
      <ul>
        <li><strong>Lampu LED 10W</strong>: Hemat energi karena resistansi tinggi</li>
        <li><strong>Setrika 350W</strong>: Butuh arus besar untuk menghasilkan panas</li>
        <li><strong>Charger HP 5V</strong>: Tegangan rendah untuk keamanan</li>
      </ul>
    `,
    audioData: {
      title: 'Audio: Konsep Dasar Listrik',
      description: 'Penjelasan sederhana tentang arus, tegangan, dan resistansi',
      chapters: [
        { title: 'Pengenalan Listrik', startTime: 0, duration: 120 },
        { title: 'Arus Listrik', startTime: 120, duration: 90 },
        { title: 'Tegangan', startTime: 210, duration: 90 },
        { title: 'Resistansi', startTime: 300, duration: 90 },
        { title: 'Hukum Ohm', startTime: 390, duration: 120 }
      ]
    },
    demoData: {
      voltage: 12,
      resistance: 100,
      title: 'Demo: Hukum Ohm'
    },
    gradientColors: 'from-blue-500 to-cyan-500'
  },
  'rangkaian-seri': {
    id: 'module-2',
    title: 'Rangkaian Seri',
    subtitle: 'Komponen tersusun berurutan',
    description: 'Pelajari bagaimana komponen listrik disusun berurutan',
    content: `
      <h4>Apa itu Rangkaian Seri?</h4>
      <p>Bayangkan rangkaian seri seperti kereta api yang berisi gerbong-gerbong. Semua gerbong tersambung berurutan dalam satu jalur. Jika satu gerbong terputus, seluruh kereta berhenti.</p>
      
      <h4>Ciri-ciri Rangkaian Seri:</h4>
      <ul>
        <li><strong>Arus sama di semua tempat</strong>: Seperti air dalam pipa tunggal, arus yang masuk sama dengan arus yang keluar</li>
        <li><strong>Tegangan terbagi</strong>: Tegangan baterai dibagi-bagi ke setiap komponen</li>
        <li><strong>Jika satu rusak, semua mati</strong>: Seperti lampu natal lama, jika satu mati semua ikut mati</li>
      </ul>
      
      <h4>Rumus Rangkaian Seri:</h4>
      <ul>
        <li><strong>Resistansi Total</strong>: R_total = R1 + R2 + R3 + ...</li>
        <li><strong>Arus</strong>: I sama di semua komponen</li>
        <li><strong>Tegangan</strong>: V_total = V1 + V2 + V3 + ...</li>
      </ul>
      
      <h4>Contoh Mudah:</h4>
      <p>Jika ada 3 lampu (masing-masing 10Ω) disambung seri dengan baterai 30V:</p>
      <ul>
        <li>R_total = 10 + 10 + 10 = 30Ω</li>
        <li>I = V/R = 30V/30Ω = 1A</li>
        <li>Setiap lampu mendapat tegangan 10V</li>
      </ul>
      
      <h4>Keuntungan dan Kerugian:</h4>
      <ul>
        <li><strong>Keuntungan</strong>: Mudah dibuat, hemat kabel</li>
        <li><strong>Kerugian</strong>: Jika satu rusak semua mati, tegangan tidak merata</li>
      </ul>
    `,
    audioData: {
      title: 'Audio: Rangkaian Seri',
      description: 'Memahami karakteristik dan perhitungan rangkaian seri',
      chapters: [
        { title: 'Konsep Rangkaian Seri', startTime: 0, duration: 120 },
        { title: 'Ciri-ciri Seri', startTime: 120, duration: 100 },
        { title: 'Rumus Perhitungan', startTime: 220, duration: 110 },
        { title: 'Contoh Soal', startTime: 330, duration: 90 }
      ]
    },
    demoData: {
      voltage: 9,
      resistance: 150,
      title: 'Demo: Rangkaian Seri'
    },
    gradientColors: 'from-green-500 to-blue-500'
  },
  'daya-listrik': {
    id: 'module-3',
    title: 'Daya Listrik',
    subtitle: 'Energi yang digunakan peralatan listrik',
    description: 'Pelajari konsep daya listrik dan cara menghitungnya',
    content: `
      <h4>Apa itu Daya Listrik?</h4>
      <p>Daya listrik adalah seberapa cepat alat listrik menggunakan energi. Bayangkan seperti seberapa cepat mobil menghabiskan bensin. Semakin besar daya, semakin cepat energi terpakai.</p>
      
      <h4>Mengapa Daya Penting?</h4>
      <ul>
        <li><strong>Untuk menghitung tagihan listrik</strong>: PLN menagih berdasarkan berapa banyak energi yang kita pakai</li>
        <li><strong>Memilih alat yang tepat</strong>: Lampu 10W lebih hemat dari lampu 60W</li>
        <li><strong>Keamanan</strong>: Jangan pasang alat berdaya tinggi di colokan kecil</li>
      </ul>
      
      <h4>Rumus Daya Listrik:</h4>
      <ul>
        <li><strong>P = V × I</strong> (Daya = Tegangan × Arus)</li>
        <li><strong>P = I² × R</strong> (Daya = Arus kuadrat × Resistansi)</li>
        <li><strong>P = V² / R</strong> (Daya = Tegangan kuadrat / Resistansi)</li>
      </ul>
      
      <h4>Contoh Sehari-hari:</h4>
      <p>Lampu 60W di rumah (220V):</p>
      <ul>
        <li>P = 60W, V = 220V</li>
        <li>I = P/V = 60/220 = 0.27A</li>
        <li>Jika nyala 5 jam: Energi = 60W × 5h = 300Wh = 0.3 kWh</li>
      </ul>
      
      <h4>Tips Hemat Listrik:</h4>
      <ul>
        <li>Gunakan lampu LED (daya rendah)</li>
        <li>Cabut charger yang tidak dipakai</li>
        <li>Pilih AC dengan rating energi tinggi</li>
        <li>Matikan peralatan yang tidak digunakan</li>
      </ul>
    `,
    audioData: {
      title: 'Audio: Daya Listrik',
      description: 'Memahami konsep daya listrik dan aplikasinya',
      chapters: [
        { title: 'Konsep Daya', startTime: 0, duration: 110 },
        { title: 'Rumus Daya', startTime: 110, duration: 100 },
        { title: 'Contoh Perhitungan', startTime: 210, duration: 120 },
        { title: 'Aplikasi Sehari-hari', startTime: 330, duration: 90 }
      ]
    },
    demoData: {
      voltage: 15,
      resistance: 75,
      title: 'Demo: Daya Listrik'
    },
    gradientColors: 'from-purple-500 to-pink-500'
  }
}

export default function ModuleDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const { markModuleComplete, isModuleCompleted } = useProgressTracking()
  
  // Get module data based on slug
  const module = modulesData[slug as keyof typeof modulesData]
  
  // If module not found, show 404
  if (!module) {
    notFound()
  }

  const handleMarkComplete = () => {
    markModuleComplete(module.id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/materials" className="text-blue-600 hover:text-blue-800">
                ← Kembali ke Materi
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">{module.title}</h1>
            </div>
            
            {/* Progress Button */}
            <button
              onClick={handleMarkComplete}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isModuleCompleted(module.id)
                  ? 'bg-green-500 text-white cursor-default'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
              disabled={isModuleCompleted(module.id)}
            >
              {isModuleCompleted(module.id) ? '✓ Selesai' : 'Tandai Selesai'}
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Module Header */}
          <div className={`bg-gradient-to-r ${module.gradientColors} rounded-xl text-white p-8 mb-8`}>
            <h2 className="text-3xl font-bold mb-2">{module.title}</h2>
            <p className="text-lg opacity-90">{module.subtitle}</p>
            <p className="mt-4 text-sm opacity-80">{module.description}</p>
          </div>

          {/* Audio Learning Section */}
          <div className="mb-8">
            <AudioPlayer 
              title={module.audioData.title}
              description={module.audioData.description}
              chapters={module.audioData.chapters}
            />
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: module.content }}
              style={{
                lineHeight: '1.8',
              }}
            />
          </div>

          {/* Interactive Demo */}
          <div className="mb-8">
            <InteractiveCircuitDemo
              voltage={module.demoData.voltage}
              resistance={module.demoData.resistance}
              title={module.demoData.title}
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Link 
              href="/materials" 
              className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
            >
              ← Kembali ke Daftar Materi
            </Link>
            
            <Link 
              href="/practicum" 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Lanjut ke Praktikum →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
