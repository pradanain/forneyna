# Deploy di server Linux

Website ini dibangun di server menggunakan Docker, lalu disajikan oleh Nginx melalui Traefik dan Cloudflare Tunnel yang sudah ada. Node.js tidak perlu dipasang di server. Foto dan MP3 ikut dibundel dalam image.

Rekomendasi domain: **forneyna.pradanain.id**. Ini hanya contoh konfigurasi; gunakan `birthday-neyna.pradanain.id` atau subdomain lain jika lebih disukai.

## 1. Push proyek ke GitHub dari PC ini

Buat repository kosong di GitHub. Repository private cocok untuk menyimpan sumber website dan foto pribadi ini.

Jalankan dari folder proyek, jika belum menjadi repository Git:

```sh
git init -b main
git add .
git status
git commit -m "Prepare Neyna birthday website for deployment"
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Ganti `USERNAME/REPOSITORY` dengan repository milikmu. `.gitignore` sudah mengecualikan `.env`, `node_modules`, build lokal, screenshot, log, dan laporan tes. Folder `public/`, termasuk tujuh JPG dan MP3, harus ikut di-commit. Jika repository sudah ada, gunakan remote dan branch yang sesuai.

## 2. Clone di server

```sh
git clone https://github.com/USERNAME/REPOSITORY.git neyna-birthday
cd neyna-birthday
cp .env.example .env
nano .env
```

Untuk repository private, gunakan akses SSH atau autentikasi GitHub yang sudah disiapkan pada server.

Isi `.env`, misalnya:

```dotenv
BIRTHDAY_DOMAIN=forneyna.pradanain.id
TRAEFIK_NETWORK=traefik-public
TRAEFIK_ENTRYPOINT=web
```

Nama network dan entrypoint harus mengikuti Traefik servermu. Domain diisi tanpa `https://` dan tanpa path. `.env` mengatur routing container; isi surat/foto tetap berasal dari `src/config/birthday.ts` dan `public/`.

## 3. Periksa Traefik yang sudah berjalan

```sh
docker compose version
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}'
docker network ls
```

Gunakan Compose V2 yang mendukung `up --wait`. Untuk melihat network Traefik, ganti `NAMA_CONTAINER_TRAEFIK` pada perintah ini:

```sh
docker inspect NAMA_CONTAINER_TRAEFIK --format '{{json .NetworkSettings.Networks}}'
```

Pilih network yang terhubung ke Traefik untuk `TRAEFIK_NETWORK`. Compose memakai network eksternal ini dan tidak membuat ulang Traefik atau Tunnel. Traefik harus mengaktifkan Docker provider agar membaca label routing website.

## 4. Build dan jalankan website

```sh
docker compose config --quiet
docker compose build --pull birthday
docker compose up -d --no-deps --wait --wait-timeout 120 birthday
docker compose ps
docker compose logs --tail=50 birthday
docker compose exec -T birthday nginx -t
docker compose exec -T birthday wget -q -O - http://127.0.0.1/healthz
```

Endpoint health harus menjawab `ok`, dan status container harus `healthy`.

Proyek Compose bernama `neyna-birthday`, service bernama `birthday`, dan image lokal bernama `neyna-birthday:latest`. Container tidak memakai `container_name`, tidak memublikasikan host port, dan tidak menggunakan volume host. Nginx mendengarkan port 80 hanya di dalam Docker network. Pengaturan ini memungkinkan website berjalan bersama container lain yang sudah ada.

## 5. Hubungkan domain melalui Cloudflare Tunnel

Pada Tunnel yang sudah ada, tambahkan hostname publik:

| Pengaturan | Contoh |
| --- | --- |
| Hostname | `forneyna.pradanain.id` |
| Service type | `HTTP` |
| Service URL | `traefik:80` |
| HTTP Host Header | `forneyna.pradanain.id` |

`traefik:80` adalah contoh alamat internal. Gunakan nama/alias dan port entrypoint Traefik yang benar-benar dapat dijangkau oleh `cloudflared`. Jika keduanya berupa container, keduanya harus berbagi network yang sesuai. Host header harus cocok dengan `BIRTHDAY_DOMAIN`. Pastikan hostname tersebut diarahkan ke Tunnel pada DNS Cloudflare.

Contoh di atas menggunakan HTTPS pada sisi pengunjung dan HTTP dari Tunnel menuju Traefik. Jika konfigurasi server menggunakan entrypoint HTTPS internal, ikuti pola routing situs lain pada server: sesuaikan service Tunnel ke HTTPS, entrypoint, sertifikat origin, dan label `traefik.http.routers.neyna-birthday.tls: "true"`. Mengganti nama entrypoint saja tidak mengaktifkan TLS router.

Setelah hostname terpasang, buka `https://forneyna.pradanain.id` dan periksa hadiah, tujuh foto, musik, surat, kucing, dan kejutan balon melalui HP. Autoplay bersuara tetap mengikuti kebijakan browser; tap pertama menjadi pemicu cadangan.

## Update berikutnya

Setelah perubahan di-push ke GitHub, jalankan dari folder clone pada server:

```sh
git pull --ff-only
docker compose config --quiet
docker compose build --pull birthday
docker compose up -d --no-deps --wait --wait-timeout 120 birthday
docker compose ps
```

Jalankan setiap langkah setelah langkah sebelumnya berhasil. File `.env` server tetap tersimpan. Tidak diperlukan registry image: server membangun image dari source GitHub.

## Jika domain belum terbuka

- **Container unhealthy:** lihat `docker compose logs --tail=100 birthday` dan jalankan pemeriksaan Nginx/health di atas.
- **Traefik 404:** periksa kecocokan domain, Host header, nama entrypoint, dan Docker provider.
- **502/504:** pastikan Traefik dan website berbagi `TRAEFIK_NETWORK`; pastikan Tunnel dapat menjangkau alamat Traefik yang dipilih.
- **Foto/musik lama:** lakukan hard refresh; foto dan musik memiliki cache satu jam. Perubahan source memerlukan build ulang.

Domain, DNS, konfigurasi Traefik/Tunnel, serta container server belum diubah otomatis oleh proyek ini.
