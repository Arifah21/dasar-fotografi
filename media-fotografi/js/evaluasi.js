// js/evaluasi.js
// js/evaluasi.js
import { supabase } from './supabase-client.js';

// ====================================================================
// ==================== DATA SOAL EVALUASI ==========================
// ====================================================================

const soalPG = [
    {
        nomor: 1,
        pertanyaan: "Seorang fotografer ingin memotret potret temannya dengan latar belakang yang benar-benar blur (bokeh halus). Kamera disetel pada mode Manual dengan nilai f/1.8, 1/500s, ISO 200. Namun hasilnya terlalu gelap. Analisis kombinasi pengaturan yang PALING TEPAT agar foto menjadi lebih terang tanpa mengubah efek bokeh yang diinginkan?",
        opsi: {
            A: "Menurunkan aperture ke f/8 dan menaikkan ISO ke 1600",
            B: "Memperlambat shutter speed menjadi 1/125s dan/atau menaikkan ISO",
            C: "Menaikkan aperture ke f/22 dan mempertahankan ISO 200",
            D: "Mengubah shutter speed menjadi 1/1000s dan ISO 800",
            E: "Mengubah ISO menjadi 100 dan aperture ke f/1.4"
        },
        jawaban: "B",
        pembahasan: "Untuk mempertahankan efek bokeh (DOF dangkal), aperture harus tetap besar (f/1.8). Cara mencerahkan tanpa mengubah aperture adalah memperlambat shutter speed (1/500s → 1/125s = +2 stop) atau menaikkan ISO. Opsi A dan C mengubah aperture; opsi D justru makin gelap; opsi E tidak masuk akal (ISO 100 lebih gelap)."
    },
    {
        nomor: 2,
        pertanyaan: "Seorang siswa memotret pertandingan futsal di dalam gedung dengan pencahayaan minim. Ia menggunakan ISO 6400 agar foto tidak blur. Namun hasil foto tampak 'berbintik' dan warnanya kusam. Evaluasi apa yang PALING TEPAT terhadap keputusan siswa tersebut?",
        opsi: {
            A: "Keputusan sudah tepat karena ISO tinggi membuat foto terang",
            B: "Ia seharusnya memakai ISO 100 agar gambar tajam dan bersih",
            C: "Ia sebaiknya menurunkan ISO dan menambah pencahayaan eksternal serta memperlambat shutter speed",
            D: "Ia seharusnya menaikkan shutter speed dan mempertahankan ISO 6400",
            E: "Ia harus mengganti lensa dengan focal length lebih panjang"
        },
        jawaban: "C",
        pembahasan: "ISO tinggi memang membuat terang tetapi menimbulkan noise. Solusi paling tepat: turunkan ISO, tambahkan cahaya (flash/lighting), dan sesuaikan shutter speed. Opsi B tidak realistis karena kondisi gelap tanpa cahaya tambahan tidak mungkin pakai ISO 100. Opsi lain tidak menyelesaikan masalah noise."
    },
    {
        nomor: 3,
        pertanyaan: "Perhatikan pernyataan berikut! (1) Semakin kecil angka f, semakin banyak cahaya masuk. (2) Shutter speed 1/1000s menghasilkan motion blur. (3) ISO tinggi menurunkan kualitas gambar karena noise. (4) Aperture f/16 menghasilkan DOF sangat dangkal. Pernyataan yang BENAR adalah...",
        opsi: {
            A: "(1) dan (2)",
            B: "(1) dan (3)",
            C: "(2) dan (3)",
            D: "(2) dan (4)",
            E: "(3) dan (4)"
        },
        jawaban: "B",
        pembahasan: "Pernyataan (1) benar: f/1.8 = bukaan besar = banyak cahaya. (3) benar: ISO tinggi = noise. Pernyataan (2) salah: 1/1000s justru freeze motion, bukan motion blur. (4) salah: f/16 adalah bukaan kecil = DOF dalam, bukan dangkal."
    },
    {
        nomor: 4,
        pertanyaan: "Seorang fotografer landscape ingin memotret pegunungan agar seluruh area (dari bunga di depan hingga puncak gunung) tajam. Ia menggunakan aperture f/2.8, ISO 100, dan shutter speed 1/2000s. Apa yang SALAH dari pilihan pengaturan ini dan bagaimana perbaikannya?",
        opsi: {
            A: "Salah pada ISO. Seharusnya ISO 3200 agar semua terang",
            B: "Salah pada aperture. Seharusnya f/11–f/16 agar DOF dalam, lalu kompensasi shutter speed dan gunakan tripod",
            C: "Salah pada shutter speed. Seharusnya 1/30s agar terang tanpa mengubah aperture",
            D: "Tidak ada yang salah, pengaturan sudah tepat",
            E: "Salah pada mode kamera. Seharusnya mode Aperture Priority dengan f/2.8"
        },
        jawaban: "B",
        pembahasan: "Untuk landscape dengan semua objek tajam, dibutuhkan DOF dalam → aperture kecil (f/11–f/16). Karena cahaya berkurang, kompensasi dengan shutter speed lebih lambat dan gunakan tripod. f/2.8 pada landscape hanya akan membuat foreground tajam & background blur."
    },
    {
        nomor: 5,
        pertanyaan: "Perhatikan skenario berikut! Rina memotret air terjun dan ingin mendapatkan efek sutra halus. Ia memakai shutter speed 1/500s. Hasilnya air justru beku dan tampak berhenti. Berdasarkan konsep segitiga exposure, apa yang PALING TEPAT dilakukan Rina?",
        opsi: {
            A: "Mempercepat shutter speed menjadi 1/2000s agar lebih halus",
            B: "Memperlambat shutter speed (misal 1–4 detik), mengecilkan aperture, dan memakai tripod",
            C: "Menaikkan ISO ke 6400 dan mempertahankan shutter speed 1/500s",
            D: "Mengganti lensa dengan focal length lebih panjang",
            E: "Mengubah mode kamera ke Auto agar hasil lebih baik"
        },
        jawaban: "B",
        pembahasan: "Efek sutra pada air terjun diperoleh dengan long exposure (shutter speed lambat, umumnya 1–4 detik). Untuk mengimbangi cahaya yang masuk, aperture dikecilkan (f/16–f/22). Tripod wajib agar tidak blur karena getaran tangan."
    },
    {
        nomor: 6,
        pertanyaan: "Seorang siswa berpendapat: 'Semakin tinggi ISO, semakin bagus foto karena lebih terang.' Evaluasi kritis terhadap pendapat tersebut adalah...",
        opsi: {
            A: "Benar, karena terang selalu lebih baik dalam fotografi",
            B: "Salah, karena ISO tinggi menimbulkan noise/grain yang menurunkan kualitas detail foto",
            C: "Benar, jika kamera memiliki megapiksel besar",
            D: "Salah, karena ISO tidak berpengaruh pada hasil foto",
            E: "Benar, karena ISO menggantikan fungsi aperture"
        },
        jawaban: "B",
        pembahasan: "ISO tinggi bukan berarti lebih bagus. Meskipun membuat foto lebih terang, ISO tinggi menimbulkan noise/grain yang menurunkan detail & kualitas. Prinsip: gunakan ISO serendah mungkin, naikkan hanya jika aperture & shutter sudah tidak bisa dikompensasi."
    },
    {
        nomor: 7,
        pertanyaan: "Seorang fotografer produk ingin memotret sebuah jam tangan dengan detail yang sangat tajam dan latar belakang bersih. Kombinasi pengaturan mana yang PALING TEPAT?",
        opsi: {
            A: "f/1.4, 1/60s, ISO 200, tanpa tripod",
            B: "f/11, 1/125s, ISO 100, dengan tripod & lighting studio",
            C: "f/2.8, 1/1000s, ISO 3200, tanpa tripod",
            D: "f/16, 1/30s, ISO 6400, hand-held",
            E: "f/1.8, 1/2000s, ISO 100, mode Auto"
        },
        jawaban: "B",
        pembahasan: "Foto produk butuh ketajaman detail maksimal → aperture kecil (f/8–f/16), ISO rendah (100) agar bersih, tripod agar stabil, dan lighting terkontrol. Opsi B paling sesuai. Opsi lain memiliki kekurangan: blur (A, C, D) atau noise tinggi (C, D)."
    },
    {
        nomor: 8,
        pertanyaan: "Perhatikan situasi ini! Dua fotografer mengambil pemandangan sama. Fotografer A memakai f/16, 1/125s, ISO 100. Fotografer B memakai f/2.8, 1/2000s, ISO 100. Keduanya menghasilkan kecerahan (exposure) yang sama. Kesimpulan yang PALING TEPAT mengenai hasil foto adalah...",
        opsi: {
            A: "Kedua foto identik dalam semua hal",
            B: "Foto A memiliki DOF lebih dalam daripada foto B",
            C: "Foto B memiliki DOF lebih dalam daripada foto A",
            D: "Keduanya memiliki DOF yang sama karena exposure sama",
            E: "Foto A lebih blur dibanding foto B di semua area"
        },
        jawaban: "B",
        pembahasan: "Exposure bisa sama meski aperture & shutter berbeda (hubungan berbanding terbalik). Namun DOF ditentukan aperture: f/16 (A) menghasilkan DOF dalam, sementara f/2.8 (B) menghasilkan DOF dangkal. Jadi foto A lebih tajam di seluruh area."
    },
    {
        nomor: 9,
        pertanyaan: "Seorang siswa ingin mengambil foto jalanan yang ramai dengan efek light trail dari lampu kendaraan malam hari. Ia memakai shutter speed 1/60s. Hasilnya lampu hanya terlihat sebagai titik. Apa yang SALAH dan bagaimana solusinya?",
        opsi: {
            A: "Salah pada ISO — seharusnya diturunkan ke 50",
            B: "Salah pada shutter speed — seharusnya 2–30 detik dengan aperture kecil & tripod",
            C: "Salah pada lensa — seharusnya memakai lensa macro",
            D: "Salah pada mode kamera — seharusnya mode portrait",
            E: "Tidak ada yang salah, hasil sudah sesuai"
        },
        jawaban: "B",
        pembahasan: "Light trail membutuhkan long exposure (shutter speed lambat: 2–30 detik). Untuk mengimbangi cahaya, aperture dikecilkan (f/11–f/22) dan ISO rendah. Tripod wajib agar tidak blur. 1/60s hanya akan menangkap lampu sebagai titik biasa."
    },
    {
        nomor: 10,
        pertanyaan: "Perhatikan pernyataan berikut! (1) Golden ratio identik dengan rule of thirds. (2) Leading lines menuntun mata menuju objek utama. (3) Framing menggunakan elemen sekitar sebagai bingkai alami. (4) Negative space membuat foto tampak penuh dan padat. Pernyataan yang BENAR tentang komposisi adalah...",
        opsi: {
            A: "(1) dan (2)",
            B: "(2) dan (3)",
            C: "(1) dan (4)",
            D: "(3) dan (4)",
            E: "(2) dan (4)"
        },
        jawaban: "B",
        pembahasan: "(2) Benar: leading lines memandu mata menuju subjek. (3) Benar: framing memakai elemen sekitar sebagai bingkai. (1) Salah: golden ratio (1:1.618) berbeda dengan rule of thirds (1:1:1). (4) Salah: negative space justru memberi ruang kosong, bukan memenuhi frame."
    }
];

const soalEssay = [
    {
        nomor: 11,
        pertanyaan: "Jelaskan konsep dasar Segitiga Exposure dan bagaimana ketiga elemennya (aperture, shutter speed, ISO) saling memengaruhi untuk menghasilkan foto yang tepat exposure!",
        keywords: ["aperture", "shutter", "iso", "cahaya", "bukaan", "rana", "sensor", "kompensasi", "seimbang", "exposure"],
        minKata: 30,
        poinMax: 8
    },
    {
        nomor: 12,
        pertanyaan: "Sebutkan dan jelaskan minimal 3 (tiga) teknik komposisi fotografi yang kamu ketahui beserta contoh penerapannya!",
        keywords: ["rule of thirds", "leading lines", "framing", "symmetry", "negative space", "golden ratio", "komposisi", "contoh"],
        minKata: 25,
        poinMax: 8
    },
    {
        nomor: 13,
        pertanyaan: "Seorang fotografer memotret konser musik dalam kondisi pencahayaan gelap. Menurutmu, pengaturan kamera seperti apa yang paling tepat digunakan? Jelaskan alasan dari setiap pengaturan yang kamu pilih!",
        keywords: ["iso", "tinggi", "aperture", "besar", "f kecil", "shutter", "1/", "flash", "noise", "tripod", "lensa"],
        minKata: 30,
        poinMax: 8
    },
    {
        nomor: 14,
        pertanyaan: "Apa perbedaan utama antara fotografi portrait, fotografi landscape, dan fotografi still life/product? Jelaskan ciri khas masing-masing dan sebutkan contoh pengaturan kamera yang sesuai!",
        keywords: ["portrait", "landscape", "produk", "still life", "dof", "aperture", "lensa", "ciri", "contoh"],
        minKata: 30,
        poinMax: 8
    },
    {
        nomor: 15,
        pertanyaan: "Menurutmu, mengapa fotografer profesional sering menggunakan ISO rendah (100-200) meskipun kondisi pencahayaan kurang ideal? Jelaskan hubungannya dengan kualitas gambar dan strategi apa yang bisa digunakan untuk mengatasinya!",
        keywords: ["iso", "rendah", "noise", "kualitas", "tajam", "bersih", "shutter", "aperture", "cahaya", "tripod", "lighting", "flash"],
        minKata: 25,
        poinMax: 8
    }
];

const TOTAL_WAKTU_MENIT = 30;

// ====================================================================
// ==================== STATE ========================================
// ====================================================================

let evaluasiState = {
    nama: '',
    kelas: '',
    jawabanPG: {},      // { soalNomor: "A"|"B"|... }
    jawabanEssay: {},   // { soalNomor: "teks jawaban" }
    waktuMulai: null,
    timerInterval: null,
    sisaWaktu: TOTAL_WAKTU_MENIT * 60,
    sudahSelesai: false
};

// ====================================================================
// ==================== RENDER SOAL ==================================
// ====================================================================

function renderSoalPG() {
    const container = document.getElementById('soal-pg-container');
    container.innerHTML = '';

    soalPG.forEach((soal, idx) => {
        const div = document.createElement('div');
        div.className = 'soal-pg';
        div.dataset.nomor = soal.nomor;

        const opsiHTML = Object.entries(soal.opsi).map(([huruf, teks]) => `
            <label class="opsi-item" data-huruf="${huruf}">
                <input type="radio" name="pg-${soal.nomor}" value="${huruf}" data-soal="${soal.nomor}">
                <span class="opsi-huruf">${huruf}</span>
                <span class="opsi-teks">${teks}</span>
            </label>
        `).join('');

        div.innerHTML = `
            <div class="soal-header">
                <span class="soal-nomor">${soal.nomor}</span>
                <span class="soal-label">Pilihan Ganda • HOTS</span>
            </div>
            <div class="soal-pertanyaan">${soal.pertanyaan}</div>
            <div class="opsi-list">${opsiHTML}</div>
        `;

        container.appendChild(div);
    });

    // Event listener pilihan
    container.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', handlePGChange);
    });
    container.querySelectorAll('.opsi-item').forEach(label => {
        label.addEventListener('click', () => {
            setTimeout(() => updatePGVisual(), 0);
        });
    });
}

function handlePGChange(e) {
    const soalNomor = e.target.dataset.soal;
    const nilai = e.target.value;
    evaluasiState.jawabanPG[soalNomor] = nilai;
    updatePGVisual();
    updateProgress();
}

function updatePGVisual() {
    document.querySelectorAll('.soal-pg').forEach(div => {
        const nomor = div.dataset.nomor;
        const selected = div.querySelector('input:checked');
        div.classList.toggle('terjawab', !!selected);

        div.querySelectorAll('.opsi-item').forEach(label => {
            const input = label.querySelector('input');
            label.classList.toggle('selected', input.checked);
        });
    });
}

function renderSoalEssay() {
    const container = document.getElementById('soal-essay-container');
    container.innerHTML = '';

    soalEssay.forEach((soal, idx) => {
        const div = document.createElement('div');
        div.className = 'soal-essay';
        div.dataset.nomor = soal.nomor;

        div.innerHTML = `
            <div class="soal-header">
                <span class="soal-nomor">${soal.nomor}</span>
                <span class="soal-label">Esai • Uraian</span>
            </div>
            <div class="soal-pertanyaan">${soal.pertanyaan}</div>
            <textarea 
                class="essay-textarea" 
                rows="5" 
                placeholder="Tulis jawabanmu di sini... (minimal ${soal.minKata} kata)"
                data-soal="${soal.nomor}"
                maxlength="2000"
            ></textarea>
            <div class="char-counter">
                <span class="kata-count" data-soal="${soal.nomor}">0</span> kata (min. ${soal.minKata})
            </div>
        `;

        container.appendChild(div);
    });

    container.querySelectorAll('.essay-textarea').forEach(textarea => {
        textarea.addEventListener('input', handleEssayInput);
    });
}

function handleEssayInput(e) {
    const soalNomor = e.target.dataset.soal;
    const teks = e.target.value.trim();
    evaluasiState.jawabanEssay[soalNomor] = teks;

    const kataCount = teks ? teks.split(/\s+/).filter(w => w.length > 0).length : 0;
    const counter = document.querySelector(`.kata-count[data-soal="${soalNomor}"]`);
    if (counter) {
        counter.textContent = kataCount;
        counter.style.color = kataCount >= soalEssay.find(s => s.nomor == soalNomor).minKata ? '#2ecc71' : '#adb5bd';
    }

    const parent = e.target.closest('.soal-essay');
    parent.classList.toggle('terjawab', teks.length > 0);

    updateProgress();
}

function updateProgress() {
    let terjawab = 0;
    Object.keys(evaluasiState.jawabanPG).forEach(k => {
        if (evaluasiState.jawabanPG[k]) terjawab++;
    });
    Object.keys(evaluasiState.jawabanEssay).forEach(k => {
        if (evaluasiState.jawabanEssay[k] && evaluasiState.jawabanEssay[k].length > 0) terjawab++;
    });

    const total = 15;
    const persen = (terjawab / total) * 100;

    document.getElementById('progres-teks').textContent = `${terjawab} / ${total} soal`;
    document.getElementById('progres-eval').style.width = `${persen}%`;
}

// ====================================================================
// ==================== TIMER ========================================
// ====================================================================

function startTimer() {
    clearInterval(evaluasiState.timerInterval);
    updateTimerDisplay();

    evaluasiState.timerInterval = setInterval(() => {
        evaluasiState.sisaWaktu--;
        updateTimerDisplay();

        if (evaluasiState.sisaWaktu <= 0) {
            clearInterval(evaluasiState.timerInterval);
            alert('⏰ Waktu habis! Evaluasi akan dikumpulkan secara otomatis.');
            document.getElementById('form-evaluasi').dispatchEvent(new Event('submit'));
        }
    }, 1000);
}

function updateTimerDisplay() {
    const menit = Math.floor(evaluasiState.sisaWaktu / 60);
    const detik = evaluasiState.sisaWaktu % 60;
    const el = document.getElementById('eval-timer');
    if (el) {
        el.textContent = `${String(menit).padStart(2, '0')}:${String(detik).padStart(2, '0')}`;
        el.classList.toggle('hampir-habis', evaluasiState.sisaWaktu <= 300);
    }
}

// ====================================================================
// ==================== NAVIGASI SCREEN ==============================
// ====================================================================

function showScreen(screenId) {
    document.querySelectorAll('.evaluasi-screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====================================================================
// ==================== MULAI EVALUASI ===============================
// ====================================================================

function mulaiEvaluasi() {
    const nama = document.getElementById('eval-nama').value.trim();
    const kelas = document.getElementById('eval-kelas').value.trim();

    if (!nama) {
        alert('Nama wajib diisi!');
        document.getElementById('eval-nama').focus();
        return;
    }
    if (!kelas) {
        alert('Kelas wajib diisi!');
        document.getElementById('eval-kelas').focus();
        return;
    }

    // Cek sudah pernah mengerjakan?
    const sudah = localStorage.getItem('evaluasi_selesai_' + nama.toLowerCase().replace(/\s+/g, '_'));
    if (sudah) {
        const data = JSON.parse(sudah);
        alert(`⚠️ Kamu sudah pernah mengerjakan evaluasi ini.\n\nNama: ${data.nama}\nSkor: ${data.skor}\nWaktu: ${new Date(data.waktu).toLocaleString('id-ID')}\n\nEvaluasi tidak dapat diulang.`);
        tampilkanHasilDariCache(data);
        return;
    }

    evaluasiState.nama = nama;
    evaluasiState.kelas = kelas;
    evaluasiState.waktuMulai = new Date();
    evaluasiState.sisaWaktu = TOTAL_WAKTU_MENIT * 60;
    evaluasiState.jawabanPG = {};
    evaluasiState.jawabanEssay = {};

    document.getElementById('peserta-info').textContent = `${nama} • ${kelas}`;

    renderSoalPG();
    renderSoalEssay();
    updateProgress();

    showScreen('evaluasi-soal');
    startTimer();
}

// ====================================================================
// ==================== HITUNG SKOR ==================================
// ====================================================================

function hitungSkorPG() {
    let benar = 0;
    soalPG.forEach(soal => {
        if (evaluasiState.jawabanPG[soal.nomor] === soal.jawaban) benar++;
    });
    return { benar, skor: benar * 6 }; // 10 soal × 6 = 60
}

function hitungSkorEssay() {
    let totalSkor = 0;
    const detail = [];

    soalEssay.forEach(soal => {
        const jawaban = (evaluasiState.jawabanEssay[soal.nomor] || '').toLowerCase();
        const kataList = jawaban.split(/\s+/).filter(w => w.length > 0);
        const jumlahKata = kataList.length;

        let poin = 0;
        let poinKata = 0;
        let poinKeyword = 0;

        // Poin panjang jawaban (max 4 poin jika >= minKata)
        if (jumlahKata >= soal.minKata) poinKata = 4;
        else if (jumlahKata >= soal.minKata * 0.7) poinKata = 3;
        else if (jumlahKata >= soal.minKata * 0.5) poinKata = 2;
        else if (jumlahKata >= 5) poinKata = 1;
        else poinKata = 0;

        // Poin keyword (max 4 poin)
        const foundKeywords = soal.keywords.filter(kw => jawaban.includes(kw.toLowerCase()));
        const keywordRatio = foundKeywords.length / soal.keywords.length;
        if (keywordRatio >= 0.5) poinKeyword = 4;
        else if (keywordRatio >= 0.35) poinKeyword = 3;
        else if (keywordRatio >= 0.2) poinKeyword = 2;
        else if (keywordRatio > 0) poinKeyword = 1;

        poin = poinKata + poinKeyword;
        totalSkor += poin;

        detail.push({
            nomor: soal.nomor,
            jumlahKata,
            minKata: soal.minKata,
            keywordDitemukan: foundKeywords,
            poinKata,
            poinKeyword,
            poin
        });
    });

    return { total: totalSkor, detail };
}

function tentukanPredikat(skor) {
    if (skor >= 90) return { huruf: 'A', label: 'Sangat Baik', icon: '🏆', warna: 'A' };
    if (skor >= 80) return { huruf: 'B', label: 'Baik', icon: '🎉', warna: 'B' };
    if (skor >= 70) return { huruf: 'C', label: 'Cukup', icon: '👍', warna: 'C' };
    if (skor >= 60) return { huruf: 'D', label: 'Kurang', icon: '💪', warna: 'D' };
    return { huruf: 'E', label: 'Perlu Belajar Lagi', icon: '📚', warna: 'E' };
}

// ====================================================================
// ==================== SUBMIT EVALUASI ==============================
// ====================================================================

async function submitEvaluasi(e) {
    e.preventDefault();

    if (evaluasiState.sudahSelesai) return;

    // Konfirmasi
    let terjawabPG = Object.values(evaluasiState.jawabanPG).filter(v => v).length;
    let terjawabEssay = Object.values(evaluasiState.jawabanEssay).filter(v => v && v.length > 0).length;

    if (terjawabPG < 10 || terjawabEssay < 5) {
        const lanjut = confirm(
            `⚠️ Masih ada soal yang belum dijawab!\n\n` +
            `• Pilihan Ganda: ${terjawabPG}/10\n` +
            `• Esai: ${terjawabEssay}/5\n\n` +
            `Yakin ingin mengumpulkan sekarang?`
        );
        if (!lanjut) return;
    } else {
        const konfirmasi = confirm(
            '✅ Semua soal sudah terjawab.\n\n' +
            'Setelah dikumpulkan, jawaban TIDAK dapat diubah dan evaluasi TIDAK dapat diulang.\n\n' +
            'Kumpulkan sekarang?'
        );
        if (!konfirmasi) return;
    }

    evaluasiState.sudahSelesai = true;
    clearInterval(evaluasiState.timerInterval);

    // Hitung skor
    const hasilPG = hitungSkorPG();
    const hasilEssay = hitungSkorEssay();
    const skorTotal = hasilPG.skor + hasilEssay.total;
    const predikat = tentukanPredikat(skorTotal);

    // Tampilkan hasil
    tampilkanHasil({
        nama: evaluasiState.nama,
        kelas: evaluasiState.kelas,
        skorPG: hasilPG.skor,
        benarPG: hasilPG.benar,
        skorEssay: hasilEssay.total,
        skorTotal,
        predikat,
        waktu: new Date().toISOString(),
        jawabanPG: { ...evaluasiState.jawabanPG },
        jawabanEssay: { ...evaluasiState.jawabanEssay }
    });

    // Simpan ke localStorage
    const key = 'evaluasi_selesai_' + evaluasiState.nama.toLowerCase().replace(/\s+/g, '_');
    localStorage.setItem(key, JSON.stringify({
        nama: evaluasiState.nama,
        skor: skorTotal,
        waktu: new Date().toISOString()
    }));

    // Kirim ke Supabase
    kirimKeSupabase({
        skorPG: hasilPG.skor,
        skorEssay: hasilEssay.total,
        skorTotal,
        predikat: predikat.huruf,
        jawabanPG: evaluasiState.jawabanPG,
        jawabanEssay: evaluasiState.jawabanEssay,
        detailEssay: hasilEssay.detail,
        durasiDetik: TOTAL_WAKTU_MENIT * 60 - evaluasiState.sisaWaktu
    });
}

function tampilkanHasil(data) {
    showScreen('evaluasi-hasil');

    // Update tampilan
    document.getElementById('hasil-icon').textContent = data.predikat.icon;
    document.getElementById('hasil-title').textContent = `Evaluasi Selesai, ${data.nama}!`;
    document.getElementById('skor-total').textContent = data.skorTotal;
    document.getElementById('skor-pg').textContent = data.skorPG;
    document.getElementById('skor-essay').textContent = data.skorEssay;

    const predikatEl = document.getElementById('predikat');
    predikatEl.textContent = `${data.predikat.huruf} — ${data.predikat.label}`;
    predikatEl.className = 'predikat ' + data.predikat.warna;

    // Animate circle
    const circle = document.querySelector('.skor-lingkaran');
    const derajat = (data.skorTotal / 100) * 360;
    setTimeout(() => {
        circle.style.background = `conic-gradient(var(--accent) ${derajat}deg, #f0f0f0 ${derajat}deg)`;
    }, 300);

    // Pesan
    let pesan = '';
    if (data.skorTotal >= 90) {
        pesan = '🌟 <strong>Luar biasa!</strong> Kamu memahami konsep dasar fotografi dengan sangat baik. Pertahankan dan teruslah berlatih memotret!';
    } else if (data.skorTotal >= 80) {
        pesan = '👏 <strong>Bagus sekali!</strong> Pemahamanmu sudah kuat. Sedikit lagi latihan untuk mencapai sempurna!';
    } else if (data.skorTotal >= 70) {
        pesan = '👍 <strong>Cukup baik.</strong> Kamu sudah memahami dasar-dasarnya. Pelajari kembali bagian yang masih lemah, terutama konsep segitiga exposure dan komposisi.';
    } else if (data.skorTotal >= 60) {
        pesan = '💪 <strong>Masih perlu belajar.</strong> Baca kembali materi Teori Dasar, terutama bagian Segitiga Exposure dan Jenis-jenis Foto. Coba praktik langsung dengan kamera.';
    } else {
        pesan = '📚 <strong>Jangan menyerah!</strong> Pelajari kembali materi dari awal. Fokus pada konsep segitiga exposure (aperture, shutter speed, ISO) dan komposisi.';
    }
    document.getElementById('hasil-pesan').innerHTML = pesan;

    // Simpan data untuk review
    window._evaluasiHasil = data;
}

async function kirimKeSupabase(data) {
    const statusEl = document.getElementById('status-terkirim');
    const statusText = document.getElementById('status-text');

    try {
        statusText.textContent = 'Mengirim hasil ke server...';
        statusEl.classList.remove('error');

        const { error } = await supabase
            .from('quiz_results')
            .insert([{
                student_name: evaluasiState.nama,
                student_class: evaluasiState.kelas,
                quiz_type: 'evaluasi',
                score: data.skorTotal,
                answers: {
                    skorPG: data.skorPG,
                    skorEssay: data.skorEssay,
                    predikat: data.predikat,
                    jawabanPG: data.jawabanPG,
                    jawabanEssay: data.jawabanEssay,
                    detailEssay: data.detailEssay,
                    durasiDetik: data.durasiDetik,
                    waktuKirim: new Date().toISOString()
                }
            }]);

        if (error) throw error;

        statusText.textContent = '✅ Hasil berhasil dikirim ke guru';
        statusEl.classList.remove('error');
    } catch (err) {
        console.error('Error kirim:', err);
        statusText.textContent = '⚠️ Gagal mengirim ke server (hasil tetap tersimpan di perangkat)';
        statusEl.classList.add('error');
    }
}

// ====================================================================
// ==================== REVIEW JAWABAN ===============================
// ====================================================================

function tampilkanReview() {
    const data = window._evaluasiHasil;
    if (!data) return;

    const container = document.getElementById('review-container');
    container.innerHTML = '';

    // ============ REVIEW PG ============
    const pgSection = document.createElement('div');
    pgSection.innerHTML = `<h3 style="color: var(--primary); margin-bottom: 1rem;">📝 Bagian A — Pilihan Ganda</h3>`;

    soalPG.forEach(soal => {
        const jawabanUser = data.jawabanPG[soal.nomor] || '(tidak dijawab)';
        const benar = jawabanUser === soal.jawaban;

        const item = document.createElement('div');
        item.className = 'review-item ' + (benar ? 'benar' : 'salah');
        item.innerHTML = `
            <div class="soal-header">
                <span class="soal-nomor">${soal.nomor}</span>
                <span class="soal-label">${benar ? '✅ Benar' : '❌ Salah'}</span>
            </div>
            <div class="soal-pertanyaan">${soal.pertanyaan}</div>
            <div class="review-jawaban">
                <div class="jawaban-box user">
                    <strong>Jawabanmu (${jawabanUser})</strong>
                    ${soal.opsi[jawabanUser] || '(kosong)'}
                </div>
                <div class="jawaban-box benar">
                    <strong>Jawaban Benar (${soal.jawaban})</strong>
                    ${soal.opsi[soal.jawaban]}
                </div>
            </div>
            <div class="pembahasan">
                <strong>💡 Pembahasan:</strong> ${soal.pembahasan}
            </div>
        `;
        pgSection.appendChild(item);
    });
    container.appendChild(pgSection);

    // ============ REVIEW ESAI ============
    const essaySection = document.createElement('div');
    essaySection.style.marginTop = '2rem';
    essaySection.innerHTML = `<h3 style="color: var(--primary); margin-bottom: 1rem;">✍️ Bagian B — Esai</h3>`;

    soalEssay.forEach(soal => {
        const jawabanUser = data.jawabanEssay[soal.nomor] || '(tidak dijawab)';
        const kata = jawabanUser.trim().split(/\s+/).filter(w => w.length > 0).length;

        const item = document.createElement('div');
        item.className = 'review-item';
        item.innerHTML = `
            <div class="soal-header">
                <span class="soal-nomor" style="background: #3498db;">${soal.nomor}</span>
                <span class="soal-label" style="color: #3498db;">Esai</span>
            </div>
            <div class="soal-pertanyaan">${soal.pertanyaan}</div>
            <div class="jawaban-box user" style="margin-top: 1rem;">
                <strong>Jawabanmu (${kata} kata, min. ${soal.minKata} kata):</strong>
                ${jawabanUser === '(tidak dijawab)' ? '<em>— tidak dijawab —</em>' : jawabanUser.replace(/\n/g, '<br>')}
            </div>
            <div class="pembahasan">
                <strong>🔑 Kata kunci yang diharapkan:</strong> ${soal.keywords.join(', ')}
            </div>
        `;
        essaySection.appendChild(item);
    });
    container.appendChild(essaySection);

    showScreen('evaluasi-review');
}

// ====================================================================
// ==================== TAMPILKAN HASIL DARI CACHE ===================
// ====================================================================

function tampilkanHasilDariCache(cache) {
    // Tampilkan info sederhana bahwa sudah pernah mengerjakan
    showScreen('evaluasi-hasil');
    document.getElementById('hasil-icon').textContent = '🔒';
    document.getElementById('hasil-title').textContent = 'Evaluasi Sudah Dikerjakan';
    document.getElementById('hasil-subtitle').textContent = 'Kamu tidak dapat mengerjakan ulang evaluasi ini.';
    document.getElementById('skor-total').textContent = cache.skor;
    document.getElementById('skor-pg').textContent = '—';
    document.getElementById('skor-essay').textContent = '—';
    document.getElementById('predikat').textContent = cache.nama;
    document.getElementById('predikat').className = 'predikat';
    document.getElementById('hasil-pesan').innerHTML = `Evaluasi sudah dikerjakan pada <strong>${new Date(cache.waktu).toLocaleString('id-ID')}</strong>. Hubungi gurumu jika ada pertanyaan.`;
    document.getElementById('status-terkirim').style.display = 'none';
    document.getElementById('btn-review-jawaban').style.display = 'none';
}

// ====================================================================
// ==================== CEK STATUS SAAT LOAD ==========================
// ====================================================================

function cekStatusEvaluasi() {
    // Cek apakah ada evaluasi yang sudah selesai di localStorage (untuk ditampilkan peringatan saat buka tab)
    const keys = Object.keys(localStorage).filter(k => k.startsWith('evaluasi_selesai_'));
    if (keys.length > 0) {
        // Ada minimal satu
        console.log('ℹ️ Ada evaluasi yang sudah selesai tersimpan di perangkat.');
    }
}

// ====================================================================
// ==================== INIT =========================================
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Tombol mulai
    document.getElementById('btn-mulai-evaluasi')?.addEventListener('click', mulaiEvaluasi);

    // Form submit
    document.getElementById('form-evaluasi')?.addEventListener('submit', submitEvaluasi);

    // Tombol review
    document.getElementById('btn-review-jawaban')?.addEventListener('click', tampilkanReview);
    document.getElementById('btn-kembali-hasil')?.addEventListener('click', () => showScreen('evaluasi-hasil'));

    // Set tanggal default
    const namaInput = document.getElementById('eval-nama');
    const kelasInput = document.getElementById('eval-kelas');

    // Auto-restore nama & kelas dari LKPD (jika sudah pernah diisi)
    try {
        const savedLKPD = localStorage.getItem('lkpd_dasar_fotografi');
        if (savedLKPD) {
            const d = JSON.parse(savedLKPD);
            if (d.nama && namaInput) namaInput.value = d.nama;
            if (d.kelas && kelasInput) kelasInput.value = d.kelas;
        }
    } catch (e) {}

    cekStatusEvaluasi();
});