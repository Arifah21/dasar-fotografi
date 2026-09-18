// js/main.js
import './teori.js';
import './lkpd.js';
import './quiz.js';
import './evaluasi.js';

// ==================== NAVIGASI TAB UTAMA ====================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        
        // Update tombol aktif
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Tampilkan konten yang sesuai
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.getElementById(target).classList.add('active');
        
        // Scroll ke atas
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ==================== AKSES GURU DARI BERANDA ====================
// Cukup redirect ke login.html — autentikasi via Supabase Auth

// ==================== AKSES GURU DARI BERANDA ====================
// Cukup redirect ke login.html — autentikasi via Supabase Auth

function setupGuruAccess() {
    const btnAccess = document.getElementById('guru-access-btn');
    if (!btnAccess) return;

    btnAccess.addEventListener('click', async (e) => {
        try {
            const { supabase } = await import('./supabase-client.js');
            const { data: { session } } = await supabase.auth.getSession();
            
            if (session) {
                e.preventDefault();
                window.location.href = 'dashboard.html';
            }
        } catch (err) {
            console.warn('Cek session gagal:', err);
        }
    });
}

document.addEventListener('DOMContentLoaded', setupGuruAccess);