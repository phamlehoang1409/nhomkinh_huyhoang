import React, { useState } from 'react';
import Breadcrumb from '../../components/common/Breadcrumb';
import { Phone, MapPin, Mail, Clock, Send, CheckCircle2, AlertCircle, Upload, MessageCircle } from 'lucide-react';
import { useSite } from '../../context/SiteContext';
import { submitQuoteRequest } from '../../services/api';

export default function ContactPage() {
  const { settings, services } = useSite();

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    address: '',
    service_name: services[0]?.name || 'Thi công cửa nhôm Xingfa nhập khẩu',
    dimensions: '',
    note: ''
  });
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files).slice(0, 5));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const phoneRegex = /^(0|\+84)(3[2-9]|5[25689]|7[06-9]|8[1-9]|9[0-9])[0-9]{7}$/;
    const cleanedPhone = formData.phone.replace(/[\s.-]/g, '');

    if (!formData.customer_name.trim()) {
      setErrorMsg('Vui lòng nhập họ và tên của bạn.');
      return;
    }

    if (!phoneRegex.test(cleanedPhone)) {
      setErrorMsg('Vui lòng nhập số điện thoại Việt Nam hợp lệ (ví dụ: 0978398567).');
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
        setSuccessMsg(res.data.message || 'Gửi yêu cầu báo giá thành công! Chúng tôi sẽ liên hệ trong thời gian sớm nhất.');
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
        setErrorMsg(res.data.message || 'Không thể lưu thông tin. Vui lòng kiểm tra lại.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Có lỗi xảy ra khi gửi biểu mẫu. Quý khách vui lòng gọi trực tiếp Hotline 0978398567.');
    } finally {
      setSubmitting(false);
    }
  };

  const phone = settings.hotline || '0978398567';
  const zaloPhone = settings.zalo || '0978398567';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
      <Breadcrumb items={[{ label: 'Liên hệ & Báo giá' }]} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
          TƯ VẤN & BÁO GIÁ CÔNG TRÌNH
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Liên Hệ Nhôm Kính Huy Hoàng
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Quý khách có nhu cầu lắp đặt cửa nhôm Xingfa, cửa kính cường lực hoặc sửa chữa cửa, hãy để lại thông tin hoặc gọi điện trực tiếp để nhận tư vấn nhanh nhất.
        </p>
      </div>

      {/* Main Grid: Form + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Contact Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-l-4 border-amber-500 pl-3">
              Thông Tin Cơ Sở
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-white mb-0.5">Địa chỉ xưởng:</strong>
                  <span>{settings.address || 'Thôn Tân Thành, xã Thọ Hải, huyện Thọ Xuân, tỉnh Thanh Hóa'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-white mb-0.5">Điện thoại / Zalo:</strong>
                  <a href={`tel:${phone}`} className="text-amber-600 dark:text-amber-400 font-bold hover:underline text-base">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-white mb-0.5">Thời gian làm việc:</strong>
                  <span>{settings.opening_hours || '07:00 - 18:30 (Cả Thứ 7 & Chủ Nhật)'}</span>
                </div>
              </div>

              {settings.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-slate-900 dark:text-white mb-0.5">Email liên hệ:</strong>
                    <span>{settings.email}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-slate-950 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Phone className="w-4 h-4" />
                <span>Gọi Ngay</span>
              </a>

              <a
                href={`https://zalo.me/${zaloPhone.replace(/\s+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat Zalo</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right: Request Quote Form (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 rounded-3xl shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Gửi Yêu Cầu Khảo Sát & Nhận Báo Giá
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Điền thông tin bên dưới, kỹ thuật viên sẽ liên hệ lại ngay để khảo sát đo đạc thực tế.
          </p>

          {successMsg ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Yêu Cầu Đã Được Tiếp Nhận!</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">{successMsg}</p>
              <button
                onClick={() => setSuccessMsg('')}
                className="mt-4 px-6 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
              >
                Gửi thêm yêu cầu khác
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
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Họ và tên quý khách <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    required
                    placeholder="Ví dụ: Anh Nam"
                    value={formData.customer_name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Số điện thoại / Zalo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="0978 398 567"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Hạng mục quan tâm
                  </label>
                  <select
                    name="service_name"
                    value={formData.service_name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none font-medium"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                    <option value="Cửa nhôm Xingfa">Cửa nhôm Xingfa</option>
                    <option value="Cửa kính cường lực">Cửa kính cường lực</option>
                    <option value="Vách kính ngăn phòng">Vách kính ngăn phòng</option>
                    <option value="Lan can / Mái kính">Lan can / Mái kính</option>
                    <option value="Sửa chữa cửa">Sửa chữa cửa</option>
                    <option value="Hạng mục khác">Hạng mục khác</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Địa chỉ công trình (Xã/Huyện)
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Ví dụ: Thọ Hải, Thọ Xuân"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Kích thước dự kiến hoặc số bộ cửa
                </label>
                <input
                  type="text"
                  name="dimensions"
                  placeholder="Ví dụ: 1 bộ cửa chính 4 cánh, 4 cửa sổ"
                  value={formData.dimensions}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ghi chú yêu cầu chi tiết
                </label>
                <textarea
                  name="note"
                  rows={3}
                  placeholder="Ghi chú thêm về hệ nhôm, màu sắc yêu cầu, thời gian mong muốn khảo sát..."
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Đính kèm bản vẽ hoặc ảnh hiện trạng công trình
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 dark:file:bg-slate-800 file:text-amber-600 dark:file:text-amber-400 hover:file:bg-slate-200 dark:hover:file:bg-slate-700 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:opacity-95 text-slate-950 font-black rounded-xl text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <span>Đang lưu thông tin vào hệ thống...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Gửi Yêu Cầu Báo Giá</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Google Maps Full Width */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden p-2 shadow-sm">
        <iframe
          title="Bản đồ chỉ đường đến Nhôm Kính Huy Hoàng"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120000!2d105.5!3d19.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3136500000000000%3A0x0!2zVGjhu40gSOG6o2ksIFRo4buNIFh1w6JuLCBUaGFuaCBIw7Fh!5e0!3m2!1svi!2svn!4v1680000000000!5m2!1svi!2svn"
          width="100%"
          height="380"
          style={{ border: 0, borderRadius: '1rem' }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>
    </div>
  );
}
