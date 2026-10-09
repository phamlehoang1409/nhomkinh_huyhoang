const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authMiddleware } = require('../middleware/auth');

// Single image upload (Admin protected)
router.post('/single', authMiddleware, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn file hình ảnh.' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({
      success: true,
      message: 'Tải ảnh lên thành công.',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi tải ảnh lên.' });
  }
});

// Multiple image upload (Admin protected)
router.post('/multiple', authMiddleware, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn ít nhất 1 file hình ảnh.' });
    }
    const urls = req.files.map(f => `/uploads/${f.filename}`);
    return res.json({
      success: true,
      message: `Đã tải lên ${req.files.length} hình ảnh thành công.`,
      data: urls
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi tải nhiều ảnh.' });
  }
});

module.exports = router;
