import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

export default function ProjectCard({ project, onOpenModal }) {
  const defaultImage = 'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col group">
      {/* Project Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
        <img
          src={project.main_image || defaultImage}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-xs font-bold px-2.5 py-1 rounded-lg border border-amber-500/30">
          {project.category || 'Cửa nhôm kính'}
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-grow justify-between">
        <div>
          <h3 className="font-bold text-base text-white hover:text-amber-400 transition-colors line-clamp-2 mb-2">
            {project.title}
          </h3>

          <div className="space-y-1.5 text-xs text-slate-400 mb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Địa điểm: {project.location || 'Thanh Hóa'}</span>
            </div>
            {project.completion_date && (
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Hoàn thiện: {project.completion_date}</span>
              </div>
            )}
          </div>

          {project.description && (
            <p className="text-xs text-slate-400 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>

        {/* Action */}
        <div className="pt-3 border-t border-slate-800/80 mt-4 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">{project.client_name || 'Công trình thực tế'}</span>
          <button
            onClick={() => onOpenModal && onOpenModal(project)}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group/btn"
          >
            <span>Xem hình ảnh</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
