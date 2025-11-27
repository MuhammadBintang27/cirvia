-- UPDATE LKPD Table - Add UNIQUE constraint for student_id
-- Jalankan ini di Supabase SQL Editor untuk update tabel lkpd_data yang sudah ada

-- Add UNIQUE constraint to prevent duplicate LKPD per student
ALTER TABLE lkpd_data 
ADD CONSTRAINT lkpd_data_student_id_unique UNIQUE (student_id);

-- Add index for last_saved_at (untuk optimasi query sorting)
CREATE INDEX IF NOT EXISTS idx_lkpd_data_last_saved ON lkpd_data(last_saved_at);

-- Add comments for documentation
COMMENT ON TABLE lkpd_data IS 'E-LKPD (Electronic Laboratory Worksheet) data storing student practical work including hypothesis, observations (12 quantitative numeric measurements + 12 qualitative text observations), hypothesis testing, and conclusions';

COMMENT ON COLUMN lkpd_data.analysis_answers IS 'JSONB field storing hypothesis and hypothesis_testing text. Structure: {"hypothesis": "text", "hypothesis_testing": "text"}';
COMMENT ON COLUMN lkpd_data.conclusion_answers IS 'JSONB field storing conclusion text. Structure: {"conclusion": "text"}';

-- Quantitative observations comments
COMMENT ON COLUMN lkpd_data.series_5_voltage IS 'Voltage measurement for series circuit with 5 lamps (in Volts)';
COMMENT ON COLUMN lkpd_data.series_5_current IS 'Current measurement for series circuit with 5 lamps (in Amperes)';
COMMENT ON COLUMN lkpd_data.series_5_resistance IS 'Resistance calculation for series circuit with 5 lamps (in Ohms)';

COMMENT ON COLUMN lkpd_data.series_2_voltage IS 'Voltage measurement for series circuit with 2 lamps (in Volts)';
COMMENT ON COLUMN lkpd_data.series_2_current IS 'Current measurement for series circuit with 2 lamps (in Amperes)';
COMMENT ON COLUMN lkpd_data.series_2_resistance IS 'Resistance calculation for series circuit with 2 lamps (in Ohms)';

COMMENT ON COLUMN lkpd_data.parallel_5_voltage IS 'Voltage measurement for parallel circuit with 5 lamps (in Volts)';
COMMENT ON COLUMN lkpd_data.parallel_5_current IS 'Current measurement for parallel circuit with 5 lamps (in Amperes)';
COMMENT ON COLUMN lkpd_data.parallel_5_resistance IS 'Resistance calculation for parallel circuit with 5 lamps (in Ohms)';

COMMENT ON COLUMN lkpd_data.parallel_2_voltage IS 'Voltage measurement for parallel circuit with 2 lamps (in Volts)';
COMMENT ON COLUMN lkpd_data.parallel_2_current IS 'Current measurement for parallel circuit with 2 lamps (in Amperes)';
COMMENT ON COLUMN lkpd_data.parallel_2_resistance IS 'Resistance calculation for parallel circuit with 2 lamps (in Ohms)';

-- Qualitative observations comments
COMMENT ON COLUMN lkpd_data.lamp_all_on_series_5 IS 'Lamp condition observation when all switches ON for series 5 lamps';
COMMENT ON COLUMN lkpd_data.lamp_all_on_series_2 IS 'Lamp condition observation when all switches ON for series 2 lamps';
COMMENT ON COLUMN lkpd_data.lamp_all_on_parallel_5 IS 'Lamp condition observation when all switches ON for parallel 5 lamps';
COMMENT ON COLUMN lkpd_data.lamp_all_on_parallel_2 IS 'Lamp condition observation when all switches ON for parallel 2 lamps';

COMMENT ON COLUMN lkpd_data.lamp_one_off_series_5 IS 'Lamp condition observation when one switch OFF for series 5 lamps';
COMMENT ON COLUMN lkpd_data.lamp_one_off_series_2 IS 'Lamp condition observation when one switch OFF for series 2 lamps';
COMMENT ON COLUMN lkpd_data.lamp_one_off_parallel_5 IS 'Lamp condition observation when one switch OFF for parallel 5 lamps';
COMMENT ON COLUMN lkpd_data.lamp_one_off_parallel_2 IS 'Lamp condition observation when one switch OFF for parallel 2 lamps';

COMMENT ON COLUMN lkpd_data.lamp_brightness_series_5 IS 'Lamp brightness level observation for series 5 lamps';
COMMENT ON COLUMN lkpd_data.lamp_brightness_series_2 IS 'Lamp brightness level observation for series 2 lamps';
COMMENT ON COLUMN lkpd_data.lamp_brightness_parallel_5 IS 'Lamp brightness level observation for parallel 5 lamps';
COMMENT ON COLUMN lkpd_data.lamp_brightness_parallel_2 IS 'Lamp brightness level observation for parallel 2 lamps';
