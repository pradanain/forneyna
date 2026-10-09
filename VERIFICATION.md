# Hasil verifikasi

Tanggal verifikasi terbaru: **9 Oktober 2026**. Proyek: `C:\Projects\birthday`.

Persiapan deploy Linux: Compose kini memiliki nama proyek `neyna-birthday` dan image `neyna-birthday:latest`. `DEPLOY.md` berisi alur GitHub ke server Traefik/Cloudflare Tunnel. Validasi Compose dengan `.env.example` lulus dan tidak menghasilkan published port. Docker build serta smoke test terbaru belum dijalankan karena Docker tujuan berada di PC/server lain. Script smoke diperbarui untuk judul terbaru, tujuh JPG asli, dan byte range MP3.

Pembaruan dekorasi: kucing SVG interaktif di dekat kue, dengan kedipan, gerakan ekor, dan sapaan saat disentuh atau diaktifkan lewat keyboard. Surat memiliki bunga dan daun rambat di dua sudut. Enam dari 18 balon kejutan kini berbentuk hati. Animasi kucing mengikuti reduced motion.

Pembaruan identitas: judul tab menjadi Neyna Salma Shiqqy’s Birthday, header menjadi Neyna’s Birthday dengan nama lengkap, serta surat dan footer mencantumkan Novanni Indi Pradana. Lint, typecheck/build, dan 6 tes browser terkait alur lengkap, layout 320 px, dan screenshot mobile/desktop lulus pada pembaruan ini. Suite lengkap di bawah sudah diperbarui setelah penambahan dekorasi.

Pembaruan kejutan: catatan enam foto kini mengikuti detail foto pengguna. Setelah semua lilin padam, kartu pesan rahasia dan 18 balon pastel muncul; balon bergerak dari bawah ke atas dan dibersihkan setelah 12 detik. Animasi menghormati reduced motion dan tidak menghalangi klik.

Pembaruan foto: tujuh JPG pengguna sudah dipasang (satu portrait dan enam kolase galeri). Galeri memakai bingkai 9:16 agar kolase tampil utuh; deskripsi alt diperbarui dan label placeholder dihapus. File JPG asli tidak diubah.

Musik mencoba autoplay sejak halaman dimuat dan mencoba lagi pada interaksi pertama jika diblokir browser, menggunakan file pengguna **`public/until i found you cover.mp3`** (4.211.181 byte). Pemutar berlabel **“A little melody for you”**; volume awal 35%, loop aktif, pause/resume tetap tersedia. Spotify tidak dimuat. Teks Inggris, animasi halus, dan dukungan reduced motion tetap tersedia.

## Hasil akhir

| Pemeriksaan | Hasil |
| --- | --- |
| Instalasi dependency dan lockfile | Berhasil; `npm ci` juga berhasil di Docker Linux |
| Audit dependency saat instalasi 8 Oktober | 0 vulnerabilities; tidak ada perubahan dependency pada pembaruan 9 Oktober |
| `npm run lint` | Lulus, tanpa error/warning lint |
| `npm run typecheck` (juga bagian dari build) | Lulus |
| `npm run build` | Lulus; output `dist/` |
| `npm run test:unit` | 13 lulus |
| `npm test` | 22 lulus, 1 screenshot mobile timeout, 1 dilewati. Screenshot yang gagal lulus saat diulang dengan `--last-failed --workers=1 --timeout=60000`; total 23 skenario lulus |
| `docker compose --env-file .env.example config --quiet` | Lulus |
| `docker compose --env-file .env.example --progress plain build --provenance=false birthday` | Belum diuji ulang untuk perubahan autoplay, foto, kejutan akhir, dan dekorasi: Docker Desktop Linux Engine tidak tersedia. Build sebelumnya lulus |
| `node scripts/verify-container.mjs` | Belum diuji ulang untuk perubahan autoplay, foto, kejutan akhir, dan dekorasi karena engine tidak tersedia; smoke test sebelumnya lulus |

Lingkungan browser: Chromium melalui Playwright, mobile **390 × 844**, desktop **1440 × 1000**, dan pemeriksaan layout tambahan **320 × 740**. Screenshot mobile/desktop diperbarui. Font, portrait JPG, enam kolase JPG galeri, dan musik dimuat lokal; tidak ditemukan request HTTP ke origin eksternal, termasuk saat pemutaran musik.

## Interaksi yang diuji

- Hadiah terbuka melalui tombol dan ilustrasi hadiah, kemudian hero tampil.
- Lightbox: foto berikutnya/sebelumnya, perputaran foto pertama/terakhir, panah keyboard, Tab tetap di dialog, Escape/tombol tutup, dan fokus kembali ke kartu pemicu.
- Swipe kiri/kanan menggunakan event sentuh browser melalui Chromium DevTools Protocol pada viewport mobile.
- Surat dibuka, ditutup, dan dibuka ulang.
- Lilin dipadamkan satu per satu maupun melalui tombol; ucapan akhir tampil.
- Ulangi kejutan mengembalikan hadiah, surat, dan lilin ke keadaan awal.
- Mode reduced motion berfungsi tanpa canvas confetti; tidak ada horizontal overflow pada 320 px, termasuk saat surat terbuka.
- MP3 asli pengguna diuji langsung di Chromium pada mobile dan desktop: audio berhasil decode, durasi valid, `currentTime` bertambah saat play/resume, pause berhasil, volume 0,35, loop aktif, dan tidak ada media error. Audio tetap berjalan saat hadiah dibuka. Tidak ada iframe Spotify maupun request eksternal.
- Dengan `--autoplay-policy=no-user-gesture-required`, MP3 langsung berjalan tanpa interaksi, sebelum hadiah dibuka; tidak muted dan volume 35%. Dengan `--autoplay-policy=document-user-activation-required`, percobaan awal ditolak lalu tap/klik pada judul halaman berhasil memulai audio tanpa membuka hadiah. Aktivasi keyboard pada ilustrasi hadiah juga berhasil. Pengujian dengan respons `HEAD` tertunda juga lulus. Setelah pengguna menekan pause, membuka ulang kejutan tidak menyalakan musik kembali.
- Tes unit juga mensimulasikan penolakan autoplay, pemulihan melalui klik/sentuhan/keyboard, dan pembersihan listener saat unmount. Mode manual dan pause tetap berfungsi. Tes browser musik mematikan tracing karena perekaman snapshot memengaruhi aktivasi pengguna pada lingkungan uji; audio asli dan kebijakan browser tetap digunakan.
- Saat halaman dimuat, pemutar memeriksa file melalui `HEAD`, lalu mencoba play otomatis. Jika diizinkan, browser mengunduh MP3 melalui `GET`. Unit test dengan media API simulasi menguji file 404, fallback HTML, gangguan jaringan, penolakan autoplay, dan kegagalan audio.
- Hash SHA-256 file MP3 dalam `dist/` sama dengan file asli di `public/`; tidak ada perubahan data audio.
- Kejutan akhir diuji pada mobile/desktop: muncul hanya setelah semua lilin padam, posisi balon bergerak ke atas, overlay tidak menerima klik, pesan dapat dibuka dengan Enter dan fokus berpindah ke judul pesan, balon dibersihkan, dan replay mereset kejutan. Mode reduced motion menampilkan pesan tanpa balon dan tanpa overflow pada lebar 320 px.
- Kucing diuji dengan tap pada mobile, Enter/Space pada keyboard, sapaan dan hati tampil, toggle kembali, serta reset saat replay. Animasi mata dan ekor tidak berjalan pada reduced motion. Dua dekorasi sudut surat dan enam balon hati juga terverifikasi.
- Tidak ditemukan JavaScript page error pada pengujian alur lengkap.

Pengujian menemukan masalah fokus Tab pada lightbox dan masalah pada alat uji sentuh/pendeteksian URL lokal; semuanya telah diperbaiki sebelum hasil akhir di atas.

## Container produksi

Hasil smoke test versi sebelumnya (sebelum perubahan autoplay saat load dan foto), pada container sementara dengan network `none`, tanpa host port. Perubahan terbaru belum dibangun ulang dalam Docker karena Docker Desktop Linux Engine tidak tersedia pada pemeriksaan terbaru. Hasil sebelumnya:

- Healthcheck mencapai `healthy`, `/healthz` mengembalikan `ok`.
- `nginx -t` berhasil.
- Halaman utama dan fallback SPA mengembalikan HTML produksi.
- HTML: `Cache-Control: no-cache`.
- Aset ber-hash: `max-age=31536000, immutable`.
- Gambar placeholder: respons 200 dan cache 3600 detik.
- File MP3 pengguna, termasuk path dengan spasi: respons 200, MIME `audio/mpeg`, dan cache 3600 detik.
- Musik/aset yang hilang: 404, bukan HTML fallback.
- Tidak ada published port.

## Artefak

- `artifacts/mobile-gift.png`, `artifacts/mobile-full.png`, `artifacts/mobile-letter.png`
- `artifacts/desktop-gift.png`, `artifacts/desktop-full.png`, `artifacts/desktop-letter.png`
- `artifacts/mobile-music.png`, `artifacts/desktop-music.png` (pemutar lokal saat MP3 pengguna sedang berjalan)
- `artifacts/mobile-final-surprise.png`, `artifacts/desktop-final-surprise.png`
- `artifacts/mobile-cat.png`, `artifacts/desktop-cat.png`
- `playwright-report/index.html` (hasil pengulangan screenshot mobile terakhir)

## Batas verifikasi

Belum dilakukan deployment publik melalui domain, Traefik, atau Cloudflare Tunnel milik pengguna karena deployment akan dilakukan pengguna pada server terpisah. Domain induk yang dipilih adalah `pradanain.id`; subdomain dikonfigurasi melalui `.env`. Pengujian audio memverifikasi decode, state media, dan waktu pemutaran browser, bukan keluaran speaker perangkat fisik. Pengujian browser memakai Chromium; Safari/iOS fisik belum diuji. Autoplay bersuara tanpa interaksi tetap mengikuti kebijakan browser; website tidak dapat memaksa izin tersebut. Saat diblokir, halaman menampilkan petunjuk tap dan mencoba lagi melalui interaksi pengguna.
