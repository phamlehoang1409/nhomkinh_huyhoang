const { query, isUsingFallback, getFallbackStore, saveFallbackData } = require('../config/db');

// Lấy tất cả cài đặt website dạng key-value map
async function getSettings(req, res) {
  try {
    if (isUsingFallback()) {
      const store = getFallbackStore();
      const settingsMap = {};
      store.site_settings.forEach(s => {
        settingsMap[s.setting_key] = s.setting_value;
      });
      return res.json({ success: true, data: settingsMap });
    }

    const rows = await query('SELECT setting_key, setting_value FROM site_settings');
    const settingsMap = {};
    rows.forEach(r => {
      settingsMap[r.setting_key] = r.setting_value;
    });

    return res.json({ success: true, data: settingsMap });
  } catch (error) {
    console.error('getSettings error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi tải thông tin cài đặt.' });
  }
}

// Cập nhật cài đặt (Admin)
async function updateSettings(req, res) {
  try {
    const settings = req.body; // { hotline: "...", address: "...", ... }

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, message: 'Dữ liệu không hợp lệ.' });
    }

    if (isUsingFallback()) {
      const store = getFallbackStore();
      for (const [key, value] of Object.entries(settings)) {
        const item = store.site_settings.find(s => s.setting_key === key);
        if (item) {
          item.setting_value = value;
        } else {
          store.site_settings.push({
            id: store.site_settings.length + 1,
            setting_key: key,
            setting_value: value
          });
        }
      }
      saveFallbackData();
      return res.json({ success: true, message: 'Cập nhật cài đặt website thành công.' });
    }

    for (const [key, value] of Object.entries(settings)) {
      await query(`
        INSERT INTO site_settings (setting_key, setting_value)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
      `, [key, value]);
    }

    return res.json({ success: true, message: 'Cập nhật cài đặt website thành công.' });
  } catch (error) {
    console.error('updateSettings error:', error);
    return res.status(500).json({ success: false, message: 'Lỗi cập nhật cài đặt.' });
  }
}

module.exports = {
  getSettings,
  updateSettings
};
