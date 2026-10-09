const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, isUsingFallback, getFallbackStore, saveFallbackData } = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');

// Đăng nhập Admin
async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.'
      });
    }

    let admin = null;

    if (isUsingFallback()) {
      const store = getFallbackStore();
      admin = store.admins.find(a => a.username === username);
    } else {
      const rows = await query('SELECT * FROM admins WHERE username = ? LIMIT 1', [username]);
      if (rows && rows.length > 0) {
        admin = rows[0];
      }
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không chính xác.'
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Tên đăng nhập hoặc mật khẩu không chính xác.'
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: admin.role,
        full_name: admin.full_name
      },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.json({
      success: true,
      message: 'Đăng nhập thành công.',
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          full_name: admin.full_name,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã có lỗi xảy ra trong quá trình đăng nhập máy chủ.'
    });
  }
}

// Lấy thông tin tài khoản đang đăng nhập
async function getMe(req, res) {
  try {
    const adminId = req.admin.id;
    let admin = null;

    if (isUsingFallback()) {
      const store = getFallbackStore();
      admin = store.admins.find(a => Number(a.id) === Number(adminId));
    } else {
      const rows = await query('SELECT id, username, full_name, email, role, created_at FROM admins WHERE id = ? LIMIT 1', [adminId]);
      if (rows && rows.length > 0) {
        admin = rows[0];
      }
    }

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin quản trị viên.'
      });
    }

    return res.json({
      success: true,
      data: {
        id: admin.id,
        username: admin.username,
        full_name: admin.full_name,
        email: admin.email,
        role: admin.role,
        created_at: admin.created_at
      }
    });
  } catch (error) {
    console.error('getMe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi máy chủ khi lấy thông tin tài khoản.'
    });
  }
}

// Đổi mật khẩu
async function changePassword(req, res) {
  try {
    const adminId = req.admin.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới.'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu mới phải có tối thiểu 6 ký tự.'
      });
    }

    let admin = null;
    if (isUsingFallback()) {
      const store = getFallbackStore();
      admin = store.admins.find(a => Number(a.id) === Number(adminId));
    } else {
      const rows = await query('SELECT * FROM admins WHERE id = ? LIMIT 1', [adminId]);
      if (rows && rows.length > 0) {
        admin = rows[0];
      }
    }

    if (!admin) {
      return res.status(404).json({ success: false, message: 'Tài khoản không tồn tại.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu hiện tại không chính xác.'
      });
    }

    const newHash = await bcrypt.hash(newPassword, 10);

    if (isUsingFallback()) {
      admin.password_hash = newHash;
      saveFallbackData();
    } else {
      await query('UPDATE admins SET password_hash = ? WHERE id = ?', [newHash, adminId]);
    }

    return res.json({
      success: true,
      message: 'Đổi mật khẩu thành công.'
    });
  } catch (error) {
    console.error('changePassword error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật mật khẩu.'
    });
  }
}

module.exports = {
  login,
  getMe,
  changePassword
};
