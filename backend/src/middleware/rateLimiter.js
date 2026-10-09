const rateLimit = require('express-rate-limit');

// 1. Chống Brute Force Đăng nhập Admin: Linh hoạt
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Tài khoản hoặc IP của bạn đã thử đăng nhập quá nhiều lần. Vui lòng thử lại sau ít phút.'
  }
});

// 2. Chống Spam Form Yêu cầu Báo giá
const quoteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Bạn đã gửi nhiều yêu cầu trong thời gian ngắn. Vui lòng liên hệ trực tiếp Hotline / Zalo 0978398567.'
  }
});

// 3. Chống Spam Tìm kiếm
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu tìm kiếm. Vui lòng thử lại sau 1 phút.'
  }
});

// 4. Giới hạn chung toàn bộ API
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 200,
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
