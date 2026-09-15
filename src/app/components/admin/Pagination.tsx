import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ApiPagination } from '../../lib/api';

interface PaginationProps {
  pagination: ApiPagination;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, total } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 text-sm text-[#222222]/60">
      <span>Página {page} de {totalPages} · {total} en total</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg border border-[#D9D9D9] text-[#222222] hover:bg-[#F8F8F8] transition-colors duration-250 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-2 rounded-lg border border-[#D9D9D9] text-[#222222] hover:bg-[#F8F8F8] transition-colors duration-250 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
