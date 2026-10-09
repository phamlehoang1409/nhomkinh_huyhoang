const rateLimit = require('express-rate-limit');

// Limiter for quote request submissions: Max 10 requests per 15 minutes per IP
const quoteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn. Vui lòng thử lại sau 15 phút hoặc gọi trực tiếp Hotline 0978398567.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// General API limiter: Max 300 requests per minute
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 300,
  message: {
    success: false,
    message: 'Quá nhiều yêu cầu đến máy chủ. Vui lòng thử lại sau.'
  }
});

module.exports = {
  quoteLimiter,
  apiLimiter
};
