-- ==========================================
-- CIRVIA — Seed 5 Questions Each (Pretest & Posttest)
-- ==========================================
-- PRETEST: 1 circuit + 1 circuitAnalysis + 1 circuitOrdering + 2 conceptual
-- POSTTEST: 1 circuit + 1 circuitAnalysis + 1 circuitOrdering + 2 conceptual

DO $$
BEGIN
  RAISE NOTICE '⚠️  WARNING: Deleting all questions and packages...';

  -- Delete in correct order (child tables first, then parent)
  DELETE FROM circuit_questions;
  DELETE FROM conceptual_questions;
  DELETE FROM circuit_analysis_questions;
  DELETE FROM circuit_ordering_questions;
  DELETE FROM class_packages;
  DELETE FROM question_packages;
  DELETE FROM questions;

  RAISE NOTICE '✅ All data deleted. Starting fresh...';
END $$;

-- ==========================================
-- PRETEST QUESTIONS (5 soal)
-- ==========================================

-- PRETEST Q1: Conceptual - Hukum Ohm
DO $$
DECLARE
  v_question_id uuid;
BEGIN
  INSERT INTO questions (
    question_type, title, difficulty, tags, is_active
  ) VALUES (
    'conceptual',
    'Hukum Ohm — Dampak Perubahan Tegangan',
    'easy',
    ARRAY['pretest', 'hukum-ohm']::text[],
    true
  ) RETURNING id INTO v_question_id;

  INSERT INTO conceptual_questions (
    question_id,
    question,
    choices,
    correct_answers,
    explanation,
    hint
) VALUES (
    v_question_id,
    'Di ruang tamu, tiga lampu terhubung pada sumber 220 V. Ketika satu lampu padam, dua lainnya tetap menyala dengan terang yang sama.
Pernyataan yang benar adalah ….',
    '[
      {"id": "choice-1", "text": "Lampu-lampu disusun paralel", "isCorrect": true},
      {"id": "choice-2", "text": "Arus yang mengalir di setiap lampu sama besar", "isCorrect": false},
      {"id": "choice-3", "text": "Tegangan pada tiap lampu sama besar", "isCorrect": true},
      {"id": "choice-4", "text": "Lampu disusun seri", "isCorrect": false},
      {"id": "choice-5", "text": "Hambatan total rangkaian bertambah jika satu lampu dilepas", "isCorrect": false}
    ]'::jsonb,
    ARRAY['choice-1','choice-3']::text[],
    'Karena ketika satu lampu padam dua lainnya tetap menyala, susunannya paralel (cabang-cabang bekerja independen). Pada paralel, tiap lampu mendapat tegangan sumber yang sama (≈220 V). Arus pada tiap lampu tidak harus sama karena bergantung daya/hambatan lampu masing-masing. Susunan seri jelas tidak sesuai, dan melepas satu cabang paralel justru menaikkan hambatan ekivalen (bukan bertambah ketika lampu tetap terpasang), sehingga pernyataan tentang hambatan bertambah “jika satu lampu dilepas” tidak tepat dalam konteks pernyataan yang diberikan.',
    'Ingat ciri paralel: tiap beban tetap menyala sendiri dan tegangannya sama. Jawaban pada soal ini ada 2 pilihan yang benar'
);


  RAISE NOTICE '✅ Pretest Q1 (Conceptual - Hukum Ohm) inserted: %', v_question_id;
END $$;

-- PRETEST Q2: Circuit - Rangkaian Seri
DO $$
DECLARE
  v_question_id uuid;
BEGIN
  INSERT INTO questions (
    question_type, title, difficulty, tags, is_active
) VALUES (
    'circuit',
    'Rangkaian Paralel — Tentukan Resistor yang Tepat',
    'medium',
    ARRAY['pretest', 'rangkaian-paralel']::text[],
    true
) RETURNING id INTO v_question_id;

INSERT INTO circuit_questions (
    question_id,
    circuit_type,
    voltage,
    target_current,
    resistor_slots,
    available_resistors,
    correct_solution,
    description,
    explanation,
    hint
) VALUES (
    v_question_id,
    'parallel',
    12,
    0.6,
    2,
    ARRAY[20, 30, 40, 60, 80, 100]::integer[],
    ARRAY[30, 60]::integer[],
    'Dua slot resistor disusun paralel dan dihubungkan ke sumber tegangan 12 volt. Tentukan kombinasi dua resistor yang menghasilkan arus total tepat sebesar 0,6 ampere.',
    'Rangkaian paralel dengan V = 12 V dan I = 0,6 A memiliki R_total = 12/0,6 = 20 Ω. Kombinasi R₁ = 30 Ω dan R₂ = 60 Ω memberikan 1/R_total = 1/30 + 1/60 = 1/20 → R_total = 20 Ω tepat, sehingga arus total tepat 0,6 A.',
    'Gunakan Hukum Ohm dan rumus paralel: 1/R_total = 1/R₁ + 1/R₂. Cari kombinasi yang menghasilkan R_total = V / I_target.'
);


  RAISE NOTICE '✅ Pretest Q2 (Circuit - Seri) inserted: %', v_question_id;
END $$;

-- PRETEST Q3: Circuit Analysis - L3 Putus
DO $$
DECLARE
  v_question_id uuid;
BEGIN
  INSERT INTO questions (
    question_type, title, difficulty, tags, is_active
  ) VALUES (
    'circuitAnalysis',
    'Analisis Campuran: Dampak L3 Putus',
    'medium',
    ARRAY['pretest', 'circuit-analysis']::text[],
    true
  ) RETURNING id INTO v_question_id;

  INSERT INTO circuit_analysis_questions (
    question_id,
    question,
    circuit_template,
    broken_component,
    choices,
    correct_answers,
    explanation,
    hint
  ) VALUES (
    v_question_id,
    'Jika lampu L3 padam (open circuit), lampu mana saja yang ikut padam dan mana yang tetap menyala?',
    'mixed-series-parallel',
    'L3',
    '[]'::jsonb,
    ARRAY['L1-on', 'L2-on', 'L4-off', 'L5-on']::text[],
    'L1–L2 berada pada jalur seri terpisah dari L3–L4, sementara L5 berdiri sendiri pada jalur paralel mandiri. Saat L3 putus, arus di jalur L3–L4 terhenti sehingga L4 padam. L1–L2 dan L5 tetap menyala.',
    'Identifikasi jalur: (L1–L2) seri, (L3–L4) seri, dan L5 jalur paralel mandiri.'
  );

  RAISE NOTICE '✅ Pretest Q3 (Circuit Analysis) inserted: %', v_question_id;
END $$;

-- PRETEST Q4: Circuit Ordering - Kecerahan
DO $$
DECLARE
  v_question_id uuid;
BEGIN
  INSERT INTO questions (
    question_type, title, difficulty, tags, is_active
) VALUES (
    'circuitOrdering',
    'Membandingkan Kecerahan Lampu',
    'medium',
    ARRAY['pretest', 'circuit-ordering']::text[],
    true
) RETURNING id INTO v_question_id;

INSERT INTO circuit_ordering_questions (
    question_id,
    ordering_type,
    question,
    circuit_items,
    correct_order,
    explanation,
    hint
) VALUES (
    v_question_id,
    'brightness',
    'Diketahui: Semua pilihan rangkaian di bawah menggunakan baterai yang sama 12V, dan masing-masing lampu memiliki daya 3W.
Urutkan rangkaian dari kecerahan TOTAL paling tinggi ke paling rendah.',
    '[
      {
        "id": "A",
        "name": "Rangkaian A",
        "template": "parallel",
        "voltage": 12,
        "resistors": [
          {"id": "R1", "value": 20, "color": "green"},
          {"id": "R2", "value": 40, "color": "blue"}
        ],
        "lamps": [
          {"id": "L1", "power": 3},
          {"id": "L2", "power": 3}
        ],
        "brightnessLevel": "high",
        "totalCurrent": 0.5,
        "description": "Rangkaian paralel dengan 2 resistor dan 2 lampu"
      },
      {
        "id": "B",
        "name": "Rangkaian B",
        "template": "series",
        "voltage": 12,
        "resistors": [
          {"id": "R1", "value": 15, "color": "red"},
          {"id": "R2", "value": 25, "color": "yellow"}
        ],
        "lamps": [
          {"id": "L1", "power": 3},
          {"id": "L2", "power": 3}
        ],
        "brightnessLevel": "medium",
        "totalCurrent": 0.5,
        "description": "Rangkaian seri dengan 2 resistor dan 2 lampu"
      },
      {
        "id": "C",
        "name": "Rangkaian C",
        "template": "series",
        "voltage": 12,
        "resistors": [
          {"id": "R1", "value": 10, "color": "red"},
          {"id": "R2", "value": 20, "color": "green"},
          {"id": "R3", "value": 30, "color": "blue"}
        ],
        "lamps": [
          {"id": "L1", "power": 3},
          {"id": "L2", "power": 3},
          {"id": "L3", "power": 3}
        ],
        "brightnessLevel": "low",
        "totalCurrent": 0.5,
        "description": "Rangkaian seri dengan 3 resistor dan 3 lampu"
      }
    ]'::jsonb,
    ARRAY[0, 1, 2]::integer[],
    'Semua lampu identik: 12V 3W. Kecerahan ∝ daya total P_total = V²/R_total.
• A (paralel 20Ω || 40Ω): R_total = 13.33 Ω → P_total = 144/13.33 = 10.8 W (paling terang).
• B (seri 15Ω + 25Ω): R_total = 40 Ω → P_total = 144/40 = 3.6 W (sedang).
• C (seri 10Ω + 20Ω + 30Ω): R_total = 60 Ω → P_total = 144/60 = 2.4 W (paling redup).
Catatan: Jumlah lampu tidak mengubah urutan brightness, yang menentukan adalah R_total rangkaian.
Urutan kecerahan (terang → redup): A, B, C.',
    'Gunakan P_total = V²/R_total untuk membandingkan; seri: R dijumlahkan, paralel: gunakan 1/R_total = 1/R1 + 1/R2. Lampu hanya indikator visual.'
);

  RAISE NOTICE '✅ Pretest Q4 (Circuit Ordering) inserted: %', v_question_id;
END $$;

-- PRETEST Q5: Conceptual - Ciri Rangkaian Seri
DO $$
DECLARE
  v_question_id uuid;
BEGIN
  INSERT INTO questions (
    question_type, title, difficulty, tags, is_active
  ) VALUES (
    'conceptual',
    'Ciri Khas Rangkaian Seri',
    'easy',
    ARRAY['pretest', 'rangkaian-seri']::text[],
    true
  ) RETURNING id INTO v_question_id;

  INSERT INTO conceptual_questions (
    question_id,
    question,
    choices,
    correct_answers,
    explanation,
    hint
) VALUES (
    v_question_id,
    'Seorang siswa menyalakan kipas dan mengisi daya ponsel melalui stopkontak yang sama. Arus total meningkat, namun tegangan tetap 220 V. Berdasarkan Hukum Ohm dan konsep rangkaian, pernyataan yang benar adalah …',
    '[
      {"id": "choice-1", "text": "Kipas dan charger disusun paralel terhadap sumber listrik", "isCorrect": true},
      {"id": "choice-2", "text": "Hambatan total rangkaian menjadi lebih kecil", "isCorrect": true},
      {"id": "choice-3", "text": "Tegangan total rangkaian bertambah", "isCorrect": false},
      {"id": "choice-4", "text": "Arus total berkurang karena beban bertambah", "isCorrect": false},
      {"id": "choice-5", "text": "Arus total bertambah karena penambahan beban paralel", "isCorrect": true}
    ]'::jsonb,
    ARRAY['choice-1','choice-2','choice-5']::text[],
    'Peralatan rumah tangga pada stopkontak terhubung paralel. Saat beban bertambah, hambatan total menurun (1/R_total = Σ(1/R_i)), sehingga arus total meningkat. Tegangan sumber tetap 220 V, tidak berubah.',
    'Gunakan konsep paralel: menambah cabang → R_total turun → arus total naik (V tetap). Pada soal ini, ada 3 jawaban benar.'
);


  RAISE NOTICE '✅ Pretest Q5 (Conceptual - Seri) inserted: %', v_question_id;
END $$;

-- ==========================================
-- POSTTEST QUESTIONS (5 soal)
-- ==========================================

-- POSTTEST Q1: Conceptual - Hambatan Paralel
DO $$
DECLARE
  v_question_id uuid;
BEGIN
  INSERT INTO questions (
    question_type, title, difficulty, tags, is_active
  ) VALUES (
    'conceptual',
    'Menghitung Hambatan Ekuivalen Paralel',
    'medium',
    ARRAY['posttest', 'rangkaian-paralel']::text[],
    true
  ) RETURNING id INTO v_question_id;

  INSERT INTO conceptual_questions (
    question_id,
    question,
    choices,
    correct_answers,
    explanation,
    hint
) VALUES (
    v_question_id,
    'Lampu hias pohon Natal disusun memanjang dalam satu rangkaian. Ketika satu lampu kecil putus, seluruh rangkaian padam.
Pernyataan yang benar adalah …',
    '[
      {"id": "choice-1", "text": "Lampu-lampu kemungkinan besar disusun seri", "isCorrect": true},
      {"id": "choice-2", "text": "Arus yang mengalir di setiap lampu sama besar", "isCorrect": true},
      {"id": "choice-3", "text": "Tegangan pada tiap lampu pasti sama 220 V", "isCorrect": false},
      {"id": "choice-4", "text": "Rangkaian paralel tidak mungkin padam semua jika satu lampu putus", "isCorrect": false},
      {"id": "choice-5", "text": "Susunan ini pasti paralel karena panjang", "isCorrect": false}
    ]'::jsonb,
    ARRAY['choice-1','choice-2']::text[],
    'Rangkaian lampu padam seluruhnya saat satu lampu putus menunjukkan susunan seri — satu jalur arus tunggal. Pada seri, arus yang mengalir di setiap lampu sama besar karena hanya ada satu lintasan arus. Tegangan tidak sama di tiap lampu karena terbagi sesuai jumlah lampu.',
    'Perhatikan gejala: semua padam saat satu putus → berarti seri. Arus di seri selalu sama. Pada Soal ini ada 2 jawaban benar.'
);


  RAISE NOTICE '✅ Posttest Q1 (Conceptual - Paralel) inserted: %', v_question_id;
END $$;

-- POSTTEST Q2: Circuit - Tantangan Seri
DO $$
DECLARE
  v_question_id uuid;
BEGIN
  -- Soal: Rangkaian Seri — Arus Tepat 0,12 A
INSERT INTO questions (
    question_type, title, difficulty, tags, is_active
) VALUES (
    'circuit',
    'Rangkaian Seri — Tentukan Resistor yang Tepat',
    'easy',
    ARRAY['posttest', 'rangkaian-seri']::text[],
    true
) RETURNING id INTO v_question_id;

INSERT INTO circuit_questions (
    question_id,
    circuit_type,
    voltage,
    target_current,
    resistor_slots,
    available_resistors,
    correct_solution,
    description,
    explanation,
    hint
) VALUES (
    v_question_id,
    'series',
    12,
    0.12,
    2,
    ARRAY[20, 30, 40, 60, 70, 80]::integer[],
    ARRAY[70, 30]::integer[],
    'Terdapat dua slot resistor yang disusun seri dan dihubungkan ke sumber tegangan 12 volt. Pilih dua resistor dari daftar sehingga arus total rangkaian tepat sebesar 0,12 ampere.',
    'Untuk seri, hambatan total adalah penjumlahan: R_total = R1 + R2. Dengan V = 12 V dan I_target = 0,12 A, maka R_total = V/I = 12/0,12 = 100 Ω. Kombinasi 70 Ω + 30 Ω menghasilkan R_total = 100 Ω tepat, sehingga arus I = 12/100 = 0,12 A.',
    'Gunakan I = V/R_total. Cari pasangan resistor yang jumlahnya tepat sama dengan V / I_target.'
);


  RAISE NOTICE '✅ Posttest Q2 (Circuit - Seri) inserted: %', v_question_id;
END $$;

-- POSTTEST Q3: Circuit Analysis - L2 Putus
DO $$
DECLARE
  v_question_id uuid;
BEGIN
  INSERT INTO questions (
    question_type, title, difficulty, tags, is_active
  ) VALUES (
    'circuitAnalysis',
    'Kerusakan pada Jalur Seri Bertingkat — L2 Putus',
    'medium',
    ARRAY['posttest', 'circuit-analysis']::text[],
    true
  ) RETURNING id INTO v_question_id;

  INSERT INTO circuit_analysis_questions (
    question_id,
    question,
    circuit_template,
    broken_component,
    choices,
    correct_answers,
    explanation,
    hint
  ) VALUES (
    v_question_id,
    'Jika L2 pada jalur tengah putus, lampu mana saja yang padam dan yang tetap menyala?',
    'nested-series-parallel',
    'L2',
    '[]'::jsonb,
    ARRAY['L1-on', 'L3-off', 'L4-on', 'L5-on']::text[],
    'Putus di L2 memutus arus cabang L2–L3 sehingga L3 padam. L1 serta pasangan L4–L5 tetap menyala karena berada di cabang berbeda yang masih tersuplai.',
    'L2–L3 seri dalam satu cabang paralel. L1 sendiri, L4–L5 seri di cabang lain.'
  );

  RAISE NOTICE '✅ Posttest Q3 (Circuit Analysis) inserted: %', v_question_id;
END $$;

-- POSTTEST Q4: Circuit Ordering - Efisiensi
DO $$
DECLARE
  v_question_id uuid;
BEGIN
  INSERT INTO questions (
    question_type, title, difficulty, tags, is_active
) VALUES (
    'circuitOrdering',
    'Membandingkan Kecerahan Lampu — Redup ke Terang',
    'medium',
    ARRAY['posttest', 'circuit-ordering']::text[],
    true
) RETURNING id INTO v_question_id;

INSERT INTO circuit_ordering_questions (
    question_id,
    ordering_type,
    question,
    circuit_items,
    correct_order,
    explanation,
    hint
) VALUES (
    v_question_id,
    'brightness',
    'Diketahui: Semua pilihan rangkaian di bawah menggunakan baterai yang sama 9V, dan masing-masing lampu memiliki daya 2W.
Urutkan rangkaian dari kecerahan TOTAL paling rendah (paling redup) ke paling tinggi (paling terang).',
    '[
      {
        "id": "D",
        "name": "Rangkaian D",
        "template": "parallel",
        "voltage": 9,
        "resistors": [
          {"id": "R1", "value": 30, "color": "red"},
          {"id": "R2", "value": 60, "color": "green"}
        ],
        "lamps": [
          {"id": "L1", "power": 2},
          {"id": "L2", "power": 2}
        ],
        "brightnessLevel": "high",
        "totalCurrent": 0.5,
        "description": "Rangkaian paralel dengan 2 resistor dan 2 lampu"
      },
      {
        "id": "E",
        "name": "Rangkaian E",
        "template": "series",
        "voltage": 9,
        "resistors": [
          {"id": "R1", "value": 20, "color": "blue"},
          {"id": "R2", "value": 25, "color": "yellow"}
        ],
        "lamps": [
          {"id": "L1", "power": 2},
          {"id": "L2", "power": 2}
        ],
        "brightnessLevel": "medium",
        "totalCurrent": 0.5,
        "description": "Rangkaian seri dengan 2 resistor dan 2 lampu"
      },
      {
        "id": "F",
        "name": "Rangkaian F",
        "template": "series",
        "voltage": 9,
        "resistors": [
          {"id": "R1", "value": 20, "color": "purple"},
          {"id": "R2", "value": 30, "color": "orange"},
          {"id": "R3", "value": 40, "color": "teal"}
        ],
        "lamps": [
          {"id": "L1", "power": 2},
          {"id": "L2", "power": 2},
          {"id": "L3", "power": 2}
        ],
        "brightnessLevel": "low",
        "totalCurrent": 0.5,
        "description": "Rangkaian seri dengan 3 resistor dan 3 lampu"
      }
    ]'::jsonb,
    ARRAY[2, 1, 0]::integer[],
    'Semua lampu identik: 9V 2W. Kecerahan ∝ daya total P_total = V²/R_total.
• F: Rt = 90 Ω (20+30+40) → P_total = 81/90 = 0.9 W (paling redup)
• E: Rt = 45 Ω (20+25) → P_total = 81/45 = 1.8 W (sedang)
• D: Rt = 20 Ω (30||60) → P_total = 81/20 = 4.05 W (paling terang)
Catatan: Yang menentukan brightness adalah R_total rangkaian, bukan jumlah atau spesifikasi lampu.
Urutan redup → terang: F, E, D.',
    'Seri: Rt dijumlahkan; Paralel: Rt dari 1/Rt = Σ(1/Ri). Kecerahan ∝ P_total = V²/R_total. Lampu hanya indikator visual.'
);


  RAISE NOTICE '✅ Posttest Q4 (Circuit Ordering) inserted: %', v_question_id;
END $$;

-- POSTTEST Q5: Conceptual - Dampak Putus Seri
DO $$
DECLARE
  v_question_id uuid;
BEGIN
  INSERT INTO questions (
    question_type, title, difficulty, tags, is_active
  ) VALUES (
    'conceptual',
    'Dampak Putus pada Rangkaian Seri',
    'medium',
    ARRAY['posttest', 'rangkaian-seri']::text[],
    true
  ) RETURNING id INTO v_question_id;

  INSERT INTO conceptual_questions (
    question_id,
    question,
    choices,
    correct_answers,
    explanation,
    hint
) VALUES (
    v_question_id,
    'Dalam praktikum Hukum Ohm, seorang siswa menghubungkan resistor ke sumber tegangan dan mengukur arus menggunakan amperemeter. Ketika nilai resistor diganti dua kali lipat, arus yang terukur menjadi setengahnya. Dari hasil ini dapat disimpulkan bahwa …',
    '[
      {"id": "choice-1", "text": "Tegangan sumber tetap konstan", "isCorrect": true},
      {"id": "choice-2", "text": "Hasil pengamatan sesuai dengan Hukum Ohm", "isCorrect": true},
      {"id": "choice-3", "text": "Arus berbanding lurus dengan hambatan", "isCorrect": false},
      {"id": "choice-4", "text": "Jika hambatan naik, tegangan juga naik", "isCorrect": false},
      {"id": "choice-5", "text": "Semakin besar hambatan, semakin besar arus", "isCorrect": false}
    ]'::jsonb,
    ARRAY['choice-1','choice-2']::text[],
    'Ketika R dinaikkan dua kali dan I turun menjadi setengahnya, berarti tegangan sumber tetap (V konstan). Perubahan ini konsisten dengan Hukum Ohm: I = V/R, menunjukkan hubungan berbanding terbalik antara arus dan hambatan.',
    'Gunakan persamaan I = V/R: jika R naik 2×, maka I turun 2× bila V tetap. Ada 2 jawaban benar pada soal ini.'
);


  RAISE NOTICE '✅ Posttest Q5 (Conceptual - Seri) inserted: %', v_question_id;
END $$;

-- ==========================================
-- CREATE DEFAULT PACKAGES
-- ==========================================

-- Create default PRETEST package
DO $$
DECLARE
  v_package_id uuid;
  v_question_ids uuid[];
BEGIN
  SELECT array_agg(id ORDER BY created_at)
  INTO v_question_ids
  FROM questions
  WHERE 'pretest' = ANY(tags);

  INSERT INTO question_packages (
    name,
    description,
    package_type,
    question_ids,
    time_limit,
    is_default,
    is_active
  ) VALUES (
    'Default Pretest Package',
    'Paket soal pretest default (5 soal: 1 circuit, 1 analysis, 1 ordering, 2 conceptual)',
    'pretest',
    v_question_ids,
    30,
    true,
    true
  ) RETURNING id INTO v_package_id;

  RAISE NOTICE '✅ Default PRETEST package created with % questions', array_length(v_question_ids, 1);
END $$;

-- Create default POSTTEST package
DO $$
DECLARE
  v_package_id uuid;
  v_question_ids uuid[];
BEGIN
  SELECT array_agg(id ORDER BY created_at)
  INTO v_question_ids
  FROM questions
  WHERE 'posttest' = ANY(tags);

  INSERT INTO question_packages (
    name,
    description,
    package_type,
    question_ids,
    time_limit,
    is_default,
    is_active
  ) VALUES (
    'Default Posttest Package',
    'Paket soal posttest default (5 soal: 1 circuit, 1 analysis, 1 ordering, 2 conceptual)',
    'posttest',
    v_question_ids,
    30,
    true,
    true
  ) RETURNING id INTO v_package_id;

  RAISE NOTICE '✅ Default POSTTEST package created with % questions', array_length(v_question_ids, 1);
  
  RAISE NOTICE '==========================================';
  RAISE NOTICE '✅ SEED COMPLETE!';
  RAISE NOTICE 'Pretest: 5 questions (1 circuit, 1 analysis, 1 ordering, 2 conceptual)';
  RAISE NOTICE 'Posttest: 5 questions (1 circuit, 1 analysis, 1 ordering, 2 conceptual)';
  RAISE NOTICE '==========================================';
END $$;

-- ==========================================
-- VERIFICATION QUERIES
-- ==========================================

-- Check total questions by type
SELECT 
  COUNT(*) as total_questions,
  COUNT(*) FILTER (WHERE 'pretest' = ANY(tags)) as pretest_count,
  COUNT(*) FILTER (WHERE 'posttest' = ANY(tags)) as posttest_count
FROM questions;

-- Check default packages
SELECT 
  id,
  name,
  package_type,
  array_length(question_ids, 1) as total_questions,
  time_limit,
  is_default
FROM question_packages
WHERE is_default = true
ORDER BY package_type;
