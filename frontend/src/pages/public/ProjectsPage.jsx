import React, { useState, useEffect } from 'react';
import { fetchProjects } from '../../services/api';
import Breadcrumb from '../../components/common/Breadcrumb';
import ProjectCard from '../../components/common/ProjectCard';
import Pagination from '../../components/common/Pagination';
import { Search, MapPin, Calendar, X, Layers, Image as ImageIcon } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

export default function ProjectsPage() {
  const { openQuoteModal } = useSite();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, totalPages: 1 });
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
      if (res.data?.success) {
        setProjects(res.data.data);
        setPagination(res.data.pagination);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
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
