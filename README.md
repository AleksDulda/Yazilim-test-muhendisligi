# Reqres.in API Test Otomasyonu (Playwright & REST Assured)

Bu proje, [Reqres.in](https://reqres.in) demo API'si üzerinde iki farklı popüler teknoloji stack'i (**Playwright + TypeScript** ve **Java + REST Assured**) ile hazırlanmış modüler API test otomasyon projelerini içermektedir.

---

## 🚀 Senaryolar ve Doğrulamalar

Testler, kullanıcı yönetim API'sinin en temel iki endpoint'ini bağımsız adımlarla doğrular:

| Adım | Metot / Endpoint | Beklenen HTTP Kodu | Doğrulamalar | Limitler |
| :--- | :--- | :--- | :--- | :--- |
| **1** | `POST /api/users` | `201 Created` | Gönderilen `name` ve `job` değerlerinin eşleşmesi, `id` ve `createdAt` alanlarının varlığı | Yanıt süresi < 800ms |
| **2** | `GET /api/users/2` | `200 OK` | Sabit fixture kullanıcısının (`id: 2`, `first_name: Janet`) doğruluğu, email formatı | Yanıt süresi < 800ms |

> ⚠️ **Önemli:** Reqres.in sahte (mock) bir API olduğu için POST isteği veriyi kalıcı olarak kaydetmez. Bu yüzden POST adımından dönen `id`, GET adımında kullanılmaz; adımlar birbirinden bağımsızdır (no chaining).

---

## 🛠️ Ortak Yapılandırma (`.env`)

Her iki test paketi de kök dizindeki `.env` dosyasını kullanır. Canlı API testleri için bir API anahtarı (`REQRES_API_KEY`) gereklidir.

`.env` dosyanızın yapısı aşağıdaki gibi olmalıdır:
```env
REQRES_API_KEY=free_user_3E4cgDFZcYydCQRz3hixVu49Jye
REQRES_BASE_URL=https://reqres.in
```

---

## 🎭 1. Playwright + TypeScript (Node.js)

Playwright API testleri, modern JavaScript/TypeScript araçlarıyla hızlı ve güvenli test koşumu sağlar.

### Gereksinimler
* Node.js (v18+)

### Kurulum
```bash
# Proje kök dizininde bağımlılıkları yükleyin
npm install
```

### Testleri Çalıştırma
```bash
# Tüm API testlerini çalıştırır
npm run test:api

# Test sonuç raporunu tarayıcıda açar
npm run test:report
```

---

## ☕ 2. REST Assured + Java

REST Assured, Java ekosisteminde RESTful servisleri test etmek için geliştirilmiş, BDD (`given/when/then`) tarzı yazımı destekleyen güçlü bir kütüphanedir.

### Gereksinimler
* Java JDK (v17+)
* Apache Maven (v3.8+)

### Kurulum ve Çalıştırma

Java testleri `restassured-tests` alt klasöründe yer almaktadır:

```bash
# REST Assured dizinine geçin
cd restassured-tests

# Testleri derleyin ve çalıştırın
mvn test
```

> 💡 **macOS Kullananlar İçin İpucu:** Bilgisayarınızda Java/Maven kurulu değilse Homebrew ile kurduktan sonra terminalinizde `export PATH="/usr/local/opt/openjdk/bin:$PATH"` komutunu koşturarak veya `~/.zshrc` dosyanıza ekleyerek `mvn` komutunu etkinleştirebilirsiniz.

---

## 📁 Proje Yapısı

```text
├── .env                               # Ortak API Key ve URL Yapılandırması
├── package.json                       # Playwright bağımlılıkları ve scriptleri
├── playwright.config.ts               # Playwright yapılandırması
├── src/                               # Playwright TypeScript kodları
│   ├── clients/                       # API HTTP istemcileri
│   ├── config/                        # Ortam değişkeni ve Mock yönetimi
│   └── models/                        # TypeScript Tip Tanımlamaları
├── tests/                             # Playwright Test Dosyaları
│   └── api/
│       └── user-create-and-verify.spec.ts
│
└── restassured-tests/                 # REST Assured Java Projesi
    ├── pom.xml                        # Maven bağımlılıkları (REST Assured, TestNG)
    └── src/
        └── test/
            └── java/
                └── api/
                    └── ReqresApiTests.java # REST Assured Test Dosyası
```
