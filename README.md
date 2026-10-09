# Neyna Salma Shidqy Birthday

Website kejutan ulang tahun untuk **Neyna Salma Shidqy**, dengan seluruh teks pengalaman dalam bahasa Inggris. React + TypeScript + Vite + Tailwind CSS, Motion for React, lucide-react, dan canvas-confetti. Gambar, font, dan musik disajikan lokal. Tidak membutuhkan database atau backend. Musik memakai file cover MP3 pengguna dan mencoba autoplay sejak halaman dimuat; jika browser memblokir audio, klik/tap/keyboard pertama di halaman memulainya.

## Menjalankan lokal

Gunakan Node.js **22.12 atau lebih baru** dan npm.

```sh
npm ci
npm run dev
```

Buka `http://127.0.0.1:5174`. Port development ditetapkan ke 5174; jika port tersebut terpakai, Vite akan memberi pesan error agar alamat tidak berpindah diam-diam.

```sh
npm run lint
npm run typecheck
npm run test:unit
npm run build
npm run preview
```

Build statis ada di `dist/`. Preview produksi biasanya di `http://127.0.0.1:4173`. Situs ditujukan untuk root domain, bukan subfolder URL.

## Personalisasi

Edit **`src/config/birthday.ts`** untuk semua nama, judul, ucapan, surat, caption, label tombol, alt text, path gambar, dan musik. Metadata HTML juga dihasilkan dari konfigurasi yang sama saat build. Tidak ada tanggal lahir, usia, atau detail hubungan yang diasumsikan.

- **Portrait:** letakkan foto di `public/images/`, kemudian ubah `hero.portrait.src` menjadi `/images/nama-file.webp` dan `hero.portrait.alt`. Rasio 4:5 paling cocok.
- **Galeri:** ganti `gallery.photos` (6–8 foto disarankan). Setiap foto memiliki `src`, `alt`, `caption`, dan `note`. Catatan saat ini ditulis mengikuti detail yang terlihat di foto; edit `note` untuk menambahkan cerita atau kenangan spesifik kalian. Galeri saat ini memakai kolase JPG vertikal dalam bingkai 9:16 dengan object-fit contain agar seluruh kolase terlihat, termasuk di lightbox. Gambar bagian bawah memakai lazy loading.
- **Catatan placeholder:** setelah mengganti ilustrasi dengan foto asli, ubah atau kosongkan `gallery.placeholderNote`.
- **Surat:** ubah `letter.salutation`, `paragraphs`, `closing`, dan `signature`.
- **Lilin:** `wish.candleCount` adalah jumlah lilin dekoratif, bukan usia; UI mendukung 1–7 lilin.
- **Musik lokal (default):** `music.enabled: true`, `music.provider: 'local'`, `music.src: '/until i found you cover.mp3'`. File pengguna berada di `public/until i found you cover.mp3` dan ikut dalam build/Docker tanpa diubah. Pemutar berlabel **“A little melody for you”**, dengan volume awal 35%, loop, pause, dan resume. `music.autoPlayOnLoad: true` mencoba memutar audio segera setelah file diverifikasi saat halaman dimuat. Jika kebijakan browser memblokir autoplay bersuara, petunjuk "Tap anywhere to let the melody begin." tampil dan musik mencoba lagi pada klik/tap/keyboard pertama di halaman, tanpa perlu membuka hadiah. Browser yang mengizinkan autoplay langsung memutar musik tanpa interaksi. `music.autoPlayOnOpen: true` juga menyediakan pemicu saat hadiah dibuka. Interaksi bisa memulai audio ketika pemeriksaan `HEAD` belum selesai. Pause pilihan pengguna dihormati pada interaksi selanjutnya dan saat kejutan diulang. Atur kedua opsi `autoPlayOnLoad` dan `autoPlayOnOpen` ke `false` untuk mode manual, atau `enabled: false` untuk menonaktifkan musik. Untuk mengganti lagu/label/volume, edit `music.src`, `music.label`, dan `music.volume` (0–1).
- **Musik Spotify (opsional):** mode sebelumnya masih tersedia melalui `music.provider: 'spotify'`. Konfigurasi lagu ada di `music.spotify`. Spotify tidak dimuat pada mode lokal; mode ini tidak diperlukan untuk memainkan file MP3 pengguna.
- **Warna/layout:** `src/styles.css` memuat token Tailwind dan gaya scrapbook.

Website kini menggunakan tujuh foto JPG pengguna di `public/images/`: `portrait.jpg`, `little-joys.jpg`, `sunshine.jpg`, `simple-moments.jpg`, `quiet-dreams.jpg`, `bloom.jpg`, dan `beautiful-days.jpg`. Caption tetap berbahasa Inggris dan label placeholder disembunyikan. File SVG lama adalah ilustrasi placeholder cadangan dan tidak lagi ditampilkan. Sumber pembuatnya ada di `scripts/create-placeholders.mjs`; menjalankan script tersebut **menimpa tujuh SVG placeholder dengan nama yang sama**. Font Cormorant Garamond, DM Sans, dan Caveat dibundel dari paket Fontsource; lisensi OFL disertakan di `public/licenses/` dan ikut dalam build.

Jalankan ulang build atau Docker build setelah mengganti konten/aset. Kompres foto pribadi sebelum dipakai, misalnya WebP dengan lebar 1000–1400 px.

## Alur dan aksesibilitas

1. Hadiah berpita terbuka lewat klik/tap/keyboard, lalu memunculkan confetti dan mengarahkan fokus ke ucapan ulang tahun.
2. Hero portrait dan ucapan. Setelah hadiah dibuka, semua bagian dapat diakses dengan scroll vertikal dan navigasi bagian.
3. Enam polaroid dengan lightbox native `<dialog>`: next/previous berputar, tombol panah keyboard, swipe horizontal, Escape, klik backdrop, tombol tutup, focus containment, dan pengembalian fokus.
4. Amplop animasi dengan surat yang dapat dibuka dan disimpan kembali. Sudut surat dihiasi bunga dan daun rambat SVG yang tidak menangkap klik.
5. Kucing kecil di dekat kue berkedip dan menggerakkan ekor. Tap atau gunakan Enter/Space untuk menampilkan sapaan ulang tahun dan hati kecil. Teksnya ada di `cat` dalam konfigurasi. Animasi berhenti pada reduced motion.
6. Lilin dapat dipadamkan satu per satu atau sekaligus. Semua padam memunculkan ucapan akhir, confetti, 18 balon pastel, termasuk enam berbentuk hati, yang terbang dari bawah ke atas, dan kartu kejutan dengan pesan rahasia. Balon selesai dalam 12 detik, tidak menangkap klik, dan tidak muncul dalam mode reduced motion. Pesan dapat diakses dengan keyboard. Isi kartu dapat diedit melalui `surprise` di konfigurasi. Ulangi kejutan mengembalikan hadiah, surat, galeri, dan lilin ke kondisi awal.

Animasi dan confetti menghormati `prefers-reduced-motion`. Terdapat reveal saat scroll, polaroid bertahap, transisi lightbox, buka/tutup surat tanpa lompatan tinggi mendadak, dan asap lilin singkat. Dekorasi diabaikan pembaca layar, tombol memakai label dan fokus keyboard, dan perubahan lilin diumumkan melalui live region. Tidak menggunakan izin mikrofon; “Blow out the candles” bekerja lewat tap/tombol.

## Pengujian browser

```sh
npx playwright install chromium
npm run build
npm test
```

Playwright menjalankan preview produksi otomatis. Pengujian mencakup viewport **390 × 844** dan **1440 × 1000**, serta layout **320 px**, hadiah, lightbox, focus containment/restoration, tombol panah/Escape, swipe, buka/tutup surat, dua cara memadamkan lilin, reset, reduced motion, gambar lokal, dan bahasa halaman. Tes musik memakai MP3 pengguna yang sebenarnya: autoplay tanpa interaksi dengan kebijakan browser yang mengizinkannya, pemulihan lewat tap/klik halaman saat autoplay diblokir, aktivasi keyboard ketika `HEAD` tertunda, pause yang dihormati saat replay, decode tanpa error, durasi valid, waktu pemutaran bertambah, pause/resume, volume, loop, serta tanpa request Spotify/origin eksternal.

Rekomendasi lagu sesuai suasana desain (penilaian kreatif): [Until I Found You — Stephen Sanchez](https://www.stephensanchezofficial.com/releases-archive/until-i-found-you/) untuk romantis vintage; [Perfect — Ed Sheeran](https://www.edsheeran.com/music/571) untuk balada hangat; [Valentine — Laufey](https://open.spotify.com/track/2Bbg8E93YsbdudeUGxyDpH) untuk nuansa jazz-pop lembut. Integrasi mengikuti [dokumentasi embed Spotify](https://developer.spotify.com/documentation/embeds/tutorials/creating-an-embed).

`npm run test:unit` menjalankan tes MusicPlayer dengan media API yang disimulasikan: musik dinonaktifkan, 404, fallback HTML, gangguan jaringan, autoplay saat load, pemulihan penolakan lewat klik/sentuhan/keyboard, pause yang dihormati, pembersihan listener saat unmount, mode manual, dan kegagalan decode. Ini tidak menggantikan pemeriksaan audio asli setelah file final dipasang.

Screenshot disimpan di `artifacts/`; laporan HTML di `playwright-report/`. Buka laporan menggunakan `npx playwright show-report`. Hasil verifikasi aktual dicatat di `VERIFICATION.md`.

Panduan push GitHub, clone Linux, domain, dan update tersedia di [DEPLOY.md](DEPLOY.md). Proyek Compose memakai nama `neyna-birthday` dan image `neyna-birthday:latest`.

## Deploy: Docker Compose → Traefik → Cloudflare Tunnel

Alur request: **browser HTTPS → Cloudflare → cloudflared → entrypoint Traefik → Nginx container port 80**. `compose.yaml` tidak memiliki `ports:`; port Nginx tidak dipublikasikan ke host. `EXPOSE 80` pada Dockerfile adalah metadata container, bukan port publik.

Prasyarat pada server:

- Docker dan Docker Compose tersedia.
- Traefik aktif dengan Docker provider dan entrypoint internal HTTP (misalnya `web`).
- External Docker network tersedia dan juga dipakai Traefik.
- Cloudflare Tunnel aktif dan dapat menjangkau Traefik; hostname publik diarahkan ke Tunnel.

Salin `.env.example` ke `.env` (PowerShell: `Copy-Item .env.example .env`; Linux: `cp .env.example .env`). Isi:

```dotenv
BIRTHDAY_DOMAIN=birthday.example.com
TRAEFIK_NETWORK=traefik-public
TRAEFIK_ENTRYPOINT=web
```

Gunakan domain Anda tanpa `https://` atau path. Nama network dan entrypoint harus sama persis dengan infrastruktur yang ada. Jika network belum ada, buat dan hubungkan Traefik sebelum menjalankan website:

```sh
docker network create traefik-public
```

Konfigurasikan Public Hostname di Cloudflare Tunnel ke service **HTTP `http://traefik:80`** jika container Traefik memiliki nama/alias `traefik`, entrypoint `web` mendengarkan port 80, dan cloudflared berada pada network yang dapat menjangkaunya. Sesuaikan nama/port dengan server Anda. Pastikan HTTP Host header tetap domain website; pada pengaturan origin gunakan **HTTP Host Header** yang sama dengan `BIRTHDAY_DOMAIN` jika diperlukan. Jangan arahkan Tunnel langsung ke Nginx jika ingin memakai routing Traefik.

Contoh ingress untuk Tunnel yang dikelola melalui file (konfigurasi Tunnel/credentials berada di server, di luar repo ini):

```yaml
ingress:
  - hostname: birthday.example.com
    service: http://traefik:80
    originRequest:
      httpHostHeader: birthday.example.com
  - service: http_status:404
```

Default contoh ini memakai HTTPS pada sisi Cloudflare dan HTTP pada jalur internal Tunnel → Traefik. Jika server memakai entrypoint HTTPS internal, sesuaikan service Tunnel ke `https://...`, pengaturan sertifikat origin, dan tambahkan label `traefik.http.routers.neyna-birthday.tls: "true"` pada Compose. Nama entrypoint saja tidak mengaktifkan TLS router.

Validasi dan jalankan:

```sh
docker compose config --quiet
docker compose up -d --build
docker compose ps
docker compose logs --tail=50 birthday
docker compose exec birthday nginx -t
docker compose exec birthday wget -q -O - http://127.0.0.1/healthz
```

Validasi contoh tanpa membuat `.env`: `docker compose --env-file .env.example config --quiet`. Container memiliki healthcheck `/healthz`. Nginx memberikan fallback SPA, cache satu tahun untuk aset Vite ber-hash, cache satu jam untuk foto/musik, dan revalidasi HTML. File media hilang mengembalikan 404, bukan HTML.

Smoke test lokal tanpa Traefik/Tunnel dan tanpa port host: setelah build image, jalankan `node scripts/verify-container.mjs neyna-birthday:latest`. Script membuat container terisolasi sementara, memeriksa healthcheck, Nginx, HTML, SPA fallback, cache, dan 404, lalu menghapus container uji itu.

Update setelah personalisasi: `docker compose up -d --build`. Repo ini menyiapkan website; tidak membuat atau mengubah Tunnel, DNS, maupun Traefik server Anda secara otomatis.

## Struktur

```text
src/config/birthday.ts      Semua konten dan konfigurasi musik
src/components/             GiftBox, BirthdayHero, PolaroidGallery,
                            PhotoLightbox, LetterEnvelope, BirthdayCake,
                            MusicPlayer, dan dekorasi reusable
src/styles.css              Token Tailwind dan gaya responsif
public/images/              Tujuh foto JPG pengguna dan SVG cadangan
tests/                      Pengujian browser
artifacts/                  Screenshot hasil pengujian
Dockerfile                  Node build → Nginx Alpine
compose.yaml                Routing Traefik tanpa published ports
nginx.conf                  SPA, healthcheck, cache, respons media
```

Referensi integrasi: [Motion for React](https://motion.dev/docs/react-installation) dan [Tailwind CSS dengan Vite](https://tailwindcss.com/docs/installation/using-vite).
