# KARMA - Kartu Asrama Mahasiswa

Sistem manajemen demerit asrama (peringatan, kartu kuning, kartu merah) dan pembersihannya lewat Sanksos (sanksos sosial).

## Aturan
- 3 peringatan -> 1 demerit kuning
- 2 demerit kuning -> 1 demerit merah
- Pelanggaran fatal -> langsung demerit merah
- Demerit dibersihkan lewat Sanksos: mahasiswa mengajukan, Bapak Asrama memberi tugas, mahasiswa mengerjakan, Bapak Asrama memverifikasi

## Teknologi
- Back-end: Express.js + SQLite (`node:sqlite` bawaan Node, butuh Node 22.13 atau lebih baru), autentikasi JWT
- Front-end: **ReactJS** (React 19, Vite, Tailwind CSS v4, Redux Toolkit, React Router, SweetAlert2, Vitest + Testing Library)

## Struktur
```
backend/    API Express + SQLite + tes
frontend/   Aplikasi ReactJS (struktur berbasis fitur)
```

Struktur front-end (`frontend/src`):
```
features/
  auth/        api/ states/ pages/ layouts/     login, token, data pengguna
  mahasiswa/   api/ states/ pages/              rekap + tambah mahasiswa (Bapak Asrama)
  pelanggaran/ api/ states/ pages/              catat dan riwayat pelanggaran
  demerit/     api/ states/                     demerit + ringkasan kartu mahasiswa
  sanksos/     api/ states/ pages/              request dan proses Sanksos
  karma/       layouts/ components/ pages/      layout utama, sidebar, navbar, dashboard
helpers/       apiHelper, toolsHelper, dataHelper
hooks/         useInput
store.js       Redux store
```
Setiap fitur punya `api` (pemanggilan HTTP), `states` (reducer + async action Redux), dan `pages`, lengkap dengan file tes `*.test.js(x)`.

## Menjalankan dari nol (paling cepat, satu server)
```bash
npm install
npm run setup     # install back-end + front-end, build front-end, buat akun contoh
npm start         # buka http://localhost:3000
```

## Mode development (ngoding, tampilan auto-refresh)
```bash
npm install
npm run dev       # API di :3000 dan front-end di http://localhost:5173 sekaligus
```
(`npm run setup` perlu dijalankan sekali sebelumnya untuk install dan seed.)

## Menjalankan manual (dua terminal)
```bash
# 1. Back-end
cd backend
npm install
npm run seed          # membuat akun contoh
npm start             # API di http://localhost:3000

# 2. Front-end (terminal baru)
cd frontend
npm install
npm run dev           # buka http://localhost:5173
```

Back-end otomatis menyajikan hasil build front-end jika folder `frontend/dist` ada.

## Akun contoh (hasil seed)
| Peran | NIM / username | Password |
|---|---|---|
| Bapak Asrama | `pembina` | `pembina123` |
| Mahasiswa | `1001` | `mhs123` |
| Mahasiswa | `1002` | `mhs123` |

Ganti password ini dan set `JWT_SECRET` di server produksi.

## Tes
```bash
npm test                          # back-end + front-end sekaligus
cd backend  && npm test           # tes API (node:test)
cd frontend && npm test           # tes front-end (Vitest)
cd frontend && npm run test:coverage   # laporan cakupan (target 100%)
```

## Environment variable
| Variabel | Fungsi | Default |
|---|---|---|
| `PORT` | Port server | 3000 |
| `JWT_SECRET` | Kunci token login | `ganti-di-produksi` |
| `DB_FILE` | Lokasi file SQLite | `backend/demerit.db` |
| `VITE_API_BASE_URL` | (front-end) alamat API jika dipisah server, mis. `http://localhost:3000/api` | `/api` |

## Endpoint API
| Method | Path | Akses |
|---|---|---|
| POST | /api/auth/login | publik |
| GET | /api/auth/me | semua peran (data akun yang login) |
| GET/POST | /api/mahasiswa | Bapak Asrama |
| GET/POST | /api/pelanggaran | GET: semua peran, POST: Bapak Asrama |
| GET | /api/demerit | semua peran (mahasiswa hanya miliknya) |
| GET | /api/ringkasan | mahasiswa |
| GET/POST | /api/sanksos | POST: mahasiswa |
| PATCH | /api/sanksos/:id | aksi: setujui, tolak, selesai (Bapak Asrama); dikerjakan (mahasiswa) |
