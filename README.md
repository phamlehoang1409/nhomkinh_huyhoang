# WEBSITE DOANH NGHIỆP NHÔM KÍNH HUY HOÀNG (THANH HÓA)

Hệ thống Website doanh nghiệp Full Stack hoàn chỉnh, hiện đại, tối ưu SEO dành cho cơ sở **NHÔM KÍNH HUY HOÀNG** tại Thanh Hóa.

---

## 1. THÔNG TIN DOANH NGHIỆP

* **Tên thương hiệu:** Nhôm Kính Huy Hoàng
* **Địa chỉ xưởng:** Thôn Tân Thành, xã Thọ Hải, huyện Thọ Xuân, tỉnh Thanh Hóa
* **Số điện thoại Hotline / Zalo:** `0978398567`
* **Ngành nghề:** Gia công, thi công, lắp đặt & sửa chữa cửa nhôm kính, cửa kính cường lực, vách kính, lan can & mái kính
* **Ngôn ngữ:** Tiếng Việt (100%)
* **Màu sắc chủ đạo:** Đen than (`#0f172a`), Trắng (`#ffffff`), Xám bạc (`#94a3b8`), Vàng đồng kim khí (`#c59b27` / `#d97706`)

---

## 2. CÔNG NGHỆ SỬ DỤNG

* **Frontend:** React 18, Vite, React Router v6, Tailwind CSS, Lucide Icons, Axios.
* **Backend:** Node.js, Express.js, MySQL2 (`mysql2/promise`), JWT Authentication, Bcryptjs, Multer (xử lý upload ảnh), Express Rate Limit (chống spam form).
* **Cơ sở dữ liệu:** MySQL (kèm file `database/database.sql` đầy đủ bảng, khóa ngoại, chỉ mục và seed data thực tế).
* **Kiến trúc:** Phân tách rõ ràng 3 phần `frontend/`, `backend/`, `database/`.

---

## 3. CÁC TRANG & CHỨC NĂNG ĐÃ XÂY DỰNG

1. **Trang chủ (`/`):**
   * Banner Hero giới thiệu Nhôm Kính Huy Hoàng với hình ảnh công trình đẹp.
   * 4 cam kết giá trị cốt lõi (Chất lượng, Thợ tay nghề cao, Đúng tiến độ, Bảo hành dài hạn).
   * Danh sách 6 dịch vụ thi công trọng tâm.
   * Danh mục sản phẩm mẫu được quan tâm nhiều nhất.
   * Quy trình 5 bước chuẩn kỹ thuật: *Tiếp nhận -> Khảo sát đo đạc -> Báo giá -> Sản xuất -> Lắp đặt & Bảo hành*.
   * Danh sách công trình tiêu biểu đã hoàn thiện.
   * Ý kiến đánh giá của khách hàng và giải đáp câu hỏi thường gặp (FAQ Accordion).
   * Banner kêu gọi hành động (CTA) nhận báo giá và gọi Hotline trực tiếp.

2. **Trang Giới thiệu (`/gioi-thieu`):**
   * Giới thiệu cơ sở Nhôm Kính Huy Hoàng tại Thọ Xuân, Thanh Hóa.
   * Năng lực sản xuất, phương châm "Chất lượng thật - Giá tại xưởng".
   * Cam kết vật liệu nhôm Xingfa chính hãng, phụ kiện đồng bộ.

3. **Trang Dịch vụ (`/dich-vu` & `/dich-vu/:slug`):**
   * Thi công cửa nhôm Xingfa nhập khẩu tem đỏ.
   * Lắp đặt cửa kính cường lực & cửa thủy lực bản lề sàn.
   * Thi công vách kính văn phòng & cabin tắm đứng.
   * Lắp đặt lan can kính, cầu thang kính & mái kính nghệ thuật.
   * Sửa chữa cửa nhôm kính, thay thế phụ kiện tận nơi.
   * Khảo sát, tư vấn phong thủy Lỗ Ban & báo giá miễn phí.
   * Trang chi tiết dịch vụ với ưu điểm, quy trình và nút nhận báo giá riêng.

4. **Trang Sản phẩm (`/san-pham` & `/san-pham/:slug`):**
   * Danh sách sản phẩm có bộ lọc theo danh mục, tìm kiếm theo tên/mã, sắp xếp theo tên hoặc ngày cập nhật.
   * Phân trang chuẩn xác (12 sản phẩm/trang).
   * Trang chi tiết sản phẩm: Thư viện nhiều ảnh lớn + thumbnail, bảng thông số kỹ thuật (Hệ nhôm, độ dày, kính, phụ kiện, bảo hành), nút gọi hotline và nút gửi form báo giá cho sản phẩm đó.
   * Danh sách sản phẩm tương tự cùng danh mục.

5. **Trang Công trình thực tế (`/cong-trinh`):**
   * Thư viện ảnh các công trình cửa nhôm, vách kính, lan can đã thi công tại Thanh Hóa.
   * Bộ lọc theo loại công trình, tìm kiếm, phân trang và xem ảnh phóng to chi tiết.

6. **Trang Tin tức & Kinh nghiệm (`/tin-tuc` & `/tin-tuc/:slug`):**
   * Các bài viết cẩm nang: Cách phân biệt nhôm Xingfa thật/giả, so sánh cửa mở quay vs mở trượt, mẹo bảo quản và vệ sinh cửa kính...
   * Bộ lọc danh mục, phân trang và trang chi tiết bài viết với thanh sidebar.

7. **Trang Liên hệ & Báo giá (`/lien-he`):**
   * Hiển thị đầy đủ tên cơ sở, địa chỉ, Hotline 0978398567, Zalo, giờ làm việc.
   * Form nhận báo giá trực tuyến kiểm tra số điện thoại Việt Nam hợp lệ, chống spam, hỗ trợ tải lên file bản vẽ/ảnh công trình và lưu trực tiếp vào cơ sở dữ liệu.
   * Bản đồ Google Maps chỉ đường đến cơ sở tại Thọ Hải, Thọ Xuân.

8. **Trang Tìm kiếm tổng hợp (`/tim-kiem?q=...`):**
   * Tìm kiếm đồng thời Sản phẩm, Dịch vụ và Bài viết không phân biệt hoa thường.
   * Hiển thị số lượng kết quả theo từng tab và thông báo khi không có dữ liệu.

9. **Trang Chính sách & Quy định (`/chinh-sach`):**
   * Chính sách bảo mật thông tin khách hàng.
   * Điều khoản dịch vụ thi công.
   * Quy trình tiếp nhận và báo giá.
   * Nội dung có thể chỉnh sửa trực tiếp từ trang quản trị Admin.

10. **Trang Quản trị Admin (`/admin`):**
    * Đăng nhập bảo mật JWT, mã hóa bcrypt.
    * Dashboard thống kê: Tổng yêu cầu báo giá, yêu cầu mới, sản phẩm, công trình, dịch vụ, bài viết.
    * Quản lý yêu cầu báo giá: Xem thông tin khách hàng, số điện thoại, kích thước, ảnh bản vẽ đính kèm, cập nhật trạng thái (*Mới, Đang liên hệ, Đã báo giá, Hoàn thành, Đã hủy*), lưu ghi chú nội bộ của admin.
    * Quản lý sản phẩm (Thêm/Sửa/Xóa, tải ảnh lên, nhập thông số kỹ thuật linh hoạt dạng key-value, bật/tắt nổi bật).
    * Quản lý dịch vụ thi công (Thêm/Sửa/Xóa, cam kết ưu điểm).
    * Quản lý danh mục sản phẩm.
    * Quản lý công trình thi công.
    * Quản lý bài viết tin tức.
    * Quản lý đánh giá khách hàng.
    * Quản lý cấu hình website (Hotline, Zalo, địa chỉ, email, iframe Google Map, SEO Meta tags, nội dung các chính sách).
    * Quản lý tài khoản & đổi mật khẩu quản trị viên.

11. **Tiện ích mở rộng:**
    * Nút gọi Hotline nhấp nháy nổi cố định góc màn hình (`tel:0978398567`).
    * Nút nhắn tin Zalo nổi (`https://zalo.me/0978398567`).
    * Nút cuộn lên đầu trang (Back to top).
    * Sitemap XML (`/sitemap.xml`) và Robots.txt (`/robots.txt`).
    * Trang 404 tùy biến chuyên nghiệp.

---

## 4. HƯỚNG DẪN CÀI ĐẶT & CHẠY TRÊN WINDOWS

### Bước 1: Chuẩn bị môi trường
* Đã cài đặt **Node.js** (Khuyến nghị phiên bản 18, 20 hoặc 22+) từ [nodejs.org](https://nodejs.org/).
* Đã cài đặt **MySQL** (hoặc thông qua XAMPP / Laragon / WampServer / MySQL Server).

### Bước 2: Tạo cơ sở dữ liệu MySQL
1. Mở phpMyAdmin (hoặc MySQL Workbench / Navicat / Command Line).
2. Tạo database mới hoặc chạy toàn bộ mã SQL trong file:
   ```
   database/database.sql
   ```
3. Lệnh tạo nhanh bằng MySQL Command line:
   ```bash
   mysql -u root -p < database/database.sql
   ```

### Bước 3: Cấu hình biến môi trường Backend
Mở file `backend/.env` và cập nhật thông tin kết nối MySQL của bạn (nếu có mật khẩu):
```env
PORT=5000
NODE_ENV=development

# Thông số MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=nhomkinh_huyhoang

# JWT Secret
JWT_SECRET=nhomkinh_huyhoang_secret_key_2026_thoxuan_thanhhoa
JWT_EXPIRES_IN=7d

# URL Cấu hình
CLIENT_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```
*(Lưu ý: Backend có tích hợp sẵn cơ chế High-Reliability Fallback Engine, trong trường hợp bạn chưa bật MySQL thì hệ thống vẫn tự động lưu trữ và hoạt động 100% không bị crash, sau đó tự chuyển sang MySQL khi kết nối thành công).*

### Bước 4: Cài đặt thư viện (Dependencies)
Mở cửa sổ dòng lệnh PowerShell hoặc Command Prompt tại thư mục dự án:
```bash
# Cài đặt backend
cd backend
npm install

# Cài đặt frontend
cd ../frontend
npm install
```

### Bước 5: Khởi động Website
Có 2 cách:

* **Cách 1 (Nhanh nhất):** Nhấp đúp chuột vào file `chay-website.bat` tại thư mục gốc của dự án.
* **Cách 2 (Thủ công):**
  * Cửa sổ 1 (Backend):
    ```bash
    cd backend
    npm start
    ```
    *(Backend chạy tại: `http://localhost:5000`)*
  * Cửa sổ 2 (Frontend):
    ```bash
    cd frontend
    npm run dev
    ```
    *(Frontend chạy tại: `http://localhost:5173`)*

---

## 5. THÔNG TIN ĐĂNG NHẬP TRANG QUẢN TRỊ (ADMIN)

* **Đường dẫn quản trị:** `http://localhost:5173/admin/login` (hoặc nhấn nút Quản trị trên Header)
* **Tên đăng nhập:** `admin`
* **Mật khẩu ban đầu:** `admin@123`

> **Lưu ý bảo mật:** Sau khi đăng nhập lần đầu, vui lòng vào mục **"Tài khoản & Mật khẩu"** trên thanh menu quản trị để đổi mật khẩu quản trị viên mới. Mật khẩu được mã hóa an toàn 100% bằng thuật toán bcrypt.

---

## 6. DANH SÁCH API ENDPOINTS

| Phương thức | Endpoint | Chức năng | Phân quyền |
|---|---|---|---|
| `POST` | `/api/auth/login` | Đăng nhập tài khoản admin | Public |
| `GET` | `/api/auth/me` | Lấy thông tin admin đang đăng nhập | Admin (JWT) |
| `PUT` | `/api/auth/change-password` | Đổi mật khẩu admin | Admin (JWT) |
| `GET` | `/api/categories` | Lấy danh mục sản phẩm kèm số lượng | Public |
| `POST/PUT/DELETE` | `/api/categories` | Thêm, sửa, xóa danh mục | Admin (JWT) |
| `GET` | `/api/products` | Lấy sản phẩm (hỗ trợ `page`, `limit`, `search`, `category_id`, `sort`) | Public |
| `GET` | `/api/products/featured` | Lấy sản phẩm nổi bật | Public |
| `GET` | `/api/products/:slug` | Chi tiết sản phẩm & thông số kỹ thuật | Public |
| `GET` | `/api/products/similar/:id` | Lấy sản phẩm tương tự cùng danh mục | Public |
| `POST/PUT/DELETE` | `/api/products` | Thêm, sửa, xóa sản phẩm | Admin (JWT) |
| `GET` | `/api/services` | Lấy danh sách dịch vụ thi công | Public |
| `GET` | `/api/services/:slug` | Lấy chi tiết dịch vụ | Public |
| `POST/PUT/DELETE` | `/api/services` | Thêm, sửa, xóa dịch vụ | Admin (JWT) |
| `GET` | `/api/projects` | Lấy danh sách công trình | Public |
| `POST/PUT/DELETE` | `/api/projects` | Thêm, sửa, xóa công trình | Admin (JWT) |
| `GET` | `/api/articles` | Lấy danh sách bài viết & kinh nghiệm | Public |
| `GET` | `/api/articles/:slug` | Chi tiết bài viết & tăng lượt xem | Public |
| `POST/PUT/DELETE` | `/api/articles` | Thêm, sửa, xóa bài viết | Admin (JWT) |
| `POST` | `/api/quote-requests` | Khách gửi form báo giá (kèm ảnh đính kèm) | Public (Rate limit) |
| `GET` | `/api/quote-requests` | Danh sách yêu cầu báo giá | Admin (JWT) |
| `PUT` | `/api/quote-requests/:id/status` | Cập nhật trạng thái báo giá | Admin (JWT) |
| `DELETE` | `/api/quote-requests/:id` | Xóa yêu cầu báo giá | Admin (JWT) |
| `GET` | `/api/reviews` | Lấy danh sách đánh giá khách hàng | Public |
| `GET` | `/api/settings` | Lấy cấu hình website, hotline, địa chỉ, map | Public |
| `PUT` | `/api/settings` | Cập nhật cấu hình website | Admin (JWT) |
| `GET` | `/api/search` | Tìm kiếm tổng hợp (sản phẩm, dịch vụ, bài viết) | Public |
| `GET` | `/api/stats/dashboard` | Thống kê số liệu cho dashboard admin | Admin (JWT) |
| `POST` | `/api/upload/single` | Tải lên 1 hình ảnh | Admin (JWT) |
| `POST` | `/api/upload/multiple` | Tải lên nhiều hình ảnh | Admin (JWT) |

---

## 7. HƯỚNG DẪN TRIỂN KHAI LÊN VPS / HOSTING (DEPLOYMENT)

### 1. Triển khai Frontend
Chạy lệnh build production:
```bash
cd frontend
npm run build
```
Toàn bộ mã nguồn tĩnh tối ưu sẽ được xuất ra thư mục `frontend/dist/`. Bạn có thể upload thư mục này lên bất kỳ Hosting tĩnh, Vercel, Netlify hoặc thư mục Nginx `/var/www/nhomkinh-frontend/`.

### 2. Triển khai Backend với PM2 trên VPS Linux (Ubuntu/Debian)
```bash
# Cài đặt PM2
npm install -g pm2

# Khởi chạy backend dưới nền
cd backend
pm2 start src/server.js --name "huyhoang-backend"
pm2 save
pm2 startup
```

### 3. Cấu hình Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        root /var/www/nhomkinh-frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API & Uploads
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads/ {
        proxy_pass http://127.0.0.1:5000/uploads/;
        proxy_set_header Host $host;
    }
}
```

---

## 8. BẢN QUYỀN & LIÊN HỆ KỸ THUẬT

* **Chủ sở hữu:** Cơ sở Nhôm Kính Huy Hoàng - Thọ Xuân, Thanh Hóa
* **Hotline kỹ thuật:** 0978398567
* **Email:** huyhoangnhomkinh77@gmail.com
