import React, { useState, useEffect } from 'react';
import { X, Send, Phone, User, MapPin, FileText, CheckCircle2, AlertCircle, Upload, Image as ImageIcon } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { submitQuoteRequest } from '../../services/api';

export default function QuoteModal() {
  const { isQuoteModalOpen, closeQuoteModal, quotePrefill, services, settings } = useSite();
  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    address: '',
    service_name: '',
    dimensions: '',
    note: ''
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isQuoteModalOpen) {
      setFormData(prev => ({
        ...prev,
        service_name: quotePrefill.service_name || prev.service_name || (services[0]?.name || ''),
        note: quotePrefill.note || prev.note || ''
      }));
      setSuccessMsg('');
      setErrorMsg('');
      setImages([]);
    }
  }, [isQuoteModalOpen, quotePrefill, services]);

  if (!isQuoteModalOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 3);
      setImages(selectedFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Phone validation (VN numbers)
    const phoneRegex = /^(0|\+84)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
    const cleanedPhone = formData.phone.replace(/[\s.-]/g, '');

    if (!formData.customer_name.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của bạn.');
      return;
    }

    if (!phoneRegex.test(cleanedPhone)) {
      setErrorMsg('Vui lòng nhập số điện thoại Việt Nam hợp lệ (10 số, ví dụ 0978398567).');
      return;
    }

    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('customer_name', formData.customer_name.trim());
      data.append('phone', cleanedPhone);
      data.append('address', formData.address.trim());
      data.append('service_name', formData.service_name);
      data.append('dimensions', formData.dimensions.trim());
      data.append('note', formData.note.trim());

      images.forEach((file) => {
        data.append('images', file);
      });

      const res = await submitQuoteRequest(data);
      if (res.data.success) {
        setSuccessMsg(res.data.message || 'Gửi yêu cầu báo giá thành công!');
        setFormData({
          customer_name: '',
          phone: '',
          address: '',
          service_name: services[0]?.name || '',
          dimensions: '',
          note: ''
        });
        setImages([]);
      } else {
        setErrorMsg(res.data.message || 'Không thể lưu yêu cầu. Vui lòng thử lại.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Có lỗi xảy ra khi gửi thông tin. Quý khách vui lòng gọi trực tiếp Hotline.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-slate-50 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              Yêu cầu Tư vấn & Nhận Báo giá
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Khảo sát đo đạc thực tế tại công trình miễn phí tại Thanh Hóa
            </p>
          </div>
          <button
            onClick={closeQuoteModal}
            className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {successMsg ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">Yêu cầu đã được gửi!</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">{successMsg}</p>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <p>Cần hỗ trợ gấp? Gọi ngay cho chúng tôi:</p>
                <a
                  href={`tel:${settings.hotline || '0978398567'}`}
                  className="font-bold text-amber-600 dark:text-amber-400 text-base block hover:underline"
                >
                  Hotline: {settings.hotline || '0978398567'}
                </a>
              </div>
              <button
                onClick={closeQuoteModal}
                className="mt-4 px-6 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-xl text-sm transition-colors"
              >
                Đóng cửa sổ
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-3 text-rose-600 dark:text-rose-300 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Họ và tên quý khách <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="customer_name"
                      required
                      placeholder="Ví dụ: Anh Tuấn"
                      value={formData.customer_name}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Số điện thoại / Zalo <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="0978 398 567"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Service & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Hạng mục cần làm
                  </label>
                  <select
                    name="service_name"
                    value={formData.service_name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none font-medium"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="Khác / Nhiều hạng mục">Khác / Nhiều hạng mục</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Địa chỉ công trình (Xã/Huyện)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      placeholder="Ví dụ: Thọ Hải, Thọ Xuân"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                    />
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Kích thước dự kiến hoặc số lượng (nếu có)
                </label>
                <input
                  type="text"
                  name="dimensions"
                  placeholder="Ví dụ: Cửa 4 cánh R3m x C2.8m, 3 cửa sổ"
                  value={formData.dimensions}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ghi chú yêu cầu thêm
                </label>
                <textarea
                  name="note"
                  rows={2}
                  placeholder="Ghi chú về màu sắc nhôm (ghi xám, nâu cafe...), loại kính, thời gian muốn khảo sát..."
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none resize-none"
                ></textarea>
              </div>

              {/* Upload image / drawing */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Đính kèm bản vẽ / ảnh thực tế (tối đa 3 ảnh)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-amber-600 dark:file:text-amber-400 hover:file:bg-slate-200 dark:hover:file:bg-slate-700 cursor-pointer"
                />
                {images.length > 0 && (
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 font-semibold">Đã chọn {images.length} tệp đính kèm.</p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:opacity-95 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <span>Đang gửi thông tin...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi Yêu Cầu Báo Giá Ngay</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
