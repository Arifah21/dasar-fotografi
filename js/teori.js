// js/teori.js

// ==================== NAVIGASI DROPDOWN TEORI (HASH ROUTING) ====================

// Daftar semua sub-materi teori yang valid
const TEORI_MATERI = ['sejarah', 'jenis', 'typeofshot', 'cameraangle','kamera','format', 'segitiga', 'komposisi'];
const TAB_VALID = ['beranda', 'teori', 'lkpd', 'quiz', 'evaluasi'];

/**
 * Menampilkan materi teori tertentu
 */
function showTeoriMateri(target, scroll = true) {
    if (!TEORI_MATERI.includes(target)) return;

    // 1. Sembunyikan SEMUA materi
    document.querySelectorAll('.teori-materi').forEach(m => {
        m.classList.remove('active');
        m.style.display = 'none';
    });

    // 2. Sembunyikan semua modal & lightbox yang mungkin tertinggal terbuka
    
    document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
    document.getElementById('shot-lightbox')?.classList.remove('active');
    document.getElementById('angle-lightbox')?.classList.remove('active');  // ⬅️ TAMBAHKAN
    document.body.style.overflow = '';

    // 3. Tampilkan materi yang dipilih
    const materiElement = document.getElementById(`teori-${target}`);
    if (materiElement) {
        materiElement.classList.add('active');
        materiElement.style.display = 'block';   // ⬅️ paksa tampilkan
        if (scroll) {
            materiElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // 4. Update status aktif di dropdown
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.toggle('active', item.dataset.teori === target);
    });

    // 5. Tutup dropdown (mobile)
    document.querySelector('.nav-dropdown')?.classList.remove('open');
}

/**
 * Menampilkan tab utama
 */
function showTab(tabName, scroll = true) {
    if (!TAB_VALID.includes(tabName)) return;

    // Update tombol aktif
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${tabName}"]`)?.classList.add('active');

    // Tampilkan konten
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(tabName)?.classList.add('active');

    // Tutup dropdown
    document.querySelector('.nav-dropdown')?.classList.remove('open');

    if (scroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

/**
 * Router utama — memproses hash URL
 */
function handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'beranda';

    // Cek apakah hash adalah sub-materi teori (misal: teori-sejarah)
    if (hash.startsWith('teori-')) {
        const subMateri = hash.replace('teori-', '');
        showTab('teori', false);
        showTeoriMateri(subMateri, true);
        return;
    }

    // Cek apakah hash adalah tab utama
    if (TAB_VALID.includes(hash)) {
        showTab(hash, false);

        // Jika tab teori tanpa sub-materi → tampilkan materi pertama
        if (hash === 'teori') {
            const currentActive = document.querySelector('.teori-materi.active');
            if (!currentActive) {
                showTeoriMateri('sejarah', false);
            }
        }
        return;
    }

    // Fallback ke beranda
    showTab('beranda', false);
}

// ==================== EVENT LISTENERS ====================

// Event untuk tombol tab utama (Beranda, LKPD, Quiz, Evaluasi)
document.querySelectorAll('.tab-btn:not(.dropdown-toggle)').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.dataset.tab;
        // Update hash → akan trigger hashchange → handleRoute
        window.location.hash = target;
    });
});

// Event untuk dropdown-toggle (Teori Dasar)
document.querySelector('.dropdown-toggle')?.addEventListener('click', (e) => {
    // Di mobile: toggle dropdown
    if (window.innerWidth <= 768) {
        e.preventDefault();
        e.stopPropagation();
        document.querySelector('.nav-dropdown')?.classList.toggle('open');
        return;
    }
    // Di desktop: navigasi ke tab teori
    e.preventDefault();
    window.location.hash = 'teori';
});

// Event untuk setiap item dropdown teori
document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
        // Biarkan default href bekerja (mengubah hash)
        // Tapi kita handle jika href kosong / sama
        const target = item.dataset.teori;
        if (!target) return;

        e.preventDefault();
        // Update hash → trigger hashchange
        window.location.hash = `teori-${target}`;
    });
});

// Dengarkan perubahan hash (back/forward browser, klik link, dsb)
window.addEventListener('hashchange', handleRoute);

// Tutup dropdown jika klik di luar
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
        document.querySelector('.nav-dropdown')?.classList.remove('open');
    }
});

// ==================== TIMELINE EXPAND/COLLAPSE ====================
function toggleTimeline(element) {
    const wasExpanded = element.classList.contains('expanded');
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.classList.remove('expanded');
    });
    if (!wasExpanded) {
        element.classList.add('expanded');
    }
}
// ==================== TYPE OF SHOT ====================

const shotData = {
    els: {
        abbr: 'ELS',
        title: 'Extreme Long Shot',
        desc: 'Menampilkan subjek dari sangat jauh dalam lanskap yang luas. Subjek tampak sangat kecil, bahkan mungkin hanya berupa titik. Fokus utama ada pada LINGKUNGAN, bukan subjek.',
        fungsi: 'Menetapkan lokasi (establishing shot) & suasana',
        usage: 'Pembuka cerita, foto dokumenter, lanskap epik',
        tips: 'Gunakan lensa wide (16-35mm), aperture f/8-f/16, sering dengan tripod',
        scale: 1.05
    },
    ls: {
        abbr: 'LS',
        title: 'Long Shot',
        desc: 'Seluruh tubuh subjek terlihat dengan latar belakang yang masih jelas. Menunjukkan subjek dalam konteks lingkungannya, tetapi subjek sudah dapat dikenali.',
        fungsi: 'Menunjukkan subjek + konteks lingkungannya',
        usage: 'Foto jurnalistik, fashion, dokumenter',
        tips: 'Lensa 24-50mm, perhatikan komposisi & garis horizon',
        scale: 1.35
    },
    mls: {
        abbr: 'MLS',
        title: 'Medium Long Shot',
        desc: 'Dari ujung kepala hingga lutut. Keseimbangan antara subjek dan lingkungan. Sering disebut juga "knee shot" atau "American shot".',
        fungsi: 'Menyeimbangkan fokus subjek dengan latar belakang',
        usage: 'Foto aksi, olahraga, jurnalistik',
        tips: 'Lensa 35-85mm, pastikan mata subjek di sepertiga atas frame',
        scale: 1.7
    },
    ms: {
        abbr: 'MS',
        title: 'Medium Shot',
        desc: 'Dari kepala hingga pinggang. Fokus pada subjek sekaligus masih menunjukkan sedikit latar belakang. Tipe shot paling umum untuk foto manusia.',
        fungsi: 'Menonjolkan subjek, gestur, dan interaksi',
        usage: 'Foto portrait, wawancara, foto bisnis',
        tips: 'Lensa 50-85mm, aperture f/2.8-f/5.6 untuk background sedikit blur',
        scale: 2.2
    },
    mcu: {
        abbr: 'MCU',
        title: 'Medium Close Up',
        desc: 'Dari kepala hingga dada. Menonjolkan ekspresi wajah dan emosi subjek, sekaligus masih menunjukkan sedikit konteks pakaian atau postur.',
        fungsi: 'Menekankan ekspresi & emosi subjek',
        usage: 'Foto editorial, headshot profesional, berita',
        tips: 'Lensa 85mm, aperture besar (f/1.8-f/2.8), pencahayaan soft',
        scale: 2.8
    },
    cu: {
        abbr: 'CU',
        title: 'Close Up',
        desc: 'Fokus pada wajah atau bagian tubuh tertentu (tangan, kaki). Sangat intim dan emosional. Detail seperti ekspresi mata atau tekstur kulit menjadi sangat penting.',
        fungsi: 'Menekankan emosi dan detail subjek',
        usage: 'Foto beauty, portrait artistik, fotografi anak',
        tips: 'Lensa 85-135mm, aperture f/1.8-f/2.8, fokus pada mata',
        scale: 3.6
    },
    ecu: {
        abbr: 'ECU',
        title: 'Extreme Close Up',
        desc: 'Detail sangat dekat dari bagian subjek — biasanya mata, bibir, hidung, atau bahkan hanya bulu mata. Sangat intim, intens, dan sering membuat pemirsa merasa tidak nyaman atau terpesona.',
        fungsi: 'Menciptakan detail maksimal & intensitas emosi',
        usage: 'Fotografi makro, beauty shot, iklan produk',
        tips: 'Lensa macro, ring flash, tripod, focus stacking',
        scale: 5.0
    }
};

/**
 * Update preview simulator Type of Shot
 */
function updateShotPreview(shotKey) {
    const data = shotData[shotKey];
    if (!data) return;

    // Update tombol aktif
    document.querySelectorAll('.shot-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.shot === shotKey);
    });

    // Update frame zoom (transform scale)
    const scene = document.getElementById('shot-scene');
    if (scene) {
        scene.style.transform = `scale(${data.scale})`;
    }

    // Update label di frame
    const overlay = document.getElementById('shot-label-overlay');
    if (overlay) overlay.textContent = data.abbr;

    // Update panel info
    document.getElementById('shot-info-abbr').textContent = data.abbr;
    document.getElementById('shot-info-title').textContent = data.title;
    document.getElementById('shot-info-desc').textContent = data.desc;
    document.getElementById('shot-info-fungsi').textContent = data.fungsi;
    document.getElementById('shot-info-usage').textContent = data.usage;
    document.getElementById('shot-info-tips').textContent = data.tips;
}

/**
 * Tampilkan modal detail Type of Shot
 */
function showShotDetail(shotKey) {
    const data = shotData[shotKey];
    if (!data) return;

    const modal = document.getElementById('shot-modal');
    const body = document.getElementById('shot-modal-body');

    body.innerHTML = `
        <div style="text-align:center; margin-bottom:1.5rem;">
            <div style="display:inline-flex; align-items:center; justify-content:center; width:80px; height:80px; background:linear-gradient(135deg, #E67E22, #d35400); color:white; border-radius:16px; font-weight:800; font-size:1.4rem; letter-spacing:1px; margin-bottom:0.75rem;">${data.abbr}</div>
            <h3 style="margin:0; color:#2C3E50;">${data.title}</h3>
        </div>
        
        <p style="line-height:1.7; color:#495057; font-size:0.95rem;">${data.desc}</p>
        
        <div style="display:flex; flex-direction:column; gap:0.75rem; margin-top:1.25rem;">
            <div style="padding:0.85rem 1rem; background:#f8f9fa; border-radius:8px; border-left:3px solid #E67E22;">
                <div style="font-size:0.75rem; color:#6c757d; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.25rem;">🎯 Fungsi Utama</div>
                <div style="font-size:0.9rem; color:#2C3E50;">${data.fungsi}</div>
            </div>
            <div style="padding:0.85rem 1rem; background:#f8f9fa; border-radius:8px; border-left:3px solid #E67E22;">
                <div style="font-size:0.75rem; color:#6c757d; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.25rem;">📸 Penggunaan</div>
                <div style="font-size:0.9rem; color:#2C3E50;">${data.usage}</div>
            </div>
            <div style="padding:0.85rem 1rem; background:#f8f9fa; border-radius:8px; border-left:3px solid #E67E22;">
                <div style="font-size:0.75rem; color:#6c757d; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.25rem;">💡 Tips Teknis</div>
                <div style="font-size:0.9rem; color:#2C3E50;">${data.tips}</div>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

function closeShotDetail() {
    document.getElementById('shot-modal')?.classList.remove('active');
}

// Setup event listener untuk tombol simulator & modal (jalankan setelah DOM siap)
function setupShotSimulator() {
    document.querySelectorAll('.shot-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            updateShotPreview(btn.dataset.shot);
        });
    });

    // Init default ke ELS
    updateShotPreview('els');

    // Modal close via backdrop
    document.getElementById('shot-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'shot-modal') closeShotDetail();
    });
}

// Expose ke window agar bisa dipanggil dari onclick di HTML
window.showShotDetail = showShotDetail;
window.closeShotDetail = closeShotDetail;

    // Init simulator type of shot
    document.addEventListener('DOMContentLoaded', () => {
        // Setup semua simulator
        setupShotSimulator();
        setupShotGallery();
        setupAngleSimulator();
        setupAngleGallery();
        setupFormatNav();
        setupKameraGaleri();
        setupKameraMateri();

        // Jika tidak ada hash, set default ke beranda
        if (!window.location.hash) {
            history.replaceState(null, '', '#beranda');
        }
        handleRoute();
    });
    // ==================== GALERI TYPE OF SHOT ====================

const galleryItems = []; // akan diisi saat init

/**
 * Inisialisasi galeri: kumpulkan data & pasang event listener
 */
function setupShotGallery() {
const items = document.querySelectorAll('#shot-gallery-grid .gallery-item');
galleryItems.length = 0;

items.forEach((item, idx) => {
    const img = item.querySelector('img');
    const shotKey = item.dataset.shot;
    const data = shotData[shotKey] || {};

    galleryItems.push({
        index: idx,
        src: img?.src || '',
        badge: data.abbr || shotKey.toUpperCase(),
        title: data.title || '',
        desc: data.desc || ''
    });

    // Klik untuk buka lightbox
    item.addEventListener('click', () => openLightbox(idx));
});

// Setup filter
setupGalleryFilter();
}

/**
 * Filter kategori galeri
 */
function setupGalleryFilter() {
document.querySelectorAll('.gallery-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        document.querySelectorAll('.gallery-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('#shot-gallery-grid .gallery-item').forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hidden');
                item.style.animation = 'fadeIn 0.4s ease';
            } else {
                item.classList.add('hidden');
            }
        });
    });
});
}
// ==================== CAMERA ANGLE ====================

const angleData = {
bird: {
    icon: '🐦',
    title: "Bird's Eye View",
    subtitle: 'Sudut Pandang Mata Burung',
    desc: 'Kamera berada jauh di atas subjek, menunduk ke bawah seperti dilihat burung yang terbang tinggi. Subjek tampak sangat kecil, sering hanya sebesar titik.',
    impression: 'Subjek tampak kecil, lemah, tak berdaya',
    usage: 'Pemandangan luas, pola dari atas, kerumunan, drone shot',
    tips: 'Gunakan drone atau naik ke gedung tinggi / tangga',
    label: "BIRD'S EYE",
    // Transformasi visual
    sceneTransform: 'scale(1.5) translateY(20%)',
    subjectTransform: 'translateX(-50%) scale(0.35)',
    cameraPos: { top: '-15%', left: '50%', transform: 'translateX(-50%)' }
},
high: {
    icon: '⬆️',
    title: 'High Angle',
    subtitle: 'Sudut Tinggi',
    desc: 'Kamera diposisikan lebih tinggi dari subjek, menunduk ke bawah. Memberi kesan bahwa subjek berada dalam posisi lebih rendah / inferior.',
    impression: 'Subjek tampak lemah, kecil, atau pasrah',
    usage: 'Foto anak-anak, pemandangan dari atas bukit, situasi rentan',
    tips: 'Berdiri di tempat tinggi atau gunakan tangga',
    label: 'HIGH ANGLE',
    sceneTransform: 'scale(1.15) translateY(10%)',
    subjectTransform: 'translateX(-50%) scale(0.7)',
    cameraPos: { top: '5%', left: '50%', transform: 'translateX(-50%)' }
},
eye: {
    icon: '👁️',
    title: 'Eye Level',
    subtitle: 'Sejajar Mata',
    desc: 'Kamera berada pada ketinggian yang sama dengan mata subjek. Memberi kesan setara, netral, dan jujur — seperti bercakap-cakap berhadapan langsung.',
    impression: 'Setara, netral, jujur, akrab',
    usage: 'Portrait formal, wawancara, reportase, foto dokumenter',
    tips: 'Jongkok jika subjek anak kecil; atur tinggi kamera = tinggi mata',
    label: 'EYE LEVEL',
    sceneTransform: 'scale(1) translateY(0)',
    subjectTransform: 'translateX(-50%) scale(1)',
    cameraPos: { top: '55%', left: '50%', transform: 'translateX(-50%)' }
},
low: {
    icon: '⬇️',
    title: 'Low Angle',
    subtitle: 'Sudut Rendah',
    desc: 'Kamera diposisikan lebih rendah dari subjek, mendongak ke atas. Memberi kesan subjek kuat, berwibawa, dan heroik.',
    impression: 'Kuat, berwibawa, dominan, heroik',
    usage: 'Foto pahlawan, atlet, gedung tinggi, otoritas',
    tips: 'Jongkok atau tiarap; sering dipakai di foto olahraga',
    label: 'LOW ANGLE',
    sceneTransform: 'scale(1.1) translateY(-10%)',
    subjectTransform: 'translateX(-50%) scale(1.4)',
    cameraPos: { top: '75%', left: '50%', transform: 'translateX(-50%)' }
},
worm: {
    icon: '🐛',
    title: "Worm's Eye View",
    subtitle: 'Sudut Mata Cacing',
    desc: 'Kamera berada sangat rendah, hampir menyentuh tanah, mendongak ekstrem ke atas. Subjek tampak sangat besar, megah, dan mendominasi seluruh frame.',
    impression: 'Sangat dominan, megah, mengintimidasi',
    usage: 'Arsitektur, monumen, kekuatan alam, foto epik',
    tips: 'Letakkan kamera di tanah / sangat rendah; kadang tanpa melihat viewfinder',
    label: "WORM'S EYE",
    sceneTransform: 'scale(1.2) translateY(-25%)',
    subjectTransform: 'translateX(-50%) scale(2)',
    cameraPos: { top: '92%', left: '50%', transform: 'translateX(-50%)' }
},
dutch: {
    icon: '📐',
    title: 'Dutch Angle',
    subtitle: 'Sudut Miring',
    desc: 'Kamera dimiringkan ke kiri atau kanan sehingga garis horizon tidak horizontal. Teknik ini menciptakan rasa tidak nyaman, ketegangan, atau kekacauan.',
    impression: 'Tegang, kacau, tidak stabil, mencekam',
    usage: 'Adegan aksi, thriller, situasi kacau, eksperimen visual',
    tips: 'Miringkan kamera 15-45 derajat; jangan berlebihan',
    label: 'DUTCH ANGLE',
    sceneTransform: 'rotate(-15deg) scale(1.2)',
    subjectTransform: 'translateX(-50%) scale(1) rotate(15deg)',
    cameraPos: { top: '55%', left: '50%', transform: 'translateX(-50%) rotate(-15deg)' }
},
pov: {
    icon: '👤',
    title: 'Point of View (POV)',
    subtitle: 'Sudut Pandang Subjek',
    desc: 'Kamera ditempatkan seolah-olah menjadi mata subjek, menampilkan apa yang dilihat subjek. Pemirsa diajak masuk ke dalam pengalaman subjek.',
    impression: 'Immersive, personal, intim, menyatu',
    usage: 'Fotografi storytelling, iklan, dokumenter, live event',
    tips: 'Bayangkan Anda adalah subjek; posisikan kamera sejajar mata subjek',
    label: 'POV',
    sceneTransform: 'scale(1.3) translateY(15%)',
    subjectTransform: 'translateX(-50%) scale(1.8)',
    cameraPos: { top: '5%', left: '50%', transform: 'translateX(-50%)' }
},
ots: {
    icon: '🎥',
    title: 'Over-the-Shoulder (OTS)',
    subtitle: 'Sudut Bahu',
    desc: 'Kamera ditempatkan di belakang bahu salah satu subjek, mengambil gambar apa yang sedang ia lihat atau hadapi. Teknik ini menciptakan kesan dialog dan menempatkan pemirsa seolah-olah ikut dalam percakapan.',
    impression: 'Dialogis, terlibat, personal, seolah ikut dalam percakapan',
    usage: 'Dialog film, wawancara, fotografi interaksi sosial, storytelling',
    tips: 'Fokus ke subjek utama; biarkan bahu di depan sedikit blur (out of focus) untuk depth',
    label: 'OTS',
    sceneTransform: 'scale(1.3) translateY(5%)',
    subjectTransform: 'translateX(-50%) scale(1.6)',
    cameraPos: { top: '40%', left: '15%', transform: 'translateX(0) rotate(-15deg)' },
    showShoulder: true
}
};

/**
 * Update preview simulator Camera Angle
 */
function updateAnglePreview(angleKey) {
const data = angleData[angleKey];
if (!data) return;

// Update tombol aktif
document.querySelectorAll('.angle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.angle === angleKey);
});

// Update scene
const scene = document.getElementById('angle-scene');
const subject = document.getElementById('angle-subject');
const cameraIcon = document.getElementById('angle-camera-icon');
const labelOverlay = document.getElementById('angle-label-overlay');

if (scene) scene.style.transform = data.sceneTransform;
if (subject) subject.style.transform = data.subjectTransform;
if (labelOverlay) labelOverlay.textContent = data.label;
if (cameraIcon) {
    cameraIcon.style.top = data.cameraPos.top;
    cameraIcon.style.left = data.cameraPos.left;
    cameraIcon.style.transform = data.cameraPos.transform;
}
const shoulder = document.getElementById('angle-shoulder');
    if (shoulder) {
        if (data.showShoulder) {
            shoulder.classList.add('active');
        } else {
            shoulder.classList.remove('active');
        }
    }
// Update info panel
document.getElementById('angle-info-icon').textContent = data.icon;
document.getElementById('angle-info-title').textContent = data.title;
document.getElementById('angle-info-subtitle').textContent = data.subtitle;
document.getElementById('angle-info-desc').textContent = data.desc;
document.getElementById('angle-info-impression').textContent = data.impression;
document.getElementById('angle-info-usage').textContent = data.usage;
document.getElementById('angle-info-tips').textContent = data.tips;
}

/**
 * Tampilkan modal detail Camera Angle
 */
function showAngleDetail(angleKey) {
const data = angleData[angleKey];
if (!data) return;

const modal = document.getElementById('angle-modal');
const body = document.getElementById('angle-modal-body');

body.innerHTML = `
<div style="text-align:center; margin-bottom:1.5rem;">
    <div style="display:inline-flex; align-items:center; justify-content:center; width:80px; height:80px; background:linear-gradient(135deg, #9b59b6, #6a1b9a); color:white; border-radius:16px; font-size:2rem; margin-bottom:0.75rem;">${data.icon}</div>
    <h3 style="margin:0 0 0.35rem 0; color:#2C3E50;">${data.title}</h3>
    <p style="margin:0; color:#6c757d; font-style:italic; font-size:0.9rem;">${data.subtitle}</p>
</div>

<p style="line-height:1.7; color:#495057; font-size:0.95rem;">${data.desc}</p>

<div style="display:flex; flex-direction:column; gap:0.75rem; margin-top:1.25rem;">
    <div style="padding:0.85rem 1rem; background:#f8f9fa; border-radius:8px; border-left:3px solid #9b59b6;">
        <div style="font-size:0.75rem; color:#6c757d; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.25rem;">💭 Kesan Visual</div>
        <div style="font-size:0.9rem; color:#2C3E50;">${data.impression}</div>
    </div>
    <div style="padding:0.85rem 1rem; background:#f8f9fa; border-radius:8px; border-left:3px solid #9b59b6;">
        <div style="font-size:0.75rem; color:#6c757d; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.25rem;">🎯 Penggunaan</div>
        <div style="font-size:0.9rem; color:#2C3E50;">${data.usage}</div>
    </div>
    <div style="padding:0.85rem 1rem; background:#f8f9fa; border-radius:8px; border-left:3px solid #9b59b6;">
        <div style="font-size:0.75rem; color:#6c757d; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.25rem;">💡 Tips Teknis</div>
        <div style="font-size:0.9rem; color:#2C3E50;">${data.tips}</div>
    </div>
</div>
`;

modal.classList.add('active');
}

function closeAngleDetail() {
document.getElementById('angle-modal')?.classList.remove('active');
}

/**
 * Setup simulator Camera Angle
 */
function setupAngleSimulator() {
document.querySelectorAll('.angle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        updateAnglePreview(btn.dataset.angle);
    });
});

// Init default ke Bird's Eye
updateAnglePreview('bird');

// Modal close via backdrop
document.getElementById('angle-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'angle-modal') closeAngleDetail();
});
}

// ==================== GALERI CAMERA ANGLE ====================

const angleGalleryItems = [];
let currentAngleLightboxIndex = 0;
let angleLightboxVisibleItems = [];

function setupAngleGallery() {
const items = document.querySelectorAll('#angle-gallery-grid .angle-gallery-item');
angleGalleryItems.length = 0;

items.forEach((item, idx) => {
    const img = item.querySelector('img');
    const angleKey = item.dataset.angle;
    const data = angleData[angleKey] || {};

    angleGalleryItems.push({
        index: idx,
        src: img?.src || '',
        badge: data.icon + ' ' + data.title,
        title: data.title,
        desc: data.desc
    });

    item.addEventListener('click', () => openAngleLightbox(idx));
});

// Setup filter
document.querySelectorAll('.angle-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        document.querySelectorAll('.angle-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('#angle-gallery-grid .angle-gallery-item').forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hidden');
                item.style.animation = 'fadeIn 0.4s ease';
            } else {
                item.classList.add('hidden');
            }
        });
    });
});
}

function openAngleLightbox(index) {
angleLightboxVisibleItems = [];
document.querySelectorAll('#angle-gallery-grid .angle-gallery-item').forEach((item, i) => {
    if (!item.classList.contains('hidden')) {
        angleLightboxVisibleItems.push(i);
    }
});

const posInVisible = angleLightboxVisibleItems.indexOf(index);
currentAngleLightboxIndex = posInVisible >= 0 ? posInVisible : 0;

renderAngleLightbox();
document.getElementById('angle-lightbox').classList.add('active');
document.body.style.overflow = 'hidden';
}

function renderAngleLightbox() {
const realIndex = angleLightboxVisibleItems[currentAngleLightboxIndex];
const item = angleGalleryItems[realIndex];
if (!item) return;

document.getElementById('angle-lightbox-img').src = item.src;
document.getElementById('angle-lightbox-img').alt = item.title;
document.getElementById('angle-lightbox-badge').textContent = item.badge;
document.getElementById('angle-lightbox-title').textContent = item.title;
document.getElementById('angle-lightbox-desc').textContent = item.desc;
document.getElementById('angle-lightbox-counter').textContent =
    `${currentAngleLightboxIndex + 1} / ${angleLightboxVisibleItems.length}`;
}

function closeAngleLightbox() {
document.getElementById('angle-lightbox').classList.remove('active');
document.body.style.overflow = '';
}

function navigateAngleLightbox(direction) {
if (angleLightboxVisibleItems.length <= 1) return;

currentAngleLightboxIndex += direction;
if (currentAngleLightboxIndex < 0) currentAngleLightboxIndex = angleLightboxVisibleItems.length - 1;
if (currentAngleLightboxIndex >= angleLightboxVisibleItems.length) currentAngleLightboxIndex = 0;

renderAngleLightbox();
}

// Event: tutup lightbox via klik backdrop
document.addEventListener('click', (e) => {
const lb = document.getElementById('angle-lightbox');
if (e.target === lb) closeAngleLightbox();
});

// Event: keyboard untuk lightbox
document.addEventListener('keydown', (e) => {
const lb = document.getElementById('angle-lightbox');
if (!lb?.classList.contains('active')) return;

if (e.key === 'Escape') closeAngleLightbox();
if (e.key === 'ArrowLeft') navigateAngleLightbox(-1);
if (e.key === 'ArrowRight') navigateAngleLightbox(1);
});

// Expose ke window
window.showAngleDetail = showAngleDetail;
window.closeAngleDetail = closeAngleDetail;
window.closeAngleLightbox = closeAngleLightbox;
window.navigateAngleLightbox = navigateAngleLightbox;
window.openAngleLightbox = openAngleLightbox;
/**
 * Buka lightbox
 */
let currentLightboxIndex = 0;
let lightboxVisibleItems = []; // indeks item yang saat ini terlihat (untuk navigasi)

function openLightbox(index) {
// Ambil item yang terlihat (tidak hidden)
lightboxVisibleItems = [];
document.querySelectorAll('#shot-gallery-grid .gallery-item').forEach((item, i) => {
    if (!item.classList.contains('hidden')) {
        lightboxVisibleItems.push(i);
    }
});

// Posisi item dalam daftar visible
const posInVisible = lightboxVisibleItems.indexOf(index);
currentLightboxIndex = posInVisible >= 0 ? posInVisible : 0;

renderLightbox();
document.getElementById('shot-lightbox').classList.add('active');
document.body.style.overflow = 'hidden';
}

/**
 * Render isi lightbox
 */
function renderLightbox() {
const realIndex = lightboxVisibleItems[currentLightboxIndex];
const item = galleryItems[realIndex];
if (!item) return;

document.getElementById('lightbox-img').src = item.src;
document.getElementById('lightbox-img').alt = item.title;
document.getElementById('lightbox-badge').textContent = item.badge;
document.getElementById('lightbox-title').textContent = item.title;
document.getElementById('lightbox-desc').textContent = item.desc;
document.getElementById('lightbox-counter').textContent =
    `${currentLightboxIndex + 1} / ${lightboxVisibleItems.length}`;
}

/**
 * Tutup lightbox
 */
function closeLightbox() {
document.getElementById('shot-lightbox').classList.remove('active');
document.body.style.overflow = '';
}

/**
 * Navigasi prev/next lightbox
 */
function navigateLightbox(direction) {
if (lightboxVisibleItems.length <= 1) return;

currentLightboxIndex += direction;
if (currentLightboxIndex < 0) currentLightboxIndex = lightboxVisibleItems.length - 1;
if (currentLightboxIndex >= lightboxVisibleItems.length) currentLightboxIndex = 0;

renderLightbox();
}

// Event: tutup lightbox via klik backdrop
document.addEventListener('click', (e) => {
const lb = document.getElementById('shot-lightbox');
if (e.target === lb) closeLightbox();
});

// Event: keyboard untuk lightbox
document.addEventListener('keydown', (e) => {
const lb = document.getElementById('shot-lightbox');
if (!lb?.classList.contains('active')) return;

if (e.key === 'Escape') closeLightbox();
if (e.key === 'ArrowLeft') navigateLightbox(-1);
if (e.key === 'ArrowRight') navigateLightbox(1);
});

// Expose ke global untuk onclick di HTML
window.closeLightbox = closeLightbox;
window.navigateLightbox = navigateLightbox;
window.openLightbox = openLightbox;

// ==================== MODAL JENIS FOTO ====================

const jenisData = {
portrait: {
    title: '👤 Fotografi Portrait',
    content: `
    <h3>Fotografi Portrait</h3>
    <p><strong>Fotografi portrait</strong> adalah genre fotografi yang berfokus pada penggambaran 
    seseorang atau sekelompok orang. Tujuannya adalah menangkap kepribadian, emosi, dan karakter subjek.</p>
    
    <h4>🎯 Ciri Khas:</h4>
    <ul>
        <li>Fokus pada wajah dan ekspresi subjek</li>
        <li>Biasanya menggunakan aperture besar (f/1.8 - f/2.8) untuk background blur</li>
        <li>Pencahayaan (lighting) sangat diperhatikan</li>
        <li>Interaksi antara fotografer dan subjek sangat penting</li>
    </ul>
    
    <h4>📸 Sub-Kategori:</h4>
    <ul>
        <li><strong>Headshot:</strong> Fokus pada kepala dan bahu</li>
        <li><strong>Environmental Portrait:</strong> Subjek dengan latar belakang aktivitasnya</li>
        <li><strong>Candid Portrait:</strong> Momen spontan tanpa pose</li>
        <li><strong>Group Portrait:</strong> Foto kelompok/keluarga</li>
    </ul>
    
    <h4>💡 Tips:</h4>
    <p>Gunakan lensa 50mm atau 85mm untuk proporsi wajah yang natural. Hindari lensa wide-angle untuk portrait karena dapat mendistorsi wajah.</p>
`
},
landscape: {
    title: '🏔️ Fotografi Landscape',
    content: `
    <h3>Fotografi Landscape</h3>
    <p><strong>Fotografi landscape</strong> menangkap keindahan pemandangan alam, 
    seperti gunung, pantai, hutan, danau, dan lainnya.</p>
    
    <h4>🎯 Ciri Khas:</h4>
    <ul>
        <li>Menggunakan aperture kecil (f/8 - f/16) untuk depth of field yang dalam</li>
        <li>Sering menggunakan tripod untuk stabilitas</li>
        <li>Memperhatikan waktu terbaik (golden hour, blue hour)</li>
        <li>Komposisi sangat penting (rule of thirds, leading lines)</li>
    </ul>
    
    <h4>⏰ Waktu Terbaik:</h4>
    <ul>
        <li><strong>Golden Hour:</strong> 1 jam setelah sunrise & 1 jam sebelum sunset</li>
        <li><strong>Blue Hour:</strong> Setelah sunset & sebelum sunrise</li>
        <li><strong>Midday:</strong> Cahaya keras, biasanya kurang ideal</li>
    </ul>
    
    <h4>💡 Tips:</h4>
    <p>Sertakan elemen foreground (batu, rumput, dll) untuk menambah kedalaman foto. Gunakan filter ND untuk long exposure di siang hari.</p>
`
},
macro: {
    title: '🔬 Fotografi Macro',
    content: `
    <h3>Fotografi Macro</h3>
    <p><strong>Fotografi macro</strong> memotret objek kecil dari jarak sangat dekat dengan 
    perbesaran minimal 1:1 (ukuran objek di sensor sama dengan ukuran aslinya).</p>
    
    <h4>🎯 Ciri Khas:</h4>
    <ul>
        <li>Menggunakan lensa macro khusus atau extension tube</li>
        <li>Depth of field sangat dangkal (bahkan f/16 masih dangkal)</li>
        <li>Membutuhkan pencahayaan yang cukup atau flash ring</li>
        <li>Tripod sangat direkomendasikan</li>
    </ul>
    
    <h4>📸 Objek Favorit:</h4>
    <ul>
        <li>Serangga (kupu-kupu, capung, semut)</li>
        <li>Bunga dan tumbuhan</li>
        <li>Tetesan air</li>
        <li>Tekstur benda (kain, logam, kayu)</li>
    </ul>
    
    <h4>💡 Tips:</h4>
    <p>Gunakan fokus manual untuk presisi. Sabar adalah kunci - foto macro membutuhkan waktu dan kesabaran ekstra.</p>
`
},
street: {
    title: '🚶 Fotografi Street',
    content: `
    <h3>Fotografi Street</h3>
    <p><strong>Fotografi street</strong> mendokumentasikan kehidupan sehari-hari di ruang publik 
    secara spontan dan candid.</p>
    
    <h4>🎯 Ciri Khas:</h4>
    <ul>
        <li>Momen spontan tanpa posing</li>
        <li>Sering menggunakan lensa 35mm atau 50mm</li>
        <li>Cepat dalam pengambilan gambar</li>
        <li>Mengangkat cerita sosial dan budaya</li>
    </ul>
    
    <h4>📖 Etika Street Photography:</h4>
    <ul>
        <li>Hormati privasi subjek</li>
        <li>Jangan memotret anak-anak tanpa izin orang tua</li>
        <li>Jika subjek keberatan, hapus foto</li>
        <li>Perhatikan hukum setempat tentang fotografi di ruang publik</li>
    </ul>
    
    <h4>💡 Tips:</h4>
    <p>Siapkan kamera sebelum momen terjadi. Antisipasi adalah kunci dalam street photography.</p>
`
},
product: {
    title: '📦 Fotografi Produk',
    content: `
    <h3>Fotografi Produk</h3>
    <p><strong>Fotografi produk</strong> memotret barang atau produk untuk keperluan komersial, 
    seperti e-commerce, katalog, dan iklan.</p>
    
    <h4>🎯 Ciri Khas:</h4>
    <ul>
        <li>Kontrol pencahayaan sangat ketat (studio lighting)</li>
        <li>Background bersih dan netral</li>
        <li>Detail produk harus terlihat jelas</li>
        <li>Konsisten dalam gaya dan warna</li>
    </ul>
    
    <h4>💡 Setup Dasar:</h4>
    <ul>
        <li><strong>Lighting:</strong> Minimal 2 sumber cahaya (key light + fill light)</li>
        <li><strong>Background:</strong> Kertas putih, kain hitam, atau lightbox</li>
        <li><strong>Tripod:</strong> Wajib untuk konsistensi</li>
        <li><strong>Aperture:</strong> f/8 - f/11 untuk ketajaman maksimal</li>
    </ul>
    
    <h4>💼 Peluang Karir:</h4>
    <p>Fotografer produk sangat dibutuhkan di era e-commerce.</p>
`
},
architecture: {
    title: '🏛️ Fotografi Arsitektur',
    content: `
    <h3>Fotografi Arsitektur</h3>
    <p><strong>Fotografi arsitektur</strong> memotret bangunan dan struktur dengan 
    memperhatikan bentuk, garis, dan proporsi.</p>
    
    <h4>🎯 Ciri Khas:</h4>
    <ul>
        <li>Kontrol perspektif sangat penting (garis vertikal harus lurus)</li>
        <li>Sering menggunakan tilt-shift lens atau post-processing</li>
        <li>Memperhatikan arah cahaya alami</li>
        <li>Komposisi geometris yang kuat</li>
    </ul>
    
    <h4>📐 Teknik Penting:</h4>
    <ul>
        <li><strong>Leading Lines:</strong> Manfaatkan garis bangunan</li>
        <li><strong>Symmetry:</strong> Banyak bangunan memiliki simetri alami</li>
        <li><strong>Reflections:</strong> Manfaatkan pantulan kaca atau air</li>
        <li><strong>Perspective Correction:</strong> Luruskan garis vertikal</li>
    </ul>
    
    <h4>💡 Tips:</h4>
    <p>Gunakan lensa wide-angle berkualitas baik untuk menghindari distorsi.</p>
`
},
wildlife: {
    title: '🦁 Fotografi Wildlife',
    content: `
    <h3>Fotografi Wildlife</h3>
    <p><strong>Fotografi wildlife</strong> memotret satwa liar di habitat alaminya tanpa 
    mengganggu mereka.</p>
    
    <h4>🎯 Ciri Khas:</h4>
    <ul>
        <li>Menggunakan lensa tele panjang (200mm+)</li>
        <li>Shutter speed cepat untuk membekukan gerakan</li>
        <li>Butuh kesabaran tinggi</li>
        <li>Memahami perilaku hewan adalah kunci</li>
    </ul>
    
    <h4>🐾 Etika Wildlife Photography:</h4>
    <ul>
        <li>Jangan mengganggu atau memberi makan hewan liar</li>
        <li>Jaga jarak aman - gunakan lensa tele, bukan mendekat</li>
        <li>Hormati habitat alami mereka</li>
        <li>Jangan memancing perilaku berbahaya hanya demi foto</li>
    </ul>
    
    <h4>💡 Tips:</h4>
    <p>Pelajari perilaku hewan yang ingin difoto. Fokus pada mata hewan.</p>
`
},
sport: {
    title: '⚽ Fotografi Olahraga',
    content: `
    <h3>Fotografi Olahraga</h3>
    <p><strong>Fotografi olahraga</strong> menangkap momen aksi dalam dunia olahraga 
    dengan fokus pada gerakan, emosi, dan momen krusial.</p>
    
    <h4>🎯 Ciri Khas:</h4>
    <ul>
        <li>Shutter speed sangat cepat (1/1000s atau lebih)</li>
        <li>Mode continuous autofocus</li>
        <li>Sering menggunakan lensa tele 70-200mm atau 400mm</li>
        <li>Antisipasi momen sangat penting</li>
    </ul>
    
    <h4>📸 Teknik:</h4>
    <ul>
        <li><strong>Freeze:</strong> 1/1000s+ untuk membekukan gerakan</li>
        <li><strong>Panning:</strong> Mengikuti subjek dengan shutter speed lebih lambat</li>
        <li><strong>Burst Mode:</strong> Menangkap beberapa frame per detik</li>
        <li><strong>Anticipation:</strong> Memprediksi momen penting</li>
    </ul>
    
    <h4>💡 Tips:</h4>
    <p>Pahami aturan olahraga yang difoto agar bisa mengantisipasi momen.</p>
`
}
};

// ==================== MATERI FORMAT FOTO ====================

const formatData = {
    jpeg: {
        icon: '🖼️',
        abbr: 'JPG',
        title: 'JPEG / JPG',
        subtitle: 'Joint Photographic Experts Group',
        desc: 'Format paling populer di dunia. Menggunakan kompresi lossy — saat menyimpan, sebagian data dibuang secara permanen untuk menghemat ruang.',
        kelebihan: [
            'Ukuran file kecil (5-10x lebih kecil dari RAW)',
            'Didukung SEMUA perangkat & aplikasi',
            'Ideal untuk berbagi & web',
            'Kualitas visual masih baik untuk penggunaan umum'
        ],
        kekurangan: [
            'Kualitas menurun setiap kali di-save ulang',
            'Tidak bisa recovery data yang hilang',
            'Tidak mendukung transparansi',
            'Kurang ideal untuk editing intensif'
        ],
        penggunaan: 'Foto sehari-hari, sosial media, website, email, cetak ukuran kecil-menengah',
        tips: 'Selalu simpan di kualitas 80-95%. Jangan pernah edit & save JPG berkali-kali!'
    },
    png: {
        icon: '🎨',
        abbr: 'PNG',
        title: 'PNG',
        subtitle: 'Portable Network Graphics',
        desc: 'Format lossless dengan dukungan transparansi (alpha channel). Sangat populer di dunia desain web & UI.',
        kelebihan: [
            'Kompresi lossless — kualitas tidak turun',
            'Mendukung background transparan',
            'Ideal untuk logo, ikon, screenshot',
            'Kualitas stabil walau di-save berulang'
        ],
        kekurangan: [
            'Ukuran file lebih besar dari JPG',
            'Tidak mendukung animasi (kecuali APNG)',
            'Kurang efisien untuk foto kompleks'
        ],
        penggunaan: 'Logo, ikon, elemen UI, grafik web, screenshot, aset desain',
        tips: 'Gunakan PNG-8 (256 warna) untuk file kecil, PNG-24 untuk kualitas penuh, PNG-32 untuk transparansi.'
    },
    tiff: {
        icon: '🖨️',
        abbr: 'TIFF',
        title: 'TIFF',
        subtitle: 'Tagged Image File Format',
        desc: 'Format lossless standar industri percetakan. Kualitas tertinggi dengan fleksibilitas editing, tapi ukuran file sangat besar.',
        kelebihan: [
            'Kualitas tertinggi tanpa kompresi',
            'Mendukung layer & metadata kaya',
            'Standar industri percetakan',
            'Ideal untuk arsip jangka panjang'
        ],
        kekurangan: [
            'Ukuran file sangat besar (bisa 100+ MB)',
            'Tidak cocok untuk web',
            'Aplikasi pendukung terbatas',
            'Transfer lambat'
        ],
        penggunaan: 'Cetak profesional, arsip, scanning dokumen, workflow percetakan, majalah',
        tips: 'Gunakan kompresi LZW (lossless) untuk menghemat ukuran tanpa kehilangan kualitas.'
    },
    raw: {
        icon: '📷',
        abbr: 'RAW',
        title: 'RAW',
        subtitle: 'Format Data Mentah Sensor',
        desc: 'Bukan format file spesifik — ini kategori. Setiap kamera punya ekstensi sendiri (.CR2, .NEF, .ARW, .RAF). Berisi SEMUA data sensor tanpa diproses.',
        kelebihan: [
            'Fleksibilitas editing maksimal',
            'Recovery highlight & shadow hingga 3 stop',
            'White balance bisa diubah bebas',
            'Kualitas tertinggi untuk cetak besar'
        ],
        kekurangan: [
            'Ukuran file raksasa (25-50 MB per foto)',
            'Butuh software khusus (Lightroom, Capture One)',
            'Tidak bisa dibuka viewer biasa',
            'Workflow lebih lambat'
        ],
        penggunaan: 'Fotografi profesional, wedding, komersial, landscape, fashion',
        tips: 'Selalu simpan RAW + JPG bersamaan. RAW untuk arsip & editing, JPG untuk preview cepat.'
    },
    heic: {
        icon: '📱',
        abbr: 'HEIC',
        title: 'HEIC / HEIF',
        subtitle: 'High Efficiency Image Format',
        desc: 'Format modern Apple (sejak iOS 11). Menggunakan codec HEVC — ukuran 50% lebih kecil dari JPG dengan kualitas setara atau lebih baik.',
        kelebihan: [
            'Ukuran file 50% lebih kecil dari JPG',
            'Kualitas visual sangat baik',
            'Mendukung 16-bit color (HDR)',
            'Bisa menyimpan Live Photos'
        ],
        kekurangan: [
            'Kompatibilitas terbatas (non-Apple)',
            'Butuh konversi untuk Windows/Android lama',
            'Belum didukung semua website',
            'Kurang ideal untuk workflow lintas platform'
        ],
        penggunaan: 'Foto iPhone sehari-hari, penyimpanan hemat di iCloud, Live Photos',
        tips: 'Set iPhone ke "Most Compatible" jika ingin otomatis JPG. Atau konversi HEIC ke JPG sebelum upload ke web.'
    },
    dng: {
        icon: '🌐',
        abbr: 'DNG',
        title: 'DNG',
        subtitle: 'Digital Negative',
        desc: 'Format RAW universal buatan Adobe. Bersifat open source — bisa dibaca oleh banyak software, tidak terikat merek kamera tertentu.',
        kelebihan: [
            'Format RAW universal (cross-platform)',
            'Kompatibel dengan banyak software',
            'Ukuran lebih kecil dari RAW proprietary',
            'Ideal untuk arsip jangka panjang'
        ],
        kekurangan: [
            'Tidak semua kamera support langsung',
            'Butuh konversi dari RAW asli',
            'Beberapa software Adobe-centric',
            'Tidak sepopuler RAW proprietary'
        ],
        penggunaan: 'Arsip foto jangka panjang, workflow lintas software, fotografer multi-brand',
        tips: 'Konversi RAW ke DNG untuk arsip. Adobe DNG Converter gratis!'
    }
};

/**
 * Setup navigasi sub-materi format
 */
function setupFormatNav() {
    document.querySelectorAll('.format-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.format;

            document.querySelectorAll('.format-nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            document.querySelectorAll('.format-sub').forEach(s => s.classList.remove('active'));
            document.getElementById(`format-${target}`)?.classList.add('active');
        });
    });
}

/**
 * Tampilkan modal detail format
 */
function showFormatDetail(formatKey) {
    const data = formatData[formatKey];
    if (!data) return;

    const modal = document.getElementById('format-modal');
    const body = document.getElementById('format-modal-body');
    if (!modal || !body) return;

    body.innerHTML = `
        <div style="text-align:center; margin-bottom:1.5rem;">
            <div style="display:inline-flex; align-items:center; justify-content:center; width:80px; height:80px; background:linear-gradient(135deg, #3498db, #2980b9); color:white; border-radius:16px; font-size:2rem; margin-bottom:0.75rem;">${data.icon}</div>
            <h3 style="margin:0 0 0.35rem 0; color:#2C3E50;">${data.title}</h3>
            <p style="margin:0; color:#6c757d; font-style:italic; font-size:0.85rem;">${data.subtitle}</p>
        </div>

        <p style="line-height:1.7; color:#495057; font-size:0.92rem;">${data.desc}</p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1.25rem;">
            <div style="padding:0.85rem 1rem; background:#e8f5e9; border-radius:8px; border-left:3px solid #2ecc71;">
                <div style="font-size:0.75rem; color:#1b5e20; font-weight:700; text-transform:uppercase; margin-bottom:0.5rem;">✅ Kelebihan</div>
                <ul style="margin:0; padding-left:1rem; font-size:0.82rem; line-height:1.6; color:#343a40;">
                    ${data.kelebihan.map(k => `<li>${k}</li>`).join('')}
                </ul>
            </div>
            <div style="padding:0.85rem 1rem; background:#ffebee; border-radius:8px; border-left:3px solid #e74c3c;">
                <div style="font-size:0.75rem; color:#b71c1c; font-weight:700; text-transform:uppercase; margin-bottom:0.5rem;">❌ Kekurangan</div>
                <ul style="margin:0; padding-left:1rem; font-size:0.82rem; line-height:1.6; color:#343a40;">
                    ${data.kekurangan.map(k => `<li>${k}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div style="padding:0.85rem 1rem; background:#f8f9fa; border-radius:8px; border-left:3px solid #3498db; margin-top:1rem;">
            <div style="font-size:0.75rem; color:#6c757d; font-weight:700; text-transform:uppercase; margin-bottom:0.35rem;">🎯 Penggunaan</div>
            <div style="font-size:0.88rem; color:#2C3E50;">${data.penggunaan}</div>
        </div>

        <div style="padding:0.85rem 1rem; background:#fff9e6; border-radius:8px; border-left:3px solid #f39c12; margin-top:0.75rem;">
            <div style="font-size:0.75rem; color:#8a6d3b; font-weight:700; text-transform:uppercase; margin-bottom:0.35rem;">💡 Tips</div>
            <div style="font-size:0.88rem; color:#2C3E50;">${data.tips}</div>
        </div>
    `;

    modal.classList.add('active');
}

function closeFormatDetail() {
    document.getElementById('format-modal')?.classList.remove('active');
}

// Tutup modal format via backdrop
document.getElementById('format-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'format-modal') closeFormatDetail();
});

// Expose ke global
window.showFormatDetail = showFormatDetail;
window.closeFormatDetail = closeFormatDetail;

function openJenisDetail(jenis) {
const modal = document.getElementById('jenis-modal');
const body = document.getElementById('jenis-modal-body');
const data = jenisData[jenis];

if (data) {
    body.innerHTML = data.content;
    modal.classList.add('active');
}
}

function closeJenisDetail() {
document.getElementById('jenis-modal')?.classList.remove('active');
}

// Tutup modal jenis via backdrop
document.getElementById('jenis-modal')?.addEventListener('click', (e) => {
if (e.target.id === 'jenis-modal') closeJenisDetail();
});

// ==================== EXPOSURE SIMULATOR ====================

const apertureSlider = document.getElementById('aperture-slider');
const shutterSlider = document.getElementById('shutter-slider');
const isoSlider = document.getElementById('iso-slider');

function updateExposure() {
if (!apertureSlider) return;

const aperture = parseFloat(apertureSlider.value);
const shutter = parseInt(shutterSlider.value);
const iso = parseInt(isoSlider.value);

document.getElementById('aperture-value').textContent = `f/${aperture}`;

let shutterText = shutter >= 1 ? `1/${shutter}s` : `${shutter}s`;
document.getElementById('shutter-value').textContent = shutterText;

document.getElementById('iso-value').textContent = iso;

const ev = Math.log2(aperture * aperture) + Math.log2(shutter) - Math.log2(iso / 100);

const previewImage = document.getElementById('preview-image');
const brightnessEl = document.getElementById('preview-brightness');
const dofEl = document.getElementById('preview-dof');
const noiseEl = document.getElementById('preview-noise');
const statusEl = document.getElementById('exposure-status');
const iconEl = document.getElementById('preview-icon');

if (!previewImage) return;

let brightness, bgColor, status, statusClass;

if (ev < 6) {
    brightness = 'Sangat Gelap'; bgColor = '#2c2c2c';
    status = 'Exposure: Under (Terlalu Gelap) ✗'; statusClass = 'under';
    iconEl.textContent = '🌑';
} else if (ev < 8) {
    brightness = 'Agak Gelap'; bgColor = '#5a5a5a';
    status = 'Exposure: Under (Agak Gelap) ⚠'; statusClass = 'under';
    iconEl.textContent = '🌘';
} else if (ev >= 8 && ev <= 12) {
    brightness = 'Normal / Ideal'; bgColor = '#a0a0a0';
    status = 'Exposure: Ideal ✓'; statusClass = '';
    iconEl.textContent = '📷';
} else if (ev <= 14) {
    brightness = 'Agak Terang'; bgColor = '#d0d0d0';
    status = 'Exposure: Over (Agak Terang) ⚠'; statusClass = 'over';
    iconEl.textContent = '🌔';
} else {
    brightness = 'Sangat Terang'; bgColor = '#f5f5f5';
    status = 'Exposure: Over (Terlalu Terang) ✗'; statusClass = 'over';
    iconEl.textContent = '☀️';
}

previewImage.style.background = `linear-gradient(135deg, ${bgColor}, ${bgColor})`;
brightnessEl.textContent = brightness;

let dof;
if (aperture <= 2.8) dof = 'Sangat Dangkal (Background Blur)';
else if (aperture <= 5.6) dof = 'Dangkal';
else if (aperture <= 11) dof = 'Sedang';
else dof = 'Dalam (Semua Tajam)';
dofEl.textContent = `DOF: ${dof}`;

let noise;
if (iso <= 200) noise = 'Sangat Rendah';
else if (iso <= 800) noise = 'Rendah';
else if (iso <= 1600) noise = 'Sedang';
else if (iso <= 3200) noise = 'Tinggi';
else noise = 'Sangat Tinggi';
noiseEl.textContent = `Noise: ${noise}`;

statusEl.textContent = status;
statusEl.className = 'exposure-status ' + statusClass;
}

if (apertureSlider) {
apertureSlider.addEventListener('input', updateExposure);
shutterSlider.addEventListener('input', updateExposure);
isoSlider.addEventListener('input', updateExposure);
updateExposure();
}

// ==================== EXPOSURE DETAIL CLICK ====================

function showExposureDetail(type) {
const detailCard = document.getElementById(`detail-${type}`);
if (detailCard) {
    detailCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    detailCard.style.borderColor = 'var(--accent)';
    detailCard.style.boxShadow = '0 8px 25px rgba(230, 126, 34, 0.3)';
    setTimeout(() => {
        detailCard.style.boxShadow = '';
    }, 2000);
}
}

// ==================== MATERI KAMERA & ALAT PENDUKUNG ====================

// Data bagian-bagian kamera
const bagianKamera = {
    lens: {
        icon: '🔭',
        title: 'Lensa',
        desc: 'Bagian terpenting kamera. Berfungsi mengumpulkan & memfokuskan cahaya ke sensor. Jenisnya: prime (fokal tetap) & zoom (fokal variabel). Kualitas lensa sangat menentukan ketajaman foto.'
    },
    evf: {
        icon: '👁️',
        title: 'Electronic Viewfinder (EVF)',
        desc: 'Jendela bidik elektronik. Menampilkan preview digital dari apa yang akan difoto — termasuk efek exposure, white balance, dan filter secara real-time. Fitur khas mirrorless.'
    },
    shutter: {
        icon: '🔴',
        title: 'Tombol Shutter',
        desc: 'Tombol untuk mengambil foto. Ditekan setengah = autofokus aktif. Ditekan penuh = shutter terbuka & foto diambil. Bisa disetel untuk mode burst (continuous shooting).'
    },
    dial: {
        icon: '🎛️',
        title: 'Mode Dial',
        desc: 'Dial untuk memilih mode pemotretan: Auto, P (Program), A/Av (Aperture Priority), S/Tv (Shutter Priority), M (Manual). Juga sering ada Custom mode (C1, C2) untuk preset pribadi.'
    },
    screen: {
        icon: '📺',
        title: 'Layar LCD',
        desc: 'Layar sentuh untuk melihat hasil foto, mengatur menu, dan live view. Banyak kamera modern punya layar flip-out yang bisa diputar untuk selfie atau vlog.'
    },
    mount: {
        icon: '⭕',
        title: 'Mount Lensa',
        desc: 'Cincin tempat memasang lensa ke body kamera. Setiap merek punya mount berbeda (Sony E-mount, Canon RF, Nikon Z, Fujifilm X). Gunakan adapter untuk lensa beda mount.'
    },
    hotshoe: {
        icon: '⚡',
        title: 'Hot Shoe',
        desc: 'Konektor di atas kamera untuk memasang flash eksternal, mic, atau aksesori lain. Menyalurkan sinyal sinkronisasi antara kamera & flash.'
    },
    grip: {
        icon: '✊',
        title: 'Grip',
        desc: 'Bagian menonjol di sisi kanan kamera untuk pegangan tangan. Desain ergonomis membuat kamera nyaman dipegang lama. Sebagian kamera punya battery grip tambahan.'
    },
    battery: {
        icon: '🔋',
        title: 'Baterai & Slot Memori',
        desc: 'Kompartemen untuk baterai lithium-ion dan kartu memori (SD/microSD/CFexpress). Selalu siapkan baterai cadangan & kartu memori kosong untuk sesi foto panjang.'
    }
};

/**
 * Setup navigasi sub-materi kamera
 */
function setupKameraNav() {
    document.querySelectorAll('.kamera-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.kamera;
            
            document.querySelectorAll('.kamera-nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            document.querySelectorAll('.kamera-sub').forEach(s => s.classList.remove('active'));
            document.getElementById(`kamera-${target}`)?.classList.add('active');
        });
    });
}

/**
 * Setup diagram interaktif kamera
 */
function setupKameraDiagram() {
    // Render daftar bagian
    const list = document.getElementById('bagian-list');
    if (!list) return;
    
    list.innerHTML = Object.entries(bagianKamera).map(([key, data], idx) => `
        <div class="bagian-item" data-part="${key}">
            <span class="bagian-num">${idx + 1}</span>
            <span class="bagian-text">${data.icon} ${data.title}</span>
        </div>
    `).join('');
    
    // Event untuk hotspot
    document.querySelectorAll('.hotspot').forEach(btn => {
        btn.addEventListener('click', () => {
            const partKey = btn.dataset.part;
            showKameraPart(partKey);
        });
    });
    
    // Event untuk item list
    document.querySelectorAll('.bagian-item').forEach(item => {
        item.addEventListener('click', () => {
            const partKey = item.dataset.part;
            showKameraPart(partKey);
            
            // Scroll ke diagram
            document.querySelector('.kamera-diagram-wrapper')?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        });
    });
}
/**
 * Setup akordeon kategori bagian kamera
 */
function setupKategoriAccordion() {
    document.querySelectorAll('.kategori-header').forEach(btn => {
        btn.addEventListener('click', () => {
            const accordion = btn.closest('.kategori-accordion');
            const isOpen = accordion.classList.contains('open');
            
            // Tutup semua accordion lain (opsional — kalau mau hanya 1 terbuka)
            // Kalau mau multi-open, hapus 3 baris di bawah
            document.querySelectorAll('.kategori-accordion').forEach(a => {
                if (a !== accordion) a.classList.remove('open');
            });
            
            // Toggle accordion yang di-klik
            accordion.classList.toggle('open', !isOpen);
        });
    });
}
/**
 * Tampilkan detail bagian kamera
 */
function showKameraPart(partKey) {
    const data = bagianKamera[partKey];
    if (!data) return;
    
    // Update hotspot aktif
    document.querySelectorAll('.hotspot').forEach(h => {
        h.classList.toggle('active', h.dataset.part === partKey);
    });
    
    // Update item list aktif
    document.querySelectorAll('.bagian-item').forEach(i => {
        i.classList.toggle('active', i.dataset.part === partKey);
    });
    
    // Update info panel
    const panel = document.getElementById('kamera-info-panel');
    if (!panel) return;
    
    panel.classList.add('has-content');
    panel.innerHTML = `
        <div class="kamera-info-header">
            <span class="kamera-info-icon">${data.icon}</span>
            <h4 class="kamera-info-title">${data.title}</h4>
        </div>
        <p class="kamera-info-desc">${data.desc}</p>
    `;
}

// ==================== ALAT PENDUKUNG ====================

const alatData = {
    softbox: {
        icon: '💡',
        title: 'Softbox',
        category: 'Lighting',
        desc: 'Softbox adalah modifier cahaya berbentuk kotak atau oktagon yang dipasang di depan flash atau lampu studio. Fungsinya menyebarkan cahaya menjadi lembut dan merata, mengurangi bayangan keras.',
        kegunaan: 'Portrait, foto produk, beauty shot, foto makanan',
        tips: 'Semakin besar softbox, semakin lembut cahayanya. Gunakan grid untuk mengontrol arah cahaya.'
    },
    umbrella: {
        icon: '☂️',
        title: 'Payung Studio (Umbrella)',
        category: 'Lighting',
        desc: 'Payung studio adalah modifier cahaya alternatif yang lebih murah & portabel dari softbox. Ada 2 tipe: shoot-through (cahaya menembus payung) dan reflective (cahaya memantul dari dalam payung).',
        kegunaan: 'Portrait cepat, foto grup, setup portable',
        tips: 'Shoot-through menghasilkan cahaya lebih lembut; reflective lebih terarah & powerful.'
    },
    flash: {
        icon: '⚡',
        title: 'Speedlight Flash',
        category: 'Lighting',
        desc: 'Flash eksternal yang dipasang di hot shoe kamera. Bisa digunakan on-camera (langsung di kamera) atau off-camera dengan trigger wireless. Jauh lebih powerful dari flash built-in.',
        kegunaan: 'Foto event, wedding, indoor, fill-in flash outdoor',
        tips: 'Selalu arahkan flash ke langit-langit (bounce) untuk cahaya lebih natural.'
    },
    ringlight: {
        icon: '⭕',
        title: 'Ring Light',
        category: 'Lighting',
        desc: 'Lampu berbentuk cincin yang mengelilingi lensa kamera. Menghasilkan pencahayaan merata tanpa bayangan keras. Sangat populer di kalangan content creator & makeup artist.',
        kegunaan: 'Makeup, beauty shot, vlog, live streaming',
        tips: 'Untuk efek "catch light" bulat di mata, gunakan ring light dekat wajah.'
    },
    tripod: {
        icon: '🦵',
        title: 'Tripod',
        category: 'Support',
        desc: 'Penyangga kamera berkaki tiga. Wajib untuk long exposure, video, atau kondisi low-light. Tripod berkualitas memiliki head ball/pannable yang bisa diatur berbagai sudut.',
        kegunaan: 'Long exposure, landscape, video, foto produk',
        tips: 'Pilih tripod dengan kapasitas beban minimal 2x berat kamera + lensa.'
    },
    monopod: {
        icon: '🥢',
        title: 'Monopod',
        category: 'Support',
        desc: 'Tripod berkaki satu. Lebih portabel & cepat dipasang. Cocok untuk situasi yang membutuhkan mobilitas tinggi namun tetap butuh kestabilan ekstra.',
        kegunaan: 'Olahraga, wildlife, konser, foto jurnalistik',
        tips: 'Kombinasikan dengan teknik pernapasan untuk hasil maksimal.'
    },
    gimbal: {
        icon: '🎬',
        title: 'Gimbal Stabilizer',
        category: 'Support',
        desc: 'Stabilizer elektronik bermotor yang membuat gerakan kamera tetap smooth tanpa goyangan. Bisa juga untuk mode follow subject secara otomatis.',
        kegunaan: 'Video sinematik, vlog, live event',
        tips: 'Latih gerakan "ninja walk" — berjalan dengan lutut ditekuk agar stabil.'
    },
    filter: {
        icon: '🔍',
        title: 'Filter Lensa',
        category: 'Optic',
        desc: 'Kaca tambahan yang dipasang di depan lensa. Jenis populer: ND (mengurangi cahaya), CPL (menghilangkan refleksi), UV (melindungi lensa), GND (gradual ND untuk landscape).',
        kegunaan: 'Landscape, long exposure, kontrol refleksi',
        tips: 'Beli filter berkualitas (B+W, Hoya, Lee) agar tidak menurunkan ketajaman.'
    },
    lenshood: {
        icon: '🌂',
        title: 'Lens Hood',
        category: 'Optic',
        desc: 'Pelindung lensa berbentuk corong yang dipasang di depan lensa. Fungsinya: menghalangi cahaya berlebih (mengurangi lens flare) & melindungi lensa dari benturan.',
        kegunaan: 'Foto outdoor, backlight, proteksi lensa',
        tips: 'Selalu pasang lens hood saat memotret di luar — gratis dan efektif!'
    },
    cleaning: {
        icon: '🧼',
        title: 'Cleaning Kit',
        category: 'Lainnya',
        desc: 'Perlengkapan untuk merawat kamera & lensa: blower (penghembus debu), microfiber cloth (lap lensa), lens pen (bersih noda membandel), dan sensor swab (bersih sensor).',
        kegunaan: 'Perawatan rutin setelah pemakaian',
        tips: 'Jangan pernah pakai tisu biasa atau baju untuk lap lensa — bisa menggores!'
    },
    tas: {
        icon: '🎒',
        title: 'Tas Kamera',
        category: 'Lainnya',
        desc: 'Tas khusus dengan sekat-sekat untuk melindungi kamera & lensa dari benturan, debu, air, dan suhu ekstrem. Ada tipe sling bag, backpack, roller, dan hard case.',
        kegunaan: 'Transportasi & penyimpanan alat',
        tips: 'Pilih tas dengan rain cover & beri silica gel untuk mencegah jamur lensa.'
    },
    background: {
        icon: '📄',
        title: 'Background Paper / Backdrop',
        category: 'Lighting',
        desc: 'Kertas atau kain latar belakang untuk studio foto. Tersedia berbagai warna & ukuran. Bisa digulung di backdrop stand untuk kemudahan.',
        kegunaan: 'Foto produk, portrait studio, foto keluarga',
        tips: 'Warna putih & hitam adalah yang paling fleksibel untuk pemula.'
    }
};

/**
 * Setup filter galeri alat
 */
function setupAlatFilter() {
    document.querySelectorAll('.alat-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.alat;
            
            document.querySelectorAll('.alat-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            document.querySelectorAll('.alat-card').forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.4s ease';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
    
    // Event klik kartu alat → modal detail
    document.querySelectorAll('.alat-card').forEach(card => {
        card.addEventListener('click', () => {
            const alatKey = card.dataset.alat;
            showAlatDetail(alatKey);
        });
    });
}

/**
 * Tampilkan modal detail alat
 */
function showAlatDetail(alatKey) {
    const data = alatData[alatKey];
    if (!data) return;
    
    const modal = document.getElementById('alat-modal');
    const body = document.getElementById('alat-modal-body');
    if (!modal || !body) return;
    
    body.innerHTML = `
        <div style="text-align:center; margin-bottom:1.5rem;">
            <div style="display:inline-flex; align-items:center; justify-content:center; width:80px; height:80px; background:linear-gradient(135deg, #16a085, #1abc9c); color:white; border-radius:16px; font-size:2rem; margin-bottom:0.75rem;">${data.icon}</div>
            <h3 style="margin:0 0 0.35rem 0; color:#2C3E50;">${data.title}</h3>
            <span style="display:inline-block; background:#e0f2f1; color:#00695c; padding:0.2rem 0.75rem; border-radius:12px; font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">${data.category}</span>
        </div>
        <p style="line-height:1.7; color:#495057; font-size:0.95rem;">${data.desc}</p>
        <div style="display:flex; flex-direction:column; gap:0.75rem; margin-top:1.25rem;">
            <div style="padding:0.85rem 1rem; background:#f8f9fa; border-radius:8px; border-left:3px solid #16a085;">
                <div style="font-size:0.75rem; color:#6c757d; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.25rem;">🎯 Kegunaan</div>
                <div style="font-size:0.9rem; color:#2C3E50;">${data.kegunaan}</div>
            </div>
            <div style="padding:0.85rem 1rem; background:#f8f9fa; border-radius:8px; border-left:3px solid #16a085;">
                <div style="font-size:0.75rem; color:#6c757d; font-weight:600; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:0.25rem;">💡 Tips</div>
                <div style="font-size:0.9rem; color:#2C3E50;">${data.tips}</div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

function closeAlatDetail() {
    document.getElementById('alat-modal')?.classList.remove('active');
}

/**
 * Setup semua untuk materi kamera
 */
function setupKameraMateri() {
    setupKameraNav();
    setupKameraDiagram();
    setupKategoriAccordion();
    setupAlatFilter();
    
    // Tutup modal alat via backdrop
    document.getElementById('alat-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'alat-modal') closeAlatDetail();
    });
}

// Expose ke window
window.showKameraPart = showKameraPart;
window.showAlatDetail = showAlatDetail;
window.closeAlatDetail = closeAlatDetail;

// ==================== GALERI JENIS KAMERA ====================

const kameraGaleriData = {
    dslr: {
        badge: 'DSLR',
        title: '📸 Kamera DSLR',
        desc: 'Digital Single-Lens Reflex. Menggunakan cermin mekanik untuk memantulkan cahaya ke viewfinder optik. Kelebihan: baterai tahan lama, banyak lensa bekas murah. Kekurangan: berat, autofokus lebih lambat dari mirrorless.'
    },
    mirrorless: {
        badge: 'Mirrorless',
        title: '🪞 Kamera Mirrorless',
        desc: 'Tanpa cermin mekanik. Cahaya langsung ke sensor, dilihat via EVF atau LCD. Kelebihan: ringan, senyap, autofokus super cepat, video 4K/8K. Standar industri saat ini.'
    },
    kamera360: {
        badge: '360°',
        title: '🌐 Kamera 360',
        desc: 'Menangkap 360° horizontal & 180° vertikal dalam 1 jepretan. Cocok untuk VR, virtual tour, dan konten media sosial yang immersive. Hasil: gambar equirectangular.'
    },
    polaroid: {
        badge: 'Polaroid',
        title: '📸 Kamera Polaroid',
        desc: 'Kamera instan yang mencetak foto langsung. Estetika vintage dengan bingkai putih khas. Kelebihan: hasil fisik & pengalaman unik. Kekurangan: biaya per foto mahal (Rp 15-25rb) & kualitas terbatas.'
    }
};

let currentKameraGaleriIndex = 0;
const kameraGaleriKeys = ['dslr', 'mirrorless', 'kamera360', 'polaroid'];

/**
 * Setup galeri jenis kamera
 */
function setupKameraGaleri() {
    document.querySelectorAll('.kamera-galeri-item').forEach(item => {
        item.addEventListener('click', () => {
            const key = item.dataset.kamera;
            const idx = kameraGaleriKeys.indexOf(key);
            currentKameraGaleriIndex = idx >= 0 ? idx : 0;
            openKameraLightbox();
        });
    });

    // Tutup via backdrop
    document.getElementById('kamera-lightbox')?.addEventListener('click', (e) => {
        if (e.target.id === 'kamera-lightbox') closeKameraLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const lb = document.getElementById('kamera-lightbox');
        if (!lb?.classList.contains('active')) return;

        if (e.key === 'Escape') closeKameraLightbox();
        if (e.key === 'ArrowLeft') navigateKameraLightbox(-1);
        if (e.key === 'ArrowRight') navigateKameraLightbox(1);
    });
}

function openKameraLightbox() {
    renderKameraLightbox();
    document.getElementById('kamera-lightbox')?.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function renderKameraLightbox() {
    const key = kameraGaleriKeys[currentKameraGaleriIndex];
    const data = kameraGaleriData[key];
    if (!data) return;

    // Cari gambar dari galeri
    const itemEl = document.querySelector(`.kamera-galeri-item[data-kamera="${key}"]`);
    const imgSrc = itemEl?.querySelector('img')?.src || '';

    const img = document.getElementById('kamera-lightbox-img');
    if (img) {
        img.src = imgSrc;
        img.alt = data.title;
    }

    document.getElementById('kamera-lightbox-badge').textContent = data.badge;
    document.getElementById('kamera-lightbox-title').textContent = data.title;
    document.getElementById('kamera-lightbox-desc').textContent = data.desc;
    document.getElementById('kamera-lightbox-counter').textContent =
        `${currentKameraGaleriIndex + 1} / ${kameraGaleriKeys.length}`;
}

function closeKameraLightbox() {
    document.getElementById('kamera-lightbox')?.classList.remove('active');
    document.body.style.overflow = '';
}

function navigateKameraLightbox(direction) {
    currentKameraGaleriIndex += direction;
    if (currentKameraGaleriIndex < 0) currentKameraGaleriIndex = kameraGaleriKeys.length - 1;
    if (currentKameraGaleriIndex >= kameraGaleriKeys.length) currentKameraGaleriIndex = 0;
    renderKameraLightbox();
}

// Expose ke window
window.openKameraLightbox = openKameraLightbox;
window.closeKameraLightbox = closeKameraLightbox;
window.navigateKameraLightbox = navigateKameraLightbox;

// Expose fungsi ke global (untuk onclick di HTML)
window.openJenisDetail = openJenisDetail;
window.closeJenisDetail = closeJenisDetail;
window.showExposureDetail = showExposureDetail;