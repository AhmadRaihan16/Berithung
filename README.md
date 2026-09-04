# Berithung 💰

> **Aplikasi Manajemen Keuangan Pribadi, Tabungan Darurat, Celengan Target, dan Pencegah Belanja Impulsif.**  
> *100% Offline, Privacy-First, Zero Backend, Tanpa Iklan, dan Multi-Platform (Web, PWA, Android).*

[![Release](https://img.shields.io/badge/release-v1.4.0-blue.svg)](https://github.com/AhmadRaihan16/Berithung/releases)
[![Platform](https://img.shields.io/badge/platform-Web%20%7C%20PWA%20%7C%20Android-green.svg)](#multi-platform)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)
[![Privacy](https://img.shields.io/badge/privacy-100%25%20Offline-orange.svg)](#privasi--keamanan-data)

---

## Daftar Isi
- [Tentang Berithung](#tentang-berithung)
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Proyek](#struktur-proyek)
- [Panduan Instalasi & Pengembangan](#panduan-instalasi--pengembangan)
  - [1. Menjalankan di Browser (Web/PWA)](#1-menjalankan-di-browser-webpwa)
  - [2. Menjalankan & Build APK Android](#2-menjalankan--build-apk-android)
- [Privasi & Keamanan Data](#privasi--keamanan-data)
- [Lisensi](#lisensi)

---

## Tentang Berithung

**Berithung** lahir dari kebutuhan akan aplikasi pencatat keuangan yang jujur, cepat, dan tidak mengumpulkan data pribadi pengguna. Sebagian besar aplikasi finansial modern mewajibkan login akun, sinkronisasi cloud pihak ketiga, atau dijejali iklan.

Berithung beroperasi **sepenuhnya di sisi klien (client-side offline-first)**. Seluruh data transaksi, target celengan, anggaran bulanan, dan evaluasi keinginan tersimpan aman di perangkat Anda sendiri melalui `localStorage`.

---

## Fitur Utama

### 1. 🎯 Celengan & Target Tabungan
- Buat multi-celengan impian dengan emoji kustom dan target nominal.
- Setor dan tarik saldo secara fleksibel disertai histori transaksi rinci.
- Estimasi target mingguan dan persentase ketercapaian secara visual.
- **Custom Confirmation Modal**: Konfirmasi penghapusan celengan yang aman, elegan, dan terintegrasi dengan hierarki gestur tombol *Back* Android (tanpa dialog browser native).

### 2. 🛡️ Tabungan Darurat (*Emergency Fund*)
- Pos dana khusus yang terpisah dari celengan target maupun anggaran belanja.
- Indikator keamanan finansial untuk memantau kesiapan menghadapi kondisi mendesak.

### 3. 💳 Anggaran Bulanan & Pelacak Pengeluaran
- Alokasi anggaran bulanan dengan navigasi linimasa bulan.
- Pencatatan pengeluaran harian per kategori (Kebutuhan Pokok, Transportasi, Hiburan, dll.).
- Monitoring *burn rate* dan sisa anggaran secara *real-time*.

### 4. 🛍️ "Boleh Beli?" & Fitur Wishlist (*Impulse Protection*)
- **Simulasi Kelayakan Finansial**: Uji apakah membeli suatu barang aman terhadap kondisi celengan dan tabungan saat ini.
- **Cooling-Off Period**: Menahan keinginan belanja impulsif selama 3, 7, 14, hingga 30 hari sebelum mengambil keputusan akhir.
- **Live Readiness Analysis**: Evaluasi otomatis kesiapan dana saat masa tunggu (*cooling*) berakhir.

### 5. 📊 Analitik & Financial Insights (v1.4.0)
- **100% Deterministic & Offline**: Analisis pola pengeluaran tanpa ketergantungan API eksternal atau AI pihak ketiga.
- Distribusi pengeluaran berbasis kategori dan rata-rata pengeluaran harian.
- Pelacakan celengan aktif dan rekap target tercapai (bulanan maupun sepanjang waktu).
- Metrik **Potensi Pengeluaran Dihindari**: Total nominal rupiah yang berhasil diselamatkan dari pembatalan barang belanja impulsif.

### 6. 🌓 Adaptif Tema (Dark / Light / System)
- Desain antarmuka modern dengan CSS Design Tokens terstandarisasi.
- Otomatis mengikuti preferensi tema sistem operasi atau dipilih manual.

---

## Teknologi yang Digunakan

- **Core Application**: HTML5, Vanilla CSS3 (CSS Variables / Design System Tokens), Modern Vanilla JavaScript (ES6+).
- **Storage**: Browser `localStorage` API dengan skema terstruktur.
- **PWA Capabilities**: Web App Manifest (`manifest.json`), Service Worker (`sw.js`).
- **Native Android Wrapper**: [Capacitor 6](https://capacitorjs.com/)
  - `@capacitor/app`: Manajemen siklus aplikasi dan hardware/gesture *Back button*.
  - `@capacitor/filesystem`: Penyimpanan cadangan berkas lokal JSON.
  - `@capacitor/share`: Berbagi berkas cadangan langsung ke aplikasi eksternal (Drive, WhatsApp, dsb.).
  - `@capacitor/status-bar`: Penyesuaian tema status bar Android.

---

## Struktur Proyek

```text
savings-app/
├── android/                   # Proyek native Android (Capacitor)
├── assets/                    # Ikon aplikasi, logo, dan splash assets
│   ├── icon-512.png
│   └── logo-berithung.png
├── scripts/                   # Script otomasi build dan asset packaging
│   └── build-web.js
├── www/                       # Folder distribusi web yang disinkronkan ke Android
├── index.html                 # Kode utama aplikasi (Markup, Style, Logic)
├── manifest.json              # Konfigurasi Progressive Web App
├── package.json               # Dependensi Capacitor dan script runner
├── sw.js                      # Service worker untuk caching offline
└── capacitor.config.json      # Konfigurasi Capacitor (App ID, Host, Scheme)
```

---

## Panduan Instalasi & Pengembangan

### Prasyarat
- [Node.js](https://nodejs.org/) (versi 18 atau lebih baru)
- NPM (bawaan Node.js)
- [Android Studio](https://developer.android.com/studio) (khusus untuk kompilasi APK Android)

### 1. Menjalankan di Browser (Web/PWA)

Klon repositori dan buka file langsung di peramban favorit Anda:

```bash
# Klon repositori
git clone https://github.com/AhmadRaihan16/Berithung.git
cd Berithung

# Buka langsung file index.html di browser
# Atau jalankan local static server sederhana:
npx serve .
```

### 2. Menjalankan & Build APK Android

Pastikan dependensi Capacitor telah terpasang:

```bash
# Pasang dependensi
npm install

# Sinkronkan aset web ke proyek Android
npm run cap:sync

# Buka proyek di Android Studio
npm run cap:open
```

Untuk mengompilasi APK debug secara langsung melalui CLI:

```bash
cd android
./gradlew assembleDebug
```

Berkas APK akan tersedia di:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## Privasi & Keamanan Data

1. **Tanpa Pelacak (*No Trackers*)**: Berithung tidak menyematkan pustaka analitik pihak ketiga (seperti Google Analytics, Firebase SDK, atau Facebook Pixel).
2. **Kedaulatan Data Penuh**: Anda memiliki kendali 100% atas data Anda. Ekspor cadangan (*Backup*) menghasilkan berkas JSON transparan yang dapat diinspeksi kapan saja.
3. **Pencadangan & Pemulihan Aman**: Berkas JSON dapat dipindahkan antar-perangkat tanpa perlu akun cloud berbayar.

---

## Lisensi

Didistribusikan di bawah Lisensi MIT. Lihat berkas `LICENSE` untuk informasi selengkapnya.

Dibuat dengan dedikasi oleh [Ahmad Raihan](https://github.com/AhmadRaihan16).
