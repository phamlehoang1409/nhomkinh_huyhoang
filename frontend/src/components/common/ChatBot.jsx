import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Phone, ExternalLink, Sparkles, CornerDownLeft, ShieldCheck, MapPin } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function ChatBot() {
  const { settings, openQuoteModal } = useSite();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const phone = settings.hotline || '0978398567';
  const zaloUrl = `https://zalo.me/${(settings.zalo || '0978398567').replace(/\s+/g, '')}`;
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: `Xin chào quý khách! Em là Trợ lý tự động của **Nhôm Kính Huy Hoàng** (Thanh Hóa). 

Quý khách cần tư vấn lắp đặt cửa nhôm Xingfa, kính cường lực hay nhận báo giá công trình? Em luôn sẵn sàng hỗ trợ và kết nối trực tiếp với **Chủ Xưởng qua Zalo: 0978 398 567**!`,
      showZaloBtn: true,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickQuestions = [
    'Báo giá cửa nhôm Xingfa',
    'Tư vấn cửa kính cường lực & vách ngăn',
    'Kết nối Zalo chủ xưởng 0978398567',
    'Địa chỉ xưởng & Khảo sát đo đạc',
    'Chính sách bảo hành cửa'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const generateBotReply = (userText) => {
    const text = userText.toLowerCase();

    // 0. Secret Admin Portal Command
    if (text.includes('admin') || text.includes('quản trị') || text.includes('quan tri') || text.includes('dang nhap')) {
      return {
        text: `🔐 **Cổng Đăng Nhập Quản Trị Viên (Admin Portal):**\n\nNhấn vào nút bên dưới để chuyển trực tiếp đến trang đăng nhập bảng điều khiển quản lý:`,
        showAdminBtn: true
      };
    }

    // 1. Nhôm Xingfa / Báo giá
    if (text.includes('xingfa') || text.includes('báo giá') || text.includes('giá') || text.includes('chi phí') || text.includes('bao nhiêu')) {
      return {
        text: `Dạ, **Nhôm Kính Huy Hoàng** chuyên gia công cửa nhôm Xingfa nhập khẩu chính hãng tem đỏ hệ 55, hệ 93 kết hợp phụ kiện Kinlong cao cấp.

Đơn giá cụ thể phụ thuộc vào khối lượng, quy cách mở cửa và độ dày kính. Để nhận **bảng dự toán bóc tách chi tiết & ưu đãi nhất**, quý khách vui lòng nhắn trực tiếp qua **Zalo của Chủ xưởng (0978 398 567)** nhé!`,
        showZaloBtn: true,
        showQuoteBtn: true
      };
    }

    // 2. Kính cường lực / Vách kính / Lan can / Mái kính
    if (text.includes('kính') || text.includes('cường lực') || text.includes('vách') || text.includes('lan can') || text.includes('mái')) {
      return {
        text: `Dạ, xưởng chúng em thi công trọn gói:
• Cửa kính thủy lực bản lề sàn, cửa lùa ray treo inox
• Vách kính ngăn văn phòng & cabin tắm đứng
• Lan can ban công & Mái kính cường lực nghệ thuật

Chủ xưởng có hỗ trợ **mang mẫu kính và phụ kiện đến tận công trình đo đạc miễn phí** tại Thanh Hóa. Quý khách kết nối Zalo để gửi bản vẽ hoặc vị trí nhé!`,
        showZaloBtn: true
      };
    }

    // 3. Địa chỉ xưởng / Ở đâu / Khảo sát
    if (text.includes('địa chỉ') || text.includes('ở đâu') || text.includes('xưởng') || text.includes('thọ xuân') || text.includes('thọ hải') || text.includes('khảo sát')) {
      return {
        text: `Dạ, xưởng sản xuất **Nhôm Kính Huy Hoàng** đặt tại:
📍 **Thôn Tân Thành, xã Thọ Hải, huyện Thọ Xuân, Thanh Hóa**

Đội ngũ thợ chúng em nhận khảo sát đo đạc tận nơi miễn phí trên toàn huyện Thọ Xuân và các khu vực lân cận thuộc tỉnh Thanh Hóa.`,
        showZaloBtn: true
      };
    }

    // 4. Zalo / SĐT / Chủ xưởng / Liên hệ
    if (text.includes('zalo') || text.includes('số điện thoại') || text.includes('sđt') || text.includes('chủ') || text.includes('gọi') || text.includes('hotline') || text.includes('liên hệ')) {
      return {
        text: `Dạ, quý khách liên hệ trực tiếp với **Chủ cơ sở Nhôm Kính Huy Hoàng** qua:
📞 **Hotline / Zalo:** **0978 398 567** (Phục vụ 24/7, cả Thứ 7 & Chủ Nhật)

Quý khách có thể bấm nút bên dưới để mở ứng dụng Zalo và nhắn tin trực tiếp trao đổi ngay ạ!`,
        showZaloBtn: true
      };
    }

    // 5. Bảo hành / Sửa chữa
    if (text.includes('bảo hành') || text.includes('sửa') || text.includes('chất lượng') || text.includes('phụ kiện')) {
      return {
        text: `Dạ, Nhôm Kính Huy Hoàng cam kết:
✅ Bảo hành 5 năm với thanh nhôm Xingfa chính hãng
✅ Bảo hành 2 năm với phụ kiện kim khí đồng bộ
✅ Có mặt nhanh chóng kiểm tra, căn chỉnh cửa nếu có sự cố

Quý khách hoàn toàn an tâm khi thi công tại cơ sở chúng em!`,
        showZaloBtn: true
      };
    }

    // Default friendly response with Owner Zalo
    return {
      text: `Cảm ơn quý khách đã quan tâm! Để được tư vấn quy cách kỹ thuật chuẩn xác và nhận báo giá ưu đãi nhanh nhất, quý khách vui lòng liên hệ trực tiếp với **Chủ Xưởng qua Zalo hoặc Hotline: 0978 398 567** nhé!`,
      showZaloBtn: true,
      showQuoteBtn: true
    };
  };

  const handleSendMessage = (textToSend = null) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const replyData = generateBotReply(query);
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: replyData.text,
        showZaloBtn: replyData.showZaloBtn,
        showQuoteBtn: replyData.showQuoteBtn,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:scale-105 active:scale-95 text-slate-950 px-4 py-3 rounded-full shadow-2xl transition-all"
            aria-label="Mở khung chat tự động"
          >
            <div className="relative">
              <Bot className="w-6 h-6 animate-bounce" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-rose-600 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </div>
            <div className="text-left hidden sm:block">
              <span className="block text-xs font-black leading-none">Hỏi Báo Giá & Zalo</span>
              <span className="text-[10px] font-semibold text-slate-900 opacity-90">Tư vấn trực tiếp 24/7</span>
            </div>

            {/* Mobile indicator pulse ring */}
            <span className="absolute inset-0 rounded-full bg-amber-400 opacity-40 animate-ping -z-10"></span>
          </button>
        )}
      </div>

      {/* Interactive Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-4 sm:bottom-6 left-2 right-2 sm:right-auto sm:left-6 z-50 w-auto sm:w-[380px] md:w-[400px] h-[520px] max-h-[85vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scaleUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center font-bold text-slate-950 shadow-md">
                  <Bot className="w-5 h-5 text-slate-950" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>Trợ Lý Huy Hoàng</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded">AI</span>
                </h3>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span>● Đang trực tuyến (Zalo: 0978398567)</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              title="Đóng cửa sổ chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/60 text-xs sm:text-sm">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed space-y-2.5 ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-br-xs shadow-md'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-xs shadow-md'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Owner Zalo & Call Action Buttons */}
                  {msg.showZaloBtn && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                      <a
                        href={zaloUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Mở Zalo Chủ Xưởng ({phone})</span>
                      </a>

                      <a
                        href={`tel:${phone}`}
                        className="w-full py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-amber-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Gọi Hotline Ngay</span>
                      </a>
                    </div>
                  )}

                  {msg.showQuoteBtn && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        openQuoteModal();
                      }}
                      className="w-full py-1.5 bg-amber-500/10 hover:bg-amber-500 hover:text-slate-950 text-amber-400 border border-amber-500/30 font-bold rounded-xl text-xs transition-colors"
                    >
                      📋 Điền Form Nhận Báo Giá Chi Tiết
                    </button>
                  )}

                  {msg.showAdminBtn && (
                    <a
                      href="/admin/login"
                      className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition-all"
                    >
                      <span>🔑 Vào Trang Đăng Nhập Quản Trị</span>
                    </a>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 w-20">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="p-2.5 bg-slate-900 border-t border-slate-800/80 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/40 text-[11px] font-medium text-slate-300 border border-slate-700 transition-colors shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-slate-950 border-t border-slate-800">
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi (ví dụ: giá cửa nhôm, zalo chủ xưởng...)..."
                className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-3.5 pr-11 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="absolute right-1.5 p-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-30 text-slate-950 rounded-xl transition-all"
                title="Gửi tin nhắn"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
