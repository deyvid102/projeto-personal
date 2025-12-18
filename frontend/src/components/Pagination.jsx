import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const maxVisiblePages = 5; // define quantas páginas numeradas aparecem no máximo

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // lógica dinâmica com "..."
      if (currentPage <= 3) {
        // perto do início: [1, 2, 3, 4, '...', total]
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        // perto do fim: [1, '...', total-3, total-2, total-1, total]
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // no meio: [1, '...', atual-1, atual, atual+1, '...', total]
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="mt-12 flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        {/* botão voltar */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-3 rounded-xl border border-gray-100 bg-white disabled:opacity-20 disabled:cursor-not-allowed hover:border-black transition-all shadow-sm"
        >
          <FaChevronLeft size={12} />
        </button>

        {/* números das páginas */}
        <div className="flex items-center gap-2">
          {getPages().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={typeof page !== "number"}
              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                currentPage === page
                  ? "bg-black text-white shadow-lg scale-110"
                  : page === "..."
                  ? "bg-transparent text-gray-400 cursor-default"
                  : "bg-white border border-gray-100 text-gray-500 hover:border-black hover:text-black shadow-sm"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* botão próximo */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-3 rounded-xl border border-gray-100 bg-white disabled:opacity-20 disabled:cursor-not-allowed hover:border-black transition-all shadow-sm"
        >
          <FaChevronRight size={12} />
        </button>
      </div>

      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
        total de {totalItems} registros
      </p>
    </div>
  );
}