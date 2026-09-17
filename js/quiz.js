// js/quiz.js

// ==================== TAB QUIZ NAVIGASI ====================
document.querySelectorAll('.quiz-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.quiz;
        
        document.querySelectorAll('.quiz-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        document.querySelectorAll('.quiz-game').forEach(g => g.classList.remove('active'));
        document.getElementById(`quiz-${target}`).classList.add('active');
    });
});

// ====================================================================
// ==================== QUIZ 1: DRAG & DROP ==========================
// ====================================================================

const dragData = {
    items: [
        { id: 1, text: 'f/1.8', category: 'aperture' },
        { id: 2, text: 'Depth of Field', category: 'aperture' },
        { id: 3, text: 'f/16', category: 'aperture' },
        { id: 4, text: '1/1000s', category: 'shutter' },
        { id: 5, text: 'Motion Blur', category: 'shutter' },
        { id: 6, text: '1/30s', category: 'shutter' },
        { id: 7, text: 'ISO 100', category: 'iso' },
        { id: 8, text: 'Noise', category: 'iso' },
        { id: 9, text: 'ISO 3200', category: 'iso' }
    ],
    score: 0,
    totalItems: 9,
    answered: [] // id yang sudah dijawab benar
};

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function initDragDrop() {
    const pool = document.getElementById('drag-pool');
    if (!pool) return;
    
    // Reset state
    dragData.score = 0;
    dragData.answered = [];
    updateDragScore();
    
    // Clear pool & drop zones
    pool.innerHTML = '';
    document.querySelectorAll('.drop-zone').forEach(z => z.innerHTML = '');
    document.getElementById('drag-message').classList.remove('show');
    
    // Shuffle & render items
    const shuffled = shuffleArray(dragData.items);
    shuffled.forEach(item => {
        const el = document.createElement('div');
        el.className = 'drag-item';
        el.draggable = true;
        el.dataset.id = item.id;
        el.dataset.category = item.category;
        el.textContent = item.text;
        pool.appendChild(el);
    });
    
    // Setup drag events
    setupDragEvents();
}

function setupDragEvents() {
    // Drag start
    document.querySelectorAll('.drag-item').forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', item.dataset.id);
            e.dataTransfer.effectAllowed = 'move';
            setTimeout(() => item.classList.add('dragging'), 0);
        });
        
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
    });
    
    // Drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            zone.parentElement.classList.add('drag-over');
            zone.classList.add('drag-over');
        });
        
        zone.addEventListener('dragleave', (e) => {
            if (!zone.contains(e.relatedTarget)) {
                zone.parentElement.classList.remove('drag-over');
                zone.classList.remove('drag-over');
            }
        });
        
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.parentElement.classList.remove('drag-over');
            zone.classList.remove('drag-over');
            
            const itemId = e.dataTransfer.getData('text/plain');
            const itemEl = document.querySelector(`.drag-item[data-id="${itemId}"]`);
            if (!itemEl) return;
            
            const category = zone.dataset.category;
            
            // Cek apakah benar
            if (itemEl.dataset.category === category) {
                // Pindahkan ke zone
                itemEl.classList.add('correct');
                itemEl.draggable = false;
                zone.appendChild(itemEl);
                dragData.answered.push(itemId);
                dragData.score++;
                updateDragScore();
                checkDragComplete();
            } else {
                // Salah - animasi shake
                itemEl.classList.add('wrong');
                setTimeout(() => itemEl.classList.remove('wrong'), 500);
            }
        });
    });
}

function updateDragScore() {
    const scoreEl = document.getElementById('drag-score');
    const progressEl = document.getElementById('drag-progress');
    if (scoreEl) scoreEl.textContent = dragData.score;
    if (progressEl) {
        progressEl.style.width = `${(dragData.score / dragData.totalItems) * 100}%`;
    }
}

function checkDragComplete() {
    if (dragData.score === dragData.totalItems) {
        const msg = document.getElementById('drag-message');
        msg.className = 'quiz-message show success';
        msg.innerHTML = '🎉 <strong>Luar biasa!</strong> Semua istilah berhasil dikategorikan dengan benar!';
    }
}

function resetDragDrop() {
    const pool = document.getElementById('drag-pool');
    if (pool) pool.classList.remove('empty');
    initDragDrop();
    const msg = document.getElementById('drag-message');
    msg.classList.remove('show');
}

function checkDragAnswers() {
    const msg = document.getElementById('drag-message');
    if (dragData.score === dragData.totalItems) {
        msg.className = 'quiz-message show success';
        msg.innerHTML = `🎉 <strong>Sempurna!</strong> Skor kamu: ${dragData.score}/${dragData.totalItems}`;
    } else if (dragData.score === 0) {
        msg.className = 'quiz-message show info';
        msg.innerHTML = '💡 Seret istilah ke kategori yang tepat untuk memulai.';
    } else {
        msg.className = 'quiz-message show info';
        msg.innerHTML = `📊 Skor sementara: <strong>${dragData.score}/${dragData.totalItems}</strong>. Lanjutkan mengerjakan!`;
    }
}

// ====================================================================
// ==================== QUIZ 2: CROSSWORD ============================
// ====================================================================

// Definisi grid crossword 7 rows x 8 cols
// '.' = kosong, huruf = jawaban
// const crosswordSolution = [
//     [null, null, null, 'I', 'S', 'O', null, null],  // row 0
//     [null, null, null, null, 'H', null, null, null], // row 1
//     [null, null, null, null, 'U', null, null, null], // row 2
//     ['A', 'P', 'E', 'R', 'T', 'U', 'R', 'E'],        // row 3
//     [null, null, null, null, 'T', null, null, null], // row 4
//     [null, null, null, 'L', 'E', 'N', 'S', 'A'],     // row 5
//     ['K', 'A', 'M', 'E', 'R', 'A', null, null]       // row 6
// ];
const crosswordSolution = [
    ['A', 'P', 'E', 'R', 'T', 'U', 'R', 'E', null, null],          // r0: APERTURE
    ['K', 'A', 'M', 'E', 'R', 'A', null, 'F', null, null],         // r1: KAMERA
    ['I', 'S', 'O', 'F', 'I', 'L', 'T', 'E', 'R', null],           // r2: ISO + FILTER
    [null, null, null, null, 'P', null, null, 'K', null, null],    // r3: TRIPOD + EFEK
    ['K', 'O', 'M', 'P', 'O', 'S', 'I', 'S', 'I', null],           // r4: KOMPOSISI
    [null, null, null, null, 'D', 'B', 'O', 'K', 'E', 'H'],        // r5: BOKEH + TRIPOD
    [null, null, null, 'F', 'O', 'K', 'U', 'S', null, null],       // r6: FOKUS
    ['L', 'E', 'N', 'S', 'A', null, null, null, null, null],       // r7: LENSA
    ['F', 'L', 'A', 'S', 'H', null, null, null, null, null],       // r8: FLASH
    ['Z', 'O', 'O', 'M', null, null, null, null, null, null]       // r9: ZOOM
];
// Definisi kata-kata crossword
// const crosswordWords = [
//     {
//         id: 'iso',
//         number: 1,
//         direction: 'across',
//         row: 0, col: 3,
//         answer: 'ISO',
//         clue: 'Sensitivitas sensor kamera terhadap cahaya (singkatan)'
//     },
//     {
//         id: 'shutter',
//         number: 2,
//         direction: 'down',
//         row: 0, col: 4,
//         answer: 'SHUTTER',
//         clue: 'Kecepatan rana / durasi rana terbuka'
//     },
//     {
//         id: 'aperture',
//         number: 3,
//         direction: 'across',
//         row: 3, col: 0,
//         answer: 'APERTURE',
//         clue: 'Bukaan lensa yang mengatur banyaknya cahaya masuk'
//     },
//     {
//         id: 'lensa',
//         number: 4,
//         direction: 'across',
//         row: 5, col: 3,
//         answer: 'LENSA',
//         clue: 'Bagian kamera untuk membiaskan cahaya'
//     },
//     {
//         id: 'kamera',
//         number: 5,
//         direction: 'across',
//         row: 6, col: 0,
//         answer: 'KAMERA',
//         clue: 'Alat untuk mengambil gambar atau foto'
//     }
// ];

const crosswordWords = [
    // ============ MENDATAR (ACROSS) ============
    {
        id: 'aperture',
        number: 1,
        direction: 'across',
        row: 0, col: 0,
        answer: 'APERTURE',
        clue: 'Bukaan lensa yang mengatur banyaknya cahaya masuk'
    },
    {
        id: 'kamera',
        number: 4,
        direction: 'across',
        row: 1, col: 0,
        answer: 'KAMERA',
        clue: 'Alat untuk mengambil gambar atau foto'
    },
    {
        id: 'iso',
        number: 5,
        direction: 'across',
        row: 2, col: 0,
        answer: 'ISO',
        clue: 'Sensitivitas sensor kamera terhadap cahaya (singkatan)'
    },
    {
        id: 'filter',
        number: 6,
        direction: 'across',
        row: 2, col: 3,
        answer: 'FILTER',
        clue: 'Aksesori lensa untuk mengontrol cahaya atau efek'
    },
    {
        id: 'komposisi',
        number: 7,
        direction: 'across',
        row: 4, col: 0,
        answer: 'KOMPOSISI',
        clue: 'Cara menyusun elemen visual dalam frame foto'
    },
    {
        id: 'bokeh',
        number: 8,
        direction: 'across',
        row: 5, col: 5,
        answer: 'BOKEH',
        clue: 'Efek blur pada latar belakang foto'
    },
    {
        id: 'fokus',
        number: 9,
        direction: 'across',
        row: 6, col: 3,
        answer: 'FOKUS',
        clue: 'Ketajaman gambar pada titik tertentu'
    },
    {
        id: 'lensa',
        number: 10,
        direction: 'across',
        row: 7, col: 0,
        answer: 'LENSA',
        clue: 'Bagian kamera untuk membiaskan cahaya'
    },
    {
        id: 'flash',
        number: 11,
        direction: 'across',
        row: 8, col: 0,
        answer: 'FLASH',
        clue: 'Lampu kilat untuk menambah cahaya'
    },
    // {
    //     id: 'zoom',
    //     number: 12,
    //     direction: 'across',
    //     row: 9, col: 0,
    //     answer: 'ZOOM',
    //     clue: 'Fitur untuk memperbesar atau memperkecil objek'
    // },
    {
    id: 'macro',
    number: 12,
    direction: 'across',
    row: 9, col: 0,
    answer: 'MACRO',
    clue: 'Jenis lensa untuk memotret objek sangat kecil'
},
    // ============ MENURUN (DOWN) ============
    {
        id: 'tripod',
        number: 2,
        direction: 'down',
        row: 0, col: 4,
        answer: 'TRIPOD',
        clue: 'Penyangga kamera berkaki tiga untuk kestabilan'
    },
    {
        id: 'efek',
        number: 3,
        direction: 'down',
        row: 0, col: 7,
        answer: 'EFEK',
        clue: 'Hasil visual khusus pada foto (misal: blur, vintage)'
    }
];
let crosswordState = {
    currentWord: null,
    currentCell: null,
    userAnswers: {}, // key: "row,col", value: letter
    startTime: null
};

function initCrossword() {
    const board = document.getElementById('crossword-board');
    if (!board) return;
    
    const rows = crosswordSolution.length;
    const cols = crosswordSolution[0].length;
    
    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    board.innerHTML = '';
    
    crosswordState.userAnswers = {};
    crosswordState.currentWord = null;
    crosswordState.currentCell = null;
    
    // Render cells
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const letter = crosswordSolution[r][c];
            const cell = document.createElement('div');
            cell.className = 'crossword-cell';
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            if (!letter) {
                cell.classList.add('blank');
            } else {
                // Cek nomor
                const wordStart = crosswordWords.find(w => w.row === r && w.col === c);
                if (wordStart) {
                    const numEl = document.createElement('span');
                    numEl.className = 'cell-number';
                    numEl.textContent = wordStart.number;
                    cell.appendChild(numEl);
                }
                
                // Input
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.dataset.row = r;
                input.dataset.col = c;
                input.autocomplete = 'off';
                input.addEventListener('input', handleCellInput);
                input.addEventListener('keydown', handleCellKeyDown);
                input.addEventListener('focus', handleCellFocus);
                cell.appendChild(input);
            }
            
            board.appendChild(cell);
        }
    }
    
    // Render clues
    renderClues();
}

function renderClues() {
    const acrossList = document.getElementById('clues-across');
    const downList = document.getElementById('clues-down');
    
    acrossList.innerHTML = '';
    downList.innerHTML = '';
    
    crosswordWords.forEach(word => {
        const li = document.createElement('li');
        li.dataset.wordId = word.id;
        li.innerHTML = `<span class="clue-number">${word.number}.</span> <span class="clue-text">${word.clue} <em>(${word.answer.length} huruf)</em></span>`;
        li.addEventListener('click', () => focusWord(word));
        
        if (word.direction === 'across') {
            acrossList.appendChild(li);
        } else {
            downList.appendChild(li);
        }
    });
}

function getWordCells(word) {
    const cells = [];
    for (let i = 0; i < word.answer.length; i++) {
        if (word.direction === 'across') {
            cells.push({ row: word.row, col: word.col + i });
        } else {
            cells.push({ row: word.row + i, col: word.col });
        }
    }
    return cells;
}

function focusWord(word) {
    crosswordState.currentWord = word;
    
    // Hapus highlight lama
    document.querySelectorAll('.crossword-cell').forEach(c => {
        c.classList.remove('highlight', 'selected');
    });
    
    // Update clue list
    document.querySelectorAll('.crossword-clues li').forEach(li => li.classList.remove('active'));
    document.querySelector(`.crossword-clues li[data-word-id="${word.id}"]`)?.classList.add('active');
    
    // Highlight cells
    const cells = getWordCells(word);
    cells.forEach(({row, col}) => {
        const cell = document.querySelector(`.crossword-cell[data-row="${row}"][data-col="${col}"]`);
        if (cell) cell.classList.add('highlight');
    });
    
    // Update active clue text
    document.getElementById('active-clue-text').textContent = 
        `(${word.number} ${word.direction === 'across' ? 'Mendatar' : 'Menurun'}) ${word.clue}`;
    
    // Focus ke cell pertama yang kosong
    const firstEmpty = cells.find(({row, col}) => !crosswordState.userAnswers[`${row},${col}`]);
    const target = firstEmpty || cells[0];
    const input = document.querySelector(`.crossword-cell[data-row="${target.row}"][data-col="${target.col}"] input`);
    if (input) input.focus();
}

function handleCellFocus(e) {
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    
    // Cari kata yang mengandung cell ini
    const word = crosswordWords.find(w => {
        const cells = getWordCells(w);
        return cells.some(c => c.row === row && c.col === col);
    });
    
    if (word) {
        // Jika sudah ada word aktif, cek apakah cell ini masih di word yang sama
        if (crosswordState.currentWord && crosswordState.currentWord.id === word.id) {
            // Tetap di word yang sama, tinggal update selected
            document.querySelectorAll('.crossword-cell').forEach(c => c.classList.remove('selected'));
            e.target.parentElement.classList.add('selected');
        } else {
            focusWord(word);
            // Setelah focusWord, tandai cell yang di-klik sebagai selected
            setTimeout(() => {
                const cell = document.querySelector(`.crossword-cell[data-row="${row}"][data-col="${col}"]`);
                if (cell) cell.classList.add('selected');
            }, 0);
        }
    }
    
    crosswordState.currentCell = { row, col };
}

function handleCellInput(e) {
    const input = e.target;
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);
    const value = input.value.toUpperCase().replace(/[^A-Z]/g, '');
    
    input.value = value;
    crosswordState.userAnswers[`${row},${col}`] = value;
    
    // Auto-advance ke cell berikutnya di word yang sama
    if (value && crosswordState.currentWord) {
        const cells = getWordCells(crosswordState.currentWord);
        const idx = cells.findIndex(c => c.row === row && c.col === col);
        
        if (idx >= 0 && idx < cells.length - 1) {
            const next = cells[idx + 1];
            const nextInput = document.querySelector(`.crossword-cell[data-row="${next.row}"][data-col="${next.col}"] input`);
            if (nextInput) nextInput.focus();
        }
    }
}

function handleCellKeyDown(e) {
    const input = e.target;
    const row = parseInt(input.dataset.row);
    const col = parseInt(input.dataset.col);
    
    // Navigasi dengan arrow keys
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        let newRow = row, newCol = col;
        
        if (e.key === 'ArrowLeft') newCol--;
        if (e.key === 'ArrowRight') newCol++;
        if (e.key === 'ArrowUp') newRow--;
        if (e.key === 'ArrowDown') newRow++;
        
        const nextInput = document.querySelector(`.crossword-cell[data-row="${newRow}"][data-col="${newCol}"] input`);
        if (nextInput) nextInput.focus();
    }
    
    // Backspace: hapus dan mundur
    if (e.key === 'Backspace' && !input.value && crosswordState.currentWord) {
        e.preventDefault();
        const cells = getWordCells(crosswordState.currentWord);
        const idx = cells.findIndex(c => c.row === row && c.col === col);
        
        if (idx > 0) {
            const prev = cells[idx - 1];
            const prevInput = document.querySelector(`.crossword-cell[data-row="${prev.row}"][data-col="${prev.col}"] input`);
            if (prevInput) {
                prevInput.value = '';
                delete crosswordState.userAnswers[`${prev.row},${prev.col}`];
                prevInput.focus();
            }
        }
    }
    
    // Tab: pindah ke word berikutnya
    if (e.key === 'Tab') {
        e.preventDefault();
        const words = crosswordWords;
        const currentIdx = words.findIndex(w => w.id === crosswordState.currentWord?.id);
        const nextIdx = (currentIdx + (e.shiftKey ? -1 : 1) + words.length) % words.length;
        focusWord(words[nextIdx]);
    }
}

function checkCrossword() {
    let correctWords = 0;
    let totalCells = 0;
    let correctCells = 0;
    
    // Reset visual
    document.querySelectorAll('.crossword-cell').forEach(c => c.classList.remove('correct', 'wrong'));
    
    crosswordWords.forEach(word => {
        const cells = getWordCells(word);
        let wordCorrect = true;
        
        cells.forEach(({row, col}, i) => {
            const expected = word.answer[i];
            const userAns = crosswordState.userAnswers[`${row},${col}`] || '';
            const cell = document.querySelector(`.crossword-cell[data-row="${row}"][data-col="${col}"]`);
            
            totalCells++;
            if (userAns === expected) {
                correctCells++;
                cell.classList.add('correct');
            } else {
                wordCorrect = false;
                if (userAns) cell.classList.add('wrong');
            }
        });
        
        if (wordCorrect) correctWords++;
    });
    
    const msg = document.getElementById('crossword-message');
    
    if (correctWords === crosswordWords.length) {
        msg.className = 'quiz-message show success';
        msg.innerHTML = `🎉 <strong>Sempurna!</strong> Semua jawaban benar! Kamu menguasai istilah fotografi dasar.`;
    } else {
        msg.className = 'quiz-message show info';
        msg.innerHTML = `📊 Hasil: <strong>${correctWords}/${crosswordWords.length} kata</strong> benar (${correctCells}/${totalCells} huruf). Periksa kotak merah untuk memperbaiki.`;
    }
}

function resetCrossword() {
    crosswordState.userAnswers = {};
    crosswordState.currentWord = null;
    document.querySelectorAll('.crossword-cell input').forEach(i => i.value = '');
    document.querySelectorAll('.crossword-cell').forEach(c => c.classList.remove('correct', 'wrong', 'highlight', 'selected'));
    document.querySelectorAll('.crossword-clues li').forEach(li => li.classList.remove('active'));
    document.getElementById('active-clue-text').textContent = 'Klik kotak untuk mulai';
    document.getElementById('crossword-message').classList.remove('show');
}

function hintCrossword() {
    if (!crosswordState.currentWord) {
        // Cari word pertama yang belum lengkap
        for (const word of crosswordWords) {
            const cells = getWordCells(word);
            const incomplete = cells.some(({row, col}) => 
                crosswordState.userAnswers[`${row},${col}`] !== word.answer[cells.findIndex(c => c.row === row && c.col === col)]
            );
            if (incomplete) {
                focusWord(word);
                break;
            }
        }
    }
    
    if (!crosswordState.currentWord) return;
    
    const word = crosswordState.currentWord;
    const cells = getWordCells(word);
    
    // Cari cell pertama yang kosong/salah
    for (let i = 0; i < cells.length; i++) {
        const {row, col} = cells[i];
        const expected = word.answer[i];
        const current = crosswordState.userAnswers[`${row},${col}`] || '';
        
        if (current !== expected) {
            const input = document.querySelector(`.crossword-cell[data-row="${row}"][data-col="${col}"] input`);
            if (input) {
                input.value = expected;
                crosswordState.userAnswers[`${row},${col}`] = expected;
                input.focus();
                
                const msg = document.getElementById('crossword-message');
                msg.className = 'quiz-message show info';
                msg.innerHTML = `💡 Huruf <strong>${expected}</strong> untuk kotak (${word.number} ${word.direction === 'across' ? 'Mendatar' : 'Menurun'}) ditambahkan.`;
            }
            break;
        }
    }
}
// Re-render crossword saat ukuran layar berubah (debounced)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const board = document.getElementById('crossword-board');
        if (board && board.children.length > 0) {
            // Simpan jawaban dulu
            const savedAnswers = { ...crosswordState.userAnswers };
            const savedWord = crosswordState.currentWord;
            
            initCrossword();
            
            // Restore jawaban
            Object.entries(savedAnswers).forEach(([key, val]) => {
                const [r, c] = key.split(',');
                const input = document.querySelector(`.crossword-cell[data-row="${r}"][data-col="${c}"] input`);
                if (input) input.value = val;
            });
            crosswordState.userAnswers = savedAnswers;
            
            if (savedWord) focusWord(savedWord);
        }
    }, 250);
});
// ====================================================================
// ==================== INIT =========================================
// ====================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Init Drag & Drop
    initDragDrop();
    
    // Init Crossword
    initCrossword();
    
    // Event listeners
    document.getElementById('reset-drag')?.addEventListener('click', resetDragDrop);
    document.getElementById('check-drag')?.addEventListener('click', checkDragAnswers);
    document.getElementById('reset-crossword')?.addEventListener('click', resetCrossword);
    document.getElementById('check-crossword')?.addEventListener('click', checkCrossword);
    document.getElementById('hint-crossword')?.addEventListener('click', hintCrossword);

});
// ====================================================================
// ==================== GAME RANA & RUPA (IFRAME) =====================
// ====================================================================

/**
 * Setup handler untuk game Rana & Rupa
 */
function setupRanaRupaGame() {
    const iframe = document.querySelector('.rana-rupa-iframe');
    const container = document.querySelector('.rana-rupa-iframe-container');
    const btnFullscreen = document.getElementById('btn-open-fullscreen');
    const btnReload = document.getElementById('btn-reload-game');

    if (!iframe || !container) return;

    // Tombol Fullscreen
    btnFullscreen?.addEventListener('click', () => {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        } else {
            // Fallback: buka tab baru dengan URL game
            window.open(iframe.src, '_blank');
        }
    });

    // Tombol Reload Game
    btnReload?.addEventListener('click', () => {
        const konfirmasi = confirm('Muat ulang game? Progress saat ini akan hilang.');
        if (!konfirmasi) return;
        
        iframe.src = iframe.src; // reload iframe
    });

    // Pause game saat tab quiz ditutup (opsional — hemat resource)
    document.querySelectorAll('.quiz-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.quiz;
            // Jika pindah dari rana-rupa, reload iframe untuk reset
            if (target !== 'ranarupa') {
                // Biarkan game tetap loaded, hanya di-hide
            }
        });
    });
}

// Jalankan saat DOM siap
document.addEventListener('DOMContentLoaded', setupRanaRupaGame);


