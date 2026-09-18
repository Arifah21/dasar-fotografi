// js/dashboard.js
import { supabase } from './supabase-client.js';

// ==================== AUTH (Supabase Auth) ====================

async function requireAuth() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
        window.location.href = 'login.html';
        return null;
    }
    return session.user;
}

async function logout() {
    if (!confirm('Yakin ingin logout dari dashboard?')) return;
    try {
        await supabase.auth.signOut();
    } catch (err) {
        console.warn('Logout error:', err);
    }
    window.location.href = 'login.html';
}

// ==================== STATE ====================

let state = {
    lkpdData: [],
    evalData: [],
    filter: { search: '', kelas: '', tanggal: '' }
};

// ==================== INIT DASHBOARD ====================

async function initDashboard() {
    const user = await requireAuth();
    if (!user) return;

    const emailDisplay = document.querySelector('.header-subtitle');
    if (emailDisplay) {
        emailDisplay.textContent = `Login sebagai: ${user.email}`;
    }

    setupTabs();
    setupFilters();

    document.getElementById('btn-refresh')?.addEventListener('click', loadAllData);
    document.getElementById('btn-export-csv')?.addEventListener('click', exportCSV);
    document.getElementById('btn-logout')?.addEventListener('click', logout);

    loadAllData();
}

document.addEventListener('DOMContentLoaded', initDashboard);

// ====================================================================
// ==================== LOAD DATA DARI SUPABASE ======================
// ====================================================================

async function loadAllData() {
    showToast('Memuat data dari server...', 'info');
    await Promise.all([loadLKPD(), loadEvaluasi()]);
    updateStats();
    renderLKPDTable();
    renderEvaluasiTable();
    renderAnalitik();
    populateKelasFilter();
    showToast('✅ Data berhasil dimuat', 'success');
}

async function loadLKPD() {
    try {
        const { data, error } = await supabase
            .from('lkpd_submissions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        state.lkpdData = data || [];
    } catch (err) {
        console.error('Error load LKPD:', err);
        state.lkpdData = [];
    }
}

async function loadEvaluasi() {
    try {
        const { data, error } = await supabase
            .from('quiz_results')
            .select('*')
            .eq('quiz_type', 'evaluasi')
            .order('created_at', { ascending: false });

        if (error) throw error;
        state.evalData = data || [];
    } catch (err) {
        console.error('Error load Evaluasi:', err);
        state.evalData = [];
    }
}

// ====================================================================
// ==================== STATISTIK OVERVIEW ===========================
// ====================================================================

function updateStats() {
    const totalLKPD = state.lkpdData.length;
    const totalEval = state.evalData.length;
    const scores = state.evalData.map(d => d.score || 0);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const max = scores.length ? Math.max(...scores) : 0;

    document.getElementById('stat-lkpd').textContent = totalLKPD;
    document.getElementById('stat-eval').textContent = totalEval;
    document.getElementById('stat-avg').textContent = avg;
    document.getElementById('stat-max').textContent = max;
}

// ====================================================================
// ==================== FILTER =======================================
// ====================================================================

function getFilteredData(data) {
    return data.filter(item => {
        if (state.filter.search) {
            const search = state.filter.search.toLowerCase();
            if (!item.student_name.toLowerCase().includes(search)) return false;
        }
        if (state.filter.kelas && item.student_class !== state.filter.kelas) return false;
        if (state.filter.tanggal) {
            const itemDate = new Date(item.created_at).toISOString().split('T')[0];
            if (itemDate !== state.filter.tanggal) return false;
        }
        return true;
    });
}

function setupFilters() {
    document.getElementById('filter-search')?.addEventListener('input', (e) => {
        state.filter.search = e.target.value;
        applyFilter();
    });
    document.getElementById('filter-kelas')?.addEventListener('change', (e) => {
        state.filter.kelas = e.target.value;
        applyFilter();
    });
    document.getElementById('filter-tanggal')?.addEventListener('change', (e) => {
        state.filter.tanggal = e.target.value;
        applyFilter();
    });
    document.getElementById('btn-reset-filter')?.addEventListener('click', () => {
        state.filter = { search: '', kelas: '', tanggal: '' };
        document.getElementById('filter-search').value = '';
        document.getElementById('filter-kelas').value = '';
        document.getElementById('filter-tanggal').value = '';
        applyFilter();
    });
}

function applyFilter() {
    renderLKPDTable();
    renderEvaluasiTable();
    updateFilterCount();
}

function updateFilterCount() {
    const lkpdCount = getFilteredData(state.lkpdData).length;
    const evalCount = getFilteredData(state.evalData).length;
    const total = lkpdCount + evalCount;
    const el = document.getElementById('filter-count');
    if (el) {
        el.textContent = total > 0
            ? `Menampilkan ${lkpdCount} LKPD • ${evalCount} Evaluasi`
            : '';
    }
}

function populateKelasFilter() {
    const kelasSet = new Set();
    [...state.lkpdData, ...state.evalData].forEach(item => {
        if (item.student_class) kelasSet.add(item.student_class);
    });
    const select = document.getElementById('filter-kelas');
    if (!select) return;
    while (select.options.length > 1) select.remove(1);
    [...kelasSet].sort().forEach(kelas => {
        const opt = document.createElement('option');
        opt.value = kelas;
        opt.textContent = kelas;
        select.appendChild(opt);
    });
}

// ====================================================================
// ==================== RENDER TABEL LKPD ============================
// ====================================================================

function renderLKPDTable() {
    const tbody = document.getElementById('lkpd-tbody');
    const data = getFilteredData(state.lkpdData);

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="6" class="empty-state">
                <span class="empty-state-icon">📭</span>
                Belum ada LKPD yang dikirim
            </td></tr>`;
        return;
    }

    tbody.innerHTML = data.map((item, idx) => {
        const jawaban = item.activity_data?.jawaban || {};
        const jumlahJawaban = Object.values(jawaban).filter(v => v && v.trim()).length;
        const totalField = Object.keys(jawaban).length || 1;
        return `
            <tr>
                <td>${idx + 1}</td>
                <td><strong>${escapeHtml(item.student_name)}</strong></td>
                <td>${escapeHtml(item.student_class)}</td>
                <td>${formatDate(item.created_at)}</td>
                <td>${jumlahJawaban} / ${totalField} terisi</td>
                <td>
                    <button class="btn-view-detail" onclick="showLKPDDetail(${item.id})">
                        👁️ Lihat Detail
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// ====================================================================
// ==================== RENDER TABEL EVALUASI ========================
// ====================================================================

function renderEvaluasiTable() {
    const tbody = document.getElementById('evaluasi-tbody');
    const data = getFilteredData(state.evalData);

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="9" class="empty-state">
                <span class="empty-state-icon">📭</span>
                Belum ada evaluasi yang dikerjakan
            </td></tr>`;
        return;
    }

    tbody.innerHTML = data.map((item, idx) => {
        const answers = item.answers || {};
        const skorPG = answers.skorPG ?? '—';
        const skorEssay = answers.skorEssay ?? '—';
        const predikat = answers.predikat || tentukanPredikat(item.score).huruf;
        return `
            <tr>
                <td>${idx + 1}</td>
                <td><strong>${escapeHtml(item.student_name)}</strong></td>
                <td>${escapeHtml(item.student_class)}</td>
                <td class="skor-cell">${skorPG}</td>
                <td class="skor-cell">${skorEssay}</td>
                <td class="skor-cell total">${item.score}</td>
                <td><span class="badge badge-${predikat}">${predikat}</span></td>
                <td>${formatDate(item.created_at)}</td>
                <td>
                    <button class="btn-view-detail" onclick="showEvaluasiDetail(${item.id})">
                        👁️ Lihat
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// ====================================================================
// ==================== ANALITIK =====================================
// ====================================================================

function renderAnalitik() {
    renderChartPredikat();
    renderChartKelas();
    renderChartTop();
    renderStatsDetail();
}

function renderChartPredikat() {
    const container = document.getElementById('chart-predikat');
    const counts = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    state.evalData.forEach(item => {
        const predikat = item.answers?.predikat || tentukanPredikat(item.score).huruf;
        if (counts[predikat] !== undefined) counts[predikat]++;
    });
    const total = state.evalData.length || 1;
    const colors = {
        A: 'linear-gradient(90deg, #2ecc71, #27ae60)',
        B: 'linear-gradient(90deg, #3498db, #2980b9)',
        C: 'linear-gradient(90deg, #f1c40f, #f39c12)',
        D: 'linear-gradient(90deg, #e67e22, #d35400)',
        E: 'linear-gradient(90deg, #e74c3c, #c0392b)'
    };
    const labels = { A: 'A (90-100)', B: 'B (80-89)', C: 'C (70-79)', D: 'D (60-69)', E: 'E (<60)' };

    if (state.evalData.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#adb5bd;">Belum ada data</p>';
        return;
    }

    container.innerHTML = ['A', 'B', 'C', 'D', 'E'].map(k => {
        const pct = (counts[k] / total) * 100;
        return `
            <div class="chart-bar-item">
                <span class="chart-bar-label">${labels[k]}</span>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: ${Math.max(pct, 5)}%; background: ${colors[k]};">
                        ${counts[k] > 0 ? counts[k] : ''}
                    </div>
                </div>
                <span class="chart-bar-value">${pct.toFixed(0)}%</span>
            </div>
        `;
    }).join('');
}

function renderChartKelas() {
    const container = document.getElementById('chart-kelas');
    const byKelas = {};
    state.evalData.forEach(item => {
        if (!byKelas[item.student_class]) {
            byKelas[item.student_class] = { total: 0, count: 0 };
        }
        byKelas[item.student_class].total += item.score;
        byKelas[item.student_class].count++;
    });
    const entries = Object.entries(byKelas).map(([kelas, data]) => ({
        kelas,
        avg: Math.round(data.total / data.count),
        count: data.count
    })).sort((a, b) => b.avg - a.avg);

    if (entries.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#adb5bd;">Belum ada data</p>';
        return;
    }
    const maxAvg = Math.max(...entries.map(e => e.avg), 100);
    container.innerHTML = entries.map(e => {
        const pct = (e.avg / maxAvg) * 100;
        const color = e.avg >= 80 ? 'linear-gradient(90deg, #2ecc71, #27ae60)' :
                      e.avg >= 70 ? 'linear-gradient(90deg, #3498db, #2980b9)' :
                      e.avg >= 60 ? 'linear-gradient(90deg, #f1c40f, #f39c12)' :
                                    'linear-gradient(90deg, #e74c3c, #c0392b)';
        return `
            <div class="chart-bar-item">
                <span class="chart-bar-label">${escapeHtml(e.kelas)}</span>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="width: ${pct}%; background: ${color};">
                        ${e.avg}
                    </div>
                </div>
                <span class="chart-bar-value">${e.count} siswa</span>
            </div>
        `;
    }).join('');
}

function renderChartTop() {
    const container = document.getElementById('chart-top');
    const top = [...state.evalData].sort((a, b) => b.score - a.score).slice(0, 5);
    if (top.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#adb5bd;">Belum ada data</p>';
        return;
    }
    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    container.innerHTML = top.map((item, i) => `
        <div class="chart-bar-item">
            <span class="chart-bar-label" style="font-size:1.1rem;">${medals[i]}</span>
            <div style="flex:1; min-width:0;">
                <div style="font-weight:700; color:#2C3E50; font-size:0.9rem;">${escapeHtml(item.student_name)}</div>
                <div style="font-size:0.75rem; color:#6c757d;">${escapeHtml(item.student_class)}</div>
            </div>
            <span class="chart-bar-value" style="color:#E67E22; font-size:1.05rem;">${item.score}</span>
        </div>
    `).join('');
}

function renderStatsDetail() {
    const container = document.getElementById('stats-detail');
    const scores = state.evalData.map(d => d.score);
    if (scores.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#adb5bd;">Belum ada data</p>';
        return;
    }
    const total = scores.length;
    const sum = scores.reduce((a, b) => a + b, 0);
    const avg = sum / total;
    const sorted = [...scores].sort((a, b) => a - b);
    const median = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const lulus = scores.filter(s => s >= 70).length;
    const persenLulus = (lulus / total) * 100;

    container.innerHTML = `
        <div class="detail-row"><span class="label">Total Siswa Dinilai</span><span class="value">${total}</span></div>
        <div class="detail-row"><span class="label">Rata-rata</span><span class="value">${avg.toFixed(1)}</span></div>
        <div class="detail-row"><span class="label">Median</span><span class="value">${median}</span></div>
        <div class="detail-row"><span class="label">Nilai Tertinggi</span><span class="value" style="color:#2ecc71;">${max}</span></div>
        <div class="detail-row"><span class="label">Nilai Terendah</span><span class="value" style="color:#e74c3c;">${min}</span></div>
        <div class="detail-row"><span class="label">Tuntas (≥70)</span><span class="value">${lulus} siswa (${persenLulus.toFixed(0)}%)</span></div>
        <div class="detail-row"><span class="label">Belum Tuntas (<70)</span><span class="value" style="color:#e74c3c;">${total - lulus} siswa</span></div>
    `;
}

// ====================================================================
// ==================== MODAL DETAIL LKPD ============================
// ====================================================================

window.showLKPDDetail = function(id) {
    const item = state.lkpdData.find(d => d.id === id);
    if (!item) return;

    const jawaban = item.activity_data?.jawaban || {};
    const waktuKirim = item.activity_data?.waktu_kirim || item.created_at;

    const aktivitas1Fields = {};
    const aktivitas2Fields = {};
    const aktivitas3Fields = {};
    let kesimpulan = '';

    Object.entries(jawaban).forEach(([key, val]) => {
        if (key.startsWith('akt1-')) aktivitas1Fields[key] = val;
        else if (key.startsWith('akt2-')) aktivitas2Fields[key] = val;
        else if (key.startsWith('akt3-')) aktivitas3Fields[key] = val;
        else if (key === 'kesimpulan') kesimpulan = val;
    });

    const renderFields = (fields) => {
        if (Object.keys(fields).length === 0) return '<p style="color:#adb5bd; font-style:italic;">Tidak ada data</p>';
        return Object.entries(fields).map(([key, val]) => `
            <div class="detail-field">
                <div class="detail-field-label">${formatFieldLabel(key)}</div>
                <div class="detail-field-value ${!val || !val.trim() ? 'empty' : ''}">
                    ${val && val.trim() ? escapeHtml(val).replace(/\n/g, '<br>') : '(kosong)'}
                </div>
            </div>
        `).join('');
    };

    document.getElementById('detail-modal-body').innerHTML = `
        <div class="detail-header">
            <h2>📝 Detail LKPD</h2>
            <p><strong>${escapeHtml(item.student_name)}</strong> • ${escapeHtml(item.student_class)}</p>
            <p style="font-size:0.8rem;">Dikirim: ${formatDate(waktuKirim)}</p>
        </div>
        <div class="detail-section">
            <h3>🎯 Aktivitas 1 — Eksplorasi Segitiga Exposure</h3>
            ${renderFields(aktivitas1Fields)}
        </div>
        <div class="detail-section">
            <h3>🖼️ Aktivitas 2 — Analisis Jenis Fotografi</h3>
            ${renderFields(aktivitas2Fields)}
        </div>
        <div class="detail-section">
            <h3>🎨 Aktivitas 3 — Penerapan Komposisi</h3>
            ${renderFields(aktivitas3Fields)}
        </div>
        ${kesimpulan ? `
            <div class="detail-section">
                <h3>📌 Kesimpulan</h3>
                <div class="detail-field">
                    <div class="detail-field-value">${escapeHtml(kesimpulan).replace(/\n/g, '<br>')}</div>
                </div>
            </div>
        ` : ''}
    `;
    document.getElementById('detail-modal').classList.add('active');
};

function formatFieldLabel(key) {
    const parts = key.split('-');
    if (parts.length < 2) return key;
    const aktivitas = parts[0].replace('akt', 'Aktivitas ');
    const rest = parts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' - ');
    return `${aktivitas} — ${rest}`;
}

// ====================================================================
// ==================== MODAL DETAIL EVALUASI ========================
// ====================================================================

window.showEvaluasiDetail = function(id) {
    const item = state.evalData.find(d => d.id === id);
    if (!item) return;

    const answers = item.answers || {};
    const skorPG = answers.skorPG ?? 0;
    const skorEssay = answers.skorEssay ?? 0;
    const predikat = answers.predikat || tentukanPredikat(item.score).huruf;
    const durasi = answers.durasiDetik ? formatDurasi(answers.durasiDetik) : '—';
    const detailEssay = answers.detailEssay || [];

    const soalPG = window._soalPG || [];
    let pgDetail = '';
    if (soalPG.length && answers.jawabanPG) {
        pgDetail = soalPG.map(soal => {
            const userAns = answers.jawabanPG[soal.nomor] || '—';
            const benar = userAns === soal.jawaban;
            return `
                <div class="detail-field">
                    <div class="detail-field-label">Soal ${soal.nomor} — ${benar ? '✅ Benar' : '❌ Salah'}</div>
                    <div class="detail-field-value">
                        Jawaban siswa: <strong>${userAns}</strong>
                        ${!benar ? ` | Jawaban benar: <strong style="color:#2ecc71;">${soal.jawaban}</strong>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    } else {
        pgDetail = '<p style="color:#adb5bd; font-style:italic;">Data soal tidak tersedia</p>';
    }

    let essayDetail = '';
    if (detailEssay.length) {
        essayDetail = detailEssay.map(d => `
            <div class="detail-field">
                <div class="detail-field-label">
                    Soal ${d.nomor} — ${d.poin}/4 poin
                    <span style="color:#6c757d; font-weight:400;">
                        (${d.jumlahKata} kata, min. ${d.minKata})
                    </span>
                </div>
                <div class="detail-field-value">
                    ${d.keywordDitemukan?.length
                        ? `🔑 Kata kunci ditemukan: <em>${d.keywordDitemukan.join(', ')}</em>`
                        : '⚠️ Tidak ada kata kunci yang ditemukan'}
                </div>
            </div>
        `).join('');
    } else {
        essayDetail = '<p style="color:#adb5bd; font-style:italic;">Data esai tidak tersedia</p>';
    }

    document.getElementById('detail-modal-body').innerHTML = `
        <div class="detail-header">
            <h2>✅ Detail Evaluasi</h2>
            <p><strong>${escapeHtml(item.student_name)}</strong> • ${escapeHtml(item.student_class)}</p>
            <p style="font-size:0.8rem;">Dikerjakan: ${formatDate(item.created_at)} • Durasi: ${durasi}</p>
        </div>
        <div class="detail-section">
            <h3>📊 Ringkasan Skor</h3>
            <div class="detail-row">
                <span class="label">Skor Pilihan Ganda</span>
                <span class="value">${skorPG} / 60</span>
            </div>
            <div class="detail-row">
                <span class="label">Skor Esai</span>
                <span class="value">${skorEssay} / 40</span>
            </div>
            <div class="detail-row">
                <span class="label">Total Nilai</span>
                <span class="value" style="color:#E67E22; font-size:1.1rem;">${item.score} / 100</span>
            </div>
            <div class="detail-row">
                <span class="label">Predikat</span>
                <span class="value"><span class="badge badge-${predikat}">${predikat}</span></span>
            </div>
        </div>
        <div class="detail-section">
            <h3>📝 Jawaban Pilihan Ganda</h3>
            ${pgDetail}
        </div>
        <div class="detail-section">
            <h3>✍️ Jawaban Esai (Auto-Scoring)</h3>
            ${essayDetail}
        </div>
    `;
    document.getElementById('detail-modal').classList.add('active');
};

window.closeDetailModal = function() {
    document.getElementById('detail-modal').classList.remove('active');
};

document.addEventListener('click', (e) => {
    if (e.target.id === 'detail-modal') closeDetailModal();
});

// ====================================================================
// ==================== EXPORT CSV ===================================
// ====================================================================

function exportCSV() {
    if (state.evalData.length === 0 && state.lkpdData.length === 0) {
        showToast('Tidak ada data untuk di-export', 'error');
        return;
    }

    let csv = '=== DATA EVALUASI ===\n';
    csv += 'No,Nama,Kelas,Skor PG,Skor Esai,Total,Predikat,Tanggal\n';
    state.evalData.forEach((item, i) => {
        const a = item.answers || {};
        const predikat = a.predikat || tentukanPredikat(item.score).huruf;
        csv += `${i + 1},"${item.student_name}","${item.student_class}",${a.skorPG || 0},${a.skorEssay || 0},${item.score},${predikat},"${formatDate(item.created_at)}"\n`;
    });

    csv += '\n\n=== DATA LKPD ===\n';
    csv += 'No,Nama,Kelas,Tanggal Kirim,Jumlah Jawaban Terisi\n';
    state.lkpdData.forEach((item, i) => {
        const jawaban = item.activity_data?.jawaban || {};
        const jumlah = Object.values(jawaban).filter(v => v && v.trim()).length;
        csv += `${i + 1},"${item.student_name}","${item.student_class}","${formatDate(item.created_at)}",${jumlah}\n`;
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    link.href = url;
    link.download = `Data_DasarFotografi_${timestamp}.csv`;
    link.click();
    URL.revokeObjectURL(url);

    showToast('✅ File CSV berhasil diunduh', 'success');
}

// ====================================================================
// ==================== HELPER =======================================
// ====================================================================

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatDate(iso) {
    if (!iso) return '—';
    try {
        const d = new Date(iso);
        return d.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return iso;
    }
}

function formatDurasi(detik) {
    const m = Math.floor(detik / 60);
    const s = detik % 60;
    return `${m}m ${s}s`;
}

function tentukanPredikat(skor) {
    if (skor >= 90) return { huruf: 'A' };
    if (skor >= 80) return { huruf: 'B' };
    if (skor >= 70) return { huruf: 'C' };
    if (skor >= 60) return { huruf: 'D' };
    return { huruf: 'E' };
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `dash-toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ====================================================================
// ==================== TABS ==========================================
// ====================================================================

function setupTabs() {
    document.querySelectorAll('.dash-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.dash;
            document.querySelectorAll('.dash-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.dash-content').forEach(c => c.classList.remove('active'));
            document.getElementById(`dash-${target}`).classList.add('active');
        });
    });
}