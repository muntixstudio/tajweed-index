// ==========================================
// 1. MENYIAPKAN ELEMEN DOM
// ==========================================

// Elemen Halaman Kiri (Data Al-Qur'an)
const elNamaSurah = document.getElementById('nama-surah');
const elTeksArab = document.getElementById('teks-arab');
const elBtnPlay = document.getElementById('btn-play');
const elAudioPlayer = document.getElementById('audio-player');

// Elemen Halaman Kanan (Tutor Gemini)
const elModePilihan = document.getElementById('mode-tajwid');
const elInputSpesifik = document.getElementById('input-tajwid');
const elBtnAnalisis = document.getElementById('btn-analisis');
const elKotakHasil = document.getElementById('kotak-hasil');


// ==========================================
// 2. FUNGSI DATA & AUDIO (HALAMAN KIRI)
// ==========================================

// Fungsi utama mengambil data API EQuran
async function muatHalamanBuku(nomorSurah) {
  try {
    const response = await fetch(`https://equran.id/api/v2/surat/${nomorSurah}`);
    const data = await response.json();
    
    if(data.code === 200) {
      const surat = data.data;
      const ayatPertama = surat.ayat[0]; 
      
      elNamaSurah.innerText = surat.namaLatin;
      elTeksArab.innerText = ayatPertama.teksArab;
      
      elAudioPlayer.src = ayatPertama.audio['05'];
      elBtnPlay.removeAttribute('disabled'); 
    }
  } catch (error) {
    elNamaSurah.innerText = "Gagal memuat data";
    console.error("Error: ", error);
  }
}

// Jalankan fungsi untuk memuat surah Al-Fatihah
muatHalamanBuku(1);

// Logika tombol putar audio
elBtnPlay.addEventListener('click', () => {
  if (elAudioPlayer.paused) {
    elAudioPlayer.play();
    elBtnPlay.innerText = "⏸ Jeda Audio";
  } else {
    elAudioPlayer.pause();
    elBtnPlay.innerText = "▶ Putar Audio Ayat 1";
  }
});

// Kembalikan teks tombol saat audio selesai
elAudioPlayer.addEventListener('ended', () => {
  elBtnPlay.innerText = "▶ Putar Audio Ayat 1";
});


// ==========================================
// 3. FUNGSI LOGIKA TUTOR GEMINI (HALAMAN KANAN)
// ==========================================

// Tampilkan/Sembunyikan input teks berdasarkan mode yang dipilih
elModePilihan.addEventListener('change', (e) => {
  if (e.target.value === 'spesifik') {
    elInputSpesifik.style.display = 'block';
  } else {
    elInputSpesifik.style.display = 'none';
  }
});

// Eksekusi perakitan prompt saat tombol diklik
elBtnAnalisis.addEventListener('click', () => {
  const mode = elModePilihan.value;
  const teksAyat = elTeksArab.innerText; 
  let promptGemini = "";

  // Tampilkan status pemuatan
  elKotakHasil.innerHTML = "<p><em>Menganalisis ayat... Mohon tunggu.</em></p>";

  // Merakit Prompt berdasarkan mode
  if (mode === 'spesifik') {
    const hukumDiminta = elInputSpesifik.value;
    
    // Validasi jika input kosong
    if (!hukumDiminta) {
      elKotakHasil.innerHTML = "<p style='color:red;'>Silakan ketik hukum tajwid yang ingin dicari!</p>";
      return;
    }
    
    promptGemini = `Anda adalah guru Tajwid. Temukan HANYA hukum tajwid ${hukumDiminta} pada ayat ini: ${teksAyat}. Tulis kata bahasa Arabnya dan alasannya. Gunakan format HTML.`;
  
  } else {
    promptGemini = `Anda adalah guru Tajwid. Analisis SELURUH hukum tajwid dasar pada ayat ini: ${teksAyat}. Buatkan daftar menggunakan HTML <ul> dan <li> berisi kata Arab, nama hukum, dan alasannya.`;
  }

  // Cek di console untuk memastikan prompt sudah benar
  console.log("Prompt yang siap dikirim ke API: ", promptGemini);
  
  // Catatan: Kode untuk mengirim 'promptGemini' ke API Gemini yang sebenarnya
  // akan ditambahkan di bagian ini nanti.
});