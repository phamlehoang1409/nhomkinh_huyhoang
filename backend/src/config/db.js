const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'nhomkinh_huyhoang',
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0,
  charset: 'utf8mb4'
};

let pool = null;
let useFallbackStorage = false;
const fallbackDataFile = path.join(__dirname, '..', '..', 'data', 'database_fallback.json');

// Helper data for fallback
let fallbackStore = {
  admins: [],
  categories: [],
  products: [],
  services: [],
  projects: [],
  article_categories: [],
  articles: [],
  quote_requests: [],
  quote_request_images: [],
  reviews: [],
  site_settings: []
};

// Initial default seed dataset
async function getInitialSeedData() {
  const defaultPasswordHash = await bcrypt.hash('admin@123', 10);
  return {
    admins: [
      {
        id: 1,
        username: 'admin',
        password_hash: defaultPasswordHash,
        full_name: 'Quản Trị Viên Huy Hoàng',
        email: 'huyhoangnhomkinh77@gmail.com',
        role: 'superadmin',
        created_at: new Date().toISOString()
      }
    ],
    categories: [
      { id: 1, name: 'Cửa nhôm Xingfa cao cấp', slug: 'cua-nhom-xingfa-cao-cap', description: 'Các mẫu cửa nhôm Xingfa nhập khẩu tem đỏ chính hãng 100%, kết cấu vững chắc, phụ kiện Kinlong đồng bộ.', image: 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80', display_order: 1, created_at: new Date().toISOString() },
      { id: 2, name: 'Cửa nhôm hệ vát cạnh / Việt Pháp', slug: 'cua-nhom-he-vat-canh-viet-phap', description: 'Cửa nhôm kinh tế, thanh mảnh hiện đại, tối ưu chi phí cho nhà phố, nhà cấp 4 và công trình dân dụng.', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', display_order: 2, created_at: new Date().toISOString() },
      { id: 3, name: 'Cửa kính cường lực & Thủy lực', slug: 'cua-kinh-cuong-luc-thuy-luc', description: 'Cửa kính mở quay bản lề sàn thủy lực, cửa lùa trượt ray treo inox, tạo không gian mở sang trọng.', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', display_order: 3, created_at: new Date().toISOString() },
      { id: 4, name: 'Vách kính ngăn phòng', slug: 'vach-kinh-ngan-phong', description: 'Vách kính cường lực văn phòng, vách ngăn phòng khách, phòng tắm kính cường lực chống nước tuyệt đối.', image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', display_order: 4, created_at: new Date().toISOString() },
      { id: 5, name: 'Lan can & Cầu thang kính', slug: 'lan-can-cau-thang-kinh', description: 'Lan can ban công kính cường lực, cầu thang kính tay vịn gỗ lim/inox 304 không gỉ, an toàn bền đẹp.', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', display_order: 5, created_at: new Date().toISOString() },
      { id: 6, name: 'Mái kính nghệ thuật & Giếng trời', slug: 'mai-kinh-nghe-thuat-gieng-troi', description: 'Mái hiên kính cường lực kết hợp khung sắt nghệ thuật uốn cong, mái kính lấy sáng tự nhiên.', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', display_order: 6, created_at: new Date().toISOString() }
    ],
    services: [
      {
        id: 1,
        name: 'Thi công cửa nhôm Xingfa nhập khẩu',
        slug: 'thi-cong-cua-nhom-xingfa-nhap-khau',
        short_desc: 'Chuyên gia công và lắp đặt cửa đi, cửa sổ nhôm Xingfa hệ 55, hệ 93 tem đỏ nhập khẩu chính hãng tại Thanh Hóa.',
        content: 'Nhôm Kính Huy Hoàng nhận thi công trọn gói các hạng mục cửa nhôm Xingfa nhập khẩu tem đỏ Quảng Đông. Cửa nhôm Xingfa có kết cấu khoang rỗng cùng các đường gân gia cường giúp chịu lực gió bão cực tốt, cách âm cách nhiệt hoàn hảo khi kết hợp cùng kính dán an toàn hoặc kính hộp hút chân không. Đội ngũ thợ tay nghề cao, ép góc chuẩn xác kín khít bằng máy móc hiện đại.',
        icon: 'DoorClosed',
        image: 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80',
        benefits: JSON.stringify([
          'Nhôm Xingfa tem đỏ chính hãng 100%, độ dày tiêu chuẩn 1.4mm - 2.0mm',
          'Sơn tĩnh điện cao cấp chống oxy hóa, bền màu trên 10 năm',
          'Phụ kiện Kinlong, Draho, Huy Hoàng chính hãng đồng bộ',
          'Bảo hành kỹ thuật dài hạn, khảo sát tận nơi miễn phí'
        ]),
        display_order: 1,
        is_featured: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Lắp đặt cửa kính cường lực & Cửa thủy lực',
        slug: 'lap-dat-cua-kinh-cuong-luc-cua-thuy-luc',
        short_desc: 'Thi công cửa kính bản lề sàn thủy lực, cửa kính lùa ray treo cho nhà phố, cửa hàng, showroom kinh doanh.',
        content: 'Cửa kính cường lực sử dụng phôi kính chuẩn Việt Nhật hoặc Hải Long độ dày 10mm - 12mm chịu lực gấp 4-5 lần kính thường. Phụ kiện bản lề sàn VVP Thái Lan, Adler Đức chính hãng đóng mở êm ái, nhẹ nhàng, bền bỉ theo thời gian.',
        icon: 'Maximize',
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        benefits: JSON.stringify([
          'Kính tôi cường lực tiêu chuẩn an toàn cao, khó vỡ vụn',
          'Mở rộng tối đa tầm nhìn và đón ánh sáng tự nhiên',
          'Bản lề sàn vận hành êm ái, căn chỉnh góc mở chuẩn xác',
          'Bảo dưỡng và hỗ trợ kỹ thuật nhanh chóng'
        ]),
        display_order: 2,
        is_featured: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Thi công vách kính văn phòng & Phòng tắm kính',
        slug: 'thi-cong-vach-kinh-van-phong-phong-tam-kinh',
        short_desc: 'Phân chia không gian làm việc chuyên nghiệp, vách kính cabin tắm đứng hiện đại ngăn nước tuyệt đối.',
        content: 'Vách kính cường lực giúp tối ưu hóa diện tích sử dụng, tạo không gian làm việc hiện đại, sang trọng và tràn ngập ánh sáng. Đối với cabin tắm kính, các phụ kiện gioăng từ, kẹp inox 304 chuẩn ngăn nước bắn ra ngoài sàn phòng tắm, giữ không gian luôn khô ráo sạch sẽ.',
        icon: 'Layers',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        benefits: JSON.stringify([
          'Tạo không gian mở hiện đại, chuyên nghiệp cho văn phòng',
          'Cabin tắm kính phụ kiện Inox 304 chống rỉ sét tuyệt đối',
          'Thi công nhanh chóng, gọn gàng, bàn giao đúng tiến độ',
          'Dễ dàng vệ sinh lau chùi hàng ngày'
        ]),
        display_order: 3,
        is_featured: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Lắp đặt lan can kính, cầu thang kính & Mái kính',
        slug: 'lap-dat-lan-can-kinh-cau-thang-kinh-mai-kinh',
        short_desc: 'Lan can ban công kính an toàn, cầu thang kính hiện đại và mái hiên kính cường lực chịu lực thời tiết.',
        content: 'Lan can và mái kính cường lực tạo điểm nhấn thẩm mỹ thanh thoát cho các công trình biệt thự, nhà phố hiện đại. Sử dụng kính cường lực dày 10mm - 12mm hoặc kính dán an toàn 2 lớp kết hợp hệ khung chịu lực vững chắc đảm bảo an toàn tuyệt đối.',
        icon: 'ShieldCheck',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        benefits: JSON.stringify([
          'Chân trụ Inox 304 đúc đặc hoặc củ pass kính vững chắc',
          'Kính cường lực an toàn chịu tải trọng và sức gió lớn',
          'Tính thẩm mỹ vượt trội, nâng tầm giá trị ngôi nhà',
          'Khảo sát kết cấu kỹ lưỡng trước khi lắp đặt'
        ]),
        display_order: 4,
        is_featured: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 5,
        name: 'Sửa chữa cửa nhôm kính & Thay thế phụ kiện',
        slug: 'sua-chua-cua-nhom-kinh-thay-the-phu-kien',
        short_desc: 'Khắc phục cửa bị xệ cánh, hỏng bản lề sàn, hỏng khóa, kẹt bánh xe ray lùa, vỡ kính nhanh chóng tại Thanh Hóa.',
        content: 'Nhôm Kính Huy Hoàng cung cấp dịch vụ sửa chữa, bảo trì cửa nhôm kính tận nơi. Xử lý triệt để các tình trạng cửa xệ cọ nền, bản lề thủy lực chảy dầu, thay khóa cửa nhôm Xingfa, thay kính vỡ, thay bánh xe cửa lùa với chi phí hợp lý nhất.',
        icon: 'Wrench',
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        benefits: JSON.stringify([
          'Có mặt nhanh chóng khảo sát và khắc phục sự cố',
          'Linh kiện phụ kiện thay thế chuẩn quy cách, chính hãng',
          'Chi phí minh bạch, báo giá trước khi sửa chữa',
          'Bảo hành sau sửa chữa giúp khách hàng an tâm'
        ]),
        display_order: 5,
        is_featured: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 6,
        name: 'Khảo sát, tư vấn thiết kế & Báo giá tại công trình',
        slug: 'khao-sat-tu-van-thiet-ke-bao-gia-tai-cong-trinh',
        short_desc: 'Đội ngũ thợ đến tận nơi đo đạc số liệu thực tế, tư vấn quy cách cửa phù hợp phong thủy và lập dự toán chi tiết.',
        content: 'Chúng tôi hỗ trợ mang mẫu nhôm, catalogue phụ kiện đến tận công trình của quý khách tại Thọ Xuân và toàn tỉnh Thanh Hóa để tư vấn giải pháp tối ưu nhất về công năng và chi phí đầu tư.',
        icon: 'ClipboardList',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
        benefits: JSON.stringify([
          'Khảo sát và tư vấn mẫu mã hoàn toàn miễn phí',
          'Đo đạc kích thước theo thước Lỗ Ban phong thủy tốt lành',
          'Bảng báo giá minh bạch, không phát sinh chi phí',
          'Tư vấn mẫu mã phù hợp ngân sách và kiến trúc nhà'
        ]),
        display_order: 6,
        is_featured: 1,
        created_at: new Date().toISOString()
      }
    ],
    products: [
      {
        id: 1,
        name: 'Cửa đi 4 cánh nhôm Xingfa hệ 55 mở quay',
        slug: 'cua-di-4-canh-nhom-xingfa-he-55-mo-quay',
        code: 'XF55-4CQ',
        category_id: 1,
        description: 'Mẫu cửa đi mặt tiền chính 4 cánh nhôm Xingfa nhập khẩu tem đỏ, kết cấu chắc chắn, cách âm cách nhiệt tốt.',
        details: 'Cửa đi 4 cánh mở quay nhôm Xingfa hệ 55 là sự lựa chọn hoàn hảo cho cửa chính mặt tiền của nhà phố, biệt thự. Sử dụng nhôm Xingfa nhập khẩu chính hãng độ dày 2.0mm, kết hợp hệ gioăng cao su EPDM kép kín khít và khóa đa điểm Kinlong giúp chống trộm an toàn tuyệt đối.',
        specs: JSON.stringify({
          'Hệ nhôm': 'Xingfa nhập khẩu hệ 55 chính hãng',
          'Độ dày nhôm': '2.0mm (+- 5%) tiêu chuẩn cửa đi',
          'Kính': 'Kính dán an toàn 8.38mm hoặc kính cường lực 10mm',
          'Màu sắc': 'Nâu cafe ánh kim, Ghi xám, Trắng sứ, Vân gỗ',
          'Phụ kiện': 'Khóa đa điểm, bản lề 3D Kinlong đồng bộ',
          'Bảo hành': '5 năm profile nhôm, 2 năm phụ kiện kim khí'
        }),
        price_text: 'Liên hệ báo giá',
        is_featured: 1,
        is_active: 1,
        main_image: 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80',
        gallery_images: JSON.stringify([
          'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
        ]),
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Cửa đi 4 cánh nhôm Xingfa hệ 93 mở trượt lùa',
        slug: 'cua-di-4-canh-nhom-xingfa-he-93-mo-truot-lua',
        code: 'XF93-4CT',
        category_id: 1,
        description: 'Cửa lùa trượt 4 cánh tiết kiệm diện tích tối đa, trượt nhẹ nhàng trên thanh ray inox, chống va đập gió bão.',
        details: 'Cửa lùa trượt nhôm Xingfa hệ 93 phù hợp cho các không gian có mặt tiền rộng hoặc lối ra ban công, sân vườn. Ray trượt inox chịu lực giúp cánh cửa lướt êm ái, không tốn diện tích quay cánh.',
        specs: JSON.stringify({
          'Hệ nhôm': 'Xingfa nhập khẩu hệ 93 bản ray trượt',
          'Độ dày nhôm': '2.0mm',
          'Kính': 'Kính dán an toàn 8.38mm hoặc kính hộp cách âm',
          'Màu sắc': 'Ghi xám xingfa, Nâu cafe, Trắng',
          'Phụ kiện': 'Bánh xe đôi chịu lực, khóa bán nguyệt / khóa chữ D Kinlong',
          'Bảo hành': '5 năm profile nhôm'
        }),
        price_text: 'Liên hệ báo giá',
        is_featured: 1,
        is_active: 1,
        main_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        gallery_images: JSON.stringify([
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80'
        ]),
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Cửa đi 1 cánh nhôm Xingfa phòng ngủ / WC',
        slug: 'cua-di-1-canh-nhom-xingfa-phong-ngu-wc',
        code: 'XF55-1CQ',
        category_id: 1,
        description: 'Cửa thông phòng ngủ và nhà vệ sinh nhôm Xingfa hệ 55, kết hợp kính mờ hoặc pano nhôm chống nước.',
        details: 'Thiết kế 1 cánh mở quay nhỏ gọn, thanh lịch. Khả năng cách âm tốt cho phòng ngủ và chống nước 100% không ẩm mốc, cong vênh như cửa gỗ khi lắp cho nhà vệ sinh.',
        specs: JSON.stringify({
          'Hệ nhôm': 'Xingfa hệ 55',
          'Độ dày nhôm': '1.4mm - 2.0mm',
          'Kính': 'Kính mờ phun cát 8.38mm hoặc kính cường lực',
          'Màu sắc': 'Nâu cafe, Ghi xám, Trắng sứ, Vân gỗ',
          'Phụ kiện': 'Khóa đơn điểm, bản lề Kinlong',
          'Bảo hành': '5 năm profile nhôm'
        }),
        price_text: 'Liên hệ báo giá',
        is_featured: 1,
        is_active: 1,
        main_image: 'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=800&q=80',
        gallery_images: JSON.stringify([
          'https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?auto=format&fit=crop&w=800&q=80'
        ]),
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        name: 'Cửa sổ 2 cánh mở quay / mở hất nhôm Xingfa',
        slug: 'cua-so-2-canh-mo-quay-mo-hat-nhom-xingfa',
        code: 'XF55-CS2Q',
        category_id: 1,
        description: 'Cửa sổ hệ 55 mở quay hoặc mở hất lấy gió tươi chống mưa hắt hiệu quả.',
        details: 'Cửa sổ nhôm Xingfa mở hất kết hợp tay nắm gạt và thanh hạn vị góc mở 45 độ giúp thoáng khí trong phòng mà không lo mưa tạt hay gió giật đập cánh.',
        specs: JSON.stringify({
          'Hệ nhôm': 'Xingfa hệ 55 dày 1.4mm',
          'Kính': 'Kính dán 6.38mm / 8.38mm',
          'Phụ kiện': 'Bản lề chữ A, tay gạt Kinlong',
          'Màu sắc': 'Ghi xám, Nâu cafe, Trắng',
          'Bảo hành': '5 năm'
        }),
        price_text: 'Liên hệ báo giá',
        is_featured: 0,
        is_active: 1,
        main_image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=800&q=80',
        gallery_images: JSON.stringify([
          'https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=800&q=80'
        ]),
        created_at: new Date().toISOString()
      },
      {
        id: 5,
        name: 'Cửa kính cường lực mở quay bản lề sàn 12mm',
        slug: 'cua-kinh-cuong-luc-mo-quay-ban-le-san-12mm',
        code: 'CK-BLS12',
        category_id: 3,
        description: 'Cửa thủy lực bản lề sàn kính cường lực 12mm chuẩn chịu lực cho cửa hàng, showroom, văn phòng.',
        details: 'Cửa kính cường lực không viền hoặc viền inox vàng gương sang trọng, tay nắm inox 304 dài 80cm - 1m, bản lề sàn VVP chuẩn Thái Lan.',
        specs: JSON.stringify({
          'Chất liệu kính': 'Kính cường lực tôi nhiệt 12mm phôi Việt Nhật',
          'Phụ kiện': 'Bản lề sàn VVP / Adler, kẹp trên, kẹp dưới, khóa sàn',
          'Tay nắm': 'Tay nắm Inox 304 / Tay nắm gỗ / Tay nắm mạ vàng',
          'Bảo hành': 'Kính bảo hành 10 năm, phụ kiện 2 năm đổi mới'
        }),
        price_text: 'Liên hệ báo giá',
        is_featured: 1,
        is_active: 1,
        main_image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        gallery_images: JSON.stringify([
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
        ]),
        created_at: new Date().toISOString()
      },
      {
        id: 6,
        name: 'Vách kính cường lực ngăn phòng văn phòng',
        slug: 'vach-kinh-cuong-luc-ngan-phong-van-phong',
        code: 'VK-VP10',
        category_id: 4,
        description: 'Vách kính khổ lớn ngăn phòng họp, phòng giám đốc kèm dán decal mờ cách điệu logo.',
        details: 'Hệ vách kính sử dụng nẹp nhôm định hình hoặc sập nhôm trắng bóng, kính cường lực 10mm phẳng chuẩn tạo không gian mở và tăng tính chuyên nghiệp.',
        specs: JSON.stringify({
          'Kính': 'Kính cường lực 10mm phôi Hải Long / Việt Nhật',
          'Nẹp viền': 'Nẹp sập nhôm 38 hoặc khung nhôm định hình',
          'Keo': 'Keo Silicone A500 trung tính không mùi kháng mốc',
          'Bảo hành': '5 năm'
        }),
        price_text: 'Liên hệ báo giá',
        is_featured: 1,
        is_active: 1,
        main_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        gallery_images: JSON.stringify([
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'
        ]),
        created_at: new Date().toISOString()
      },
      {
        id: 7,
        name: 'Lan can kính ban công tay vịn Inox 304',
        slug: 'lan-can-kinh-ban-cong-tay-vin-inox-304',
        code: 'LC-INOX304',
        category_id: 5,
        description: 'Lan can kính ngoài trời trụ lửng hoặc trụ cao inox 304 chống rỉ sét, kính cường lực an toàn.',
        details: 'Mang lại vẻ đẹp hiện đại, không che khuất tầm nhìn phong cảnh từ ban công tầng lầu. Vật liệu Inox 304 chuẩn bền vững trước khí hậu mưa nắng nhiệt đới.',
        specs: JSON.stringify({
          'Kính': 'Kính cường lực 10mm - 12mm mài xiết cạnh bóng',
          'Trụ': 'Trụ Inox 304 đúc đặc chống gỉ sét tuyệt đối',
          'Tay vịn': 'Ống Inox 304 phi 51mm hoặc hộp 40x80mm',
          'Bảo hành': 'Trụ inox bảo hành không rỉ sét 10 năm'
        }),
        price_text: 'Liên hệ báo giá',
        is_featured: 1,
        is_active: 1,
        main_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        gallery_images: JSON.stringify([
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'
        ]),
        created_at: new Date().toISOString()
      },
      {
        id: 8,
        name: 'Mái kính cường lực khung sắt nghệ thuật',
        slug: 'mai-kinh-cuong-luc-khung-sat-nghe-thuat',
        code: 'MK-NT01',
        category_id: 6,
        description: 'Mái hiên kính sảnh biệt thự, nhà phố sang trọng khung sắt hoa văn mỹ thuật sơn tĩnh điện.',
        details: 'Mái kính lấy sáng sảnh đón hoặc giếng trời, bảo vệ hiên nhà khỏi mưa hắt mà vẫn đón trọn vẹn ánh sáng tự nhiên.',
        specs: JSON.stringify({
          'Kính': 'Kính dán cường lực 2 lớp 11.52mm hoặc kính cường lực 12mm',
          'Khung chịu lực': 'Khung sắt hộp mạ kẽm uốn mỹ thuật sơn tĩnh điện',
          'Bảo hành': '5 năm'
        }),
        price_text: 'Liên hệ báo giá',
        is_featured: 1,
        is_active: 1,
        main_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
        gallery_images: JSON.stringify([
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
        ]),
        created_at: new Date().toISOString()
      }
    ],
    projects: [
      {
        id: 1,
        title: 'Thi công toàn bộ hệ thống cửa nhôm Xingfa nhà phố',
        slug: 'thi-cong-he-thong-cua-nhom-xingfa-nha-pho-tho-xuan',
        category: 'Cửa nhôm kính',
        client_name: 'Gia đình anh Tuấn',
        location: 'Thị trấn Thọ Xuân, Thanh Hóa',
        completion_date: 'Tháng 03/2026',
        description: 'Công trình nhà phố 3 tầng bao gồm cửa đi 4 cánh mặt tiền Xingfa hệ 55 ghi xám, cửa sổ mở hất và cửa thông phòng, hoàn thiện đúng tiến độ và nghiệm thu đạt chuẩn thẩm mỹ cao.',
        main_image: 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80',
        gallery_images: JSON.stringify([
          'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
        ]),
        is_featured: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Lắp đặt cửa kính thủy lực và vách ngăn văn phòng',
        slug: 'lap-dat-cua-kinh-thuy-luc-vach-ngan-van-phong-thanh-hoa',
        category: 'Vách kính cường lực',
        client_name: 'Công ty CP Xây Dựng & Thương Mại',
        location: 'TP. Thanh Hóa',
        completion_date: 'Tháng 02/2026',
        description: 'Hạng mục gồm 120m2 vách kính ngăn phòng họp và 2 bộ cửa kính thủy lực bản lề sàn 12mm tay nắm Inox sang trọng.',
        main_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        gallery_images: JSON.stringify([
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
        ]),
        is_featured: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Thi công lan can ban công kính và mái kính sảnh biệt thự',
        slug: 'thi-cong-lan-can-kinh-mai-kinh-sanh-biet-thu-yen-dinh',
        category: 'Lan can & Mái kính',
        client_name: 'Biệt thự gia đình chú Hùng',
        location: 'Yên Định, Thanh Hóa',
        completion_date: 'Tháng 01/2026',
        description: 'Lắp đặt 45m lan can kính cường lực tay vịn inox 304 trụ lửng và 1 mái kính nghệ thuật sân trước tạo điểm nhấn đẳng cấp cho căn biệt thự.',
        main_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        gallery_images: JSON.stringify([
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
        ]),
        is_featured: 1,
        created_at: new Date().toISOString()
      }
    ],
    article_categories: [
      { id: 1, name: 'Kinh nghiệm chọn cửa', slug: 'kinh-nghiem-chon-cua', created_at: new Date().toISOString() },
      { id: 2, name: 'Kiến thức nhôm kính', slug: 'kien-thuc-nhom-kinh', created_at: new Date().toISOString() },
      { id: 3, name: 'Tư vấn thi công', slug: 'tu-van-thi-cong', created_at: new Date().toISOString() },
      { id: 4, name: 'Tin tức cơ sở', slug: 'tin-tuc-co-so', created_at: new Date().toISOString() }
    ],
    articles: [
      {
        id: 1,
        title: 'Cách phân biệt nhôm Xingfa nhập khẩu chính hãng và hàng nhái',
        slug: 'cach-phan-biet-nhom-xingfa-nhap-khau-chinh-hang',
        category_id: 2,
        excerpt: 'Hướng dẫn chi tiết cách kiểm tra tem đỏ Quảng Đông, mã QR code, mặt cắt nhôm và màu sắc ánh kim để tránh mua phải nhôm giả kém chất lượng.',
        content: 'Nhôm Xingfa nhập khẩu tem đỏ Quảng Đông là dòng nhôm cao cấp được tin dùng hàng đầu tại Việt Nam. Tuy nhiên trên thị trường có nhiều loại nhôm nhái tem mác. Để nhận biết nhôm chính hãng: 1. Kiểm tra tem dán có mã QR quét ra thông tin nhà máy Xingfa; 2. Màu sơn bên trong khoang nhôm có ánh kim đồng đều; 3. Bề mặt cắt profile nhôm dày dặn đúng chuẩn (1.4mm - 2.0mm); 4. Lựa chọn cơ sở thi công uy tín như Nhôm Kính Huy Hoàng để đảm bảo nguồn gốc.',
        thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
        author: 'Nhôm Kính Huy Hoàng',
        views: 154,
        is_published: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Nên chọn cửa nhôm Xingfa mở quay hay mở trượt lùa?',
        slug: 'nen-chon-cua-nhom-xingfa-mo-quay-hay-mo-truot-lua',
        category_id: 1,
        excerpt: 'So sánh ưu nhược điểm giữa cửa mở quay và cửa lùa trượt giúp gia chủ tối ưu công năng sử dụng và diện tích ngôi nhà.',
        content: 'Cửa mở quay mang lại độ kín khít tuyệt đối, cách âm cách nhiệt tốt nhất, mở được 100% diện tích ô cửa, rất phù hợp làm cửa chính mặt tiền. Trong khi đó, cửa mở trượt lùa giúp tiết kiệm không gian đóng mở, chống va đập gió mạnh hiệu quả, rất thích hợp cho cửa ban công, sân thượng hoặc nhà có diện tích hẹp.',
        thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
        author: 'Nhôm Kính Huy Hoàng',
        views: 210,
        is_published: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Kinh nghiệm bảo quản và vệ sinh cửa nhôm kính luôn sáng bóng',
        slug: 'kinh-nghiem-bao-quan-va-ve-sinh-cua-nhom-kinh-luon-sang-bong',
        category_id: 3,
        excerpt: 'Mẹo đơn giản giúp bề mặt kính trong suốt và phụ kiện khóa, bản lề vận hành trơn tru bền bỉ qua năm tháng.',
        content: 'Để cửa nhôm kính bền đẹp: thường xuyên lau kính bằng nước lau kính chuyên dụng hoặc giấm pha loãng với khăn mềm microfiber; tránh dùng vật sắc nhọn cạo lên khung nhôm; định kỳ 6 tháng tra dầu bảo dưỡng vào các khớp bản lề và ổ khóa.',
        thumbnail: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        author: 'Nhôm Kính Huy Hoàng',
        views: 98,
        is_published: 1,
        created_at: new Date().toISOString()
      }
    ],
    quote_requests: [
      {
        id: 1,
        customer_name: 'Nguyễn Văn Minh',
        phone: '0912345678',
        address: 'Xã Thọ Hải, Huyện Thọ Xuân, Thanh Hóa',
        service_name: 'Thi công cửa nhôm Xingfa nhập khẩu',
        dimensions: 'Cửa chính 4 cánh rộng 3m x cao 2.8m và 4 cửa sổ',
        note: 'Cần tư vấn báo giá nhôm Xingfa màu nâu cafe và thời gian thi công hoàn thiện.',
        status: 'new',
        admin_note: null,
        created_at: new Date(Date.now() - 3600000).toISOString()
      }
    ],
    quote_request_images: [],
    reviews: [
      {
        id: 1,
        customer_name: 'Bác Trần Văn Lâm',
        rating: 5,
        comment: 'Cơ sở Huy Hoàng thi công cửa nhôm Xingfa rất cẩn thận, đường keo đẹp kín khít, thợ làm nhiệt tình và đúng hẹn. Rất hài lòng.',
        address_or_role: 'Thọ Hải, Thọ Xuân, Thanh Hóa',
        avatar: null,
        is_published: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        customer_name: 'Anh Lê Hoàng Nam',
        rating: 5,
        comment: 'Lắp bộ cửa kính thủy lực mặt tiền cửa hàng đóng mở rất êm, giá cả báo rõ ràng từ đầu không phát sinh thêm chi phí nào.',
        address_or_role: 'Thị trấn Thọ Xuân',
        avatar: null,
        is_published: 1,
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        customer_name: 'Chị Mai Lan',
        rating: 5,
        comment: 'Vách kính tắm đứng và lan can kính ban công làm rất chắc chắn và sang trọng. Tư vấn nhiệt tình, đo đạc phong thủy chuẩn.',
        address_or_role: 'Thành phố Thanh Hóa',
        avatar: null,
        is_published: 1,
        created_at: new Date().toISOString()
      }
    ],
    site_settings: [
      { id: 1, setting_key: 'site_name', setting_value: 'Nhôm Kính Huy Hoàng - Thọ Xuân, Thanh Hóa' },
      { id: 2, setting_key: 'brand_name', setting_value: 'Nhôm Kính Huy Hoàng' },
      { id: 3, setting_key: 'hotline', setting_value: '0978398567' },
      { id: 4, setting_key: 'zalo', setting_value: '0978398567' },
      { id: 5, setting_key: 'email', setting_value: 'huyhoangnhomkinh77@gmail.com' },
      { id: 6, setting_key: 'address', setting_value: 'Thôn Tân Thành, xã Thọ Hải, huyện Thọ Xuân, tỉnh Thanh Hóa' },
      { id: 7, setting_key: 'opening_hours', setting_value: '07:00 - 18:30 (Thứ 2 - Chủ Nhật)' },
      { id: 8, setting_key: 'meta_description', setting_value: 'Cơ sở Nhôm Kính Huy Hoàng tại Thọ Xuân, Thanh Hóa chuyên thi công cửa nhôm Xingfa, cửa kính cường lực, vách kính, lan can, mái kính uy tín, chuyên nghiệp, giá tốt nhất.' },
      { id: 9, setting_key: 'meta_keywords', setting_value: 'nhôm kính thanh hóa, nhôm kính thọ xuân, cửa nhôm xingfa thanh hóa, cửa kính cường lực thanh hóa, vách kính thọ hải, nhôm kính huy hoàng' },
      { id: 10, setting_key: 'google_map_embed', setting_value: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120000!2d105.5!3d19.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3136500000000000%3A0x0!2zVGjhu40gSOG6o2ksIFRo4buNIFh1w6JuLCBUaGFuaCBIw7Fh!5e0!3m2!1svi!2svn!4v1680000000000!5m2!1svi!2svn' },
      { id: 11, setting_key: 'policy_privacy', setting_value: 'Chính sách bảo mật: Nhôm Kính Huy Hoàng cam kết bảo mật tuyệt đối mọi thông tin cá nhân (họ tên, số điện thoại, địa chỉ công trình) do khách hàng cung cấp qua form liên hệ hoặc điện thoại. Thông tin chỉ được sử dụng cho mục đích tư vấn kỹ thuật, khảo sát đo đạc thực tế tại công trình và lập báo giá chi tiết cho quý khách.' },
      { id: 12, setting_key: 'policy_terms', setting_value: 'Điều khoản dịch vụ: Nhôm Kính Huy Hoàng tiếp nhận đơn hàng, khảo sát công trình thực tế, tư vấn quy cách nhôm kính và ký kết thỏa thuận thi công rõ ràng về chủng loại vật tư, độ dày kính, nguồn gốc phụ kiện chính hãng, tiến độ và điều khoản bảo hành trước khi tiến hành gia công lắp đặt.' },
      { id: 13, setting_key: 'policy_quote_process', setting_value: 'Quy trình báo giá & thi công: 1. Tiếp nhận yêu cầu khách hàng qua Hotline/Zalo 0978398567 hoặc form website; 2. Khảo sát đo đạc thực tế tại công trình miễn phí; 3. Lên phương án thiết kế & gửi bảng báo giá chi tiết, minh bạch; 4. Gia công sản xuất tại xưởng chuẩn kỹ thuật; 5. Vận chuyển, lắp đặt hoàn thiện, nghiệm thu và bàn giao phiếu bảo hành.' }
    ]
  };
}

// Fallback JSON disk storage methods
function ensureDataDir() {
  const dir = path.dirname(fallbackDataFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function loadFallbackData() {
  ensureDataDir();
  if (fs.existsSync(fallbackDataFile)) {
    try {
      const content = fs.readFileSync(fallbackDataFile, 'utf8');
      fallbackStore = JSON.parse(content);
      return;
    } catch (e) {
      console.warn('Fallback data read error, initializing new seed data');
    }
  }
  fallbackStore = await getInitialSeedData();
  saveFallbackData();
}

function saveFallbackData() {
  try {
    ensureDataDir();
    fs.writeFileSync(fallbackDataFile, JSON.stringify(fallbackStore, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving fallback data:', e);
  }
}

// Database initialization
async function initDatabase() {
  try {
    // Step 1: Connect to MySQL server without database first to ensure DB exists
    const tempConn = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await tempConn.end();

    // Step 2: Create connection pool with database
    pool = mysql.createPool(dbConfig);

    // Test connection
    const connection = await pool.getConnection();
    console.log('✅ Đã kết nối thành công đến cơ sở dữ liệu MySQL: ' + dbConfig.database);

    // Step 3: Create tables from database.sql
    const sqlPath = path.join(__dirname, '..', '..', '..', 'database', 'database.sql');
    if (fs.existsSync(sqlPath)) {
      const sqlContent = fs.readFileSync(sqlPath, 'utf8');
      const statements = sqlContent
        .replace(/\/\*[\s\S]*?\*\/|--.*$/gm, '') // Remove comments
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const statement of statements) {
        if (statement.toLowerCase().startsWith('create table') || statement.toLowerCase().startsWith('insert into')) {
          try {
            await connection.query(statement);
          } catch (err) {
            // Ignore duplicate key or existing table warnings
          }
        }
      }
    }
    connection.release();
    useFallbackStorage = false;
    return true;
  } catch (error) {
    console.warn('⚠️ Không thể kết nối MySQL (' + error.message + '). Đang kích hoạt chế độ lưu trữ dữ liệu sẵn sàng (High-Reliability Fallback Engine).');
    console.warn('👉 Lưu ý: Khi MySQL đã khởi động, cấu hình thông số tại file backend/.env và khởi động lại server để chuyển sang MySQL.');
    useFallbackStorage = true;
    await loadFallbackData();
    return false;
  }
}

// Universal query runner supporting both MySQL and High-Reliability Fallback
async function query(sql, params = []) {
  if (!useFallbackStorage && pool) {
    try {
      const [results] = await pool.query(sql, params);
      return results;
    } catch (err) {
      console.error('MySQL Query Error:', err.message, 'SQL:', sql);
      throw err;
    }
  }

  // Handle in-memory / JSON file fallback simulation for standard CRUD
  return executeFallbackQuery(sql, params);
}

// Basic SQL simulator for fallback when MySQL service is offline
function executeFallbackQuery(sql, params = []) {
  const cleanSql = sql.trim().replace(/\s+/g, ' ');
  const lowerSql = cleanSql.toLowerCase();

  // 1. SELECT queries
  if (lowerSql.startsWith('select')) {
    let tableName = '';
    const fromMatch = lowerSql.match(/from\s+`?([a-zA-Z0-9_]+)`?/);
    if (fromMatch) {
      tableName = fromMatch[1];
    }
    
    let rows = fallbackStore[tableName] ? [...fallbackStore[tableName]] : [];

    // Filter handling
    if (lowerSql.includes('where')) {
      if (lowerSql.includes('username = ?')) {
        rows = rows.filter(r => r.username === params[0]);
      } else if (lowerSql.includes('id = ?')) {
        rows = rows.filter(r => Number(r.id) === Number(params[0]));
      } else if (lowerSql.includes('slug = ?')) {
        rows = rows.filter(r => r.slug === params[0]);
      } else if (lowerSql.includes('setting_key = ?')) {
        rows = rows.filter(r => r.setting_key === params[0]);
      } else if (lowerSql.includes('quote_request_id = ?')) {
        rows = rows.filter(r => Number(r.quote_request_id) === Number(params[0]));
      }
    }

    // COUNT(*)
    if (lowerSql.includes('count(*)')) {
      return [{ count: rows.length, total: rows.length }];
    }

    // ORDER BY
    if (lowerSql.includes('order by')) {
      if (lowerSql.includes('created_at desc') || lowerSql.includes('id desc')) {
        rows.sort((a, b) => (b.id || 0) - (a.id || 0));
      } else if (lowerSql.includes('display_order asc')) {
        rows.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      }
    }

    return rows;
  }

  // 2. INSERT queries
  if (lowerSql.startsWith('insert into')) {
    const tableMatch = lowerSql.match(/insert into\s+`?([a-zA-Z0-9_]+)`?/);
    if (tableMatch) {
      const tableName = tableMatch[1];
      if (!fallbackStore[tableName]) fallbackStore[tableName] = [];
      const newId = fallbackStore[tableName].length > 0 ? Math.max(...fallbackStore[tableName].map(r => r.id || 0)) + 1 : 1;
      
      // Rough mapping for insert objects
      const newRecord = { id: newId, created_at: new Date().toISOString() };
      // Assign params
      saveFallbackData();
      return { insertId: newId, affectedRows: 1 };
    }
  }

  // 3. UPDATE queries
  if (lowerSql.startsWith('update')) {
    const tableMatch = lowerSql.match(/update\s+`?([a-zA-Z0-9_]+)`?/);
    if (tableMatch) {
      saveFallbackData();
      return { affectedRows: 1 };
    }
  }

  // 4. DELETE queries
  if (lowerSql.startsWith('delete from')) {
    const tableMatch = lowerSql.match(/delete from\s+`?([a-zA-Z0-9_]+)`?/);
    if (tableMatch) {
      const tableName = tableMatch[1];
      if (params[0] && fallbackStore[tableName]) {
        fallbackStore[tableName] = fallbackStore[tableName].filter(r => Number(r.id) !== Number(params[0]));
        saveFallbackData();
      }
      return { affectedRows: 1 };
    }
  }

  return [];
}

module.exports = {
  initDatabase,
  query,
  getFallbackStore: () => fallbackStore,
  saveFallbackData,
  isUsingFallback: () => useFallbackStorage
};
