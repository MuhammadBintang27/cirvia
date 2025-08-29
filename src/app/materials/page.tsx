import Link from 'next/link'

export default function MaterialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← Kembali ke Beranda
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Materi Pembelajaran</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Rangkaian Listrik
            </h2>
            <p className="text-lg text-gray-600">
              Pelajari konsep dasar rangkaian listrik dengan penjelasan yang mudah dipahami
            </p>
          </div>

          {/* Learning Modules */}
          <div className="space-y-8">
            {/* Module 1 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6">
                <h3 className="text-xl font-bold">Modul 1: Konsep Dasar Listrik</h3>
                <p className="text-blue-100">Memahami arus, tegangan, dan resistansi</p>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Arus Listrik (I)</h4>
                    <p className="text-gray-600 mb-4">
                      Arus listrik adalah aliran muatan listrik yang mengalir melalui penghantar. 
                      Arus diukur dalam satuan Ampere (A).
                    </p>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-sm font-semibold text-blue-800">Rumus:</p>
                      <p className="font-mono text-blue-700">I = Q/t</p>
                      <p className="text-xs text-blue-600 mt-1">
                        I = Arus (A), Q = Muatan (C), t = Waktu (s)
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Tegangan (V)</h4>
                    <p className="text-gray-600 mb-4">
                      Tegangan adalah beda potensial listrik antara dua titik. 
                      Tegangan diukur dalam satuan Volt (V).
                    </p>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <p className="text-sm font-semibold text-green-800">Rumus:</p>
                      <p className="font-mono text-green-700">V = W/Q</p>
                      <p className="text-xs text-green-600 mt-1">
                        V = Tegangan (V), W = Energi (J), Q = Muatan (C)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Resistansi (R)</h4>
                  <p className="text-gray-600 mb-4">
                    Resistansi adalah hambatan terhadap aliran arus listrik. 
                    Resistansi diukur dalam satuan Ohm (Ω).
                  </p>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                    <p className="text-sm font-semibold text-orange-800">Hukum Ohm:</p>
                    <p className="font-mono text-orange-700 text-lg">V = I × R</p>
                    <p className="text-xs text-orange-600 mt-1">
                      V = Tegangan (V), I = Arus (A), R = Resistansi (Ω)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Module 2 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6">
                <h3 className="text-xl font-bold">Modul 2: Rangkaian Seri</h3>
                <p className="text-green-100">Memahami karakteristik rangkaian seri</p>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Karakteristik Rangkaian Seri</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        Komponen disusun berurutan dalam satu jalur
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        Arus yang mengalir sama di semua komponen
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        Tegangan total = jumlah tegangan pada setiap komponen
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        Resistansi total = jumlah semua resistansi
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Rumus Rangkaian Seri</h4>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded border border-blue-200">
                        <p className="text-sm font-semibold text-blue-800">Arus:</p>
                        <p className="font-mono text-blue-700">I₁ = I₂ = I₃ = I_total</p>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded border border-green-200">
                        <p className="text-sm font-semibold text-green-800">Tegangan:</p>
                        <p className="font-mono text-green-700">V_total = V₁ + V₂ + V₃</p>
                      </div>
                      
                      <div className="bg-orange-50 p-3 rounded border border-orange-200">
                        <p className="text-sm font-semibold text-orange-800">Resistansi:</p>
                        <p className="font-mono text-orange-700">R_total = R₁ + R₂ + R₃</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Module 3 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
                <h3 className="text-xl font-bold">Modul 3: Daya Listrik</h3>
                <p className="text-purple-100">Memahami konsep daya dalam rangkaian listrik</p>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Konsep Daya Listrik</h4>
                    <p className="text-gray-600 mb-4">
                      Daya listrik adalah laju penggunaan energi listrik per satuan waktu. 
                      Daya diukur dalam satuan Watt (W).
                    </p>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                      <p className="text-sm font-semibold text-purple-800">Rumus Dasar:</p>
                      <p className="font-mono text-purple-700">P = V × I</p>
                      <p className="text-xs text-purple-600 mt-1">
                        P = Daya (W), V = Tegangan (V), I = Arus (A)
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Rumus Alternatif</h4>
                    <div className="space-y-3">
                      <div className="bg-pink-50 p-3 rounded border border-pink-200">
                        <p className="text-sm font-semibold text-pink-800">Menggunakan Resistansi:</p>
                        <p className="font-mono text-pink-700">P = I² × R</p>
                      </div>
                      
                      <div className="bg-indigo-50 p-3 rounded border border-indigo-200">
                        <p className="text-sm font-semibold text-indigo-800">Menggunakan Tegangan:</p>
                        <p className="font-mono text-indigo-700">P = V² / R</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Example Problem */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                <h3 className="text-xl font-bold">Contoh Soal</h3>
                <p className="text-orange-100">Aplikasi rumus dalam perhitungan</p>
              </div>
              <div className="p-6">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Soal:</h4>
                  <p className="text-gray-700">
                    Sebuah rangkaian seri terdiri dari baterai 12V dan dua resistor dengan nilai 
                    R₁ = 100Ω dan R₂ = 200Ω. Hitunglah:
                  </p>
                  <ol className="list-decimal list-inside mt-2 text-gray-700 space-y-1">
                    <li>Resistansi total</li>
                    <li>Arus yang mengalir</li>
                    <li>Daya total yang dikonsumsi</li>
                  </ol>
                </div>

                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h5 className="font-semibold text-blue-800 mb-2">Langkah 1: Resistansi Total</h5>
                    <p className="font-mono text-blue-700">R_total = R₁ + R₂ = 100Ω + 200Ω = 300Ω</p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-green-800 mb-2">Langkah 2: Arus Total</h5>
                    <p className="font-mono text-green-700">I = V / R_total = 12V / 300Ω = 0.04A</p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h5 className="font-semibold text-purple-800 mb-2">Langkah 3: Daya Total</h5>
                    <p className="font-mono text-purple-700">P = V × I = 12V × 0.04A = 0.48W</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 text-center">
            <Link 
              href="/practicum" 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg inline-block"
            >
              Lanjut ke Praktikum →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
