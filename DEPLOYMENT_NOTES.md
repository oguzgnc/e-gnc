# GNC Şarkuteri - Deployment Notları

**Tarih:** 27 Aralık 2025

---

## 📋 Proje Özeti

**Proje Adı:** GNC Şarkuteri E-Ticaret Sitesi  
**Frontend:** React + Vite  
**Backend:** Node.js + Express + PostgreSQL  
**Frontend Deploy:** Netlify  
**Backend Deploy:** Render.com  
**Database:** Render PostgreSQL (Free Tier)

---

## 🔗 Canlı Linkler

- **Frontend URL:** https://e-genc.netlify.app
- **Backend API URL:** https://gncsarkuteri-backend.onrender.com/api
- **GitHub Repository:** https://github.com/oguzgnc/e-gnc

---

## 🎯 Bugün Yapılan İşlemler

### 1. **Backend Deployment (Render.com)**

#### Database Oluşturma
- Render'da PostgreSQL database oluşturuldu: `gncsarkuteri-db`
- Database bilgileri:
  - Hostname: `dpg-d57ruvv5r7bs738b64p0-a`
  - Port: `5432`
  - Database: `gncsarkuteri_db`
  - User: `gncsarkuteri_db_user`
  - Internal URL: `postgresql://gncsarkuteri_db_user:***@dpg-d57ruvv5r7bs738b64p0-a/gncsarkuteri_db`

#### Web Service Kurulumu
- Render'da Node.js Web Service oluşturuldu
- GitHub repository bağlandı
- Build ve Start komutları:
  - **Root Directory:** `backend`
  - **Build Command:** `npm install`
  - **Start Command:** `node server.js`
  - **Runtime:** Node.js 22.16.0

#### Environment Variables
Aşağıdaki environment variables eklendi:
```
DATABASE_URL=postgresql://gncsarkuteri_db_user:***@dpg-d57ruvv5r7bs738b64p0-a/gncsarkuteri_db
JWT_SECRET=gncsarkuteri_super_secret_key_2024
PORT=5000
NODE_ENV=production
```

### 2. **Backend Kod Değişiklikleri**

#### Database Configuration Güncelleme
- `backend/config/database.js` dosyası güncellendi
- `DATABASE_URL` environment variable desteği eklendi
- Connection string ile bağlantı sağlandı

```javascript
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: false, // Render internal connection için SSL gerekmez
    })
  : new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'gncsarkuteri',
    });
```

#### Admin Hesabı Yönetimi
- `backend/config/initDatabase.js` dosyasına varsayılan admin oluşturma kodu eklendi (kullanılmadı)
- `backend/routes/setupRoutes.js` yeni route oluşturuldu
- Mevcut kullanıcıyı admin yapma endpoint'i: `POST /api/setup/make-first-admin`

### 3. **Frontend Deployment (Netlify)**

#### Environment Variables
- `.env` dosyası oluşturuldu (development için):
  ```
  VITE_API_URL=http://localhost:5000/api
  ```

- `.env.production` dosyası oluşturuldu (production için):
  ```
  VITE_API_URL=https://gncsarkuteri-backend.onrender.com/api
  ```

#### API Service Güncellemesi
- `src/services/api.js` dosyası güncellendi
- Environment variable desteği eklendi:
  ```javascript
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  ```

#### Build ve Deploy
- Production build oluşturuldu: `npm run build`
- `dist` klasörü Netlify'ye manuel olarak deploy edildi
- GitHub entegrasyonu yapılmadı (manuel deployment kullanılıyor)

### 4. **Admin Hesabı Oluşturma**

PowerShell komutu ile admin hesabı oluşturuldu:
```powershell
Invoke-RestMethod -Uri "https://gncsarkuteri-backend.onrender.com/api/setup/make-first-admin" -Method POST -ContentType "application/json" -Body '{"email":"admin1@gmail.com"}'
```

**Admin Giriş Bilgileri:**
- Email: `admin1@gmail.com`
- Şifre: `admin123`

---

## 🗄️ Database Yapısı

### Users Tablosu
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Orders Tablosu
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

### Order Items Tablosu
```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(100) NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  volume VARCHAR(100)
)
```

### Products Tablosu
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  options JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

---

## 🚀 Deployment Süreci

### Frontend Yeniden Deploy Etme
1. Değişiklikleri yap
2. Production build oluştur:
   ```bash
   npm run build
   ```
3. `dist` klasörünü Netlify'ye sürükle-bırak

### Backend Yeniden Deploy Etme
1. Değişiklikleri yap
2. GitHub'a push et:
   ```bash
   git add .
   git commit -m "Commit mesajı"
   git push
   ```
3. Render otomatik olarak yeniden deploy eder (1-2 dakika)

---

## 🔧 Önemli Komutlar

### Local Development

**Frontend Çalıştırma:**
```bash
npm run dev
```

**Backend Çalıştırma:**
```bash
cd backend
node server.js
```

**Production Build:**
```bash
npm run build
```

### Git İşlemleri
```bash
git add .
git commit -m "Mesaj"
git push
```

### Admin Oluşturma (Production)
```powershell
Invoke-RestMethod -Uri "https://gncsarkuteri-backend.onrender.com/api/setup/make-first-admin" -Method POST -ContentType "application/json" -Body '{"email":"email@example.com"}'
```

---

## ⚠️ Önemli Notlar

### Render Free Tier Sınırlamaları
- **Inactivity Spin Down:** Backend 15 dakika kullanılmadığında otomatik olarak uyku moduna geçer
- İlk istek 50+ saniye sürebilir (cold start)
- Aylık 750 saat ücretsiz kullanım
- PostgreSQL database 1 GB storage

### Nelify Free Tier
- Manuel deployment kullanılıyor
- Aylık 100 GB bandwidth
- Otomatik HTTPS

### Güvenlik
- `JWT_SECRET` güvenli bir şekilde saklanıyor
- Database şifreleri environment variable'larda
- CORS ayarlanmış
- Şifreler bcrypt ile hash'lenmiş

---

## 🐛 Karşılaşılan Sorunlar ve Çözümler

### Problem 1: Network Fetch Hatası
**Sorun:** Netlify'deki site backend'e ulaşamıyordu  
**Çözüm:** Backend Render'a deploy edildi ve frontend environment variables güncellendi

### Problem 2: Database Connection Error (ENOTFOUND)
**Sorun:** Backend database'e bağlanamıyordu, hostname eksikti  
**Çözüm:** `DATABASE_URL` connection string kullanılarak tam hostname ile bağlantı sağlandı

### Problem 3: Admin Hesabı Yok
**Sorun:** Production database boştu, admin hesabı yoktu  
**Çözüm:** `/api/setup/make-first-admin` endpoint'i oluşturuldu ve mevcut kullanıcı admin yapıldı

---

## 📝 Yapılabilecek İyileştirmeler

### Kısa Vadeli
- [ ] Netlify'yi GitHub'a bağla (otomatik deployment)
- [ ] Setup route'unu kaldır (güvenlik için)
- [ ] Error logging sistemi ekle
- [ ] Backend'e rate limiting ekle

### Orta Vadeli
- [ ] Email doğrulama sistemi
- [ ] Şifre sıfırlama özelliği
- [ ] Ürün resimleri için Cloudinary entegrasyonu
- [ ] Admin paneline analitik ekle

### Uzun Vadeli
- [ ] Payment gateway entegrasyonu
- [ ] SMS bildirimleri
- [ ] Responsive tasarım iyileştirmeleri
- [ ] SEO optimizasyonu
- [ ] CI/CD pipeline kurulumu

---

## 📞 Destek ve İletişim

**GitHub Repository:** https://github.com/oguzgnc/e-gnc

**Render Dashboard:**
- Web Service: gncsarkuteri-backend
- PostgreSQL: gncsarkuteri-db

**Netlify Dashboard:**
- Site: e-genc

---

## ✅ Başarıyla Tamamlanan Özellikler

- ✅ Backend API production'da çalışıyor
- ✅ Frontend production'da çalışıyor
- ✅ PostgreSQL database production'da
- ✅ Kullanıcı kayıt/giriş sistemi çalışıyor
- ✅ Admin paneli erişilebilir
- ✅ CORS yapılandırması tamamlandı
- ✅ Environment variables ayarlandı
- ✅ JWT authentication çalışıyor

---

**Son Güncelleme:** 27 Aralık 2025  
**Durum:** ✅ Production'da Canlı ve Çalışıyor
