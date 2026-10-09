import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    // Show first, last, and around current
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-10">
      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500 disabled:opacity-40 disabled:pointer-events-none transition-all text-xs sm:text-sm flex items-center gap-1 shadow-sm"
        aria-label="Trang trước"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline font-semibold">Trước</span>
      </button>

      {/* Page Numbers */}
      {pages.map((p, idx) => (
        <React.Fragment key={idx}>
          {p === '...' ? (
            <span className="px-2 text-slate-400 dark:text-slate-500 text-xs sm:text-sm font-semibold">...</span>
          ) : (
            <button
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                currentPage === p
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500 shadow-sm'
              }`}
            >
              {p}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-500 disabled:opacity-40 disabled:pointer-events-none transition-all text-xs sm:text-sm flex items-center gap-1 shadow-sm"
        aria-label="Trang sau"
      >
        <span className="hidden sm:inline font-semibold">Sau</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
