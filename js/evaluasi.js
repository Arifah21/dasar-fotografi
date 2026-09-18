// js/evaluasi.js
// js/evaluasi.js
import { supabase } from './supabase-client.js';

// ====================================================================
// ==================== DATA SOAL EVALUASI ==========================
// ====================================================================

// 
const soalPG = [
    // ========== SEJARAH FOTOGRAFI (2 soal) ==========
    {
        nomor: 1,
        pertanyaan: "Perhatikan pernyataan berikut! (1) Kamera obscura awalnya digunakan pelukis untuk membuat sketsa. (2) Daguerreotype menggunakan pelat tembaga berlapis perak. (3) Kodak Brownie dijual seharga $100. (4) Kamera digital pertama ditemukan oleh Steven Sasson pada 1975. Pernyataan yang BENAR tentang sejarah fotografi adalah...",
        opsi: {
            A: "(1), (2), dan (3)",
            B: "(1), (2), dan (4)",
            C: "(1), (3), dan (4)",
            D: "(2), (3), dan (4)",
            E: "Semua benar"
        },
        jawaban: "B",
        pembahasan: "(3) SALAH — Kodak Brownie dijual seharga $1 (bukan $100), itulah sebabnya kamera ini disebut sebagai 'demokratisasi fotografi'. Pernyataan lain benar."
    },
    {
        nomor: 2,
        pertanyaan: "Seorang siswa berpendapat: 'Foto permanen pertama di dunia dibuat pada tahun 1839 oleh Daguerre.' Evaluasi kritis terhadap pendapat tersebut adalah...",
        opsi: {
            A: "Benar, karena Daguerre adalah penemu fotografi",
            B: "Salah, foto permanen pertama dibuat 1826 oleh Niépce dengan teknik heliography",
            C: "Benar, 1839 adalah tahun kelahiran fotografi modern",
            D: "Salah, foto permanen pertama dibuat 1888 oleh George Eastman",
            E: "Benar, tapi seharusnya tahunnya 1835"
        },
        jawaban: "B",
        pembahasan: "Foto permanen PERTAMA dibuat oleh Joseph Nicéphore Niépce pada 1826 dengan teknik heliography ('View from the Window at Le Gras'). Tahun 1839 adalah tahun dipublikasikannya daguerreotype — kelahiran fotografi MODERN, bukan foto pertama."
    },

    // ========== JENIS-JENIS FOTO (2 soal) ==========
    {
        nomor: 3,
        pertanyaan: "Seorang fotografer ingin memotret kupu-kupu dengan detail sayap yang sangat jelas. Ia menggunakan lensa macro, f/8, 1/200s, dan flash ring. Berdasarkan materi jenis fotografi, genre ini termasuk kategori...",
        opsi: {
            A: "Fotografi landscape",
            B: "Fotografi wildlife sekaligus macro",
            C: "Fotografi produk",
            D: "Fotografi portrait",
            E: "Fotografi street"
        },
        jawaban: "B",
        pembahasan: "Kupu-kupu adalah satwa liar (wildlife), dan teknik memotretnya dari jarak sangat dekat dengan lensa macro masuk kategori macro. Gabungan keduanya = wildlife macro."
    },
    {
        nomor: 4,
        pertanyaan: "Perhatikan skenario berikut! Rina mendapat tugas memotret koleksi sepatu untuk katalog online. Ia harus memastikan warna sepatu akurat, detail terlihat jelas, dan konsisten di semua produk. Genre fotografi yang PALING TEPAT adalah...",
        opsi: {
            A: "Fotografi portrait",
            B: "Fotografi street",
            C: "Fotografi produk",
            D: "Fotografi landscape",
            E: "Fotografi arsitektur"
        },
        jawaban: "C",
        pembahasan: "Fotografi produk berfokus pada kontrol pencahayaan ketat (studio lighting), background netral, detail jelas, dan konsistensi — persis kebutuhan katalog e-commerce."
    },

    // ========== TYPE OF SHOT (3 soal) ==========
    {
        nomor: 5,
        pertanyaan: "Seorang fotografer memotret atlet panahan. Ia ingin menonjolkan ekspresi mata sang atlet saat membidik. Type of shot yang PALING TEPAT adalah...",
        opsi: {
            A: "Extreme Long Shot (ELS)",
            B: "Long Shot (LS)",
            C: "Medium Shot (MS)",
            D: "Close Up (CU) atau Extreme Close Up (ECU)",
            E: "Medium Long Shot (MLS)"
        },
        jawaban: "D",
        pembahasan: "Untuk menonjolkan ekspresi mata, dibutuhkan CU (close up) atau ECU (extreme close up). ECU bahkan bisa hanya menampilkan mata saja — sangat intens dan emosional."
    },
    {
        nomor: 6,
        pertanyaan: "Seorang fotografer ingin membuka cerita perjalanan wisata dengan memperlihatkan lokasi dan suasana tempat terlebih dahulu sebelum masuk ke detail subjek. Type of shot yang TEPAT untuk pembuka adalah...",
        opsi: {
            A: "Extreme Close Up (ECU)",
            B: "Close Up (CU)",
            C: "Medium Close Up (MCU)",
            D: "Extreme Long Shot (ELS) sebagai establishing shot",
            E: "Medium Shot (MS)"
        },
        jawaban: "D",
        pembahasan: "ELS (Extreme Long Shot) adalah establishing shot — memperlihatkan lingkungan & lokasi secara luas. Cocok sebagai pembuka cerita sebelum masuk ke shot yang lebih dekat."
    },
    {
        nomor: 7,
        pertanyaan: "Analisis pernyataan berikut! (1) MS menampilkan subjek dari kepala hingga pinggang. (2) MCU dari kepala hingga dada, menonjolkan ekspresi. (3) CU harus selalu menampilkan seluruh wajah. (4) ECU biasanya memerlukan lensa macro. Pernyataan yang BENAR tentang type of shot adalah...",
        opsi: {
            A: "(1), (2), dan (3)",
            B: "(1), (2), dan (4)",
            C: "(2), (3), dan (4)",
            D: "(1), (3), dan (4)",
            E: "Semua benar"
        },
        jawaban: "B",
        pembahasan: "(3) SALAH — CU (Close Up) tidak harus seluruh wajah; bisa hanya mata, bibir, atau tangan. Justru ECU biasanya hanya menampilkan bagian kecil seperti mata saja dan sering butuh lensa macro."
    },

    // ========== CAMERA ANGLE (3 soal) ==========
    {
        nomor: 8,
        pertanyaan: "Seorang sutradara ingin membuat adegan yang menunjukkan karakter utama sebagai sosok yang kuat, berwibawa, dan heroik. Camera angle yang PALING TEPAT adalah...",
        opsi: {
            A: "Bird's Eye View",
            B: "High Angle",
            C: "Eye Level",
            D: "Low Angle atau Worm's Eye",
            E: "Dutch Angle"
        },
        jawaban: "D",
        pembahasan: "Low Angle (kamera lebih rendah dari subjek) dan Worm's Eye (dari sangat bawah) membuat subjek tampak kuat, dominan, dan heroik. Bird's Eye & High Angle justru memberi kesan lemah."
    },
    {
        nomor: 9,
        pertanyaan: "Seorang fotografer diminta memotret wawancara antara presenter dan narasumber. Ia ingin pemirsa merasa 'ikut duduk' dalam percakapan tersebut. Camera angle yang TEPAT adalah...",
        opsi: {
            A: "Dutch Angle",
            B: "Over-the-Shoulder (OTS)",
            C: "Bird's Eye View",
            D: "Worm's Eye View",
            E: "Low Angle"
        },
        jawaban: "B",
        pembahasan: "OTS (Over-the-Shoulder) menempatkan kamera di belakang bahu salah satu subjek — menciptakan kesan dialogis & melibatkan pemirsa seolah ikut dalam percakapan. Standar untuk wawancara film."
    },
    {
        nomor: 10,
        pertanyaan: "Perhatikan pernyataan berikut! (1) Dutch angle menciptakan ketegangan & ketidaknyamanan. (2) POV membuat pemirsa masuk ke pengalaman subjek. (3) Eye level memberi kesan superior. (4) Bird's eye view membuat subjek tampak kecil. Pernyataan yang BENAR adalah...",
        opsi: {
            A: "(1), (2), dan (3)",
            B: "(1), (2), dan (4)",
            C: "(2), (3), dan (4)",
            D: "(1), (3), dan (4)",
            E: "Semua benar"
        },
        jawaban: "B",
        pembahasan: "(3) SALAH — Eye Level memberi kesan SETARA & NETRAL, bukan superior. Yang memberi kesan superior adalah HIGH ANGLE (kamera lebih tinggi dari subjek)."
    },

    // ========== KAMERA MIRRORLESS & BAGIAN (3 soal) ==========
    {
        nomor: 11,
        pertanyaan: "Seorang siswa berpendapat: 'Kamera DSLR selalu lebih baik dari mirrorless karena punya cermin.' Evaluasi kritis terhadap pendapat tersebut adalah...",
        opsi: {
            A: "Benar, cermin membuat gambar lebih tajam",
            B: "Salah, mirrorless justru lebih ringan, senyap, autofokus lebih cepat, dan sudah jadi standar industri",
            C: "Benar, DSLR lebih murah dari mirrorless",
            D: "Salah, DSLR tidak bisa digunakan untuk video",
            E: "Benar, semua fotografer pro masih pakai DSLR"
        },
        jawaban: "B",
        pembahasan: "DSLR & mirrorless punya kelebihan masing-masing, tapi mirrorless unggul di: ringan, senyap, autofokus cepat (AI eye-tracking), video 4K/8K. Standar industri saat ini cenderung ke mirrorless."
    },
    {
        nomor: 12,
        pertanyaan: "Seorang fotografer pemula melihat jendela bidik elektronik (EVF) yang menampilkan preview exposure, white balance, dan histogram secara real-time. Fitur ini disebut juga...",
        opsi: {
            A: "WYSIWYG (What You See Is What You Get)",
            B: "TTL (Through The Lens) metering",
            C: "HDR preview",
            D: "Live composite",
            E: "Auto exposure bracketing"
        },
        jawaban: "A",
        pembahasan: "EVF menampilkan WYSIWYG — apa yang dilihat di viewfinder = hasil foto nanti. Ini keunggulan mirrorless dibanding DSLR yang pakai viewfinder optik (apa yang dilihat belum tentu jadi hasilnya)."
    },
    {
        nomor: 13,
        pertanyaan: "Perhatikan pernyataan berikut! (1) Mode dial memilih M/A/S/P/Auto. (2) Command dial mengubah aperture/shutter/ISO. (3) Hot shoe untuk memasang lensa tambahan. (4) Slot memori menyimpan hasil foto. Pernyataan yang BENAR tentang bagian kamera adalah...",
        opsi: {
            A: "(1), (2), dan (3)",
            B: "(1), (2), dan (4)",
            C: "(2), (3), dan (4)",
            D: "(1), (3), dan (4)",
            E: "Semua benar"
        },
        jawaban: "B",
        pembahasan: "(3) SALAH — Hot shoe adalah konektor di atas kamera untuk memasang FLASH atau MIC, bukan lensa tambahan. Lensa dipasang di MOUNT LENSA. Pernyataan lain benar."
    },

    // ========== POLAROID & KAMERA 360 (2 soal) ==========
    {
        nomor: 14,
        pertanyaan: "Seorang content creator diminta membuat konten virtual tour sekolah yang bisa diputar 360° di YouTube VR. Kamera yang PALING TEPAT digunakan adalah...",
        opsi: {
            A: "Kamera DSLR full-frame",
            B: "Kamera Polaroid",
            C: "Kamera 360 (misal Insta360 atau Ricoh Theta)",
            D: "Smartphone dengan lensa tele",
            E: "Kamera mirrorless dengan lensa macro"
        },
        jawaban: "C",
        pembahasan: "Untuk virtual tour 360° yang immersive & VR-ready, dibutuhkan kamera 360 dengan 2+ lensa. Hasilnya berupa gambar equirectangular yang bisa diputar ke segala arah."
    },
    {
        nomor: 15,
        pertanyaan: "Seorang fotografer event pernikahan ingin memberikan souvenir fisik berupa foto instan kepada setiap tamu. Ia memilih Polaroid. Kelemahan utama dari pilihan ini yang perlu diantisipasi adalah...",
        opsi: {
            A: "Tidak bisa menghasilkan foto",
            B: "Biaya per foto cukup mahal (Rp 15-25 ribu) dan jumlah per pack terbatas",
            C: "Foto Polaroid tidak bisa dibagikan",
            D: "Polaroid tidak bisa digunakan malam hari",
            E: "Polaroid hanya untuk foto landscape"
        },
        jawaban: "B",
        pembahasan: "Kelemahan Polaroid: biaya per foto Rp 15-25 ribu (film), 1 pack hanya berisi 8-10 lembar. Untuk event besar, biaya bisa membengkak. Solusi: tentukan kuota atau gunakan sebagai 'bonus' untuk momen spesial."
    },

    // ========== ALAT PENDUKUNG (2 soal) ==========
    {
        nomor: 16,
        pertanyaan: "Seorang fotografer portrait ingin cahaya yang lembut, merata, dan tidak menghasilkan bayangan keras di wajah model. Alat pendukung yang PALING TEPAT adalah...",
        opsi: {
            A: "Tripod",
            B: "Lens hood",
            C: "Softbox",
            D: "Monopod",
            E: "Filter UV"
        },
        jawaban: "C",
        pembahasan: "Softbox adalah modifier cahaya yang menyebarkan cahaya jadi lembut & merata — ideal untuk portrait. Umbrella juga bisa, tapi softbox lebih terarah. Tripod/lenshood/monopod tidak mempengaruhi kualitas cahaya."
    },
    {
        nomor: 17,
        pertanyaan: "Seorang fotografer landscape ingin memotret air terjun dengan efek sutra halus di siang hari yang terang. Ia perlu menggunakan shutter speed lambat, tapi khawatir foto akan over-exposed. Alat yang PALING TEPAT digunakan adalah...",
        opsi: {
            A: "Softbox",
            B: "Filter ND (Neutral Density)",
            C: "Lens hood",
            D: "Flash eksternal",
            E: "Ring light"
        },
        jawaban: "B",
        pembahasan: "Filter ND (Neutral Density) berfungsi mengurangi cahaya masuk ke lensa tanpa mengubah warna — memungkinkan shutter speed lambat di siang terang. Sangat berguna untuk long exposure air terjun, light trails, dll."
    },

    // ========== SEGITIGA EXPOSURE (2 soal) ==========
    {
        nomor: 18,
        pertanyaan: "Seorang fotografer memotret konser musik di gedung gelap. Ia memakai ISO 6400 agar tidak blur, tapi hasil foto tampak berbintik (noise) & warna kusam. Evaluasi PALING TEPAT adalah...",
        opsi: {
            A: "Keputusan sudah tepat, ISO tinggi selalu bagus",
            B: "Ia seharusnya memakai ISO 100 di kondisi gelap",
            C: "Ia sebaiknya menurunkan ISO dan menambah cahaya (flash) atau memperlambat shutter speed",
            D: "Ia seharusnya menaikkan shutter speed lebih cepat",
            E: "Ia harus mengganti kamera"
        },
        jawaban: "C",
        pembahasan: "ISO tinggi menimbulkan noise. Solusi paling tepat: turunkan ISO + tambahkan cahaya eksternal (flash) atau perlambat shutter speed (dengan konsekuensi subjek bisa blur). Opsi B tidak realistis di kondisi gelap."
    },
    {
        nomor: 19,
        pertanyaan: "Seorang fotografer portrait ingin latar belakang blur (bokeh halus) dengan subjek fokus tajam. Kombinasi pengaturan yang TEPAT adalah...",
        opsi: {
            A: "f/16, ISO 100, 1/125s",
            B: "f/1.8, ISO 200, 1/500s",
            C: "f/22, ISO 100, 1/60s",
            D: "f/8, ISO 400, 1/250s",
            E: "f/11, ISO 800, 1/1000s"
        },
        jawaban: "B",
        pembahasan: "Untuk background blur (DOF dangkal), gunakan aperture BESAR = angka f KECIL = f/1.8 atau f/2.8. Opsi lain pakai f/8 ke atas → DOF dalam → background tidak blur."
    },

    // ========== KOMPOSISI (1 soal) ==========
    {
        nomor: 20,
        pertanyaan: "Seorang fotografer memotret jalan raya dari sudut rendah. Garis jalan membentang dari bawah frame menuju ke titik hilang di kejauhan — mata pemirsa otomatis mengikuti garis tersebut menuju horizon. Teknik komposisi ini disebut...",
        opsi: {
            A: "Rule of Thirds",
            B: "Framing",
            C: "Leading Lines",
            D: "Symmetry",
            E: "Negative Space"
        },
        jawaban: "C",
        pembahasan: "Leading Lines = garis-garis alami (jalan, pagar, sungai, rel) yang menuntun mata pemirsa menuju objek utama. Rule of Thirds = pembagian 9 grid; Framing = bingkai; Symmetry = simetri; Negative Space = ruang kosong."
    }
];
const soalEssay = [
    {
        nomor: 21,
        pertanyaan: "Jelaskan konsep Segitiga Exposure dan bagaimana ketiga elemennya (aperture, shutter speed, ISO) saling memengaruhi untuk menghasilkan foto yang tepat exposure! Berikan contoh konkret kombinasi pengaturan untuk memotret portrait dengan background blur!",
        keywords: ["aperture", "shutter", "iso", "cahaya", "bukaan", "rana", "sensor", "kompensasi", "seimbang", "exposure", "bokeh", "background", "f/1.8", "f/2.8"],
        minKata: 40,
        poinMax: 4
    },
    {
        nomor: 22,
        pertanyaan: "Sebutkan dan jelaskan minimal 3 (tiga) Type of Shot yang kamu ketahui! Untuk setiap type of shot, jelaskan fungsinya dan berikan contoh situasi penggunaannya dalam fotografi!",
        keywords: ["extreme long shot", "long shot", "medium", "close up", "establishing", "els", "cu", "ecu", "ms", "mcu", "detail", "emosi"],
        minKata: 35,
        poinMax: 4
    },
    {
        nomor: 23,
        pertanyaan: "Jelaskan pengaruh Camera Angle terhadap kesan visual subjek! Sebutkan minimal 4 sudut kamera dan jelaskan kesan yang ditimbulkan untuk masing-masing sudut!",
        keywords: ["low angle", "high angle", "bird", "worm", "dutch", "eye level", "pov", "ots", "kuat", "lemah", "netral", "heroik", "dialogis"],
        minKata: 35,
        poinMax: 4
    },
    {
        nomor: 24,
        pertanyaan: "Seorang fotografer memotret konser musik di malam hari dengan pencahayaan minim. Menurutmu, pengaturan kamera seperti apa yang paling tepat? Jelaskan alasan dari setiap pengaturan (aperture, shutter speed, ISO) yang kamu pilih!",
        keywords: ["iso", "tinggi", "aperture", "besar", "f kecil", "shutter", "flash", "noise", "1/", "lensa", "monopod", "tripod"],
        minKata: 40,
        poinMax: 4
    },
    {
        nomor: 25,
        pertanyaan: "Jelaskan perbedaan utama antara kamera DSLR dan kamera Mirrorless! Sebutkan minimal 2 kelebihan masing-masing dan berikan rekomendasi untuk pemula yang ingin belajar fotografi dengan budget terbatas!",
        keywords: ["cermin", "evf", "optik", "ringan", "senyap", "autofokus", "baterai", "lensa", "video", "pemula", "budget"],
        minKata: 35,
        poinMax: 4
    },
    {
        nomor: 26,
        pertanyaan: "Sebutkan dan jelaskan minimal 5 (lima) bagian kamera mirrorless beserta fungsinya! Kelompokkan ke dalam kategori yang sesuai (Body & Kontrol, Optik & Sensor, Layar, Konektivitas, atau Daya)!",
        keywords: ["lensa", "sensor", "evf", "lcd", "hot shoe", "shutter", "mode dial", "mount", "baterai", "memori", "grip", "fungsi"],
        minKata: 40,
        poinMax: 4
    },
    {
        nomor: 27,
        pertanyaan: "Bandingkan kamera Polaroid dan kamera 360! Sebutkan minimal 3 perbedaan utama, kelebihan, dan kekurangan masing-masing! Dalam situasi apa kamu akan merekomendasikan masing-masing kamera?",
        keywords: ["polaroid", "360", "instan", "digital", "fisik", "vr", "mahal", "immersive", "equirectangular", "kenang-kenangan", "virtual tour"],
        minKata: 35,
        poinMax: 4
    },
    {
        nomor: 28,
        pertanyaan: "Jelaskan minimal 4 (empat) alat pendukung fotografi beserta fungsinya! Untuk setiap alat, jelaskan situasi penggunaan yang paling tepat dan tips praktis dalam menggunakannya!",
        keywords: ["softbox", "tripod", "flash", "reflektor", "lens hood", "filter", "gimbal", "monopod", "ring light", "cahaya", "kestabilan"],
        minKata: 40,
        poinMax: 4
    },
    {
        nomor: 29,
        pertanyaan: "Seorang klien meminta Anda memotret foto produk tas sekolah untuk katalog e-commerce. Rancanglah rencana pemotretan yang mencakup: (1) jenis fotografi, (2) pengaturan kamera, (3) alat pendukung, (4) type of shot, dan (5) composition/angle yang akan digunakan! Jelaskan alasan setiap pilihan!",
        keywords: ["produk", "f/8", "f/11", "softbox", "background", "tripod", "medium shot", "close up", "eye level", "komposisi", "cahaya", "studio"],
        minKata: 50,
        poinMax: 4
    },
    {
        nomor: 30,
        pertanyaan: "Sebagai calon desainer komunikasi visual, jelaskan bagaimana pemahaman tentang fotografi (jenis foto, type of shot, camera angle, dan komposisi) dapat membantu Anda dalam membuat karya visual yang efektif untuk iklan atau media sosial! Berikan contoh konkret!",
        keywords: ["dkv", "desain", "iklan", "media sosial", "komposisi", "angle", "type of shot", "komunikasi", "pesan", "visual", "storytelling", "target audiens"],
        minKata: 45,
        poinMax: 4
    }
];
// const soalEssay = [
//     {
//         nomor: 11,
//         pertanyaan: "Jelaskan konsep dasar Segitiga Exposure dan bagaimana ketiga elemennya (aperture, shutter speed, ISO) saling memengaruhi untuk menghasilkan foto yang tepat exposure!",
//         keywords: ["aperture", "shutter", "iso", "cahaya", "bukaan", "rana", "sensor", "kompensasi", "seimbang", "exposure"],
//         minKata: 30,
//         poinMax: 8
//     },
//     {
//         nomor: 12,
//         pertanyaan: "Sebutkan dan jelaskan minimal 3 (tiga) teknik komposisi fotografi yang kamu ketahui beserta contoh penerapannya!",
//         keywords: ["rule of thirds", "leading lines", "framing", "symmetry", "negative space", "golden ratio", "komposisi", "contoh"],
//         minKata: 25,
//         poinMax: 8
//     },
//     {
//         nomor: 13,
//         pertanyaan: "Seorang fotografer memotret konser musik dalam kondisi pencahayaan gelap. Menurutmu, pengaturan kamera seperti apa yang paling tepat digunakan? Jelaskan alasan dari setiap pengaturan yang kamu pilih!",
//         keywords: ["iso", "tinggi", "aperture", "besar", "f kecil", "shutter", "1/", "flash", "noise", "tripod", "lensa"],
//         minKata: 30,
//         poinMax: 8
//     },
//     {
//         nomor: 14,
//         pertanyaan: "Apa perbedaan utama antara fotografi portrait, fotografi landscape, dan fotografi still life/product? Jelaskan ciri khas masing-masing dan sebutkan contoh pengaturan kamera yang sesuai!",
//         keywords: ["portrait", "landscape", "produk", "still life", "dof", "aperture", "lensa", "ciri", "contoh"],
//         minKata: 30,
//         poinMax: 8
//     },
//     {
//         nomor: 15,
//         pertanyaan: "Menurutmu, mengapa fotografer profesional sering menggunakan ISO rendah (100-200) meskipun kondisi pencahayaan kurang ideal? Jelaskan hubungannya dengan kualitas gambar dan strategi apa yang bisa digunakan untuk mengatasinya!",
//         keywords: ["iso", "rendah", "noise", "kualitas", "tajam", "bersih", "shutter", "aperture", "cahaya", "tripod", "lighting", "flash"],
//         minKata: 25,
//         poinMax: 8
//     }
// ];

const TOTAL_WAKTU_MENIT = 45;

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

    const total = 30;
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

// function hitungSkorPG() {
//     let benar = 0;
//     soalPG.forEach(soal => {
//         if (evaluasiState.jawabanPG[soal.nomor] === soal.jawaban) benar++;
//     });
//     return { benar, skor: benar * 6 }; // 10 soal × 6 = 60
// }
function hitungSkorPG() {
    let benar = 0;
    soalPG.forEach(soal => {
        if (evaluasiState.jawabanPG[soal.nomor] === soal.jawaban) benar++;
    });
    return { benar, skor: benar * 3 }; // 20 soal × 3 = 60
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