import React, { useState, useEffect } from 'react';
import { fetchProjects } from '../../services/api';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProjectCard from '../../components/common/ProjectCard';
import Pagination from '../../components/common/Pagination';
import { Search, MapPin, Calendar, X, Layers, Image as ImageIcon } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: 'Thi công hệ thống cửa nhôm Xingfa nhà phố Thọ Xuân',
    slug: 'thi-cong-he-thong-cua-nhom-xingfa-nha-pho-tho-xuan',
    category: 'Cửa nhôm kính',
    client_name: 'Gia đình anh Tuấn',
    location: 'Thị trấn Thọ Xuân, Thanh Hóa',
    completion_date: 'Tháng 03/2026',
    description: 'Công trình nhà phố 3 tầng bao gồm cửa đi 4 cánh mặt tiền Xingfa hệ 55 ghi xám, cửa sổ mở hất và cửa thông phòng, hoàn thiện đúng tiến độ và nghiệm thu đạt chuẩn thẩm mỹ cao.',
    main_image: 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 2,
    title: 'Lắp đặt cửa đi 4 cánh nhôm Xingfa mở quay biệt thự',
    slug: 'lap-dat-cua-di-4-canh-nhom-xingfa-mo-quay-biet-thu',
    category: 'Cửa nhôm kính',
    client_name: 'Gia đình anh Hoàng',
    location: 'Thọ Hải, Thọ Xuân, Thanh Hóa',
    completion_date: 'Tháng 02/2026',
    description: 'Hạng mục cửa đi chính 4 cánh nhôm Xingfa nhập khẩu tem đỏ hệ 55 màu nâu cafe sang trọng kết hợp kính dán an toàn 8.38mm phôi Việt Nhật.',
    main_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 3,
    title: 'Lắp đặt cửa kính thủy lực và vách ngăn văn phòng',
    slug: 'lap-dat-cua-kinh-thuy-luc-vach-ngan-van-phong-thanh-hoa',
    category: 'Vách kính cường lực',
    client_name: 'Công ty CP Xây Dựng & Thương Mại',
    location: 'TP. Thanh Hóa',
    completion_date: 'Tháng 02/2026',
    description: 'Hạng mục gồm 120m2 vách kính ngăn phòng họp và 2 bộ cửa kính thủy lực bản lề sàn 12mm tay nắm Inox sang trọng.',
    main_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 4,
    title: 'Thi công cabin phòng tắm kính đứng 135 độ khách sạn',
    slug: 'thi-cong-cabin-phong-tam-kinh-dung-135-do-khach-san',
    category: 'Vách kính cường lực',
    client_name: 'Khách sạn Sao Mai',
    location: 'Triệu Sơn, Thanh Hóa',
    completion_date: 'Tháng 01/2026',
    description: 'Lắp đặt 15 bộ phòng tắm kính vát góc 135 độ phụ kiện Inox 304 bóng gương cao cấp, gioăng từ chống tràn nước tuyệt đối.',
    main_image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 5,
    title: 'Thi công lan can ban công kính và mái kính sảnh biệt thự',
    slug: 'thi-cong-lan-can-kinh-mai-kinh-sanh-biet-thu-yen-dinh',
    category: 'Lan can & Mái kính',
    client_name: 'Biệt thự gia đình chú Hùng',
    location: 'Yên Định, Thanh Hóa',
    completion_date: 'Tháng 01/2026',
    description: 'Lắp đặt 45m lan can kính cường lực tay vịn inox 304 trụ lửng và 1 mái kính nghệ thuật sân trước tạo điểm nhấn đẳng cấp cho căn biệt thự.',
    main_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 6,
    title: 'Lắp đặt cầu thang kính tay vịn gỗ Lim Nam Phi',
    slug: 'lap-dat-cau-thang-kinh-tay-vin-go-lim-nam-phi',
    category: 'Lan can & Mái kính',
    client_name: 'Gia đình bác Quang',
    location: 'Thọ Xuân, Thanh Hóa',
    completion_date: 'Tháng 12/2025',
    description: 'Cầu thang kính cường lực 10mm chân trụ ngàm Inox đúc liền kết hợp tay vịn gỗ Lim Nam Phi bo cạnh bóng đẹp chắc chắn.',
    main_image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

export default function ProjectsPage() {
  const { openQuoteModal } = useSite();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 6, totalPages: 1 });
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = [
    { key: 'all', label: 'Tất cả công trình' },
    { key: 'Cửa nhôm kính', label: 'Cửa nhôm kính' },
    { key: 'Vách kính cường lực', label: 'Vách kính cường lực' },
    { key: 'Lan can & Mái kính', label: 'Lan can & Mái kính' }
  ];

  const loadProjects = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchProjects({
        page,
        limit: 9,
        category: activeCategory !== 'all' ? activeCategory : undefined,
        search: search || undefined
      });
      if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
        setProjects(res.data.data);
        setPagination(res.data.pagination);
      } else {
        // Fallback default sample projects
        let filtered = [...DEFAULT_PROJECTS];
        if (activeCategory !== 'all') {
          filtered = filtered.filter(p => p.category === activeCategory);
        }
        if (search.trim()) {
          const s = search.toLowerCase();
          filtered = filtered.filter(p => p.title.toLowerCase().includes(s) || p.location.toLowerCase().includes(s));
        }
        setProjects(filtered);
        setPagination({ page: 1, limit: 9, total: filtered.length, totalPages: 1 });
      }
    } catch (err) {
      console.error('Error loading projects, using fallback list:', err);
      let filtered = [...DEFAULT_PROJECTS];
      if (activeCategory !== 'all') {
        filtered = filtered.filter(p => p.category === activeCategory);
      }
      if (search.trim()) {
        const s = search.toLowerCase();
        filtered = filtered.filter(p => p.title.toLowerCase().includes(s) || p.location.toLowerCase().includes(s));
      }
      setProjects(filtered);
      setPagination({ page: 1, limit: 9, total: filtered.length, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects(1);
  }, [activeCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadProjects(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      <Breadcrumb items={[{ label: 'Công trình đã thi công' }]} />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
          HỒ SƠ CÔNG TRÌNH THỰC TẾ
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
          Công Trình Đã Hoàn Thiện
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Tổng hợp hình ảnh các công trình cửa nhôm Xingfa, vách kính văn phòng, lan can ban công đã được Nhôm Kính Huy Hoàng thi công lắp đặt tại Thanh Hóa.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
        {/* Category tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                activeCategory === cat.key
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc địa điểm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-500 dark:text-slate-400 text-sm">Đang tải danh sách công trình...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-600 dark:text-slate-400 text-sm shadow-sm">
          Không có công trình nào phù hợp với bộ lọc hiện tại.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpenModal={(p) => setSelectedProject(p)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={(p) => loadProjects(p)}
      />

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">
                  {selectedProject.category}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Main Image */}
              <div className="rounded-xl overflow-hidden aspect-[16/10] bg-slate-100 dark:bg-slate-950">
                <img
                  src={selectedProject.main_image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Gallery if any */}
              {Array.isArray(selectedProject.gallery_images) && selectedProject.gallery_images.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Hình ảnh hạng mục</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedProject.gallery_images.map((img, idx) => (
                      <div key={idx} className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl text-xs text-slate-600 dark:text-slate-300">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block">Địa điểm thi công:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedProject.location || 'Thanh Hóa'}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block">Khách hàng:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{selectedProject.client_name || 'Gia đình / Chủ đầu tư'}</span>
                </div>
                {selectedProject.completion_date && (
                  <div>
                    <span className="text-slate-400 dark:text-slate-500 block">Thời gian hoàn thiện:</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedProject.completion_date}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedProject.description && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Mô tả công trình</h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {selectedProject.description}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => {
                  const title = selectedProject.title;
                  setSelectedProject(null);
                  openQuoteModal({ note: `Tư vấn thi công tương tự công trình: ${title}` });
                }}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition-colors"
              >
                Tư Vấn Mẫu Công Trình Này
              </button>
              <button
                onClick={() => setSelectedProject(null)}
                className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-xl text-xs sm:text-sm font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
