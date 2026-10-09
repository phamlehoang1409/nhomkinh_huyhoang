-- ==========================================================
-- CƠ SỞ DỮ LIỆU MYSQL - NHÔM KÍNH HUY HOÀNG (THANH HÓA)
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `nhomkinh_huyhoang` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nhomkinh_huyhoang`;

-- 1. Bảng admins (Quản trị viên)
CREATE TABLE IF NOT EXISTS `admins` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `role` VARCHAR(20) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Bảng categories (Danh mục sản phẩm)
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Bảng products (Sản phẩm)
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(220) NOT NULL UNIQUE,
  `code` VARCHAR(50) DEFAULT NULL,
  `category_id` INT DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `details` LONGTEXT DEFAULT NULL,
  `specs` LONGTEXT DEFAULT NULL, -- Lưu JSON thông số kỹ thuật
  `price_text` VARCHAR(100) DEFAULT 'Liên hệ báo giá',
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `main_image` VARCHAR(255) DEFAULT NULL,
  `gallery_images` LONGTEXT DEFAULT NULL, -- Lưu mảng JSON danh sách ảnh
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Bảng services (Dịch vụ thi công)
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(220) NOT NULL UNIQUE,
  `short_desc` TEXT DEFAULT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `icon` VARCHAR(100) DEFAULT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `benefits` LONGTEXT DEFAULT NULL, -- JSON array các ưu điểm
  `display_order` INT DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Bảng projects (Công trình đã thi công)
CREATE TABLE IF NOT EXISTS `projects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(220) NOT NULL UNIQUE,
  `category` VARCHAR(100) DEFAULT 'Cửa nhôm kính',
  `client_name` VARCHAR(150) DEFAULT 'Gia đình / Công trình',
  `location` VARCHAR(200) DEFAULT 'Thanh Hóa',
  `completion_date` VARCHAR(50) DEFAULT NULL,
  `description` LONGTEXT DEFAULT NULL,
  `main_image` VARCHAR(255) DEFAULT NULL,
  `gallery_images` LONGTEXT DEFAULT NULL,
  `is_featured` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Bảng article_categories (Danh mục bài viết)
CREATE TABLE IF NOT EXISTS `article_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(120) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Bảng articles (Tin tức, kinh nghiệm & hướng dẫn)
CREATE TABLE IF NOT EXISTS `articles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(270) NOT NULL UNIQUE,
  `category_id` INT DEFAULT NULL,
  `excerpt` TEXT DEFAULT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `thumbnail` VARCHAR(255) DEFAULT NULL,
  `author` VARCHAR(100) DEFAULT 'Nhôm Kính Huy Hoàng',
  `views` INT DEFAULT 0,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_articles_category` FOREIGN KEY (`category_id`) REFERENCES `article_categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Bảng quote_requests (Yêu cầu tư vấn & báo giá)
CREATE TABLE IF NOT EXISTS `quote_requests` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `address` VARCHAR(255) DEFAULT NULL,
  `service_name` VARCHAR(150) DEFAULT NULL,
  `dimensions` VARCHAR(150) DEFAULT NULL,
  `note` TEXT DEFAULT NULL,
  `status` ENUM('new', 'contacted', 'quoted', 'completed', 'cancelled') DEFAULT 'new',
  `admin_note` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Bảng quote_request_images (Ảnh đính kèm từ khách hàng)
CREATE TABLE IF NOT EXISTS `quote_request_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `quote_request_id` INT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_quote_images_request` FOREIGN KEY (`quote_request_id`) REFERENCES `quote_requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Bảng reviews (Đánh giá của khách hàng)
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `customer_name` VARCHAR(100) NOT NULL,
  `rating` INT DEFAULT 5,
  `comment` TEXT NOT NULL,
  `address_or_role` VARCHAR(150) DEFAULT 'Khách hàng tại Thanh Hóa',
  `avatar` VARCHAR(255) DEFAULT NULL,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Bảng site_settings (Cấu hình website & thông tin liên hệ)
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` LONGTEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================================
-- DỮ LIỆU MẪU BAN ĐẦU (SEED DATA)
-- ==========================================================

-- Mật khẩu mặc định của admin: admin@123 (hash bcrypt)
-- Tài khoản quản trị ban đầu
INSERT INTO `admins` (`username`, `password_hash`, `full_name`, `email`, `role`)
VALUES ('admin', '$2a$10$msm6r6J1flHu5oG.j.HoY.0rOgPU9GOaES0FNQn2bpg7kC9/9w6Yq', 'Quản Trị Viên Huy Hoàng', 'huyhoangnhomkinh@gmail.com', 'superadmin')
ON DUPLICATE KEY UPDATE `password_hash`=VALUES(`password_hash`), `full_name`=VALUES(`full_name`);

-- Danh mục sản phẩm
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `display_order`) VALUES
(1, 'Cửa nhôm Xingfa cao cấp', 'cua-nhom-xingfa-cao-cap', 'Các mẫu cửa nhôm Xingfa nhập khẩu chính hãng 100%, độ bền vượt trội', 1),
(2, 'Cửa nhôm hệ vát cạnh / Việt Pháp', 'cua-nhom-he-vat-canh-viet-phap', 'Cửa nhôm kinh tế, mẫu mã đẹp phù hợp nhà ở dân dụng', 2),
(3, 'Cửa kính cường lực & Thủy lực', 'cua-kinh-cuong-luc-thuy-luc', 'Cửa bản lề sàn, cửa kính lùa ray treo văn phòng và mặt tiền', 3),
(4, 'Vách kính ngăn phòng', 'vach-kinh-ngan-phong', 'Vách kính cường lực phòng khách, văn phòng, phòng tắm kính', 4),
(5, 'Lan can & Cầu thang kính', 'lan-can-cau-thang-kinh', 'Lan can kính cường lực tay vịn inox/gỗ, trụ inox 304 sang trọng', 5),
(6, 'Mái kính nghệ thuật & Giếng trời', 'mai-kinh-nghe-thuat-gieng-troi', 'Mái kính cường lực khung sắt nghệ thuật, mái che giếng trời lấy sáng', 6)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Danh mục bài viết
INSERT INTO `article_categories` (`id`, `name`, `slug`) VALUES
(1, 'Kinh nghiệm chọn cửa', 'kinh-nghiem-chon-cua'),
(2, 'Kiến thức nhôm kính', 'kien-thuc-nhom-kinh'),
(3, 'Tư vấn thi công', 'tu-van-thi-cong'),
(4, 'Tin tức cơ sở', 'tin-tuc-co-so')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- Cấu hình trang web (Site Settings)
INSERT INTO `site_settings` (`setting_key`, `setting_value`) VALUES
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
('policy_privacy', 'Chính sách bảo mật: Nhôm Kính Huy Hoàng cam kết bảo mật tuyệt đối mọi thông tin cá nhân (họ tên, số điện thoại, địa chỉ) do khách hàng cung cấp. Thông tin chỉ được sử dụng cho mục đích tư vấn, khảo sát thực tế và báo giá thi công công trình.'),
('policy_terms', 'Điều khoản dịch vụ: Nhôm Kính Huy Hoàng tiếp nhận đơn hàng, khảo sát công trình thực tế, ký kết thỏa thuận thi công rõ ràng về chủng loại nhôm, độ dày kính, phụ kiện chính hãng và tiến độ hoàn thiện trước khi tiến hành lắp đặt.'),
('policy_quote_process', 'Quy trình báo giá: 1. Tiếp nhận yêu cầu -> 2. Khảo sát đo đạc thực tế tại công trình miễn phí -> 3. Lên phương án thiết kế & gửi bảng báo giá chi tiết -> 4. Gia công sản xuất chuẩn kỹ thuật -> 5. Lắp đặt, nghiệm thu và bàn giao bảo hành.')
ON DUPLICATE KEY UPDATE `setting_value`=VALUES(`setting_value`);
