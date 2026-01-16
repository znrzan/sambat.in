# SAMBAT.IN 😤

**Sambat aja dulu.**  
Platform anonim buat curhat, ngeluh, atau sekadar ngoceh. 100% bebas, identitasmu tersembunyi, dan kontenmu bisa auto-hangus.

![Lihat Demo](https://sambatin.vercel.app)

## 🌟 Fitur Utama

-   **🎭 Identitas Unik & Anonim**  
    Otomatis mendapatkan nama samaran lucu ala Indonesia (seperti "Cireng Renyah", "Kucing Ambis") tanpa perlu login atau registrasi. Privasi terjaga 100%.

-   **⏱️ Konten Hangus (Ephemeral)**  
    Atur durasi "sambat" kamu. Pilih untuk hilang otomatis dalam 24 jam, 1 minggu, atau biarkan selamanya.

-   **⚡ Real-time**  
    Sambatan baru dan reaksi muncul secara instan tanpa perlu refresh halaman.

-   **🚫 Bebas Tracking**  
    Tidak ada pelacakan data pribadi. Curhat sebebas-bebasnya.

## 🛠️ Tech Stack

Project ini dibangun menggunakan teknologi modern:

-   **Framework:** [Next.js 15](https://nextjs.org/) (App Directory)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Animation:** [Framer Motion](https://www.framer.com/motion/)
-   **State Management:** [Zustand](https://github.com/pmndrs/zustand)
-   **Data Fetching:** [TanStack Query](https://tanstack.com/query/latest)
-   **Backend & Database:** [Supabase](https://supabase.com/)
-   **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Cara Menjalankan

Ikuti langkah-langkah ini untuk menjalankan project di local machine kamu:

1.  **Clone repository**
    ```bash
    git clone https://github.com/username/sambatin.git
    cd sambatin
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # atau
    yarn install
    ```

3.  **Setup Environment Variables**
    Salin file `.env.example` menjadi `.env.local` dan isi kredenal Supabase kamu.
    ```bash
    cp .env.example .env.local
    ```
    Isi variable berikut:
    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

    # Formspree (Feedback Form)
    NEXT_PUBLIC_FORMSPREE_ENDPOINT=xxx

    # Cloudflare Turnstile (Protection)
    NEXT_PUBLIC_TURNSTILE_SITE_KEY=xxx
    TURNSTILE_SECRET_KEY=xxx

    # Cloudinary (Voice Uploads)
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```

4.  **Jalankan Development Server**
    ```bash
    npm run dev
    ```

5.  **Buka di Browser**
    Buka [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 📂 Struktur Project

```
sambatin/
├── src/
│   ├── app/          # Next.js App Router pages & layouts
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks (usePersona, useSambats, etc.)
│   ├── lib/          # Utilities & helper functions
│   └── types/        # TypeScript type definitions
├── supabase/         # Supabase schema & migrations
└── ...
```

## 🚢 Deployment

Cara termudah untuk deploy aplikasi Next.js adalah menggunakan [Vercel](https://vercel.com/new).

1.  Push code kamu ke Git provider (GitHub/GitLab/Bitbucket).
2.  Import project di Vercel.
3.  Di bagian **Environment Variables**, masukkan variable yang sama dengan di `.env.local`:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `NEXT_PUBLIC_FORMSPREE_ENDPOINT`
    - `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
    - `TURNSTILE_SECRET_KEY`
    - `CLOUDINARY_CLOUD_NAME`
    - `CLOUDINARY_API_KEY`
    - `CLOUDINARY_API_SECRET`
4.  Klik **Deploy**.

Alternatifnya, kamu bisa build secara manual untuk production:

```bash
npm run build
npm start
```

## 🤝 Kontribusi

Pull request dipersilakan. Untuk perubahan besar, mohon buka issue terlebih dahulu untuk mendiskusikan apa yang ingin Anda ubah.

## ☕ Donasi

Suka dengan project ini? Traktir kopi developer-nya di [Trakteer](https://trakteer.id/zanrazann/tip).

---

Dibuat dengan 😡 dan ☕ oleh [ozann].
