# 🎬 KIROFLIX - Netflix kabi Streaming Platforma

Netflix-dan ilhomlangan to'liq stack kino streaming platformasi.

## 🛠️ Texnologiyalar

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

---

## 🚀 Loyihani Ishga Tushirish

### 1. Backend

```bash
cd backend

# .env fayl yarating
cp .env.example .env
# .env ni oching va o'zgartiring:
#   MONGO_URI=mongodb://localhost:27017/netflix-clone
#   JWT_SECRET=your_secret_key

# Dependencies o'rnatish
npm install

# (Ixtiyoriy) Namuna ma'lumotlarni qo'shish
node src/data/seedMovies.js

# Development serverni ishga tushirish
npm run dev
```

Backend `http://localhost:5000` da ishlaydi.

### 2. Frontend

```bash
cd frontend

# Dependencies o'rnatish
npm install

# Development serverni ishga tushirish
npm run dev
```

Frontend `http://localhost:5173` da ishlaydi.

---

## 📂 Loyiha Tuzilmasi

```
netflix-clone/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js    # Ro'yxatdan o'tish, kirish
│   │   │   └── movieController.js   # Filmlar CRUD
│   │   ├── models/
│   │   │   ├── User.js              # Foydalanuvchi modeli
│   │   │   └── Movie.js             # Film modeli
│   │   ├── middleware/
│   │   │   └── auth.js              # JWT himoya
│   │   ├── routes/
│   │   │   ├── auth.js              # Auth yo'llar
│   │   │   └── movies.js            # Film yo'llar
│   │   ├── data/
│   │   │   └── seedMovies.js        # Namuna ma'lumotlar
│   │   └── index.js                 # Express server
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.ts             # API klient
    │   ├── components/
    │   │   ├── Navbar.tsx           # Navigatsiya
    │   │   ├── HeroBanner.tsx       # Asosiy banner
    │   │   ├── MovieCard.tsx        # Film kartochkasi
    │   │   ├── MovieRow.tsx         # Gorizontal qator
    │   │   ├── VideoPlayer.tsx      # Video player
    │   │   └── ProtectedRoute.tsx   # Himoyalangan yo'l
    │   ├── contexts/
    │   │   └── AuthContext.tsx      # Auth holat
    │   ├── data/
    │   │   └── mockMovies.ts        # Namuna filmlar (offline)
    │   ├── pages/
    │   │   ├── HomePage.tsx         # Bosh sahifa
    │   │   ├── LoginPage.tsx        # Kirish
    │   │   ├── RegisterPage.tsx     # Ro'yxatdan o'tish
    │   │   ├── MovieDetailPage.tsx  # Film batafsil
    │   │   ├── SearchPage.tsx       # Qidiruv
    │   │   └── ProfilePage.tsx      # Profil
    │   ├── types/
    │   │   └── index.ts             # TypeScript turlari
    │   └── App.tsx                  # Asosiy ilova
    └── package.json
```

---

## ✨ Xususiyatlar

- 🔐 JWT orqali autentifikatsiya
- 🎬 Netflix uslubidagi UI (qora mavzu, qizil aksent)
- 🔍 Film qidirish va janr bo'yicha filtrlash
- 📋 Tomosha ro'yxati (watchlist)
- 🎭 Film batafsil sahifasi
- ▶️ HTML5 video player
- 📱 Responsive dizayn
- 🔄 Backend bo'lmasa mock data bilan ishlaydi

---

## 🌐 API Endpointlar

### Auth
| Method | URL | Tavsif |
|--------|-----|--------|
| POST | /api/auth/register | Ro'yxatdan o'tish |
| POST | /api/auth/login | Kirish |
| GET | /api/auth/profile | Profilni olish |
| PUT | /api/auth/profile | Profilni yangilash |

### Filmlar
| Method | URL | Tavsif |
|--------|-----|--------|
| GET | /api/movies | Barcha filmlar |
| GET | /api/movies/featured | Taniqli filmlar |
| GET | /api/movies/trending | Trending filmlar |
| GET | /api/movies/search?q= | Qidirish |
| GET | /api/movies/genre/:genre | Janr bo'yicha |
| GET | /api/movies/:id | Bitta film |
| POST | /api/movies/:id/watchlist | Ro'yxatga qo'shish |
| DELETE | /api/movies/:id/watchlist | Ro'yxatdan o'chirish |
