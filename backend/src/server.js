const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { initDatabase } = require('./config/db');
const { apiLimiter } = require('./middleware/rateLimiter');
const { requestSanitizer } = require('./middleware/security');

// Import routes
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const projectRoutes = require('./routes/projectRoutes');
const articleRoutes = require('./routes/articleRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const settingRoutes = require('./routes/settingRoutes');
const searchRoutes = require('./routes/searchRoutes');
const statsRoutes = require('./routes/statsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Tăng cường bảo mật Header HTTP với Helmet & ẩn X-Powered-By
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.disable('x-powered-by');

// 2. Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 3. CORS Policy
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 4. Giới hạn dung lượng Payload tối đa 5MB chống tấn công tràn bộ nhớ (Payload Overflow)
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// 5. Làm sạch dữ liệu đầu vào toàn bộ request (Chống SQL Injection / XSS)
app.use(requestSanitizer);

// 6. Giới hạn tần suất gọi API chung (Chống cào dữ liệu & DDOS)
app.use('/api/', apiLimiter);

// 7. Serve static uploaded files
app.use('/uploads', express.static(uploadDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Nhôm Kính Huy Hoàng Secure API Server',
    version: '1.0.0'
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/quote-requests', quoteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);

// Sitemap generator helper
app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}/</loc><priority>1.0</priority><changefreq>daily</changefreq></url>
  <url><loc>${baseUrl}/gioi-thieu</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/dich-vu</loc><priority>0.9</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/san-pham</loc><priority>0.9</priority><changefreq>daily</changefreq></url>
  <url><loc>${baseUrl}/cong-trinh</loc><priority>0.8</priority><changefreq>weekly</changefreq></url>
  <url><loc>${baseUrl}/tin-tuc</loc><priority>0.8</priority><changefreq>daily</changefreq></url>
  <url><loc>${baseUrl}/lien-he</loc><priority>0.9</priority><changefreq>monthly</changefreq></url>
</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (e) {
    res.status(500).end();
  }
});

// Robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${(process.env.CLIENT_URL || 'http://localhost:5173')}/sitemap.xml`);
});

// 404 Handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Đường dẫn API ${req.originalUrl} không tồn tại.`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Đã có lỗi máy chủ nội bộ xảy ra.'
  });
});

// Start Server
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`🛡️ Máy chủ Bảo Mật Backend Nhôm Kính Huy Hoàng đang chạy tại cổng ${PORT}`);
    console.log(`📡 URL API: http://localhost:${PORT}/api`);
  });
}

startServer();

module.exports = app;
