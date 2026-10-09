-- ==========================================================
-- SUPABASE / POSTGRESQL SCHEMA CHO NHÔM KÍNH HUY HOÀNG
-- Hướng dẫn: Copy toàn bộ nội dung file này và dán vào
-- Supabase Dashboard -> SQL Editor -> Bấm RUN
-- ==========================================================

-- 1. Bảng admins (Tài khoản quản trị)
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) DEFAULT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng categories (Danh mục sản phẩm)
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  image TEXT DEFAULT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bảng products (Sản phẩm)
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  code VARCHAR(50) DEFAULT NULL,
  category_id INT REFERENCES categories(id) ON DELETE SET NULL,
  description TEXT DEFAULT NULL,
  details TEXT DEFAULT NULL,
  specs TEXT DEFAULT NULL,
  price_text VARCHAR(100) DEFAULT 'Liên hệ báo giá',
  is_featured SMALLINT DEFAULT 0,
  is_active SMALLINT DEFAULT 1,
  main_image TEXT DEFAULT NULL,
  gallery_images TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bảng services (Dịch vụ thi công)
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  short_desc TEXT DEFAULT NULL,
  content TEXT DEFAULT NULL,
  icon VARCHAR(100) DEFAULT 'DoorClosed',
  image TEXT DEFAULT NULL,
  benefits TEXT DEFAULT NULL,
  display_order INT DEFAULT 0,
  is_featured SMALLINT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bảng projects (Công trình đã thi công)
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  category VARCHAR(100) DEFAULT 'Cửa nhôm kính',
  client_name VARCHAR(150) DEFAULT 'Gia đình / Công trình',
  location VARCHAR(200) DEFAULT 'Thanh Hóa',
  completion_date VARCHAR(50) DEFAULT NULL,
  description TEXT DEFAULT NULL,
  main_image TEXT DEFAULT NULL,
  gallery_images TEXT DEFAULT NULL,
  is_featured SMALLINT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Bảng article_categories (Danh mục bài viết)
CREATE TABLE IF NOT EXISTS article_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Bảng articles (Tin tức, kinh nghiệm & hướng dẫn)
CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(270) NOT NULL UNIQUE,
  category_id INT REFERENCES article_categories(id) ON DELETE SET NULL,
  excerpt TEXT DEFAULT NULL,
  content TEXT DEFAULT NULL,
  thumbnail TEXT DEFAULT NULL,
  author VARCHAR(100) DEFAULT 'Nhôm Kính Huy Hoàng',
  views INT DEFAULT 0,
  is_published SMALLINT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Bảng quote_requests (Yêu cầu tư vấn & báo giá)
CREATE TABLE IF NOT EXISTS quote_requests (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(255) DEFAULT NULL,
  service_name VARCHAR(150) DEFAULT NULL,
  dimensions VARCHAR(150) DEFAULT NULL,
  note TEXT DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'new',
  admin_note TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Bảng quote_request_images (Ảnh đính kèm từ khách hàng)
CREATE TABLE IF NOT EXISTS quote_request_images (
  id SERIAL PRIMARY KEY,
  quote_request_id INT NOT NULL REFERENCES quote_requests(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Bảng reviews (Đánh giá của khách hàng)
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(100) NOT NULL,
  rating INT DEFAULT 5,
  comment TEXT NOT NULL,
  address_or_role VARCHAR(150) DEFAULT 'Khách hàng tại Thanh Hóa',
  avatar TEXT DEFAULT NULL,
  is_published SMALLINT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Bảng site_settings (Cấu hình website & thông tin liên hệ)
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================================
-- DỮ LIỆU MẪU BAN ĐẦU CHO SUPABASE
-- ==========================================================

-- Mật khẩu mặc định của admin: admin@123
INSERT INTO admins (id, username, password_hash, full_name, email, role)
VALUES (1, 'admin', '$2a$10$msm6r6J1flHu5oG.j.HoY.0rOgPU9GOaES0FNQn2bpg7kC9/9w6Yq', 'Quản Trị Viên Huy Hoàng', 'huyhoangnhomkinh77@gmail.com', 'superadmin')
ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Danh mục sản phẩm
INSERT INTO categories (id, name, slug, description, image, display_order) VALUES
(1, 'Cửa nhôm Xingfa cao cấp', 'cua-nhom-xingfa-cao-cap', 'Các mẫu cửa nhôm Xingfa nhập khẩu tem đỏ chính hãng 100%, kết cấu vững chắc, phụ kiện Kinlong đồng bộ.', 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80', 1),
(2, 'Cửa nhôm hệ vát cạnh / Việt Pháp', 'cua-nhom-he-vat-canh-viet-phap', 'Cửa nhôm kinh tế, thanh mảnh hiện đại, tối ưu chi phí cho nhà phố, nhà cấp 4 và công trình dân dụng.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 2),
(3, 'Cửa kính cường lực & Thủy lực', 'cua-kinh-cuong-luc-thuy-luc', 'Cửa kính mở quay bản lề sàn thủy lực, cửa lùa trượt ray treo inox, tạo không gian mở sang trọng.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', 3),
(4, 'Vách kính ngăn phòng', 'vach-kinh-ngan-phong', 'Vách kính cường lực văn phòng, vách ngăn phòng khách, phòng tắm kính cường lực chống nước tuyệt đối.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', 4),
(5, 'Lan can & Cầu thang kính', 'lan-can-cau-thang-kinh', 'Lan can ban công kính cường lực, cầu thang kính tay vịn gỗ lim/inox 304 không gỉ, an toàn bền đẹp.', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', 5),
(6, 'Mái kính nghệ thuật & Giếng trời', 'mai-kinh-nghe-thuat-gieng-troi', 'Mái hiên kính cường lực kết hợp khung sắt nghệ thuật uốn cong, mái kính lấy sáng tự nhiên.', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', 6)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- Dịch vụ
INSERT INTO services (id, name, slug, short_desc, content, icon, image, benefits, display_order, is_featured) VALUES
(1, 'Thi công cửa nhôm Xingfa nhập khẩu', 'thi-cong-cua-nhom-xingfa-nhap-khau', 'Chuyên gia công và lắp đặt cửa đi, cửa sổ nhôm Xingfa hệ 55, hệ 93 tem đỏ nhập khẩu chính hãng tại Thanh Hóa.', 'Nhôm Kính Huy Hoàng nhận thi công trọn gói các hạng mục cửa nhôm Xingfa nhập khẩu tem đỏ Quảng Đông. Cửa nhôm Xingfa có kết cấu khoang rỗng cùng các đường gân gia cường giúp chịu lực gió bão cực tốt, cách âm cách nhiệt hoàn hảo khi kết hợp cùng kính dán an toàn hoặc kính hộp hút chân không. Đội ngũ thợ tay nghề cao, ép góc chuẩn xác kín khít bằng máy móc hiện đại.', 'DoorClosed', 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80', '["Nhôm Xingfa tem đỏ chính hãng 100%, độ dày tiêu chuẩn 1.4mm - 2.0mm","Sơn tĩnh điện cao cấp chống oxy hóa, bền màu trên 10 năm","Phụ kiện Kinlong, Draho, Huy Hoàng chính hãng đồng bộ","Bảo hành kỹ thuật dài hạn, khảo sát tận nơi miễn phí"]', 1, 1),
(2, 'Lắp đặt cửa kính cường lực & Cửa thủy lực', 'lap-dat-cua-kinh-cuong-luc-cua-thuy-luc', 'Thi công cửa kính bản lề sàn thủy lực, cửa kính lùa ray treo cho nhà phố, cửa hàng, showroom kinh doanh.', 'Cửa kính cường lực sử dụng phôi kính chuẩn Việt Nhật hoặc Hải Long độ dày 10mm - 12mm chịu lực gấp 4-5 lần kính thường. Phụ kiện bản lề sàn VVP Thái Lan, Adler Đức chính hãng đóng mở êm ái, nhẹ nhàng, bền bỉ theo thời gian.', 'Maximize', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', '["Kính tôi cường lực tiêu chuẩn an toàn cao, khó vỡ vụn","Mở rộng tối đa tầm nhìn và đón ánh sáng tự nhiên","Bản lề sàn vận hành êm ái, căn chỉnh góc mở chuẩn xác","Bảo dưỡng và hỗ trợ kỹ thuật nhanh chóng"]', 2, 1),
(3, 'Thi công vách kính văn phòng & Phòng tắm kính', 'thi-cong-vach-kinh-van-phong-phong-tam-kinh', 'Phân chia không gian làm việc chuyên nghiệp, vách kính cabin tắm đứng hiện đại ngăn nước tuyệt đối.', 'Vách kính cường lực giúp tối ưu hóa diện tích sử dụng, tạo không gian làm việc hiện đại, sang trọng và tràn ngập ánh sáng. Đối với cabin tắm kính, các phụ kiện gioăng từ, kẹp inox 304 chuẩn ngăn nước bắn ra ngoài sàn phòng tắm, giữ không gian luôn khô ráo sạch sẽ.', 'Layers', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', '["Tạo không gian mở hiện đại, chuyên nghiệp cho văn phòng","Cabin tắm kính phụ kiện Inox 304 chống rỉ sét tuyệt đối","Thi công nhanh chóng, gọn gàng, bàn giao đúng tiến độ","Dễ dàng vệ sinh lau chùi hàng ngày"]', 3, 1),
(4, 'Lắp đặt lan can kính, cầu thang kính & Mái kính', 'lap-dat-lan-can-kinh-cau-thang-kinh-mai-kinh', 'Lan can ban công kính an toàn, cầu thang kính hiện đại và mái hiên kính cường lực chịu lực thời tiết.', 'Lan can và mái kính cường lực tạo điểm nhấn thẩm mỹ thanh thoát cho các công trình biệt thự, nhà phố hiện đại. Sử dụng kính cường lực dày 10mm - 12mm hoặc kính dán an toàn 2 lớp kết hợp hệ khung chịu lực vững chắc đảm bảo an toàn tuyệt đối.', 'ShieldCheck', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', '["Chân trụ Inox 304 đúc đặc hoặc củ pass kính vững chắc","Kính cường lực an toàn chịu tải trọng và sức gió lớn","Tính thẩm mỹ vượt trội, nâng tầm giá trị ngôi nhà","Khảo sát kết cấu kỹ lưỡng trước khi lắp đặt"]', 4, 1),
(5, 'Sửa chữa cửa nhôm kính & Thay thế phụ kiện', 'sua-chua-cua-nhom-kinh-thay-the-phu-kien', 'Khắc phục cửa bị xệ cánh, hỏng bản lề sàn, hỏng khóa, kẹt bánh xe ray lùa, vỡ kính nhanh chóng tại Thanh Hóa.', 'Nhôm Kính Huy Hoàng cung cấp dịch vụ sửa chữa, bảo trì cửa nhôm kính tận nơi. Xử lý triệt để các tình trạng cửa xệ cọ nền, bản lề thủy lực chảy dầu, thay khóa cửa nhôm Xingfa, thay kính vỡ, thay bánh xe cửa lùa với chi phí hợp lý nhất.', 'Wrench', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', '["Có mặt nhanh chóng khảo sát và khắc phục sự cố","Linh kiện phụ kiện thay thế chuẩn quy cách, chính hãng","Chi phí minh bạch, báo giá trước khi sửa chữa","Bảo hành sau sửa chữa giúp khách hàng an tâm"]', 5, 1),
(6, 'Khảo sát, tư vấn thiết kế & Báo giá tại công trình', 'khao-sat-tu-van-thiet-ke-bao-gia-tai-cong-trinh', 'Đội ngũ thợ đến tận nơi đo đạc số liệu thực tế, tư vấn quy cách cửa phù hợp phong thủy và lập dự toán chi tiết.', 'Chúng tôi hỗ trợ mang mẫu nhôm, catalogue phụ kiện đến tận công trình của quý khách tại Thọ Xuân và toàn tỉnh Thanh Hóa để tư vấn giải pháp tối ưu nhất về công năng và chi phí đầu tư.', 'CheckCircle2', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80', '["Đo đạc chính xác bằng máy cân bằng laser hiện đại","Tư vấn kích thước chuẩn thước Lỗ Ban đón tài lộc","Báo giá chi tiết từng hạng mục không bóc tách chi phí ẩn","Tư vấn tận tâm 24/7 qua Hotline/Zalo 0978398567"]', 6, 1)
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- Sản phẩm mẫu
INSERT INTO products (id, name, slug, code, category_id, description, details, specs, price_text, is_featured, is_active, main_image, gallery_images) VALUES
(1, 'Cửa đi 4 cánh nhôm Xingfa hệ 55 mở quay', 'cua-di-4-canh-nhom-xingfa-he-55-mo-quay', 'XF55-4CQ', 1, 'Mẫu cửa đi mặt tiền chính 4 cánh nhôm Xingfa nhập khẩu tem đỏ, kết cấu chắc chắn, cách âm cách nhiệt tốt.', 'Cửa đi 4 cánh mở quay nhôm Xingfa hệ 55 là sự lựa chọn hoàn hảo cho cửa chính mặt tiền của nhà phố, biệt thự. Sử dụng nhôm Xingfa nhập khẩu chính hãng độ dày 2.0mm, kết hợp hệ gioăng cao su EPDM kép kín khít và khóa đa điểm Kinlong giúp chống trộm an toàn tuyệt đối.', '{"Hệ nhôm":"Xingfa nhập khẩu hệ 55 chính hãng","Độ dày nhôm":"2.0mm (+- 5%) tiêu chuẩn cửa đi","Kính":"Kính dán an toàn 8.38mm hoặc kính cường lực 10mm","Màu sắc":"Nâu cafe ánh kim, Ghi xám, Trắng sứ, Vân gỗ","Phụ kiện":"Khóa đa điểm, bản lề 3D Kinlong đồng bộ","Bảo hành":"5 năm profile nhôm, 2 năm phụ kiện kim khí"}', 'Liên hệ báo giá', 1, 1, 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"]'),
(2, 'Cửa đi 4 cánh nhôm Xingfa hệ 93 mở trượt lùa', 'cua-di-4-canh-nhom-xingfa-he-93-mo-truot-lua', 'XF93-4CT', 1, 'Cửa lùa trượt 4 cánh tiết kiệm diện tích tối đa, trượt nhẹ nhàng trên thanh ray inox, chống va đập gió bão.', 'Cửa lùa trượt nhôm Xingfa hệ 93 phù hợp cho các không gian có mặt tiền rộng hoặc lối ra ban công, sân vườn. Ray trượt inox chịu lực giúp cánh cửa lướt êm ái, không tốn diện tích quay cánh.', '{"Hệ nhôm":"Xingfa nhập khẩu hệ 93 bản ray trượt","Độ dày nhôm":"2.0mm","Kính":"Kính dán an toàn 8.38mm hoặc kính hộp cách âm","Màu sắc":"Ghi xám xingfa, Nâu cafe, Trắng","Phụ kiện":"Bánh xe đôi chịu lực, khóa bán nguyệt / khóa chữ D Kinlong","Bảo hành":"5 năm profile nhôm"}', 'Liên hệ báo giá', 1, 1, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80"]'),
(3, 'Cửa đi 1 cánh nhôm Xingfa phòng ngủ / WC', 'cua-di-1-canh-nhom-xingfa-phong-ngu-wc', 'XF55-1CQ', 1, 'Cửa thông phòng ngủ và nhà vệ sinh nhôm Xingfa hệ 55, kết hợp kính mờ hoặc pano nhôm chống nước.', 'Thiết kế 1 cánh mở quay nhỏ gọn, thanh lịch. Khả năng cách âm tốt cho phòng ngủ và chống nước 100% không ẩm mốc, cong vênh như cửa gỗ khi lắp cho nhà vệ sinh.', '{"Hệ nhôm":"Xingfa hệ 55","Độ dày nhôm":"1.4mm - 2.0mm","Kính":"Kính mờ phun cát 8.38mm hoặc kính cường lực","Màu sắc":"Nâu cafe, Ghi xám, Trắng sứ, Vân gỗ","Phụ kiện":"Khóa đơn điểm, bản lề Kinlong","Bảo hành":"5 năm profile nhôm"}', 'Liên hệ báo giá', 1, 1, 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=800&q=80"]'),
(4, 'Cửa sổ 2 cánh mở quay / mở hất nhôm Xingfa', 'cua-so-2-canh-mo-quay-mo-hat-nhom-xingfa', 'XF55-CS2Q', 1, 'Cửa sổ hệ 55 mở quay hoặc mở hất lấy gió tươi chống mưa hắt hiệu quả.', 'Cửa sổ nhôm Xingfa mở hất kết hợp tay nắm gạt và thanh hạn vị góc mở 45 độ giúp thoáng khí trong phòng mà không lo mưa tạt hay gió giật đập cánh.', '{"Hệ nhôm":"Xingfa hệ 55 dày 1.4mm","Kính":"Kính dán 6.38mm / 8.38mm","Phụ kiện":"Bản lề chữ A, tay gạt Kinlong","Màu sắc":"Ghi xám, Nâu cafe, Trắng","Bảo hành":"5 năm"}', 'Liên hệ báo giá', 0, 1, 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=800&q=80"]'),
(5, 'Cửa kính cường lực mở quay bản lề sàn 12mm', 'cua-kinh-cuong-luc-mo-quay-ban-le-san-12mm', 'CK-BLS12', 3, 'Cửa thủy lực bản lề sàn kính cường lực 12mm chuẩn chịu lực cho cửa hàng, showroom, văn phòng.', 'Cửa kính cường lực không viền hoặc viền inox vàng gương sang trọng, tay nắm inox 304 dài 80cm - 1m, bản lề sàn VVP chuẩn Thái Lan.', '{"Chất liệu kính":"Kính cường lực tôi nhiệt 12mm phôi Việt Nhật","Phụ kiện":"Bản lề sàn VVP / Adler, kẹp trên, kẹp dưới, khóa sàn","Tay nắm":"Tay nắm Inox 304 / Tay nắm gỗ / Tay nắm mạ vàng","Bảo hành":"Kính bảo hành 10 năm, phụ kiện 2 năm đổi mới"}', 'Liên hệ báo giá', 1, 1, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"]'),
(6, 'Vách kính cường lực ngăn phòng văn phòng', 'vach-kinh-cuong-luc-ngan-phong-van-phong', 'VK-VP10', 4, 'Vách kính khổ lớn ngăn phòng họp, phòng giám đốc kèm dán decal mờ cách điệu logo.', 'Hệ vách kính sử dụng nẹp nhôm định hình hoặc sập nhôm trắng bóng, kính cường lực 10mm phẳng chuẩn tạo không gian mở và tăng tính chuyên nghiệp.', '{"Kính":"Kính cường lực 10mm phôi Hải Long / Việt Nhật","Nẹp viền":"Nẹp sập nhôm 38 hoặc khung nhôm định hình","Keo":"Keo Silicone A500 trung tính không mùi kháng mốc","Bảo hành":"5 năm"}', 'Liên hệ báo giá', 1, 1, 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"]'),
(7, 'Lan can kính ban công tay vịn Inox 304', 'lan-can-kinh-ban-cong-tay-vin-inox-304', 'LC-INOX304', 5, 'Lan can kính ngoài trời trụ lửng hoặc trụ cao inox 304 chống rỉ sét, kính cường lực an toàn.', 'Mang lại vẻ đẹp hiện đại, không che khuất tầm nhìn phong cảnh từ ban công tầng lầu. Vật liệu Inox 304 chuẩn bền vững trước khí hậu mưa nắng nhiệt đới.', '{"Kính":"Kính cường lực 10mm - 12mm mài xiết cạnh bóng","Trụ":"Trụ Inox 304 đúc đặc chống gỉ sét tuyệt đối","Tay vịn":"Ống Inox 304 phi 51mm hoặc hộp 40x80mm","Bảo hành":"Trụ inox bảo hành không rỉ sét 10 năm"}', 'Liên hệ báo giá', 1, 1, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"]'),
(8, 'Mái kính cường lực khung sắt nghệ thuật', 'mai-kinh-cuong-luc-khung-sat-nghe-thuat', 'MK-NT01', 6, 'Mái hiên kính sảnh biệt thự, nhà phố sang trọng khung sắt hoa văn mỹ thuật sơn tĩnh điện.', 'Mái kính lấy sáng sảnh đón hoặc giếng trời, bảo vệ hiên nhà khỏi mưa hắt mà vẫn đón trọn vẹn ánh sáng tự nhiên.', '{"Kính":"Kính dán cường lực 2 lớp 11.52mm hoặc kính cường lực 12mm","Khung chịu lực":"Khung sắt hộp mạ kẽm uốn mỹ thuật sơn tĩnh điện","Bảo hành":"5 năm"}', 'Liên hệ báo giá', 1, 1, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"]')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- Công trình mẫu
INSERT INTO projects (id, title, slug, category, client_name, location, completion_date, description, main_image, gallery_images, is_featured) VALUES
(1, 'Thi công toàn bộ hệ thống cửa nhôm Xingfa nhà phố', 'thi-cong-he-thong-cua-nhom-xingfa-nha-pho-tho-xuan', 'Cửa nhôm kính', 'Gia đình anh Tuấn', 'Thị trấn Thọ Xuân, Thanh Hóa', 'Tháng 03/2026', 'Công trình nhà phố 3 tầng bao gồm cửa đi 4 cánh mặt tiền Xingfa hệ 55 ghi xám, cửa sổ mở hất và cửa thông phòng, hoàn thiện đúng tiến độ và nghiệm thu đạt chuẩn thẩm mỹ cao.', 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"]', 1),
(2, 'Lắp đặt cửa kính thủy lực và vách ngăn văn phòng', 'lap-dat-cua-kinh-thuy-luc-vach-ngan-van-phong-thanh-hoa', 'Vách kính cường lực', 'Công ty CP Xây Dựng & Thương Mại', 'TP. Thanh Hóa', 'Tháng 02/2026', 'Hạng mục gồm 120m2 vách kính ngăn phòng họp và 2 bộ cửa kính thủy lực bản lề sàn 12mm tay nắm Inox sang trọng.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"]', 1),
(3, 'Thi công lan can ban công kính và mái kính sảnh biệt thự', 'thi-cong-lan-can-kinh-mai-kinh-sanh-biet-thu-yen-dinh', 'Lan can & Mái kính', 'Biệt thự gia đình chú Hùng', 'Yên Định, Thanh Hóa', 'Tháng 01/2026', 'Lắp đặt 45m lan can kính cường lực tay vịn inox 304 trụ lửng và 1 mái kính nghệ thuật sân trước tạo điểm nhấn đẳng cấp cho căn biệt thự.', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"]', 1)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

-- Danh mục bài viết
INSERT INTO article_categories (id, name, slug) VALUES
(1, 'Kinh nghiệm chọn cửa', 'kinh-nghiem-chon-cua'),
(2, 'Kiến thức nhôm kính', 'kien-thuc-nhom-kinh'),
(3, 'Tư vấn thi công', 'tu-van-thi-cong'),
(4, 'Tin tức cơ sở', 'tin-tuc-co-so')
ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

-- Bài viết
INSERT INTO articles (id, title, slug, category_id, excerpt, content, thumbnail, author, views, is_published) VALUES
(1, 'Cách phân biệt nhôm Xingfa nhập khẩu chính hãng và hàng nhái', 'cach-phan-biet-nhom-xingfa-nhap-khau-chinh-hang', 2, 'Hướng dẫn chi tiết cách kiểm tra tem đỏ Quảng Đông, mã QR code, mặt cắt nhôm và màu sắc ánh kim để tránh mua phải nhôm giả kém chất lượng.', 'Nhôm Xingfa nhập khẩu tem đỏ Quảng Đông là dòng nhôm cao cấp được tin dùng hàng đầu tại Việt Nam. Tuy nhiên trên thị trường có nhiều loại nhôm nhái tem mác. Để nhận biết nhôm chính hãng: 1. Kiểm tra tem dán có mã QR quét ra thông tin nhà máy Xingfa; 2. Màu sơn bên trong khoang nhôm có ánh kim đồng đều; 3. Bề mặt cắt profile nhôm dày dặn đúng chuẩn (1.4mm - 2.0mm); 4. Lựa chọn cơ sở thi công uy tín như Nhôm Kính Huy Hoàng để đảm bảo nguồn gốc.', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80', 'Nhôm Kính Huy Hoàng', 154, 1),
(2, 'Nên chọn cửa nhôm Xingfa mở quay hay mở trượt lùa?', 'nen-chon-cua-nhom-xingfa-mo-quay-hay-mo-truot-lua', 1, 'So sánh ưu nhược điểm giữa cửa mở quay và cửa lùa trượt giúp gia chủ tối ưu công năng sử dụng và diện tích ngôi nhà.', 'Cửa mở quay mang lại độ kín khít tuyệt đối, cách âm cách nhiệt tốt nhất, mở được 100% diện tích ô cửa, rất phù hợp làm cửa chính mặt tiền. Trong khi đó, cửa mở trượt lùa giúp tiết kiệm không gian đóng mở, chống va đập gió mạnh hiệu quả, rất thích hợp cho cửa ban công, sân thượng hoặc nhà có diện tích hẹp.', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', 'Nhôm Kính Huy Hoàng', 210, 1),
(3, 'Kinh nghiệm bảo quản và vệ sinh cửa nhôm kính luôn sáng bóng', 'kinh-nghiem-bao-quan-va-ve-sinh-cua-nhom-kinh-luon-sang-bong', 3, 'Mẹo đơn giản giúp bề mặt kính trong suốt và phụ kiện khóa, bản lề vận hành trơn tru bền bỉ qua năm tháng.', 'Để cửa nhôm kính bền đẹp: thường xuyên lau kính bằng nước lau kính chuyên dụng hoặc giấm pha loãng với khăn mềm microfiber; tránh dùng vật sắc nhọn cạo lên khung nhôm; định kỳ 6 tháng tra dầu bảo dưỡng vào các khớp bản lề và ổ khóa.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', 'Nhôm Kính Huy Hoàng', 98, 1)
ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title;

-- Đánh giá khách hàng
INSERT INTO reviews (id, customer_name, rating, comment, address_or_role, avatar, is_published) VALUES
(1, 'Bác Trần Văn Lâm', 5, 'Cơ sở Huy Hoàng thi công cửa nhôm Xingfa rất cẩn thận, đường keo đẹp kín khít, thợ làm nhiệt tình và đúng hẹn. Rất hài lòng.', 'Thọ Hải, Thọ Xuân, Thanh Hóa', NULL, 1),
(2, 'Anh Lê Hoàng Nam', 5, 'Lắp bộ cửa kính thủy lực mặt tiền cửa hàng đóng mở rất êm, giá cả báo rõ ràng từ đầu không phát sinh thêm chi phí nào.', 'Thị trấn Thọ Xuân', NULL, 1),
(3, 'Chị Mai Lan', 5, 'Vách kính tắm đứng và lan can kính ban công làm rất chắc chắn và sang trọng. Tư vấn nhiệt tình, đo đạc phong thủy chuẩn.', 'Thành phố Thanh Hóa', NULL, 1)
ON CONFLICT DO NOTHING;

-- Cấu hình website
INSERT INTO site_settings (setting_key, setting_value) VALUES
('site_name', 'Nhôm Kính Huy Hoàng - Thọ Xuân, Thanh Hóa'),
('brand_name', 'Nhôm Kính Huy Hoàng'),
('hotline', '0978398567'),
('zalo', '0978398567'),
('email', 'huyhoangnhomkinh77@gmail.com'),
('address', 'Thôn Tân Thành, xã Thọ Hải, huyện Thọ Xuân, tỉnh Thanh Hóa'),
('opening_hours', '07:00 - 18:30 (Thứ 2 - Chủ Nhật)'),
('meta_description', 'Cơ sở Nhôm Kính Huy Hoàng tại Thọ Xuân, Thanh Hóa chuyên thi công cửa nhôm Xingfa, cửa kính cường lực, vách kính, lan can, mái kính uy tín, chuyên nghiệp, giá tốt nhất.'),
('meta_keywords', 'nhôm kính thanh hóa, nhôm kính thọ xuân, cửa nhôm xingfa thanh hóa, cửa kính cường lực thanh hóa, vách kính thọ hải, nhôm kính huy hoàng'),
('google_map_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120000!2d105.5!3d19.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3136500000000000%3A0x0!2zVGjhu40gSOG6o2ksIFRo4buNIFh1w6JuLCBUaGFuaCBIw7Fh!5e0!3m2!1svi!2svn!4v1680000000000!5m2!1svi!2svn'),
('policy_privacy', 'Chính sách bảo mật: Nhôm Kính Huy Hoàng cam kết bảo mật tuyệt đối mọi thông tin cá nhân (họ tên, số điện thoại, địa chỉ công trình) do khách hàng cung cấp qua form liên hệ hoặc điện thoại. Thông tin chỉ được sử dụng cho mục đích tư vấn kỹ thuật, khảo sát đo đạc thực tế tại công trình và lập báo giá chi tiết cho quý khách.'),
('policy_terms', 'Điều khoản dịch vụ: Nhôm Kính Huy Hoàng tiếp nhận đơn hàng, khảo sát công trình thực tế, tư vấn quy cách nhôm kính và ký kết thỏa thuận thi công rõ ràng về chủng loại vật tư, độ dày kính, nguồn gốc phụ kiện chính hãng, tiến độ và điều khoản bảo hành trước khi tiến hành gia công lắp đặt.'),
('policy_quote_process', 'Quy trình báo giá & thi công: 1. Tiếp nhận yêu cầu khách hàng qua Hotline/Zalo 0978398567 hoặc form website; 2. Khảo sát đo đạc thực tế tại công trình miễn phí; 3. Lên phương án thiết kế & gửi bảng báo giá chi tiết, minh bạch; 4. Gia công sản xuất tại xưởng chuẩn kỹ thuật; 5. Vận chuyển, lắp đặt hoàn thiện, nghiệm thu và bàn giao phiếu bảo hành.')
ON CONFLICT (setting_key) DO UPDATE SET setting_value = EXCLUDED.setting_value;

-- Cập nhật chuỗi auto increment (Sequence) để tránh trùng ID khi thêm bản ghi mới
SELECT setval('admins_id_seq', (SELECT COALESCE(MAX(id), 1) FROM admins));
SELECT setval('categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM categories));
SELECT setval('products_id_seq', (SELECT COALESCE(MAX(id), 1) FROM products));
SELECT setval('services_id_seq', (SELECT COALESCE(MAX(id), 1) FROM services));
SELECT setval('projects_id_seq', (SELECT COALESCE(MAX(id), 1) FROM projects));
SELECT setval('article_categories_id_seq', (SELECT COALESCE(MAX(id), 1) FROM article_categories));
SELECT setval('articles_id_seq', (SELECT COALESCE(MAX(id), 1) FROM articles));
SELECT setval('reviews_id_seq', (SELECT COALESCE(MAX(id), 1) FROM reviews));
SELECT setval('site_settings_id_seq', (SELECT COALESCE(MAX(id), 1) FROM site_settings));
