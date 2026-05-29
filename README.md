# AI Factory — Landing Page

Trang quảng cáo cho app **AI Factory** (Windows/macOS), song ngữ Việt/Anh, build bằng HTML/CSS/JS thuần.

Domain: **aifactory.id.vn** · Self-host trên PC cá nhân.

---

## 📁 Cấu trúc

```
webTool/
├── index.html           # Landing chính
├── privacy.html         # Chính sách bảo mật
├── terms.html           # Điều khoản
├── Caddyfile            # Cấu hình production
├── Caddyfile.local      # Cấu hình dev local
├── assets/
│   ├── css/style.css
│   ├── js/main.js, i18n.js
│   ├── images/          # logo, favicon, demo placeholders (SVG)
│   ├── videos/          # demo.mp4 (bạn tự thêm)
│   └── lang/vi.json, en.json
└── downloads/           # File cài AIFactory-Setup.exe, AIFactory.dmg
```

---

## 🚀 Chạy local

### Cách 1: Caddy (khuyên dùng)
1. Tải Caddy: https://caddyserver.com/download (Windows AMD64)
2. Đặt `caddy.exe` cùng cấp với `Caddyfile.local`
3. Mở PowerShell tại thư mục dự án:
   ```powershell
   .\caddy.exe run --config Caddyfile.local
   ```
4. Truy cập http://localhost:8080

### Cách 2: Python (không cần cài gì)
```powershell
python -m http.server 8080
```

### Cách 3: VS Code Live Server extension
Click chuột phải `index.html` → "Open with Live Server".

---

## 🌐 Deploy production (PC cá nhân + domain aifactory.id.vn)

### Bước 1: Cài Caddy làm Windows service
Caddy tự động cấp HTTPS từ Let's Encrypt khi có domain.

```powershell
# Cài qua winget
winget install CaddyServer.Caddy

# Hoặc tải zip về và giải nén
```

### Bước 2: Setup Cloudflare Tunnel (khuyên dùng — không cần mở port router)

1. Đăng ký domain `aifactory.id.vn` vào Cloudflare (đổi nameserver tại tenten.vn sang Cloudflare).
2. Cài `cloudflared`:
   ```powershell
   winget install Cloudflare.cloudflared
   ```
3. Đăng nhập & tạo tunnel:
   ```powershell
   cloudflared tunnel login
   cloudflared tunnel create aifactory
   cloudflared tunnel route dns aifactory aifactory.id.vn
   cloudflared tunnel route dns aifactory www.aifactory.id.vn
   ```
4. Tạo file `C:\Users\Admin\.cloudflared\config.yml`:
   ```yaml
   tunnel: aifactory
   credentials-file: C:\Users\Admin\.cloudflared\<TUNNEL-ID>.json
   ingress:
     - hostname: aifactory.id.vn
       service: http://localhost:8080
     - hostname: www.aifactory.id.vn
       service: http://localhost:8080
     - service: http_status:404
   ```
5. Chạy:
   ```powershell
   # Terminal 1: Caddy serve local
   caddy run --config Caddyfile.local

   # Terminal 2: Cloudflare tunnel
   cloudflared tunnel run aifactory
   ```
6. (Tùy chọn) Cài cả hai làm Windows service để tự start khi boot.

> **Ưu điểm Cloudflare Tunnel**: không lo IP động, không cần mở port, HTTPS sẵn, miễn phí, có CDN.

### Bước 3 (cách 2): Mở port trực tiếp
Nếu muốn tự host không qua Cloudflare:
- Mở port 80, 443 trên router (port forwarding về IP PC)
- Trỏ A record `aifactory.id.vn` → IP công cộng
- Chạy `caddy run --config Caddyfile` (sẽ tự xin SSL từ Let's Encrypt)
- ⚠️ Cần IP tĩnh hoặc dùng DDNS

---

## ✏️ Tùy biến nội dung

- **Đổi text**: sửa file `assets/lang/vi.json` và `assets/lang/en.json`
- **Đổi màu**: sửa CSS variables trong `assets/css/style.css` (mục `:root`)
- **Đổi logo**: thay file `assets/images/logo.svg` và `favicon.svg`
- **Thêm ảnh demo thật**: thay `demo1.svg` → `demo6.svg` bằng ảnh thật của bạn (giữ tên hoặc sửa trong `index.html`)
- **Thêm video demo**: bỏ file `demo.mp4` vào `assets/videos/`
- **Cập nhật link tải app**: bỏ file `.exe`/`.dmg` vào thư mục `downloads/`

---

## 📊 Tích hợp Analytics (tùy chọn)

Trước thẻ `</head>` trong `index.html`, dán:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');
</script>
```

---

## ✅ Checklist trước khi go-live

- [ ] Thay logo thật vào `assets/images/logo.svg`
- [ ] Thay ảnh demo thật vào `assets/images/demo*.svg`
- [ ] Thêm video demo `assets/videos/demo.mp4`
- [ ] Bỏ file cài app vào `downloads/`
- [ ] Cập nhật email liên hệ trong `index.html`, `privacy.html`, `terms.html`
- [ ] Trỏ domain qua Cloudflare Tunnel
- [ ] Cài Caddy + cloudflared làm Windows service
- [ ] Test trên mobile + desktop
- [ ] Test chuyển ngôn ngữ VI/EN
