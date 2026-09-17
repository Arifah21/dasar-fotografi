// js/lkpd.js
import { supabase } from './supabase-client.js';

// ==================== SIMPAN DATA LKPD KE LOCALSTORAGE ====================
const STORAGE_KEY = 'lkpd_dasar_fotografi';

// Simpan otomatis saat input berubah
function autoSave() {
    const data = collectFormData();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Kumpulkan semua data dari form
function collectFormData() {
    const data = {
        nama: document.getElementById('lkpd-nama')?.value || '',
        kelas: document.getElementById('lkpd-kelas')?.value || '',
        tanggal: document.getElementById('lkpd-tanggal')?.value || '',
        fields: {}
    };
    
    // Kumpulkan semua input dengan data-field
    document.querySelectorAll('[data-field]').forEach(el => {
        data.fields[el.dataset.field] = el.value || '';
    });
    
    return data;
}

// Muat data dari localStorage saat halaman dibuka
function loadSavedData() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    
    try {
        const data = JSON.parse(saved);
        
        if (data.nama) document.getElementById('lkpd-nama').value = data.nama;
        if (data.kelas) document.getElementById('lkpd-kelas').value = data.kelas;
        if (data.tanggal) document.getElementById('lkpd-tanggal').value = data.tanggal;
        
        Object.entries(data.fields || {}).forEach(([key, value]) => {
            const el = document.querySelector(`[data-field="${key}"]`);
            if (el) el.value = value;
        });
    } catch (e) {
        console.warn('Gagal memuat data tersimpan:', e);
    }
}

// Pasang auto-save ke semua input
function setupAutoSave() {
    document.querySelectorAll('#lkpd input, #lkpd textarea').forEach(el => {
        el.addEventListener('input', autoSave);
    });
}

// ==================== VALIDASI FORM ====================
function validateForm() {
    const nama = document.getElementById('lkpd-nama').value.trim();
    const kelas = document.getElementById('lkpd-kelas').value.trim();
    
    if (!nama) {
        showToast('Nama wajib diisi!', 'error');
        document.getElementById('lkpd-nama').focus();
        return false;
    }
    
    if (!kelas) {
        showToast('Kelas wajib diisi!', 'error');
        document.getElementById('lkpd-kelas').focus();
        return false;
    }
    
    return true;
}

// ==================== TOMBOL SAVE AS PDF ====================
async function saveAsPDF() {
    if (!validateForm()) return;
    
    showLoading('Membuat PDF...');
    
    try {
        // Dynamic import html2pdf
        const html2pdf = (await import('https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js')).default;
        
        // Siapkan elemen yang akan dicetak
        const element = document.getElementById('lkpd');
        
        // Sembunyikan tombol aksi & loading saat cetak
        const actions = element.querySelector('.lkpd-actions');
        const originalActionsDisplay = actions.style.display;
        actions.style.display = 'none';
        
        // Nama file
        const nama = document.getElementById('lkpd-nama').value.trim().replace(/\s+/g, '_');
        const kelas = document.getElementById('lkpd-kelas').value.trim().replace(/\s+/g, '_');
        const filename = `LKPD_DasarFotografi_${kelas}_${nama}.pdf`;
        
        // Opsi PDF
        const options = {
            margin: [10, 10, 10, 10],
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2, 
                useCORS: true,
                backgroundColor: '#ffffff'
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' 
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };
        
        // Generate PDF
        await html2pdf().set(options).from(element).save();
        
        // Kembalikan tombol
        actions.style.display = originalActionsDisplay;
        
        hideLoading();
        showToast('✅ PDF berhasil disimpan!', 'success');
    } catch (error) {
        console.error('Error PDF:', error);
        hideLoading();
        showToast('❌ Gagal membuat PDF: ' + error.message, 'error');
    }
}

// ==================== TOMBOL KIRIM KE SUPABASE ====================
async function kirimKeGuru() {
    if (!validateForm()) return;
    
    const konfirmasi = confirm('Apakah kamu yakin ingin mengirim LKPD ini ke guru?\n\nPastikan semua jawaban sudah terisi dengan benar.');
    if (!konfirmasi) return;
    
    showLoading('Mengirim ke guru...');
    
    try {
        const data = collectFormData();
        
        const { error } = await supabase
            .from('lkpd_submissions')
            .insert([{
                student_name: data.nama,
                student_class: data.kelas,
                activity_data: {
                    tanggal: data.tanggal,
                    jawaban: data.fields,
                    waktu_kirim: new Date().toISOString()
                }
            }]);
        
        if (error) throw error;
        
        hideLoading();
        showToast('🎉 LKPD berhasil dikirim ke guru!', 'success');
        
        // Tandai sudah terkirim
        localStorage.setItem('lkpd_terkirim', JSON.stringify({
            nama: data.nama,
            kelas: data.kelas,
            waktu: new Date().toISOString()
        }));
        
        // Disable tombol kirim agar tidak dobel
        document.getElementById('btn-kirim').disabled = true;
        document.getElementById('btn-kirim').textContent = '✅ Sudah Terkirim';
        
    } catch (error) {
        console.error('Error kirim:', error);
        hideLoading();
        showToast('❌ Gagal mengirim: ' + error.message, 'error');
    }
}

// ==================== RESET FORM ====================
function resetForm() {
    const konfirmasi = confirm('Yakin ingin menghapus semua jawaban?\n\nData yang tersimpan di perangkat akan dihapus.');
    if (!konfirmasi) return;
    
    document.querySelectorAll('#lkpd input, #lkpd textarea').forEach(el => {
        if (el.type !== 'date') el.value = '';
    });
    
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('lkpd_terkirim');
    
    document.getElementById('btn-kirim').disabled = false;
    document.getElementById('btn-kirim').innerHTML = '📤 Kirim ke Guru';
    
    showToast('🔄 Form berhasil di-reset', 'info');
}

// ==================== HELPER: LOADING ====================
function showLoading(text = 'Memproses...') {
    const overlay = document.getElementById('lkpd-loading');
    const textEl = document.getElementById('loading-text');
    if (overlay) {
        textEl.textContent = text;
        overlay.style.display = 'flex';
    }
}

function hideLoading() {
    const overlay = document.getElementById('lkpd-loading');
    if (overlay) overlay.style.display = 'none';
}

// ==================== HELPER: TOAST ====================
function showToast(message, type = 'success') {
    // Hapus toast yang ada
    document.querySelectorAll('.toast').forEach(t => t.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s reverse';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==================== CEK STATUS TERKIRIM ====================
function checkSentStatus() {
    const sent = localStorage.getItem('lkpd_terkirim');
    if (sent) {
        try {
            const data = JSON.parse(sent);
            const btn = document.getElementById('btn-kirim');
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = `✅ Sudah Terkirim (${new Date(data.waktu).toLocaleDateString('id-ID')})`;
            }
        } catch (e) {}
    }
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    // Set tanggal default = hari ini
    const tanggalInput = document.getElementById('lkpd-tanggal');
    if (tanggalInput && !tanggalInput.value) {
        tanggalInput.value = new Date().toISOString().split('T')[0];
    }
    
    // Muat data tersimpan
    loadSavedData();
    
    // Setup auto-save
    setupAutoSave();
    
    // Cek status terkirim
    checkSentStatus();
    
    // Event listeners tombol
    document.getElementById('btn-save-pdf')?.addEventListener('click', saveAsPDF);
    document.getElementById('btn-kirim')?.addEventListener('click', kirimKeGuru);
    document.getElementById('btn-reset-lkpd')?.addEventListener('click', resetForm);
});