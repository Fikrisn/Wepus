# 🌐 Wepus - Fullstack App with HonoJS, DrizzleORM, React, Bun, TypeScript & TailwindCSS

Ini adalah proyek fullstack modern yang dibangun menggunakan:

- ⚡ **[Bun](https://bun.sh/)** sebagai package manager dan runtime JavaScript/TypeScript
- 🔥 **[Hono](https://hono.dev/)** untuk backend API (minimal & cepat)
- 💾 **[Drizzle ORM](https://orm.drizzle.team/)** untuk koneksi database PostgreSQL
- 🧩 **[React + TypeScript](https://react.dev/)** dengan **[Vite](https://vitejs.dev/)** untuk frontend
- 💅 **[Tailwind CSS](https://tailwindcss.com/)** untuk styling UI

---

# 📦 Instalasi Project

# Inisialisasi Frontend (React + TypeScript)
```bash
bun create vite@latest
# Masukkan nama project
# Pilih framework: React
# Pilih variant: TypeScript
cd nama-project
bun install
```
----

# Menambahkan backend (Honojs)
```bash
bun add hono
```
# install ORM & PostgreSQL Client
```bash
bun add drizzle-orm dotenv
bun add -D drizzle-kit tsx @types/pg
```

# Setup Database (PostgreSQL via pgAdmin)
buat database di pgAdmin : wepus <br>
tambahkan ke .env:
DATABASE_URL=postgres://postgres:root@localhost:5432/wepus

# Struktur Direktori
```bash
project-root/
│
├── backend/
│   ├── index.ts               # Entry point backend
│   ├── routers/               # Folder untuk routing berdasarkan tabel
│
├── db/
│   ├── index.ts               # Koneksi ke Drizzle ORM
│   └── schema.ts              # Skema tabel database
│
├── frontend/
│   ├── src/                   # React source files
│   ├── index.html
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── drizzle.config.ts         # Konfigurasi Drizzle CLI
├── .env
└── package.json
```

# Menambahkan perintah di script yang digunakan untuk memulai project
```bash
"scripts": {
  "dev:backend": "bun run --hot backend/index.ts",
  "dev:frontend": "vite --config frontend/vite.config.ts"
}
```

dev:backend   digunakan untuk memulai server
dev:frontend  digunakan untuk memulai tampilan

# Cara menjalankan backend 
```bash
bun run dev:backend
```

# Cara menjalankan frontend
```bash
bun run dev:frontend
```

# Generate SQL schema dari kode Typescript
```bash
bunx drizzle-kit generate
```
# Push schema ke Database
```bash
bunx drizzle-kit push
```
# Mengakses drizzle studio (untuk menambahkan data secara manual)
```bash
bunx drizzle-kit studio
```

# Beberapa tips 
Gunakan camelCase untuk nama route, contoh lariRoute
Gunakan .gitignore untuk menyimpan variable sensitif agar 