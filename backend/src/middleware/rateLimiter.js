const rateLimit = require('express-rate-limit');

// 1. Chống Brute Force Đăng nhập Admin: Tối đa 5 lần thử trong 15 phút
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Tài khoản hoặc IP của bạn đã thử đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút để đảm bảo an toàn.'
  }
});

// 2. Chống Spam Form Yêu cầu Báo giá: Tối đa 5 yêu cầu trong 30 phút cho mỗi IP
const quoteLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Bạn đã gửi nhiều yêu cầu trong thời gian ngắn. Vui lòng liên hệ trực tiếp Hotline / Zalo 0978398567.'
  }
});

// 3. Chống Spam Tìm kiếm: Tối đa 30 lượt tìm kiếm trong 1 phút
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu tìm kiếm. Vui lòng thử lại sau 1 phút.'
  }
});

// 4. Giới hạn chung toàn bộ API chống DDOS & cào dữ liệu bừa bãi: Max 120 req/phút
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Hệ thống phát hiện lưu lượng truy cập bất thường từ thiết bị của bạn. Vui lòng thử lại sau.'
  }
});

module.exports = {
  authLimiter,
  quoteLimiter,
  searchLimiter,
  apiLimiter
};
