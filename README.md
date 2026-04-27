# Fixora

Fixora, İngilizce console ve browser hata mesajlarını Türkçe, sade ve uygulanabilir açıklamalara dönüştüren AI destekli bir web uygulamasıdır. Ürün odağı, hata mesajını hızlıca anlamlandırmak ve kullanıcıya doğrudan işe yarar bir sonraki adımı sunmaktır.

Önceki adı `errorinsight` idi; proje artık Fixora adıyla devam ediyor.

## Canlı Demo

Frontend: https://getfixora.dev

Backend: https://fixora-api-loyo.onrender.com

## Ekran Görüntüsü

![Fixora ana sayfa ekran görüntüsü](./docs/fixora-homepage.png)

## Mevcut Durum

Fixora, production ortamında çalışan bir web ürünü olarak canlı domain üzerinden yayınlanmaktadır. Frontend React + Vite + Tailwind ile, backend Node.js + Express ile çalışır; veriler MongoDB Atlas üzerinde tutulur ve analizler Google Gemini ile üretilir.

### Tamamlananlar

- Canlı domain yayında: https://getfixora.dev
- Backend Render üzerinde çalışıyor.
- React + Vite + Tailwind frontend yapısı tamamlandı.
- Node.js + Express backend yapısı tamamlandı.
- MongoDB Atlas bağlantısı aktif.
- Google Gemini ile analiz üretimi aktif.
- Register, login ve logout auth akışları tamamlandı.
- `/analyze` ve `/history` protected route’ları aktif.
- `/share/:slug` public, SEO uyumlu analiz sayfaları aktif.
- Shared sayfalar için meta, og, canonical ve route-level meta kontrolleri eklendi.
- JSON-LD structured data eklendi.
- Dinamik sitemap share linklerini içeriyor.
- Google Search Console kurulumu yapıldı ve sitemap gönderildi.
- Analyze sonucu ekranından direkt paylaşım linki kopyalama aksiyonu eklendi.
- History içinde paylaşım linki oluşturma ve kopyalama akışı eklendi.
- History pagination, filter, search ve clear-all akışları tamamlandı.
- Analyze loading UX iyileştirildi; stale request ve race condition riskleri azaltıldı.
- Similar history yükleme akışı ana sonucu bloklamayacak şekilde ayrıldı.
- History detail loading UX iyileştirildi.
- Share sonrası history detail yenileme akışı eklendi.

## Ne Problemi Çözüyor

Geliştiriciler özellikle React, Node.js, build tool ve API katmanında gelen hata mesajlarını çoğu zaman teknik ve dağınık biçimde görür. Fixora, bu mesajları daha anlaşılır hale getirerek neyin bozulduğunu, neden bozulduğunu ve ne yapılması gerektiğini Türkçe olarak özetler.

Bu yaklaşım özellikle şu durumlarda işe yarar:
- Yeni bir hata mesajının hızlıca anlaşılması gerektiğinde
- Junior geliştiricilerin çözüm adımlarını daha net görmesi gerektiğinde
- Geçmiş analizlerin tekrar incelenmesi gerektiğinde

## Temel Özellikler

- İngilizce hata mesajını Türkçe açıklamaya dönüştürür.
- Muhtemel nedenleri ve çözüm adımlarını ayrı ayrı sunar.
- Örnek kod parçasını analiz akışına dahil eder.
- Analiz sonuçlarını history altında saklar.
- Authenticated user scope ile history yönetimi sağlar.
- Analiz sonucu ekranından direkt paylaşım linki oluşturup kopyalamayı destekler.
- History ekranında paylaşım linki oluşturma ve kopyalama akışı sağlar.
- Paylaşılan analizler için SEO uyumlu public `/share/:slug` sayfaları üretir.
- Dinamik sitemap üzerinden share linklerini arama motorlarına açar.
- Shared sayfalarda meta, og, canonical ve JSON-LD yapılandırmasını uygular.
- JWT tabanlı auth ile register, login ve logout akışlarını destekler.
- Session restore ile sayfa yenileme sonrası oturumu geri yükler.
- Protected route’lar üzerinden `/analyze` ve `/history` erişimini sınırlar.
- Public-only route’lar ile `/login` ve `/register` sayfalarını ayırır.
- Network hatası ile auth hatasını ayrı ele alır.
- Rate limiting ile API kötüye kullanımını sınırlar.
- Analyze ve history ekranlarında yükleme / geçiş UX’i daha akıcıdır.

## Kullanılan Teknolojiler

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- React Hot Toast
- React Syntax Highlighter

### Backend
- Node.js
- Express.js
- Mongoose
- express-rate-limit

### AI
- Google Gemini API

### Veritabanı
- MongoDB Atlas

## Çalışma Akışı

1. Kullanıcı hata mesajını ve isterse ilgili kod parçasını girer.
2. Frontend, isteği JWT ile backend’e gönderir.
3. Backend, Gemini API üzerinden analiz üretir.
4. Sonuç Türkçe olarak kullanıcıya gösterilir.
5. Analiz kaydı history’ye eklenir.
6. Kullanıcı daha sonra aynı sonucu history ekranından tekrar açabilir.

## Kurulum

### 1) Repoyu klonla

```bash
git clone <repo-url>
cd fixora
```

### 2) Backend bağımlılıklarını yükle

```bash
cd backend
npm install
```

### 3) Frontend bağımlılıklarını yükle

```bash
cd ../frontend
npm install
```

### 4) Uygulamayı çalıştır

Backend ve frontend ayrı terminallerde başlatılır.

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

## Local Environment Ayarları

Bu repo’da örnek env dosyaları iki ayrı klasörde tutulur:
- [backend/.env.example](backend/.env.example)
- [frontend/.env.example](frontend/.env.example)

### Backend `.env.example`

```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/fixora
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
FRONTEND_ORIGIN=http://localhost:5173
```

### Frontend `.env.example`

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### Local çalıştırma notları

- Backend varsayılan portu `3001` olarak kullanılır.
- Frontend varsayılan olarak Vite üzerinden `5173` portunda çalışır.
- `VITE_API_BASE_URL`, local backend adresini göstermelidir.
- Production ortamında `FRONTEND_ORIGIN` boş bırakılamaz.

## Production Notları

- Canlı frontend: https://getfixora.dev
- Canlı backend: https://fixora-api-loyo.onrender.com
- Auth akışı production’da test edildi ve stabil çalışır.
- Analyze → history → share akışı uçtan uca doğrulandı.
- Public share sayfaları SEO ve meta açısından doğrulandı.
- Sitemap ve Search Console entegrasyonu aktif.

## Yol Haritası

- Bundle ve performans optimizasyonu
- Daha gelişmiş analytics
- Feedback verilerini anlamlandırma
- Daha güçlü share page içerik ve iç linkleme
- İleride pricing / limit planı

## Kapanış

Fixora, küçük ama net bir ürün hedefi olan, üretim ortamında çalışan ve kontrollü şekilde büyütülen bir araçtır. Amaç; hata mesajını sadeleştirmek, çözüm yolunu görünür kılmak ve bunu güvenilir bir akış içinde sunmaktır.
