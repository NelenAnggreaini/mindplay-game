/* =========================
   MindPlay - Core Game Engine & Autentikasi (Mode Tanpa Jenjang)
========================= */

const TOTAL_QUESTIONS = 5;
const DEFAULT_TIME_SECONDS = 45;

// Global States
window.__mindplayGameState = null;
let currentQuestionIndex = 0;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let timerInterval = null;
let timeLeft = DEFAULT_TIME_SECONDS;
let pageHistory = [];

// =========================
// 1) CENTRALIZED CURRICULUM DATA (JURNAL UTUH) - Mode Tanpa Jenjang
// =========================
// Catatan: data soal ditambah menjadi 5 soal per game sesuai kebutuhan engine.
const curriculumData = {
  materi: [
    {
      id: 'materi-hardware-jurnal',
      title: 'Perangkat Keras dan Jaringan Komputer',
      konten: [
        {
          h: 'Definisi Hardware',
          p: [
            'Hardware atau perangkat keras adalah komponen fisik komputer yang dapat dilihat dan diraba. Hardware berfungsi mendukung proses komputerisasi berdasarkan instruksi dari perangkat lunak (software).',
            'Sistem komputer tidak akan berjalan tanpa adanya koordinasi antara perangkat keras yang nyata dengan perintah software yang memberikan instruksi tugas.'
          ]
        },
        {
          h: 'Klasifikasi Perangkat Keras',
          p: [
            'Berdasarkan fungsinya, hardware dibagi menjadi lima kategori utama:',
            '1. Input device: Unit ini berfungsi sebagai media untuk memasukkan data dari luar ke dalam suatu memori dan processor untuk diolah guna menghasilkan informasi yang diperlukan (Contoh: Keyboard, Mouse).',
            '2. Process device: Unit ini berfungsi sebagai tempat pemroses instruksi-instruksi program yang ada pada komputer dan mengontrol keseluruhan sistem komputer selama pengolahan data berlangsung (Contoh: CPU/Processor).',
            '3. Output device: Unit ini berfungsi sebagai alat yang menampilkan hasil pengolahan data yang dilakukan CPU (Contoh: Monitor, Printer).',
            '4. Storage device: Unit ini berfungsi sebagai tempat penyimpanan data atau program yang dapat digunakan kembali pada waktu tertentu (Contoh: RAM, SSD, HDD).',
            '5. Periferal device: Unit ini berfungsi sebagai perangkat tambahan yang digunakan sesuai dengan kebutuhan.'
          ]
        },
        {
          h: 'Jaringan Komputer',
          p: [
            'Jaringan komputer adalah sistem yang terdiri atas komputer dan perangkat jaringan lainnya yang bekerja bersama untuk berbagi data, informasi, dan periferal.',
            'Contoh perangkat jaringan meliputi Switch untuk penghubung, Router untuk pengatur lalu lintas data, dan NIC untuk interface kartu jaringan.'
          ]
        }
      ]
    }
  ],
  soal: {
    'tebak-gambar': [
      {
        id: 1,
        q: 'Nama dari perangkat keras pada gambar di bawah ini adalah…',
        img: 'ram.jpg',
        options: ['RAM', 'Processor', 'Harddisk'],
        correct: 'RAM'
      },
      {
        id: 2,
        q: 'Perangkat pada gambar di bawah termasuk ke dalam komponen…',
        img: 'printer.jpg',
        options: ['Input Device', 'Output Device', 'Storage Device'],
        correct: 'Output Device'
      },
      {
        id: 3,
        q: 'Apa fungsi utama dari perangkat penyimpanan pada gambar di bawah?',
        img: 'ssd.jpg',
        options: ['Memproses data', 'Menampilkan visual', 'Menyimpan data permanen'],
        correct: 'Menyimpan data permanen'
      },
      {
        id: 4,
        q: 'Berdasarkan gambar di bawah, port yang dilingkari merah digunakan untuk koneksi…',
        img: 'lan-port.jpg',
        options: ['Kabel LAN/Jaringan', 'Kabel Power', 'Kabel USB'],
        correct: 'Kabel LAN/Jaringan'
      },
      {
        id: 5,
        q: 'Perangkat jaringan pada gambar di bawah ini berfungsi untuk…',
        img: 'switch.jpg',
        options: ['Menghubungkan banyak komputer', 'Menyimpan data browser', 'Memperkuat sinyal Wi-Fi'],
        correct: 'Menghubungkan banyak komputer'
      }
    ],

    'drag-and-drop': [
      {
        id: 1,
        zones: [
          {
            title: 'Perangkat Input',
            description: 'Memasukkan Data',
            items: [
              { name: 'Keyboard', image: 'keyboard.jpg', correct: true },
              { name: 'Mouse', image: 'hardware-pc.jpg', correct: false },
              { name: 'Monitor', image: 'hardware-pc.jpg', correct: false },
              { name: 'Printer', image: 'printer.jpg', correct: false }
            ]
          }
        ]
      },
      {
        id: 2,
        zones: [
          {
            title: 'Perangkat Proses',
            description: 'Mengolah Data',
            items: [
              { name: 'CPU/Processor', image: 'hardware-pc.jpg', correct: true },
              { name: 'RAM', image: 'ram.jpg', correct: false },
              { name: 'NIC', image: 'lan-port.jpg', correct: false },
              { name: 'SSD', image: 'ssd.jpg', correct: false }
            ]
          }
        ]
      },
      {
        id: 3,
        zones: [
          {
            title: 'Perangkat Output',
            description: 'Menampilkan Hasil',
            items: [
              { name: 'Printer', image: 'printer.jpg', correct: true },
              { name: 'Monitor', image: 'hardware-pc.jpg', correct: false },
              { name: 'Keyboard', image: 'keyboard.jpg', correct: false },
              { name: 'SSD', image: 'ssd.jpg', correct: false }
              ]
          }
        ]
      },
      {
        id: 4,
        zones: [
          {
            title: 'Perangkat Storage',
            description: 'Penyimpanan Data Permanen',
            items: [
              { name: 'SSD', image: 'ssd.jpg', correct: true },
              { name: 'RAM', image: 'ram.jpg', correct: false },
              { name: 'Flashdisk', image: 'flashdisk.jpg', correct: false },
              { name: 'CPU/Processor', image: 'hardware-pc.jpg', correct: false }
            ]
          }
        ]
      },
      {
        id: 5,
        zones: [
          {
            title: 'Perangkat WAN/Internet',
            description: 'Menghubungkan ke Internet',
            items: [
              { name: 'Modem', image: 'flashdisk.jpg', correct: true },
              { name: 'Router', image: 'hardware-pc.jpg', correct: false },
              { name: 'Switch', image: 'switch.jpg', correct: false },
              { name: 'Kabel LAN', image: 'kabel-lan.jpg', correct: false }
            ]
          }
        ]
      }
    ],

    'kuis-cepat': [
      { id: 1, q: 'Apa fungsi utama CPU?', options: ['Penyimpanan', 'Pemrosesan', 'Input'], correct: 'Pemrosesan' },
      { id: 2, q: 'Perangkat input berfungsi untuk…', options: ['Mengolah data', 'Memasukkan data', 'Menyimpan data'], correct: 'Memasukkan data' },
      { id: 3, q: 'Perangkat output berfungsi untuk…', options: ['Menampilkan hasil', 'Menyimpan data', 'Mengatur jaringan'], correct: 'Menampilkan hasil' },
      { id: 4, q: 'Storage device biasanya digunakan untuk…', options: ['Pemrosesan', 'Penyimpanan', 'Transmisi data'], correct: 'Penyimpanan' },
      { id: 5, q: 'Fungsi router adalah…', options: ['Menghubungkan perangkat dalam LAN saja', 'Mengatur rute pengiriman data', 'Menggantikan CPU'], correct: 'Mengatur rute pengiriman data' }
    ]
  }
};

const LS_LAST_GAME_KEY = '__mindplay_lastGameKey';

// =========================
// 2) CORE NAVIGATION SYSTEM
// =========================
function tampilkanHalamanMutlak(pageId) {
  const currentActive =
    document.querySelector('.page-container.active') ||
    document.querySelector('.page-section.active');

  if (currentActive && currentActive.id !== pageId) {
    if (pageHistory[pageHistory.length - 1] !== currentActive.id) {
      pageHistory.push(currentActive.id);
    }
  }

  // sembunyikan semua halaman
  const containers = document.querySelectorAll(
    '.page-container, .page-section'
  );

  containers.forEach(p => {
    p.classList.remove('active');
    p.classList.add('hidden');
  });

  // tampilkan target
  const target = document.getElementById(pageId);

  if (target) {
    target.classList.remove('hidden');
    target.classList.add('active');

    // update nama dashboard
    if (pageId === 'dashboard-page') {
      updateDashboardUsername();
    }
  }

  window.scrollTo(0, 0);
}

function navigasiKembali() {
  if (pageHistory.length > 0) {
    const prevPage = pageHistory.pop();
    tampilkanHalamanMutlak(prevPage);
  } else {
    tampilkanHalamanMutlak('landing-page');
  }
}

function tampilkanLogin() {
  tampilkanHalamanMutlak('form-masuk-container');
}

function tampilkanDaftar() {
  tampilkanHalamanMutlak('form-buat-akun-container');
}

// 1) AKTIFKAN TOMBOL DASHBOARD
function tampilkanMateri() {
  renderMateriDariJenjang();
  tampilkanHalamanMutlak('materi-page');
}

function tampilkanGameMenu() {
  tampilkanHalamanMutlak('pilih-game-page');
}

// Hook untuk tombol dashboard di index.html
function navigasiKeMateri() {
  tampilkanMateri();
}
function navigasiKeGameMenu() {
  tampilkanGameMenu();
}

function tampilkanDashboardDariMateri() {
  tampilkanHalamanMutlak('dashboard-page');
}

function kembaliKeDashboardFromScore() {
  tampilkanHalamanMutlak('dashboard-page');
}

// =========================
// 3) AUTHENTICATION LOGIC (ASLI DIBERSIHKAN DARI JENJANG)
// =========================
// =========================
// FIREBASE INITIALIZATION (Auth + Firestore)
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyAbpoOmRm8NJt9R-0R09LXWlzddNaQvOEk",
  authDomain: "mindplay-game.firebaseapp.com",
  projectId: "mindplay-game",
  storageBucket: "mindplay-game.firebasestorage.app",
  messagingSenderId: "410301792904",
  appId: "1:410301792904:web:b4ddefe4119d555b43d53d",
  measurementId: "G-65164H1CEG"
};

// Guard agar tidak inisialisasi dua kali
let __mindplayFirebase = window.__mindplayFirebase;
if (!__mindplayFirebase) {
  try {
    const app = firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth(app);
    const firestore = firebase.firestore(app);
    __mindplayFirebase = { app, auth, firestore };
    window.__mindplayFirebase = __mindplayFirebase;
  } catch (e) {
    console.error('[FIREBASE] init gagal:', e);
  }
}

function getFirebaseAuth() {
  return window.__mindplayFirebase?.auth || null;
}
function getFirebaseFirestore() {
  return window.__mindplayFirebase?.firestore || null;
}

function getCurrentUserName() {
  // Ambil dari cache user doc (users) bila ada, kalau tidak fallback dari displayName/atau email.
  const u = window.__mindplayCurrentUser;
  if (u?.nama) return u.nama;
  return null;
}

// =========================
// AUTH: LOGIN & REGISTER (menggunakan email/password)
// =========================
function updateDashboardUsername() {
  const user = window.__mindplayCurrentUser;

  const el = document.getElementById('user-greeting');

  if (!el) return;

  const nama = user?.nama || 'User';

  el.innerHTML = `
    <span class="greeting-text">Hallo, ${nama}</span>
    <span class="wave">👋</span>
  `;
}

function loginCheck() {
  const userIn = document.getElementById('username');
  const passIn = document.getElementById('password');

  if (!userIn || !passIn) return;

  const email = userIn.value.trim();
  const p = passIn.value.trim();

  if (!email || !p) {
    alert('Email dan Password harus diisi!');
    return;
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    alert('Firebase belum siap. Pastikan SDK sudah terpasang.');
    return;
  }

  firebase.auth().signInWithEmailAndPassword(email, p)
  .then(async (cred) => {

    const uid = cred.user.uid;

    const firestore = getFirebaseFirestore();

    const userDoc = await firestore
      .collection('users')
      .doc(uid)
      .get();

    const data = userDoc.data();

    window.__mindplayCurrentUser = {
      uid: uid,
      nama: data.nama,
      email: data.email
    };

    updateDashboardUsername();

    tampilkanHalamanMutlak('dashboard-page');

    userIn.value = '';
    passIn.value = '';

  })
}

function submitDaftar() {
  const nameEl = document.getElementById('fullName');
  const emailEl = document.getElementById('email');
  const passEl = document.getElementById('registerPassword');
  const confEl = document.getElementById('confirmPassword');

  if (!nameEl || !emailEl || !passEl || !confEl) return;

  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const pass = passEl.value.trim();
  const conf = confEl.value.trim();

  if (!name || !email || !pass || !conf) {
    alert('Semua field pendaftaran harus diisi!');
    return;
  }

  if (pass !== conf) {
    alert('Konfirmasi password tidak cocok!');
    return;
  }

  const auth = getFirebaseAuth();
  if (!auth) {
    alert('Firebase belum siap. Pastikan SDK sudah terpasang.');
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, pass)
    .then(async (cred) => {
      const uid = cred.user?.uid;
      if (!uid) throw new Error('UID tidak ditemukan.');

      const firestore = getFirebaseFirestore();
      if (firestore) {
        await firestore.collection('users').doc(uid).set({
          uid,
          nama: name,
          email
        });
      }

      // Update cache current user
      window.__mindplayCurrentUser = { uid, nama: name, email };

      alert('Akun berhasil dibuat! Silakan masuk menggunakan email & password.');
      tampilkanHalamanMutlak('form-masuk-container');

      // Reset Form
      nameEl.value = '';
      emailEl.value = '';
      passEl.value = '';
      confEl.value = '';
    })
    .catch((err) => {
      console.error('[AUTH REGISTER] error:', err);
      alert('Daftar gagal: ' + (err?.message || err));
    });
}

// =========================
// SKOR: simpan ke Firestore
// =========================
async function simpanSkorKeDatabase(skor, namaGame) {
  // Sesuai permintaan: simpanSkorKeDatabase(skor) dipanggil dari showScorePage.
  // Parameter namaGame dibuat opsional agar konsisten.
  try {
    const firestore = getFirebaseFirestore();
    const auth = getFirebaseAuth();
    if (!firestore || !auth) return;

    const currentUser = window.__mindplayCurrentUser || null;
    const uid = currentUser?.uid || auth.currentUser?.uid;
    if (!uid) return; // jika belum login, tidak menyimpan

    // Ambil nama dari cache; jika tidak ada, baca dari users doc
    let nama = currentUser?.nama || null;
    if (!nama) {
      const userDoc = await firestore.collection('users').doc(uid).get();
      const data = userDoc.data();
      nama = data?.nama || 'Siswa';
    }

    const ngame = namaGame || window.__mindplayGameState?.gameKey || 'game';

    await firestore.collection('skor').add({
  userId: uid,
  namaGame: ngame,
  nama: nama,
  skor: skor,
  createdAt: firebase.firestore.FieldValue.serverTimestamp()
});

console.log('[SKOR] berhasil disimpan');

 } catch (err) {
    console.error('[SKOR] gagal simpan:', err);
  }
}

// =========================
// 4) MATERI RENDERING
// =========================
function renderMateriDariJenjang() {
  const materiWrap = document.getElementById('materi-wrap');
  if (!materiWrap) return;
  materiWrap.innerHTML = '';

  const data = curriculumData.materi[0];

  const secEl = document.createElement('div');
  secEl.className = 'materi-card';
  secEl.innerHTML = `
    <h3 style="text-align: center; margin-bottom: 16px;">${data.title}</h3>
    ${data.konten.map(block => `
      <h4>${block.h}</h4>
      ${block.p.map(text => `<p style="text-align: left; line-height: 1.6;">${text}</p>`).join('')}
    `).join('')}
    <div class="materi-cta" style="margin-top: 40px; text-align: center;">
      <button
        type="button"
        class="btn-navy"
        style="padding: 14px 32px; border-radius: 12px; cursor: pointer; background:#1d4ed8; display:inline-flex; align-items:center; justify-content:center;"
        onclick="navigasiKeGameMenu()"
      >
        Lanjut ke Game
      </button>
    </div>
  `;
  materiWrap.appendChild(secEl);
}

// =========================
// 5) GAME ENGINE PLATFORM (Terlengkap)
// =========================
function shuffleArray(arr) {
  // Fisher-Yates shuffle (in-place on a cloned array)
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Fisher-Yates untuk dataset soal: ambil N teratas setelah diacak
function pickShuffledTop(arr, topN) {
  // Shuffle Fisher-Yates, lalu ambil topN teratas
  return shuffleArray(arr).slice(0, topN);
}

function resetGameState() {
  currentQuestionIndex = 0;
  score = 0;
  correctCount = 0;
  wrongCount = 0;
  timeLeft = DEFAULT_TIME_SECONDS;

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // FIX: pastikan state selalu berupa objek lengkap (bukan null)
  window.__mindplayGameState = {
    gameKey: null,
    questions: [],
    locked: false,
    answered: false,

    currentZoneIndex: 0,
    // internal guards untuk mencegah double-trigger
    __proceedQueued: false,
    __dndFinished: false,

    __dndDropHandled: false,
    __dndRenderToken: 0,
  };
}

function updateTimerUI() {
  const timerText = document.getElementById('timer-text');
  if (!timerText) return;

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const ss = String(timeLeft % 60).padStart(2, '0');
  timerText.textContent = `${mm}:${ss}`;
}

function updateProgressUI() {
const progressText = document.getElementById('progress-text');

if (!progressText) {
console.log('[PROGRESS UPDATE] progress-text TIDAK DITEMUKAN');
return;
}

const displayNumber = currentQuestionIndex + 1;

progressText.textContent = `Soal: ${displayNumber}/${TOTAL_QUESTIONS}`;

console.log(
'[PROGRESS UPDATE]',
'currentQuestionIndex =',
currentQuestionIndex,
'display =',
progressText.textContent
);
}

function startTimer(onTimeout) {
  updateTimerUI();
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    timeLeft -= 1;
    updateTimerUI();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      if (typeof onTimeout === 'function') onTimeout();
    }
  }, 1000);
}

function showScorePage() {
  // stop timer
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  // compute final score
  // Skor: benar = 100/TOTAL_QUESTIONS per soal, salah = 0
  const maxScore = 100;
  const perQuestion = Math.round(maxScore / TOTAL_QUESTIONS);
  // Pastikan 100/100 tidak meleset jika pembulatan.
  // Untuk drag-and-drop multi-item, score sudah diakumulasi per item benar.
  // Jadi jangan overwrite jika score sudah terisi.
  if (score <= 0) {
    score = correctCount * perQuestion;
  }
  if (correctCount === TOTAL_QUESTIONS) score = 100;

  const finalScore = document.getElementById('final-score');
  const correctEl = document.getElementById('correct-count');
  const wrongEl = document.getElementById('wrong-count');
  const timeLeftEl = document.getElementById('time-left');

  // Hapus tampilan statistik WAKTU dari card skor (hanya UI)
  if (timeLeftEl) {
    const timeStatEl = timeLeftEl.closest('.stat-item');
    if (timeStatEl) timeStatEl.remove();
  }

  if (finalScore) finalScore.textContent = `${score}/${100}`;
  if (correctEl) correctEl.textContent = String(correctCount);
  if (wrongEl) wrongEl.textContent = String(wrongCount);

  // Layout 3 statistik (Jawaban Benar, Jawaban Salah, Total Soal)
  const statsGridEl = document.querySelector('#score-page .score-stats-grid');
  if (statsGridEl) {
    statsGridEl.style.display = 'flex';
    statsGridEl.style.justifyContent = 'center';
    statsGridEl.style.gap = '20px';
  }

  // Motivasi: "HEBAT!" rata tengah
  const scoreMessageTitleEl = document.querySelector('#score-page .score-message strong');
  if (scoreMessageTitleEl) {
    scoreMessageTitleEl.style.display = 'block';
    scoreMessageTitleEl.style.textAlign = 'center';
    scoreMessageTitleEl.style.width = '100%';
  }

  // Baris bawah (⭐ + teks) dibuat jadi 1 baris dan rata tengah
  const starIconEl = document.querySelector('#score-page .score-message .star-icon');
  const messageContentEl = document.querySelector('#score-page .score-message .message-content');
  if (starIconEl && messageContentEl) {
    // Pastikan bintang dan teks tampil dalam satu baris
    starIconEl.style.margin = '0';
    starIconEl.style.display = 'inline-block';

    const msgTextOnly = messageContentEl.childNodes[1];

    // Buat wrapper flex khusus
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.style.gap = '10px';

    // Ambil teks baris kedua (setelah <br>)
    const textNode = document.createTextNode('');
    wrapper.appendChild(starIconEl);

    // Ambil string setelah <br> dari messageContentEl
    const contentText = messageContentEl.textContent.replace('Hebat!\n', '').trim();
    const textEl = document.createElement('div');
    textEl.textContent = contentText;
    textEl.style.textAlign = 'left';

    wrapper.appendChild(textEl);

    // kosongkan message-content lalu susun ulang
    messageContentEl.innerHTML = '<strong style="display:block; text-align:center; width:100%;">Hebat!</strong>';
    messageContentEl.appendChild(wrapper);
  }

  // total soal stat: di HTML ada <div class="stat-value">5</div>
  // Kita hardcode 5 agar sesuai rule TOTAL_QUESTIONS.
  // (Agar aman jika selector berubah, kita tetap set jika ada elemen dengan id atau posisi.)
  const statTotal = document.getElementById('score-page')?.querySelectorAll('.stat-item .stat-value')[3];
  if (statTotal) statTotal.textContent = String(TOTAL_QUESTIONS);

  tampilkanHalamanMutlak('score-page');
}

function lockQuestionUI(lock) {
  const state = window.__mindplayGameState;
  if (!state) return;
  state.locked = !!lock;
}

function proceedToNextQuestionOrFinish() {
  const state = window.__mindplayGameState;

  if (!state) return;

  // HARD GUARD anti double next
  if (state.__proceedQueued === true) return;

  state.__proceedQueued = true;

  // stop semua trigger lama drag-drop
  state.__dndRenderToken =
    (state.__dndRenderToken || 0) + 1;

  // naik index SEKALI
  currentQuestionIndex++;

  console.log('[NEXT QUESTION]', currentQuestionIndex);

  // selesai game
  if (currentQuestionIndex >= TOTAL_QUESTIONS) {

    // reset guard sebelum keluar
    state.__proceedQueued = false;

    showScorePage();
    return;
  }

  // reset state soal berikutnya
  state.locked = false;
  state.answered = false;

  // update progress
  updateProgressUI();

  // render soal berikutnya
  renderCurrentQuestion();

  // buka guard setelah render benar-benar selesai
  requestAnimationFrame(() => {
    state.__proceedQueued = false;
  });
}

function markAnswer(isCorrect) {
  const state = window.__mindplayGameState;
  if (!state || state.locked) return;

  lockQuestionUI(true);
  state.answered = true;

  if (isCorrect) {
    correctCount += 1;
  } else {
    wrongCount += 1;
  }
}

function renderTebakGambar(question) {
  const ui = document.getElementById('game-ui');
  if (!ui) return;

  ui.innerHTML = `
    <div class="quiz-wrap">
      <div class="question-title">${question.q}</div>

      <div style="margin-top:14px;">
        <img
          src="${question.img || ''}"
          alt="${question.q}"
          style="width:100%; max-height:220px; object-fit:contain; border-radius:12px; background:rgba(29,78,216,0.08); display:block;"
          onerror="this.style.display='none';"
        />
      </div>

      <div class="answer-grid" style="display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:12px; margin-top:18px;">
        ${question.options
          .map(opt => {
            const btnLabel = String(opt);
            return `
              <button type="button" class="btn-navy" data-action="answer" data-answer="${btnLabel}" style="padding:14px 10px; border-radius:10px; cursor:pointer;">${btnLabel}</button>
            `;
          })
          .join('')}
      </div>
      <div id="tebak-gambar-feedback" style="margin-top:14px; min-height: 20px; font-weight:600;"></div>
    </div>
  `;

  const btns = ui.querySelectorAll('button[data-action="answer"]');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const state = window.__mindplayGameState;
      if (!state || state.locked) return;

      const selected = btn.getAttribute('data-answer');
      const correct = String(question.correct);
      const isCorrect = String(selected) === correct;

      markAnswer(isCorrect);

      const fb = document.getElementById('tebak-gambar-feedback');
      if (fb) fb.textContent = isCorrect ? 'Benar! ✅' : `Salah! Jawaban benar: ${correct} ❌`;

      setTimeout(() => proceedToNextQuestionOrFinish(), 700);
    });
  });
}

function renderDragAndDrop(question) {
  const ui = document.getElementById('game-ui');
  if (!ui) return;

  // 1) Data Preparation
  const zones = Array.isArray(question?.zones) ? question.zones : [];
  if (zones.length === 0) {
    ui.innerHTML = '<div class="dnd-empty">Soal tidak tersedia.</div>';
    return;
  }

  // 2) State zona berjalan dalam 1 question
  const state = window.__mindplayGameState;
  if (!state) return;

  // reset guard async sebelum render zona baru (mencegah sisa async dari zona sebelumnya)
  state.__dndDropHandled = false;
  state.__dndRenderToken = (state.__dndRenderToken || 0) + 1;
  const renderToken = state.__dndRenderToken;

  // index zona aktif
if (typeof state.currentZoneIndex !== 'number') {
  state.currentZoneIndex = 0;
}

const activeZoneIdx = state.currentZoneIndex;
const activeZone = zones[activeZoneIdx];

// reset penilaian saat mulai dari zona pertama
if (activeZoneIdx === 0) {
  state.__dndQuestionAllZonesCorrect = true;
}


  // 3) Pastikan dari 4 item: 1 benar + 3 pengecoh (berdasarkan zona aktif)
  const correctItems = (activeZone?.items || []).filter(it => !!it.correct);
  const falseItems = (zones || []).flatMap(z => (z?.items || [])).filter(it => !it.correct);

  const correctPick = correctItems.length ? shuffleArray(correctItems)[0] : (shuffleArray((activeZone?.items || []) || [])[0] || null);
  const falsePicks = shuffleArray(falseItems)
    .filter(it => !correctPick || it.name !== correctPick.name)
    .slice(0, 3);

  const displayItems = shuffleArray([correctPick, ...falsePicks].filter(Boolean));


  // 4) Render HTML DND (reset penuh tiap soal)
  ui.innerHTML = `
    <div class="dnd-container">
      <div class="dnd-tips-card">
        <span class="dnd-tips-icon" aria-hidden="true">💡</span>
        <div class="dnd-tips-text">Pahamilah fungsi setiap komponen, lalu letakkan pada zona yang paling sesuai.</div>
      </div>

      <div class="dnd-grid">
        <div class="dnd-items">
          <span class="dnd-column-label">ITEM (KOMPONEN)</span>
          <div class="dnd-items-list" id="dnd-items-list">
            ${displayItems.map(it => `
              <div class="dnd-item" draggable="true" role="button" tabindex="0"
                data-name="${it.name}" data-is-correct="${it.correct ? '1' : '0'}">
                ${it.image ? `<img src="${it.image}" class="dnd-item-img" alt="${it.name}">` : ''}
                <div class="dnd-item-text">${it.name}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="dnd-zone-col">
          <span class="dnd-column-label">ZONA FUNGSI</span>
          <div class="dnd-zone">
            <div class="dnd-zone-card">
              <div class="dnd-zone-card-head">
                <div class="dnd-zone-card-icon" aria-hidden="true">🧩</div>
                <div>
                  <div class="dnd-zone-card-title">${activeZone.title}</div>
                  <div class="dnd-zone-card-desc">${activeZone.description}</div>
                </div>
              </div>

              <div class="dnd-zone-drop-area" id="dnd-drop-area" data-zone-idx="${activeZoneIdx}">
                <div class="dnd-zone-drop-instruction">Masukan ke zona di sini</div>
              </div>

              <div class="dnd-feedback" id="dnd-feedback" aria-live="polite" style="display:none"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // 5) Setup Drag & Drop logic (hanya untuk game ini)


  const dropArea = ui.querySelector('#dnd-drop-area');
  const items = ui.querySelectorAll('.dnd-item[draggable="true"]');
  if (!dropArea || !items.length) return;

  // Reset guard per soal (lokal), tapi keputusan final pakai state.__dndDropHandled + token
  let dropHandled = false;

  function setDropHover(isOn) {
    const zone = ui.querySelector('.dnd-zone-drop-area');
    if (!zone) return;
    zone.classList.toggle('is-dragover', !!isOn);
  }

  function getIsCorrectFromDragged(el) {
    if (!el) return false;
    return el.getAttribute('data-is-correct') === '1';
  }

 items.forEach(item => {

  item.addEventListener('touchstart', () => {
    if (state.locked) return;

    items.forEach(i => i.classList.remove('selected-mobile'));
    item.classList.add('selected-mobile');

    window.__selectedDndItem = item;

    });
  });

  dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (state.locked) return;
    setDropHover(true);
    try {
      e.dataTransfer.dropEffect = 'move';
    } catch (err) {}
  });

  dropArea.addEventListener('dragleave', () => {
    setDropHover(false);
  });

  function handleDropResult(isCorrect) {

  if (!isCorrect) {
    state.__dndQuestionAllZonesCorrect = false;
  }

  items.forEach(it => {
    it.classList.add('dnd-item-disabled');
    it.setAttribute('draggable', 'false');
  });

  const fb = ui.querySelector('#dnd-feedback');

  if (fb) {
    fb.style.display = 'block';
    fb.style.color = isCorrect ? '#16a34a' : '#ef4444';
    fb.textContent = isCorrect ? 'Benar! ✅' : 'Salah! ❌';
  }

  // lanjutkan semua kode setTimeout yang sudah ada sekarang
  setTimeout(() => {

    if (state.__dndRenderToken !== renderToken) return;

    const totalZones = (question?.zones || []).length;

    if (state.currentZoneIndex < totalZones - 1) {

      state.currentZoneIndex += 1;
      renderDragAndDrop(question);
      return;
    }

    const allCorrect = state.__dndQuestionAllZonesCorrect;

    markAnswer(allCorrect);

    if (fb) {
      fb.style.display = 'block';
      fb.style.color = allCorrect ? '#16a34a' : '#ef4444';
      fb.textContent = allCorrect
        ? 'Semua zona benar! ✅'
        : 'Ada zona yang salah! ❌';
    }

    setTimeout(() => {
      proceedToNextQuestionOrFinish();
    }, 700);

  }, 550);
}

  dropArea.addEventListener('drop', (e) => {
  e.preventDefault();

  if (dropHandled) return;
  if (state.locked) return;
  if (state.__dndRenderToken !== renderToken) return;
  if (state.__dndDropHandled) return;

  dropHandled = true;
  state.__dndDropHandled = true;

  setDropHover(false);

  let draggedName = '';

  try {
    draggedName = e.dataTransfer?.getData('text/plain') || '';
  } catch (err) {}

  const draggedEl = ui.querySelector(
    `.dnd-item[data-name="${draggedName}"]`
  );

  const isCorrect = getIsCorrectFromDragged(draggedEl);

  dropArea.dataset.filled = 'true';

  handleDropResult(isCorrect);
});

}

function renderKuisCepat(question) {
  const ui = document.getElementById('game-ui');
  if (!ui) return;

  ui.innerHTML = `
    <div class="quiz-wrap">
      <div class="question-title">${question.q}</div>
      <div class="answer-grid" style="display:grid; grid-template-columns: repeat(1, minmax(0,1fr)); gap:12px; margin-top:18px;">
        ${question.options
          .map(opt => {
            const label = String(opt);
            return `
              <button type="button" class="btn-navy" data-action="answer" data-answer="${label}" style="padding:14px 12px; border-radius:10px; cursor:pointer; text-align:left;">${label}</button>
            `;
          })
          .join('')}
      </div>
      <div id="kuis-feedback" style="margin-top:14px; min-height: 20px; font-weight:600;"></div>
    </div>
  `;

  const btns = ui.querySelectorAll('button[data-action="answer"]');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const state = window.__mindplayGameState;
      if (!state || state.locked) return;

      const selected = btn.getAttribute('data-answer');
      const correct = String(question.correct);
      const isCorrect = String(selected) === correct;

      markAnswer(isCorrect);

      const fb = document.getElementById('kuis-feedback');
      if (fb) fb.textContent = isCorrect ? 'Benar! ✅' : `Salah! Jawaban benar: ${correct} ❌`;

      setTimeout(() => proceedToNextQuestionOrFinish(), 500);
    });
  });
}

function renderCurrentQuestion() {
  const state = window.__mindplayGameState;
  if (!state) return;

  // RESET ZONA DRAG-DROP SETIAP GANTI SOAL
state.__dndDropHandled = false;
state.__dndQuestionAllZonesCorrect = true;
state.currentZoneIndex = 0;

  const q = state.questions[currentQuestionIndex];

  if (!q) {
    showScorePage();
    return;
  }

  if (state.gameKey === 'tebak-gambar') {
    renderTebakGambar(q);
  } else if (state.gameKey === 'drag-and-drop') {
    renderDragAndDrop(q);
  } else if (state.gameKey === 'kuis-cepat') {
    renderKuisCepat(q);
  } else {
    document.getElementById('game-ui').innerHTML = '<div>Game tidak ditemukan.</div>';
  }
}

function startGame(gameKey) {
  console.log("Game Starting:", gameKey);

  // Guard rendering target DOM
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) return;

  // 2) PASTIKAN halaman beralih ke #game-container
  localStorage.setItem(LS_LAST_GAME_KEY, gameKey);
  resetGameState();

  // Pastikan __dndFinished dipastikan false sebelum game dimulai
  if (window.__mindplayGameState) {
    window.__mindplayGameState.__dndFinished = false;
  }

  tampilkanHalamanMutlak('game-container');

  const titleEl = document.getElementById('game-title');
  if (titleEl) {
    if (gameKey === 'tebak-gambar') titleEl.textContent = 'Tebak Gambar';
    else if (gameKey === 'drag-and-drop') titleEl.textContent = 'Drag and Drop';
    else if (gameKey === 'kuis-cepat') titleEl.textContent = 'Kuis Cepat';
    else titleEl.textContent = 'Game';
  }

  // Ambil soal dari curriculumData.soal
  const pool = curriculumData.soal?.[gameKey] || [];
  if (pool.length === 0) {
    alert('Soal untuk game ini belum tersedia.');
    tampilkanHalamanMutlak('pilih-game-page');
    return;
  }

  // Fisher-Yates shuffle pada pool, ambil N teratas (TOTAL_QUESTIONS)
  const selectedQuestions = pickShuffledTop(pool, Math.min(TOTAL_QUESTIONS, pool.length));

  // Jika data kurang dari TOTAL_QUESTIONS, duplikasi agar tidak error.
  while (selectedQuestions.length < TOTAL_QUESTIONS && pool.length > 0) {
    selectedQuestions.push(pool[selectedQuestions.length % pool.length]);
  }

  window.__mindplayGameState.gameKey = gameKey;
  window.__mindplayGameState.questions = selectedQuestions;
  window.__mindplayGameState.locked = false;
  window.__mindplayGameState.answered = false;

  updateProgressUI();
  updateTimerUI();

  // Timer: 1 timer untuk seluruh game.
  startTimer(() => {
    // waktu habis -> langsung score
    // (anggap soal yang tersisa sebagai salah)
    while (currentQuestionIndex < TOTAL_QUESTIONS) {
      wrongCount += 1;
      currentQuestionIndex += 1;
    }
    showScorePage();
  });

  renderCurrentQuestion();
}


function mainAgain() {
  const lastKey = localStorage.getItem(LS_LAST_GAME_KEY) || 'tebak-gambar';
  startGame(lastKey);
}

// =========================
// BOOTSTRAP INITIALIZATION
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const startPage = 'landing-page';

  // Pastikan halaman awal aktif secara class visual
  // (Ini patch minimal untuk mencegah blank page saat mekanisme class/hidden tidak terpasang.)
  const lp = document.getElementById(startPage);
  const allContainers = document.querySelectorAll('.page-container, .page-section');
  allContainers.forEach(el => {
    // default: non-aktif
    el.classList.remove('active');
    el.classList.add('hidden');
  });

  if (lp) {
    lp.classList.remove('hidden');
    lp.classList.add('active');
  }

  renderMateriDariJenjang();
});


