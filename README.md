# Fixora

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) ![Gemini](https://img.shields.io/badge/Gemini-4285F4?style=flat-square&logo=google&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white) ![Render](https://img.shields.io/badge/Render-2D2D2D?style=flat-square&logo=render&logoColor=white)

Fixora, İngilizce browser ve console hata mesajlarını Türkçe, sade ve uygulanabilir açıklamalara dönüştüren AI destekli bir web uygulamasıdır. Hata mesajını hızlıca anlamlandırmak, olası nedenleri ayırmak ve geliştiriciye doğrudan işe yarar bir sonraki adımı sunmak için tasarlanmıştır.

Önceki adı `errorinsight` idi; proje artık Fixora adıyla devam ediyor.

## Ürün Konumlandırma

Fixora, ciddi bir portfolio projesi olarak başlayan ve production ortamında çalışan erken aşama bir SaaS ürünü yaklaşımıyla ilerleyen bir uygulamadır. Amaç; hata ayıklama sürecini daha okunabilir, daha hızlı ve daha paylaşılabilir hale getirmektir.

Uygulama; analiz, geçmiş kayıtlar, public share linkleri ve SEO uyumlu paylaşım sayfaları etrafında şekillenir. Ürün dili bilinçli olarak teknik ve nettir; gereksiz pazarlama tonu taşımaz.

## Canlı Demo

Frontend: [https://getfixora.dev](https://getfixora.dev)

Backend: [https://fixora-api-loyo.onrender.com](https://fixora-api-loyo.onrender.com)

## İçindekiler

- [Ürün Konumlandırma](#ürün-konumlandırma)
- [Ekran Görüntüleri](#ekran-görüntüleri)
- [Fixora Neden Var?](#fixora-neden-var)
- [Örnek Analiz Akışı](#örnek-analiz-akışı)
- [Architecture Overview](#architecture-overview)
- [Authentication & Session Flow](#authentication--session-flow)
- [SEO & Share System](#seo--share-system)
- [Temel Özellikler](#temel-özellikler)
- [Kullanılan Teknolojiler](#kullanılan-teknolojiler)
- [Kurulum](#kurulum)
- [Roadmap](#roadmap)

## Ekran Görüntüleri

### Ana Sayfa

![Fixora ana sayfa](./docs/fixora-homepage-dark.png)

### Analiz Sonucu

![Fixora analiz sonucu genel görünüm](./docs/fixora-analyze-result-overview.png)

### Analiz Detayları

![Fixora analiz sonucu detayları](./docs/fixora-analyze-result-details.png)

### Kod ve Feedback Alanı

![Fixora kod ve feedback alanı](./docs/fixora-analyze-result-code-feedback.png)

### History Detay Görünümü

![Fixora history detay görünümü](./docs/fixora-history-detail.png)

## Fixora Neden Var?

Geliştiriciler özellikle React, Node.js, build tool ve API katmanında gelen hata mesajlarını çoğu zaman teknik ve dağınık biçimde görür. Fixora, bu mesajları daha anlaşılır hale getirerek neyin bozulduğunu, neden bozulduğunu ve ne yapılması gerektiğini Türkçe olarak özetler.

Bu yapı özellikle şu durumlarda faydalıdır:

- Yeni bir hata mesajının hızlıca anlaşılması gerektiğinde
- Junior geliştiricilerin çözüm adımlarını daha net görmesi gerektiğinde
- Geçmiş analizlerin tekrar incelenmesi gerektiğinde

## Örnek Analiz Akışı

Örnek hata mesajı:

```text
Uncaught TypeError: Cannot read properties of undefined (reading 'map')
```

Fixora bu girdi için kısa özet, muhtemel nedenler, çözüm adımları ve örnek fix kodu üretir. Örneğin:

- `users` değişkeni beklenen anda tanımlı değilse `map` çağrısı hata verir.
- Veri henüz gelmeden render oluşuyorsa input/state kontrolü gerekir.
- Girişte boş dizi ve güvenli kontrol kullanmak problemi tekrar etmeyi engeller.

Kullanıcı açısından fayda:

- Hata mesajını sadece çevrilmiş olarak değil, bağlamıyla birlikte görür.
- Hangi adımı önce kontrol etmesi gerektiği netleşir.
- Aynı hatayı bir sonraki sefer daha hızlı debug eder.

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

## Architecture Overview

Fixora’nın yapısı üç ana katmanda düşünülür:

### Frontend

- React + Vite tabanlı arayüz
- Tailwind ile responsive UI
- Login sonrası protected route akışı
- Analyze, History ve public share yüzeyleri

### Backend

- Node.js + Express API
- JWT tabanlı authentication
- Analyze, history, share ve public sitemap endpoint’leri
- Google Gemini ile analiz üretimi

### Data Layer

- MongoDB Atlas üzerinde kullanıcı, history ve paylaşım verileri
- Share slug ve SEO içerik alanları history kaydıyla birlikte tutulur

## Authentication & Session Flow

Fixora’da auth akışı JWT ile çalışır. Kullanıcı giriş yaptığında token alınır, protected sayfalara bu token ile erişilir ve session restore ile sayfa yenilendikten sonra oturum korunur.

Akış özeti:

1. Kullanıcı register veya login olur.
2. JWT alınır ve protected API isteklerinde kullanılır.
3. Protected route’lar `/analyze` ve `/history` erişimini sınırlar.
4. Session restore ile sayfa yenileme sonrası kullanıcı oturumu geri yüklenir.
5. Logout sonrası auth state temizlenir.

## SEO & Share System

Fixora’nın public paylaşım yüzeyi yalnızca bir link üretmekten ibaret değildir; SEO ve paylaşım önizlemesi dikkate alınarak kurgulanmıştır.

### Public `/share/:slug` sayfaları

- Paylaşıma açılmış analizler public olarak görüntülenir.
- Giriş gerektirmez.
- İçerik; kısa özet, hata mesajı, çözüm adımları ve SEO içeriği ile gösterilir.

### Dynamic sitemap sistemi

- Paylaşılan analiz bağlantıları dinamik sitemap içine alınır.
- Böylece arama motorlarının public içerikleri keşfetmesi kolaylaşır.

### robots.txt stratejisi

- Private route’lar taranmaz.
- Public paylaşım ve sitemap uçları açık tutulur.
- Noindex davranışı hata / private alanlarda korunur.

### Canonical / meta / OG / JSON-LD yapısı

- Public share sayfalarında canonical URL tanımlıdır.
- Open Graph ve Twitter meta etiketleri paylaşım önizlemesi için üretilir.
- JSON-LD structured data eklenmiştir.
- 404 ve 503 gibi durumlarda noindex/no-follow davranışı uygulanır.

## Ne Problemi Çözüyor

Fixora, hata mesajını tek başına çevirmek yerine onu yapılandırılmış bir geliştirici akışına dönüştürür. Özellikle React, Node.js, build tool ve API katmanında görülen hatalarda; kısa özet, olası nedenler, çözüm adımları ve örnek fix kodu aynı bağlamda sunulur.

Bu yapı, hata mesajının ne söylediğini değil, geliştiricinin bir sonraki adımda neyi kontrol etmesi gerektiğini görünür hale getirir.

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

Aşağıdaki adımlar local geliştirme ortamı içindir.

### 1) Repoyu klonla

```bash
git clone https://github.com/EnessCansever/fixora.git
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

- Canlı frontend: [https://getfixora.dev](https://getfixora.dev)
- Canlı backend: [https://fixora-api-loyo.onrender.com](https://fixora-api-loyo.onrender.com)
- Auth akışı production’da test edildi ve stabil çalışır.
- Analyze → history → share akışı uçtan uca doğrulandı.
- Public share sayfaları SEO ve meta açısından doğrulandı.
- Sitemap ve Search Console entegrasyonu aktif.

## Roadmap

Güncel öncelik üretim kalitesini korumak ve mevcut ürün yüzeyini derinleştirmektir.

- Bundle ve performans optimizasyonu
- Daha gelişmiş analytics
- Feedback verilerini anlamlandırma
- Daha güçlü share page içerik ve iç linkleme
- İleride pricing / limit planı

## Kapanış

Fixora, küçük ama net bir ürün hedefi olan, üretim ortamında çalışan ve kontrollü şekilde büyütülen bir araçtır. Amaç; hata mesajını sadeleştirmek, çözüm yolunu görünür kılmak ve bunu güvenilir bir akış içinde sunmaktır.
