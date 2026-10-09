/**
 * Middleware bảo mật: Làm sạch dữ liệu đầu vào (Input Sanitization),
 * Chống SQL Injection, XSS và Bot Honeypot
 */

function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  // Loại bỏ các thẻ script, iframe, javascript: URLs và ký tự điều khiển nguy hiểm
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/onload=/gi, '')
    .replace(/onerror=/gi, '')
    .trim();
}

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      obj[key] = sanitizeString(obj[key]);
    } else if (typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    }
  }
  return obj;
}

// Global Sanitizer Middleware
function requestSanitizer(req, res, next) {
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);
  next();
}

// Bot Honeypot Protection: Bẫy bot tự động gửi form
function honeypotCheck(req, res, next) {
  // Nếu bot tự động điền vào trường ẩn này -> Chặn ngay lập tức
  if (req.body && req.body._hp && req.body._hp.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Spam bot detected.'
    });
  }
  next();
}

module.exports = {
  requestSanitizer,
  honeypotCheck,
  sanitizeString
};
