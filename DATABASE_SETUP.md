# Veritabanı ve Ortam Ayarları

Bu proje iki ayrı PostgreSQL düzeniyle çalışabilir:

- Local geliştirme için `backend/.env` içindeki ayrı değişkenler kullanılır.
- Sunucu ortamında varsa `DATABASE_URL` kullanılır.

## Local Veritabanı

Backend dosyaları localde çalışırken varsayılan olarak şu değerler kullanılır:

- Host: `localhost`
- Port: `5432`
- Database: `gncsarkuteri`
- User: `postgres`
- Password: `1234`

Local bağlantı stringi:

```text
postgresql://postgres:1234@localhost:5432/gncsarkuteri
```

## Sunucu Veritabanı

Backend kodu `DATABASE_URL` varsa onu kullanır. Bu yüzden sunucuda ayrı bir PostgreSQL olabilir.

Örnek yapı:

```text
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<database>
NODE_ENV=production
PORT=5000
```

## pgAdmin'de Kayıtları Görme

Kullanıcı kayıtlarını görmek için şu sorguyu çalıştır:

```sql
SELECT id, name, email, role, created_at
FROM users
ORDER BY id DESC;
```

Tabloda veri yoksa şunlardan biri olur:

- Yanlış database'e bakıyorsundur.
- Henüz o tabloya kayıt atılmamıştır.
- Backend başka bir veritabanına bağlanıyordur.

## Admin Hesabı

Projede varsayılan admin hesabı vardır:

- Email: `admin@gncsarkuteri.com`
- Şifre: `admin123`

Admin yetkisi için `users` tablosunda `role` alanı `admin` olmalıdır.

## Local İçin `.env` Örneği

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=gncsarkuteri

JWT_SECRET=gncsarkuteri_ozel_anahtar_2026

PORT=5000
NODE_ENV=development
```

## Sunucu İçin `.env` Örneği

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<database>

JWT_SECRET=<gizli_bir_deger>

PORT=5000
NODE_ENV=production
```

## Hızlı Kontrol Listesi

1. Backend'in hangi klasörden çalıştığını kontrol et.
2. `backend/.env` ile local DB'nin aynı olduğundan emin ol.
3. pgAdmin'de doğru database'i aç.
4. `users` tablosunda `role` kolonuna bak.
5. Gerekirse admin rolünü SQL ile ata:

```sql
UPDATE users
SET role = 'admin'
WHERE email = 'senin-mailin@example.com';
```
