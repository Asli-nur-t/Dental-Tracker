# Dental Tracker

Dental Tracker, diş sağlığını takip etmek ve diş bakım alışkanlıklarını geliştirmek için tasarlanmış bir web uygulamasıdır.

## Özellikler

- Kullanıcı Yönetimi
  - Kayıt olma
  - Giriş yapma
  - Şifre sıfırlama
  - Profil yönetimi

- Diş Sağlığı Takibi
  - Günlük diş fırçalama takibi
  - Diş ipi kullanımı takibi
  - Ağız bakım suyu kullanımı takibi

- Hedef Belirleme
  - Kişisel diş bakım hedefleri oluşturma
  - Hedef ilerlemesini takip etme
  - Başarı istatistikleri görüntüleme

- Günlük İpuçları
  - Kişiselleştirilmiş diş bakım ipuçları
  - Diş sağlığı hakkında bilgilendirici içerikler

## Ekran Görüntüleri

### Giriş Sayfası
![Giriş Sayfası](./dental-tracker-ss/Ekran%20Resmi%202025-04-06%2023.52.27.png)


### Kayıt Sayfası
![Kayıt Sayfası](./dental-tracker-ss/Ekran%20Resmi%202025-04-06%2023.55.59.png)

### Dashboard
![Dashboard](./dental-tracker-ss/Ekran%20Resmi%202025-04-06%2023.52.56.png)


### Hedefler Sayfası
![Hedefler](./dental-tracker-ss/Ekran%20Resmi%202025-04-06%2023.55.18.png)

### Profil Sayfası
![Profil](./dental-tracker-ss/Ekran%20Resmi%202025-04-06%2023.55.10.png)

## Teknolojiler

### Backend
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- BCrypt.Net

### Frontend
- React
- TypeScript
- Material-UI
- Tailwind CSS
- React Router
- Axios

## Kurulum

### Backend Kurulumu
1. PostgreSQL veritabanını kurun
2. `DentalTracker.API` klasörüne gidin
3. `appsettings.json` dosyasında veritabanı bağlantı bilgilerini güncelleyin
4. Aşağıdaki komutları çalıştırın:
```bash
dotnet restore
dotnet ef database update
dotnet run
```

### Frontend Kurulumu
1. `dental-tracker-client` klasörüne gidin
2. Aşağıdaki komutları çalıştırın:
```bash
npm install
npm run dev
```

## API Endpoints

### Kullanıcı İşlemleri
- POST /api/User/register - Yeni kullanıcı kaydı
- POST /api/User/login - Kullanıcı girişi
- POST /api/User/reset-password - Şifre sıfırlama
- GET /api/User/profile - Kullanıcı profili

### Diş Aktivite İşlemleri
- POST /api/DentalActivity - Yeni aktivite ekleme
- GET /api/DentalActivity - Aktivite listesi
- GET /api/DentalActivity/{id} - Aktivite detayı

### Hedef İşlemleri
- POST /api/DentalGoal - Yeni hedef ekleme
- GET /api/DentalGoal - Hedef listesi
- PUT /api/DentalGoal/{id} - Hedef güncelleme
- DELETE /api/DentalGoal/{id} - Hedef silme

## Katkıda Bulunma

1. Bu repository'yi fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın. 
