# HƯỚNG DẪN TRIỂN KHAI WEBSITE LÊN VERCEL VÀ SUPABASE

Tài liệu này hướng dẫn chi tiết từng bước để đưa toàn bộ hệ thống **Website Nhôm Kính Huy Hoàng** lên **Vercel (Hosting Web + Serverless API)** và **Supabase (Cơ sở dữ liệu PostgreSQL Cloud)** hoàn toàn miễn phí.

---

## PHẦN 1: TẠO VÀ CẤU HÌNH CƠ SỞ DỮ LIỆU TRÊN SUPABASE

### Bước 1: Đăng ký / Đăng nhập Supabase
1. Truy cập [https://supabase.com](https://supabase.com) và bấm **Sign In** (hoặc **Start your project**).
2. Đăng nhập bằng tài khoản **GitHub** của bạn.

### Bước 2: Tạo Project mới
1. Bấm nút **"New Project"**.
2. Điền các thông tin:
   - **Name:** `nhomkinh-huyhoang`
   - **Database Password:** Nhập mật khẩu quản trị database (ví dụ: `HuyHoang@2026Db!`) -> **Lưu lại mật khẩu này cẩn thận**.
   - **Region:** Chọn `Southeast Asia (Singapore)` để có tốc độ truy cập từ Việt Nam nhanh nhất.
   - **Pricing Plan:** Chọn `Free plan`.
3. Bấm **"Create new project"** và chờ khoảng 1 - 2 phút để Supabase khởi tạo.

### Bước 3: Tạo Bảng và Nạp Dữ Liệu Ban Đầu
1. Ở thanh menu bên trái của Supabase Dashboard, chọn biểu tượng **SQL Editor** (hình `>_`).
2. Mở file [database/supabase_schema.sql](database/supabase_schema.sql) trong thư mục dự án của bạn.
3. **Copy toàn bộ nội dung** trong file `supabase_schema.sql` và **Dán vào ô soạn thảo SQL Editor** trên Supabase.
4. Bấm nút **RUN** (màu xanh lá cây ở góc dưới bên phải).
5. Supabase sẽ thông báo **`Success. No rows returned`** -> Toàn bộ bảng dữ liệu, sản phẩm, dịch vụ, dự án, bài viết, đánh giá, cấu hình và tài khoản Admin mặc định (`admin` / `admin@123`) đã được tạo thành công!

### Bước 4: Lấy Connection String (Chuỗi kết nối)
1. Ở menu bên trái, chọn biểu tượng bánh răng **Project Settings** -> chọn **Database**.
2. Kéo xuống phần **Connection string**, chọn tab **URI**.
3. Copy chuỗi kết nối có dạng:
   ```env
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxx.supabase.co:5432/postgres
   ```
4. Thay thế `[YOUR-PASSWORD]` bằng mật khẩu bạn đã đặt ở Bước 2.
   *(Ví dụ: `postgresql://postgres:HuyHoang@2026Db!@db.xxxxxx.supabase.co:5432/postgres`)*.

---

## PHẦN 2: TRIỂN KHAI LÊN VERCEL

### Bước 1: Đăng nhập Vercel & Import GitHub Repository
1. Truy cập [https://vercel.com](https://vercel.com) và đăng nhập bằng tài khoản **GitHub**.
2. Tại trang tổng quan Dashboard, bấm **"Add New..."** -> chọn **"Project"**.
3. Tìm repository `nhomkinh_huyhoang` và bấm **"Import"**.

### Bước 2: Cấu hình biến môi trường (Environment Variables) trên Vercel
Trong mục **Environment Variables**, bấm thêm các biến môi trường sau:

| Tên biến (Key) | Giá trị mẫu (Value) | Ghi chú |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://postgres:MatKhau@db.xxxx.supabase.co:5432/postgres` | Chuỗi kết nối Supabase lấy ở Phần 1 |
| `JWT_SECRET` | `nhomkinh_huyhoang_secret_key_2026_super_secure` | Khóa bí mật tạo token bảo mật |
| `JWT_EXPIRES_IN` | `7d` | Thời hạn phiên đăng nhập Admin |
| `NODE_ENV` | `production` | Chế độ Production |

### Bước 3: Deploy (Bấm Triển Khai)
1. Bấm nút **"Deploy"**.
2. Vercel sẽ tự động build Frontend React và đóng gói Serverless API. Quá trình mất khoảng 1 - 2 phút.
3. Khi hoàn tất, Vercel sẽ hiển thị thông báo chúc mừng kèm theo tên miền miễn phí dạng `https://nhomkinh-huyhoang.vercel.app`.

---

## PHẦN 3: KIỂM TRA VÀ SỬ DỤNG TRÊN MÔI TRƯỜNG ONLINE

1. **Trang chủ:** Truy cập `https://<ten-mien-cua-ban>.vercel.app`
2. **Kiểm tra chức năng:**
   - [x] Chế độ Sáng / Tối (Dark & Light Mode).
   - [x] Trợ lý Chat tư vấn tự động (Gửi Zalo 0978398567 & số Hotline).
   - [x] Xem danh mục sản phẩm, chi tiết sản phẩm, công trình, tin tức.
   - [x] Gửi form yêu cầu tư vấn & báo giá (dữ liệu lưu trực tiếp vào Supabase).
   - [x] Giao diện di động Responsive & thanh nút gọi nhanh thoại/Zalo.
3. **Trang Quản trị Admin:**
   - Đường dẫn: `https://<ten-mien-cua-ban>.vercel.app/admin/login`
   - Tài khoản mặc định: `admin`
   - Mật khẩu: `admin@123`

---

## TỔNG KẾT CÁC FILE ĐÃ ĐƯỢC CHUẨN BỊ SẴN
- `database/supabase_schema.sql`: File SQL chuẩn PostgreSQL dành riêng cho Supabase.
- `api/index.js`: Điểm vào Vercel Serverless Function cho toàn bộ REST API.
- `vercel.json`: Tệp cấu hình điều hướng và build tự động của Vercel.
- `backend/src/config/db.js`: Tự động nhận diện Supabase PostgreSQL, MySQL hoặc Fallback Engine.
