import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center text-xs sm:text-sm text-slate-400 py-3 mb-6 overflow-x-auto whitespace-nowrap">
      <Link to="/" className="flex items-center gap-1 hover:text-amber-400 transition-colors">
        <Home className="w-3.5 h-3.5" />
        <span>Trang chủ</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-600 shrink-0" />
          {item.link && idx !== items.length - 1 ? (
            <Link to={item.link} className="hover:text-amber-400 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-amber-400 font-medium truncate max-w-[200px] sm:max-w-none">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
