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
    'Sebuah rangkaian sederhana memiliki hambatan tetap. Jika sumber tegangannya dinaikkan menjadi 2 kali semula, bagaimana perubahan arus yang mengalir melalui rangkaian menurut Hukum Ohm?',
    '[
      {"id": "choice-1", "text": "Tetap sama", "isCorrect": false},
      {"id": "choice-2", "text": "Naik 2 kali", "isCorrect": true},
      {"id": "choice-3", "text": "Turun 2 kali", "isCorrect": false},
      {"id": "choice-4", "text": "Naik 4 kali", "isCorrect": false},
      {"id": "choice-5", "text": "Naik 1,5 kali", "isCorrect": false}
    ]'::jsonb,
    ARRAY['choice-2']::text[],
    'Hukum Ohm menyatakan I = V/R. Karena R tetap dan V menjadi 2V, maka I baru = (2V)/R = 2 × (V/R). Arus meningkat 2 kali lipat.',
    'Gunakan I = V/R dan bandingkan kondisi sebelum–sesudah.'
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
    'Rangkaian Seri — Menyetel Arus Target',
    'easy',
    ARRAY['pretest', 'rangkaian-seri']::text[],
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
    0.08,
    2,
    ARRAY[50, 75, 100, 120, 150, 200]::integer[],
    ARRAY[100, 50]::integer[],
    'Sebuah rangkaian terdiri atas dua slot resistor yang disusun seri dan dihubungkan dengan sumber tegangan sebesar 12 volt. Tujuan percobaan ini adalah menentukan kombinasi dua resistor yang mampu menghasilkan arus total sekitar 0,08 ampere.',
    'Pada rangkaian seri, R_total = R₁ + R₂. Dengan V = 12V dan I_target = 0.08A, maka R_total = V/I = 12/0.08 = 150Ω. Kombinasi 100Ω + 50Ω = 150Ω.',
    'Gunakan Hukum Ohm: I = V/R. Untuk rangkaian seri, hambatan total adalah penjumlahan semua resistor.'
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
    'Urutkan dari rangkaian paling terang ke paling redup.',
    '[
      {
        "id": "A",
        "name": "Rangkaian A",
        "template": "series",
        "voltage": 12,
        "resistors": [{"id": "R1", "value": 10, "color": "red"}, {"id": "R2", "value": 15, "color": "green"}],
        "lamps": [{"id": "L1", "power": 5.76}, {"id": "L2", "power": 8.64}],
        "brightnessLevel": "high",
        "totalCurrent": 0.48,
        "description": "Seri 2R (R_total=25Ω, P≈5,76 W)"
      },
      {
        "id": "B",
        "name": "Rangkaian B",
        "template": "parallel",
        "voltage": 12,
        "resistors": [{"id": "R1", "value": 30, "color": "green"}, {"id": "R2", "value": 60, "color": "blue"}],
        "lamps": [{"id": "L1", "power": 4.8}, {"id": "L2", "power": 2.4}],
        "brightnessLevel": "medium",
        "totalCurrent": 0.6,
        "description": "Paralel 2R (R_total=20Ω, P≈7,2 W)"
      },
      {
        "id": "C",
        "name": "Rangkaian C",
        "template": "series",
        "voltage": 12,
        "resistors": [{"id": "R1", "value": 20, "color": "blue"}, {"id": "R2", "value": 30, "color": "yellow"}, {"id": "R3", "value": 40, "color": "purple"}],
        "lamps": [{"id": "L1", "power": 0.71}, {"id": "L2", "power": 1.07}, {"id": "L3", "power": 1.42}],
        "brightnessLevel": "low",
        "totalCurrent": 0.133,
        "description": "Seri 3R (R_total≈90Ω, P≈1,6 W)"
      }
    ]'::jsonb,
    ARRAY[1, 0, 2]::integer[],
    'Rangkaian paralel umumnya memiliki R_total lebih kecil daripada seri, sehingga daya total (dan kecerahan) cenderung lebih besar.',
    'P_total ≈ V²/R_total. R_total lebih kecil → P_total lebih besar.'
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
    'Manakah pernyataan yang BENAR untuk rangkaian seri ideal dengan komponen linear?',
    '[
      {"id": "choice-1", "text": "Arus sama di semua komponen", "isCorrect": true},
      {"id": "choice-2", "text": "Tegangan sama di semua komponen", "isCorrect": false},
      {"id": "choice-3", "text": "Hambatan total lebih kecil dari hambatan terkecil", "isCorrect": false},
      {"id": "choice-4", "text": "Jika satu komponen putus, komponen lain tetap bekerja", "isCorrect": false},
      {"id": "choice-5", "text": "Hambatan total adalah jumlah seluruh hambatan", "isCorrect": true}
    ]'::jsonb,
    ARRAY['choice-1', 'choice-5']::text[],
    'Di rangkaian seri, arus sama di semua komponen. Tegangan terbagi sesuai nilai hambatan masing-masing. Hambatan total adalah penjumlahan semua hambatan.',
    'Rangkaian seri hanya memiliki satu jalur arus.'
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
    'Dua resistor 6Ω dipasang paralel pada sumber yang sama. Berapakah hambatan total ekuivalennya?',
    '[
      {"id": "choice-1", "text": "12Ω", "isCorrect": false},
      {"id": "choice-2", "text": "6Ω", "isCorrect": false},
      {"id": "choice-3", "text": "3Ω", "isCorrect": true},
      {"id": "choice-4", "text": "2Ω", "isCorrect": false},
      {"id": "choice-5", "text": "3,5Ω", "isCorrect": false}
    ]'::jsonb,
    ARRAY['choice-3']::text[],
    '1/R_total = 1/6 + 1/6 = 2/6 = 1/3 → R_total = 3Ω.',
    'Gunakan 1/R_total = 1/R₁ + 1/R₂.'
  );

  RAISE NOTICE '✅ Posttest Q1 (Conceptual - Paralel) inserted: %', v_question_id;
END $$;

-- POSTTEST Q2: Circuit - Tantangan Seri
DO $$
DECLARE
  v_question_id uuid;
BEGIN
  INSERT INTO questions (
    question_type, title, difficulty, tags, is_active
  ) VALUES (
    'circuit',
    'Tantangan Seri — Presisi Arus',
    'hard',
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
    20,
    0.05,
    2,
    ARRAY[100, 150, 200, 250, 300, 400]::integer[],
    ARRAY[200, 200]::integer[],
    'Rangkaian ini terdiri dari dua resistor yang dihubungkan secara seri dengan sumber tegangan 20 volt. Tantanganmu adalah mencari kombinasi dua resistor yang menghasilkan arus sekitar 0,05 ampere.',
    'R_total = V/I = 20/0.05 = 400Ω. Kombinasi 200Ω + 200Ω = 400Ω menghasilkan I = 20/400 = 0.05A.',
    'Hitung R_total = R₁ + R₂, lalu I = V/R_total. Sesuaikan pilihan hingga mendekati target.'
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
    'Membandingkan Efisiensi Rangkaian',
    'hard',
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
    'power',
    'Urutkan dari efisiensi tertinggi ke terendah.',
    '[
      {
        "id": "E1",
        "name": "Rangkaian E1",
        "template": "simple",
        "voltage": 12,
        "resistors": [{"id": "R1", "value": 12}],
        "lamps": [{"id": "L1", "power": 12}],
        "brightnessLevel": "high",
        "totalCurrent": 1.0,
        "description": "Sederhana 1R (Efisiensi ≈ 95%)"
      },
      {
        "id": "E2",
        "name": "Rangkaian E2",
        "template": "series",
        "voltage": 12,
        "resistors": [{"id": "R1", "value": 6}, {"id": "R2", "value": 6}],
        "lamps": [{"id": "L1", "power": 6}, {"id": "L2", "power": 6}],
        "brightnessLevel": "medium",
        "totalCurrent": 1.0,
        "description": "Seri 2R (Efisiensi ≈ 90%)"
      },
      {
        "id": "E3",
        "name": "Rangkaian E3",
        "template": "parallel",
        "voltage": 12,
        "resistors": [{"id": "R1", "value": 24}, {"id": "R2", "value": 24}],
        "lamps": [{"id": "L1", "power": 6}, {"id": "L2", "power": 6}],
        "brightnessLevel": "medium",
        "totalCurrent": 1.0,
        "description": "Paralel 2R (Efisiensi ≈ 85%)"
      }
    ]'::jsonb,
    ARRAY[0, 1, 2]::integer[],
    'Semakin sedikit elemen yang menambah rugi-rugi (kawat panjang, sambungan, komponen), semakin tinggi efisiensi total.',
    'Efisiensi = P_output / P_input. Rangkaian lebih sederhana cenderung lebih efisien.'
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
    'Pada rangkaian seri ideal, jika satu lampu putus, apa yang terjadi pada rangkaian?',
    '[
      {"id": "choice-1", "text": "Lampu lain tetap menyala", "isCorrect": false},
      {"id": "choice-2", "text": "Semua lampu mati", "isCorrect": true},
      {"id": "choice-3", "text": "Lampu lain menyala lebih terang", "isCorrect": false},
      {"id": "choice-4", "text": "Tidak ada pengaruh", "isCorrect": false},
      {"id": "choice-5", "text": "Hanya lampu yang rusak yang padam", "isCorrect": false}
    ]'::jsonb,
    ARRAY['choice-2']::text[],
    'Putus pada satu komponen memutus jalur arus sehingga seluruh rangkaian tidak dialiri arus dan semua lampu padam.',
    'Seri hanya memiliki satu jalur arus.'
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
