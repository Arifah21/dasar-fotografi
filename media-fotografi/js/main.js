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
