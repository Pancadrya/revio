## Revio: File Multimedia Manipulation Tool

Revio merupakan suatu aplikasi berbasis web yang kegunnaan utamanya untuk memanipulasi file multimedia sesuai dengan kebutuhan pengguna. Revio dibangun dengan menggunakan teknologi NextJS. Terdapat dua library atau package yang digunakan dalam Revio, yaitu [sharp](https://sharp.pixelplumbing.com/) untuk menipulasi image dan [fluent-ffmpeg](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg#readme) untuk manipulasi audio.

# Note:
Revio belum dapat dihosting dikarenakan ketergantungan fluent-ffmpeg akan ffmpeg di mesin lokal yang mengakibatkan kebutuhan untuk melakukan hosting menggunakan VPS. Harga sewa VPS yang relatif mahal menjadi kendala utamanya.

# Try It
Untuk mencoba Revio, ikuti langkah-langkah berikut:
1. Clone repository ini
2. Buka editor (VS Code atau semacamnya)
3. Buka terminal
4. Patikan komputer memiliki nodeJS dan ffmpeg
5. Arahkan terminal ke folder aplikasi (revio)
6. Jalankan perintah npm install untuk menginstall dependesi
7. Jalankan npm run dev
8. Buka http://localhost:3000/ di browser
9. Revio siap digunakan (Semoga tidak error, hehe)
