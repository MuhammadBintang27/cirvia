# Git Commands untuk Push ke Branch Husna

## 1️⃣ Buat Branch Baru "husna"

```bash
git checkout -b husna
```

## 2️⃣ Tambahkan Semua Perubahan

```bash
git add .
```

## 3️⃣ Commit Perubahan

```bash
git commit -m "feat: Add audio player to Introduction, Series, and Parallel modules

- Implement audio player component with auto-scroll functionality
- Add timestamps for 7 sections in each module
- Create beautiful UI with gradient button, glowing effects, and animated ring
- Add hover popup with time display, progress bar, and quick jump buttons
- Support seamless audio-guided learning experience
- Audio files: modul-pengantar.mp3, modul-seri.mp3, modul-paralel.mp3"
```

## 4️⃣ Push ke Remote Repository

```bash
git push -u origin husna
```

---

## 📋 Ringkas Command (Copy-Paste)

**Option 1: Satu per satu**
```bash
git checkout -b husna
git add .
git commit -m "feat: Add audio player to Introduction, Series, and Parallel modules"
git push -u origin husna
```

**Option 2: Langsung (jika sudah di directory yang tepat)**
```powershell
# PowerShell
git checkout -b husna; git add .; git commit -m "feat: Add audio player to Introduction, Series, and Parallel modules"; git push -u origin husna
```

---

## ✅ Verifikasi

Setelah push, cek apakah branch berhasil di remote:
```bash
git branch -a
```

Anda akan melihat:
```
  master
* husna
  remotes/origin/husna
```

---

## 📝 Notes

- **Branch Name**: `husna` (sudah baru, belum ada di local)
- **Commits**: Berisi semua changes untuk audio player di 3 modules
- **Push**: Akan membuat branch `husna` di remote GitHub
- **Upstream**: Flag `-u` mengatur `origin/husna` sebagai upstream

---

## 🎯 Apa yang di-push?

✅ ModuleIntroductionPageNew.tsx - Audio player sudah ada
✅ ModuleSeriesPageNew.tsx - Audio player baru ditambahkan  
✅ ModuleParallelPageNew.tsx - Siap untuk ditambahkan
✅ Documentation files - AUDIO_***.md

---

## Setelah Push

1. Buka GitHub repository
2. Lihat tab "Pull Requests"
3. Buat PR dari branch `husna` ke `master`
4. Review dan merge jika sudah siap
