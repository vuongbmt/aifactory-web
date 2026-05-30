# Context Handoff — AI Factory Landing (webTool)

> Báo cáo trạng thái dự án + dữ liệu bàn giao cho phiên làm việc tiếp theo.
> Ngày tạo: 30/05/2026 · Workspace: `D:\webTool` · Deploy host: `C:\Users\Admin\Desktop\webTool`

---

## 1. Tổng quan dự án

- **Mục tiêu**: Landing page giới thiệu app desktop **AI Factory** (Windows/macOS), song ngữ VI/EN, kèm trang `privacy.html` và `terms.html`.
- **Domain**: `aifactory.id.vn` (đi kèm `vuongbmt.space`). Self-host bằng **Caddy** + **Cloudflare Tunnel**.
- **Stack**: HTML/CSS/JS thuần — không build step, không framework. i18n bằng `data-i18n` + 2 file JSON.
- **Trạng thái git**: branch `main` đã sync với `origin/main`; chỉ còn 1 file local-dirty là [lenhCommitToGit.md](lenhCommitToGit.md) (ghi chú lệnh commit, không cần push).

## 2. Cấu trúc thư mục thực tế

```
webTool/
├── index.html              # Landing chính (hero, features, showcase, how, pricing, download, footer, payment modal)
├── privacy.html            # Trang Chính sách bảo mật
├── terms.html              # Trang Điều khoản sử dụng
├── Caddyfile               # Production (root = C:/Users/Admin/Desktop/webTool)
├── Caddyfile.local         # Dev local (:8080, root = .)
├── lenhCommitToGit.md      # Cheatsheet lệnh git
├── README.md               # Hướng dẫn chạy + deploy
├── .gitignore              # Bỏ qua *.exe/.dmg/.zip/.pkg/.msi trong downloads/, log, caddy.exe
├── assets/
│   ├── css/style.css       # ~24 KB, 1 file duy nhất, biến CSS ở :root
│   ├── js/
│   │   ├── i18n.js         # Load lang JSON, set data-i18n innerHTML + data-i18n-attr content
│   │   └── main.js         # Carousel arrows (feat/step/price), mobile menu, reveal-on-scroll, Payment modal (VietQR)
│   ├── lang/
│   │   ├── vi.json         # 4.8 KB
│   │   └── en.json         # 4.0 KB
│   ├── images/             # logo, favicon, demo SVG, login_hero.png, bangGia, logo-FAQ
│   └── videos/             # CHỈ có README.md — chưa có demo.mp4
└── downloads/              # CHỈ có README.md — file cài app host trên Google Drive
```

## 3. Tích hợp & dịch vụ ngoài

- **Tải app**: link Google Drive trong `index.html` (#download), không host file `.exe`/`.dmg` trong repo.
  - Windows: `https://drive.google.com/drive/folders/1JfMlf_ztDyW5ES8vSqyD8CxCpomb-WHC`
  - macOS:  `https://drive.google.com/drive/folders/1QD3CW6YE7uMxhGZnOdtvqLE3mPnj8meI`
- **Demo videos**: YouTube embed (4 landscape + 3 shorts) ở section `#showcase`.
- **Payment**: modal VietQR động (`https://img.vietqr.io/image/TCB-19038709343023-compact2.png?...`).
  - Bank: **Techcombank** · Acc: `19038709343023` · Owner: `HOANG NGOC QUOC`
  - Nội dung CK = `<PLAN> --- QUOC`.
- **Liên hệ Zalo**: `https://zalo.me/g/z2cntcd5tj2uvuywul2`.

## 4. Bảng giá (snapshot trong `index.html`)

| Plan         | Giá        | Hạn   | Ảnh/ngày | Video/ngày | Quota ảnh | Quota video | Luồng | Hệ số |
|--------------|------------|-------|----------|------------|-----------|-------------|-------|-------|
| PRO (sale)   | 289.000đ (gốc 589k) | 30 ngày | 400  | 400   | 800    | 800     | 5  | ×3 |
| PRO++        | 549.000đ   | 30 ngày | 1.000 | 1.000 | 2.000  | 2.000  | 9  | ×1 |
| PREMIUM ⭐   | 1.349.000đ | 30 ngày | 2.000 | 2.000 | 6.000  | 6.000  | 12 | ×1 |
| FACTORY      | 2.989.000đ | 90 ngày | 5.000 | 5.000 | 30.000 | 30.000 | 18 | ×1 |
| DOANH NGHIỆP | 1.849.000đ | 30 ngày | 5.000 | 5.000 | 15.000 | 30.000 | 12 | ×1 |
| DN VIDEO     | 3.649.000đ | 30 ngày | 2.000 | 10.000 | 10.000 | 100.000 | 12 | ×1 |

## 5. Bug / điểm cần xử lý (ưu tiên)

> Liệt kê theo thứ tự rủi ro. Các mục P1 đang thực sự sai khi tải trang ngôn ngữ VI/EN.

### P1 — i18n đè text hardcoded mới
Commit gần nhất `650abbd` đổi hardcoded HTML từ "Sản phẩm" → "Demo" và "Tác phẩm từ AI Factory" → "Demo AI Factory", nhưng **không cập nhật JSON ngôn ngữ**. Khi [assets/js/i18n.js](assets/js/i18n.js) chạy, nó sẽ ghi đè text mới bằng giá trị cũ trong [assets/lang/vi.json](assets/lang/vi.json) và [assets/lang/en.json](assets/lang/en.json).

Cần đổi:
- [assets/lang/vi.json](assets/lang/vi.json#L5) `nav.showcase`: "Sản phẩm" → "Demo".
- [assets/lang/vi.json](assets/lang/vi.json#L33) `showcase.title`: "Tác phẩm từ AI Factory" → "Demo AI Factory".
- [assets/lang/vi.json](assets/lang/vi.json#L77) `footer.product`: "Sản phẩm" → "Demo".
- [assets/lang/en.json](assets/lang/en.json#L5) `nav.showcase`: "Showcase" → "Demo" (nếu muốn thống nhất).
- [assets/lang/en.json](assets/lang/en.json#L33) `showcase.title`: "Made with AI Factory" → "AI Factory Demo".
- [assets/lang/en.json](assets/lang/en.json#L77) `footer.product`: "Product" → "Demo".

### P1 — Email liên hệ không đồng nhất
- [index.html](index.html#L466) dùng `hoangngocquoc12sh@gmail.com`.
- [privacy.html](privacy.html#L53) và [terms.html](terms.html#L53) dùng `contact@aifactory.id.vn` (mailbox này có tồn tại không?).
- README checklist cũng nhắc cập nhật email trước go-live. Cần chốt 1 địa chỉ duy nhất.

### P2 — `main.js` tham chiếu DOM không tồn tại
- [assets/js/main.js](assets/js/main.js#L62) khởi tạo `initArrows('featCarousel', 'featPrev', 'featNext')` nhưng `index.html` dùng class `.features-carousel` cho features mà **không có** `id="featCarousel"` / `id="featPrev"` / `id="featNext"`. Hàm tự return khi thiếu DOM nên không crash, nhưng arrows cho khu Features không bao giờ xuất hiện. Cần: (a) bổ sung id vào features carousel để bật arrows, hoặc (b) xoá lời gọi này.
- [assets/js/main.js](assets/js/main.js#L184) `closeBtn2 = document.getElementById('payCloseBtn')` không tồn tại trong DOM (đã bị xoá ở commit `8940744`). Dòng `closeBtn2.addEventListener('click', closeModal)` ở [main.js](assets/js/main.js#L207) **sẽ throw** `Cannot read properties of null` và làm hỏng phần khởi tạo còn lại của payment modal. Cần guard `if (closeBtn2) ...` hoặc xoá biến.

### P2 — Asset thiếu
- [assets/videos/](assets/videos/) chưa có `demo.mp4` nhưng [index.html](index.html#L100) `<video><source src="assets/videos/demo.mp4">`. Trình duyệt sẽ 404 và chỉ hiển thị poster `login_hero.png`. Nên thêm file thật hoặc xoá block `<source>`.
- [downloads/](downloads/) chỉ có README; nút Download trỏ Google Drive nên OK, nhưng README claim "Bỏ file cài app vào `downloads/`" — cần thống nhất.

### P3 — Caddy production root path
- [Caddyfile](Caddyfile#L9) hardcoded `root * C:/Users/Admin/Desktop/webTool`. Workspace hiện tại là `D:\webTool`. Đây là máy dev khác với máy deploy; lưu ý khi rebuild hoặc khi đổi máy deploy.
- Production Caddyfile gộp `vuongbmt.space` chung block với `aifactory.id.vn`. Comment ở đầu file đã ghi rõ kế hoạch redirect khi domain mới ổn định.

### P3 — Khác
- [index.html](index.html#L2) `<html lang="vi">` được i18n.js cập nhật runtime, OK.
- Meta OG image dùng `assets/images/ai_factory_logo.png` (PNG vuông) — chấp nhận được, nhưng FB/Zalo thường khuyến nghị 1200×630.
- README có nhắc Google Analytics, nhưng `index.html` hiện **chưa nhúng GA**.
- Không có Service Worker / PWA manifest.
- Không thấy CSP header trong Caddyfile (chỉ có nosniff, frame-options, referrer, permissions).

## 6. Lệnh quen thuộc

```powershell
# Dev local
.\caddy.exe run --config Caddyfile.local        # http://localhost:8080
# hoặc
python -m http.server 8080

# Commit (xem lenhCommitToGit.md)
cd C:\Users\Admin\Desktop\webTool
git add <file>
git commit -m "..."
git push

# Production
caddy run --config Caddyfile
cloudflared tunnel run aifactory
```

## 7. Lưu ý môi trường (đã rút từ memory)

- Workspace `D:\webTool` bị git từ chối vì owner Admin; đã chạy `git config --global --add safe.directory D:/webTool` trong phiên này.
- PowerShell 5.1 trong terminal VS Code có thể mất `python`/`py` trên PATH; nếu cần Python tĩnh, fallback `py -3` hoặc cấu hình venv.

## 7b. Nhật ký phiên 30/05/2026

- **Hero video** chuyển sang YouTube iframe (`_maCPnHMrBU`, autoplay+mute+loop) — không còn phụ thuộc `assets/videos/demo.mp4`. CSS [.hero-video-wrap iframe](assets/css/style.css#L249) thêm rule `width/height 100%`, `border:0`.
- **i18n sync**: cập nhật [vi.json](assets/lang/vi.json) và [en.json](assets/lang/en.json) — `nav.showcase`, `showcase.title`, `footer.product` đều dùng "Demo" / "AI Factory Demo" để khớp HTML mới.
- **Pricing DN**: thêm dòng `🅿️ Ưu tiên luồng P cho Doanh nghiệp ✓` vào cả 2 thẻ [DOANH NGHIỆP](index.html#L356) và [DN VIDEO](index.html#L383); cân đối lên 8 hàng giống các gói khác.
- Đã `git add` + `commit` + `push` lên `origin/main`.

## 8. Việc nên làm tiếp (đề xuất next session)

1. Đồng bộ text VI/EN ↔ hardcoded HTML (mục 5 P1) — sửa 6 dòng JSON.
2. Sửa 2 lỗi DOM trong `main.js` (mục 5 P2) để payment modal init không bị throw.
3. Chốt email liên hệ, áp dụng đồng nhất 3 trang.
4. Thêm file `assets/videos/demo.mp4` hoặc remove `<source>` để khỏi 404.
5. (Tuỳ chọn) Thêm GA4, og:image 1200×630, CSP header, PWA manifest.

---
*File này được tạo tự động bởi GitHub Copilot để bàn giao bối cảnh — có thể chỉnh sửa hoặc gitignore tuỳ ý.*
