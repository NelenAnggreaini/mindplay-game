# TODO - Code Injection & Sanitization

## Step 1
- [x] Kumpulkan konteks fungsi `renderDragAndDrop` dan `startGame` dari `script.js`.

## Step 2
- [ ] Buat kode lengkap pengganti untuk `renderDragAndDrop`:
  - [ ] Tambah `if (!ui) return;` di awal.
  - [ ] Pastikan `ui.innerHTML` template string tertutup sempurna dengan semua tag closing.
  - [ ] Inisialisasi ulang `stateDnd` dengan aman untuk setiap render.
  - [ ] Tambahkan guard tambahan agar tidak crash saat DOM belum siap.

## Step 3
- [ ] Buat kode lengkap pengganti untuk `startGame`:
  - [ ] Tambahkan `console.log("Game Starting:", gameKey);`.
  - [ ] Pastikan `__dndFinished` dipastikan `false` sebelum game dimulai.
  - [ ] Tambahkan `if (!ui) return;` di awal fungsi rendering yang dipanggil dari dalamnya (sesuai permintaan).

## Step 4
- [ ] Patch `script.js` hanya pada dua fungsi tersebut.

## Step 5
- [ ] Jalankan smoke check (opsional) / sanity check.

