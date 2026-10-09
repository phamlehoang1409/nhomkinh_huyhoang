/**
 * Kiểm tra số điện thoại Việt Nam hợp lệ
 * Đầu số: 03, 05, 07, 08, 09 kèm 8 chữ số tiếp theo (Tổng 10 chữ số)
 * Hoặc định dạng +84 kèm 9 chữ số
 */
function isValidVNPhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s.-]/g, '');
  const vnPhoneRegex = /^(0|\+84)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
  return vnPhoneRegex.test(cleaned);
}

module.exports = { isValidVNPhone };
