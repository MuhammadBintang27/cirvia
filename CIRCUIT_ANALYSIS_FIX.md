# Circuit Analysis Question Fix

## Problem Summary

Circuit analysis questions were being marked as incorrect even when the user answered correctly. The issue was with how the `correct_answers` data was being stored and retrieved from the database.

### Example Case
**Database stored**: `["L1-on", "L2-on", "L4-off", "L5-on"]`  
**User answered**: `["L1-on", "L2-on", "L4-off", "L5-on"]`  
**Result**: ❌ MARKED AS WRONG (but should be correct!)

## Root Cause

There were **3 bugs** in the data transformation pipeline:

### 1. **Saving to Database** (supabase-question-service.ts, Line 190)
**Before:**
```typescript
correct_answers: Object.keys(analysisQ.correctStates)
// This saved: ["L1", "L2", "L4", "L5"] ❌ Missing state information!
```

**After:**
```typescript
const correctAnswersArray = Object.entries(analysisQ.correctStates).map(
  ([lampId, state]) => `${lampId}-${state}`
);
correct_answers: correctAnswersArray
// This saves: ["L1-on", "L2-on", "L4-off", "L5-on"] ✅
```

### 2. **Loading for Teacher** (supabase-question-service.ts, Line 374)
**Before:**
```typescript
correctStates: analysisData.correct_answers.reduce((acc: any, lampId: string) => {
  acc[lampId] = 'on'; // Hardcoded to 'on' ❌
  return acc;
}, {})
// Result: { L1: 'on', L2: 'on', L4: 'on', L5: 'on' } ❌ All forced to 'on'!
```

**After:**
```typescript
const correctStates: { [lampId: string]: 'on' | 'off' } = {};
analysisData.correct_answers.forEach((lampState: string) => {
  const parts = lampState.split('-'); // Split "L1-on" -> ["L1", "on"]
  if (parts.length === 2) {
    const lampId = parts[0]; // "L1"
    const state = parts[1] as 'on' | 'off'; // "on" or "off"
    correctStates[lampId] = state;
  }
});
// Result: { L1: 'on', L2: 'on', L4: 'off', L5: 'on' } ✅
```

### 3. **Loading for Student** (student-question-service.ts, Line 222)
**Same issue as #2** - also hardcoded all states to 'on'. Fixed with same solution.

## Data Flow Diagram

### Before Fix:
```
Form Input              Database               Teacher View          Student View
─────────────────────   ──────────────────   ────────────────────  ────────────────────
{ L1: 'on',          →  ["L1", "L2",      →  { L1: 'on',        →  { L1: 'on',
  L2: 'on',              "L4", "L5"]          L2: 'on',             L2: 'on',
  L4: 'off',             ❌ Lost state!       L4: 'on', ❌          L4: 'on', ❌
  L5: 'on' }                                   L5: 'on' }            L5: 'on' }
```

### After Fix:
```
Form Input              Database                    Teacher View          Student View
─────────────────────   ───────────────────────   ────────────────────  ────────────────────
{ L1: 'on',          →  ["L1-on", "L2-on",     →  { L1: 'on',        →  { L1: 'on',
  L2: 'on',              "L4-off", "L5-on"]        L2: 'on',             L2: 'on',
  L4: 'off',             ✅ State preserved!       L4: 'off', ✅         L4: 'off', ✅
  L5: 'on' }                                        L5: 'on' }            L5: 'on' }
```

## Files Modified

1. **src/lib/supabase-question-service.ts**
   - Line 178-196: Fixed `correct_answers` array creation when saving
   - Line 365-388: Fixed parsing when loading for teacher

2. **src/lib/student-question-service.ts**
   - Line 210-227: Fixed parsing when loading for student

## Testing Steps

### 1. Test Existing Questions (From SQL Seed)
The questions inserted via SQL (seed-5-questions-each.sql) should now work correctly:

```bash
# Refresh browser and test pretest question #3
# Answer: L1-on, L2-on, L4-off, L5-on
# Expected: ✅ CORRECT
```

### 2. Test New Questions (From Form)
Create a new circuit analysis question via the teacher form:

1. Go to teacher question creation form
2. Create a circuit analysis question with:
   - Template: `mixed-series-parallel`
   - Target lamp: `L3`
   - States: L1=on, L2=on, L4=off, L5=on
3. Save the question
4. Take the quiz as a student
5. Answer exactly as specified
6. Expected: ✅ CORRECT

### 3. Verify Database Format
Check the database to ensure new questions have correct format:

```sql
SELECT 
  q.title,
  ca.broken_component,
  ca.correct_answers
FROM questions q
JOIN circuit_analysis_questions ca ON ca.question_id = q.id
WHERE q.question_type = 'circuitAnalysis'
ORDER BY q.created_at DESC
LIMIT 5;
```

Expected output format:
```
| title                              | broken_component | correct_answers                       |
|------------------------------------|------------------|---------------------------------------|
| Analisis Rangkaian - L3 Putus     | L3               | ["L1-on","L2-on","L4-off","L5-on"]   |
```

## Migration Notes

### Existing Data
If you have circuit analysis questions created BEFORE this fix, they may have incorrect data:

**Option 1: Delete and Recreate**
```sql
-- Delete all circuit analysis questions
DELETE FROM circuit_analysis_questions;
DELETE FROM questions WHERE question_type = 'circuitAnalysis';

-- Re-run seed script
-- (or recreate via form)
```

**Option 2: Manual Fix (if you have important questions)**
```sql
-- Example: Fix a question with broken data
UPDATE circuit_analysis_questions
SET correct_answers = ARRAY['L1-on', 'L2-on', 'L4-off', 'L5-on']::text[]
WHERE question_id = 'your-question-id-here';
```

### New Data
All new circuit analysis questions created after this fix will automatically use the correct format.

## Standardization Achieved

✅ **Database Format**: `text[]` array with "lampId-state" format  
✅ **Form Output**: Object `{ lampId: state }`  
✅ **Save Process**: Converts object to array correctly  
✅ **Load Process**: Converts array back to object correctly  
✅ **Component Usage**: Receives correctly formatted object  

All parts of the system now use the same data transformation pattern!
