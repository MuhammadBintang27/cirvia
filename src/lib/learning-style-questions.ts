export interface LearningStyleQuestion {
  id: number
  question: string
  options: {
    a: string
    b: string
    c: string
  }
}

export const learningStyleQuestions: LearningStyleQuestion[] = [
  {
    id: 1,
    question: "Ketika saya belajar sesuatu yang baru, saya lebih suka:",
    options: {
      a: "Membaca buku atau melihat diagram",
      b: "Mendengar penjelasan dari guru atau teman",
      c: "Langsung mempraktikkan atau melakukan percobaan"
    }
  },
  {
    id: 2,
    question: "Saat mengingat informasi, saya lebih mudah mengingat:",
    options: {
      a: "Wajah seseorang daripada namanya",
      b: "Nama seseorang daripada wajahnya", 
      c: "Apa yang dilakukan seseorang daripada nama atau wajahnya"
    }
  },
  {
    id: 3,
    question: "Ketika saya sedang berkonsentrasi, saya terganggu oleh:",
    options: {
      a: "Keributan atau suara berisik",
      b: "Orang berlalu lalang atau gerakan visual",
      c: "Lingkungan yang tidak nyaman (terlalu panas/dingin)"
    }
  },
  {
    id: 4,
    question: "Saat memecahkan masalah, saya cenderung:",
    options: {
      a: "Menulis atau menggambar untuk memvisualisasikan masalah",
      b: "Membicarakan masalah dengan orang lain",
      c: "Menggunakan objek konkret atau model untuk memahami masalah"
    }
  },
  {
    id: 5,
    question: "Ketika belajar keterampilan baru, saya lebih suka:",
    options: {
      a: "Melihat demonstrasi terlebih dahulu",
      b: "Mendengar penjelasan langkah demi langkah",
      c: "Langsung mencoba sendiri dengan trial and error"
    }
  },
  {
    id: 6,
    question: "Dalam waktu luang, saya lebih menikmati:",
    options: {
      a: "Membaca, menonton film, atau melihat pameran",
      b: "Mendengarkan musik, podcast, atau mengobrol",
      c: "Berolahraga, berkebun, atau aktivitas fisik lainnya"
    }
  },
  {
    id: 7,
    question: "Saat menghadiri kuliah atau presentasi, saya:",
    options: {
      a: "Lebih fokus pada slide, diagram, atau visual yang ditampilkan",
      b: "Lebih fokus mendengarkan penjelasan pembicara",
      c: "Perlu membuat catatan atau melakukan sesuatu dengan tangan"
    }
  },
  {
    id: 8,
    question: "Ketika mengerjakan tugas kelompok, saya lebih suka:",
    options: {
      a: "Membuat mind map, diagram, atau presentasi visual",
      b: "Diskusi dan brainstorming secara verbal",
      c: "Membuat prototipe atau model kerja"
    }
  },
  {
    id: 9,
    question: "Saat mencari lokasi baru, saya lebih mengandalkan:",
    options: {
      a: "Peta visual atau GPS dengan tampilan visual",
      b: "Petunjuk arah secara verbal",
      c: "Mengingat landmark fisik dan mencoba berbagai rute"
    }
  },
  {
    id: 10,
    question: "Ketika mempelajari konsep baru, saya lebih mudah memahami melalui:",
    options: {
      a: "Diagram, grafik, atau ilustrasi",
      b: "Penjelasan verbal yang detail",
      c: "Analogi dengan pengalaman fisik atau praktis"
    }
  },
  {
    id: 11,
    question: "Saat mengingat nomor telepon atau kode, saya:",
    options: {
      a: "Menvisualisasikan angka-angka tersebut",
      b: "Mengucapkannya berulang-ulang",
      c: "Mengetiknya atau menulisnya beberapa kali"
    }
  },
  {
    id: 12,
    question: "Dalam diskusi kelas, saya:",
    options: {
      a: "Lebih suka melihat ekspresi wajah dan bahasa tubuh",
      b: "Fokus pada nada suara dan intonasi pembicara",
      c: "Merasa perlu bergerak atau menggunakan gesture saat berbicara"
    }
  },
  {
    id: 13,
    question: "Ketika belajar bahasa asing, saya lebih mudah mengingat:",
    options: {
      a: "Melihat kata-kata tertulis dan struktur kalimat",
      b: "Mendengar pronunciation dan rhythm bahasa",
      c: "Mempraktikkan percakapan dan gesture budaya"
    }
  },
  {
    id: 14,
    question: "Saat merasa stres atau cemas, saya cenderung:",
    options: {
      a: "Mencari tempat yang tenang untuk melihat pemandangan",
      b: "Mendengarkan musik yang menenangkan",
      c: "Melakukan aktivitas fisik untuk melepas ketegangan"
    }
  },
  {
    id: 15,
    question: "Ketika menghadapi ujian, strategi belajar saya adalah:",
    options: {
      a: "Membuat rangkuman visual, highlight, dan diagram",
      b: "Membaca keras atau berdiskusi dengan teman",
      c: "Membuat flashcard dan quiz interaktif"
    }
  },
  {
    id: 16,
    question: "Saat mengikuti workshop atau pelatihan, saya lebih menyukai:",
    options: {
      a: "Presentasi dengan slide dan materi visual yang jelas",
      b: "Ceramah dengan tanya jawab dan diskusi grup",
      c: "Hands-on practice dan simulasi langsung"
    }
  },
  {
    id: 17,
    question: "Ketika menganalisis masalah kompleks, saya:",
    options: {
      a: "Membuat flowchart atau diagram untuk memvisualisasikan",
      b: "Mendiskusikan dengan orang lain untuk mendengar perspektif",
      c: "Mencoba berbagai solusi secara trial and error"
    }
  },
  {
    id: 18,
    question: "Dalam mengorganisir informasi, saya lebih suka:",
    options: {
      a: "Sistem filing visual dengan warna dan kategori",
      b: "Sistem penamaan yang logis dengan deskripsi verbal",
      c: "Sistem yang memungkinkan akses cepat saat diperlukan"
    }
  },
  {
    id: 19,
    question: "Saat mempelajari software atau aplikasi baru, saya:",
    options: {
      a: "Membaca manual atau tutorial visual step-by-step",
      b: "Menonton video tutorial atau meminta penjelasan",
      c: "Langsung explore fitur-fitur sambil mencoba-coba"
    }
  },
  {
    id: 20,
    question: "Ketika memberikan presentasi, saya merasa paling nyaman:",
    options: {
      a: "Menggunakan banyak visual, slide, dan props",
      b: "Berbicara secara spontan dengan storytelling",
      c: "Melibatkan audience dalam aktivitas atau demonstrasi"
    }
  }
]

export interface LearningStyleResult {
  visual: number
  auditory: number
  kinesthetic: number
}

export const calculateLearningStyle = (answers: string[]): LearningStyleResult => {
  const result: LearningStyleResult = {
    visual: 0,
    auditory: 0,
    kinesthetic: 0
  }

  answers.forEach(answer => {
    switch (answer) {
      case 'a':
        result.visual++
        break
      case 'b':
        result.auditory++
        break
      case 'c':
        result.kinesthetic++
        break
    }
  })

  return result
}

export const getLearningStyleDescription = (result: LearningStyleResult) => {
  const total = result.visual + result.auditory + result.kinesthetic
  const percentages = {
    visual: Math.round((result.visual / total) * 100),
    auditory: Math.round((result.auditory / total) * 100),
    kinesthetic: Math.round((result.kinesthetic / total) * 100)
  }

  // Determine primary learning style
  let primaryStyle = 'visual'
  if (result.auditory > result.visual && result.auditory > result.kinesthetic) {
    primaryStyle = 'auditory'
  } else if (result.kinesthetic > result.visual && result.kinesthetic > result.auditory) {
    primaryStyle = 'kinesthetic'
  }

  const descriptions = {
    visual: {
      title: "Visual Learner",
      description: "Anda belajar terbaik melalui stimuli visual seperti diagram, grafik, gambar, dan representasi visual lainnya.",
      characteristics: [
        "Lebih mudah mengingat informasi yang dilihat",
        "Suka membuat catatan visual dan mind map", 
        "Memahami konsep melalui gambar dan diagram",
        "Terganggu oleh keributan saat belajar"
      ],
      tips: [
        "Gunakan highlighter dengan warna berbeda",
        "Buat diagram dan flowchart untuk konsep kompleks",
        "Manfaatkan video pembelajaran dan presentasi visual",
        "Susun workspace yang rapi dan terorganisir"
      ]
    },
    auditory: {
      title: "Auditory Learner", 
      description: "Anda belajar terbaik melalui mendengar dan berbicara, seperti diskusi, ceramah, dan penjelasan verbal.",
      characteristics: [
        "Lebih mudah mengingat informasi yang didengar",
        "Suka berdiskusi dan menjelaskan kepada orang lain",
        "Memahami konsep melalui penjelasan verbal", 
        "Terganggu oleh visual yang berlebihan"
      ],
      tips: [
        "Rekam materi pembelajaran dan dengarkan kembali",
        "Bergabung dalam grup diskusi dan study group",
        "Baca materi dengan suara keras",
        "Gunakan musik instrumental saat belajar"
      ]
    },
    kinesthetic: {
      title: "Kinesthetic Learner",
      description: "Anda belajar terbaik melalui pengalaman langsung, praktik, dan aktivitas fisik.",
      characteristics: [
        "Lebih mudah mengingat melalui praktik langsung",
        "Suka belajar sambil bergerak atau menggunakan tangan",
        "Memahami konsep melalui eksperimen dan simulasi",
        "Terganggu jika harus diam terlalu lama"
      ],
      tips: [
        "Gunakan model fisik dan manipulatif saat belajar",
        "Lakukan eksperimen dan praktikum langsung",
        "Belajar sambil berjalan atau dalam posisi berdiri",
        "Buat flashcard yang bisa disentuh dan dipindahkan"
      ]
    }
  }

  return {
    primary: primaryStyle,
    percentages,
    descriptions,
    recommendation: descriptions[primaryStyle as keyof typeof descriptions]
  }
}