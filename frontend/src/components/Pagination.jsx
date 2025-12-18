import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Pagination({ currentPage, totalPages, onPageChange, totalItems }) {
  if (totalPages <= 1) return null;

  // Lógica para decidir quais números mostrar
  const getPages = () => {
    const pages = [];
    
    // Se tivermos 5 páginas ou menos, mostra todas normalmente
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // Caso contrário, aplica a lógica: 3 primeiras ... e a última
    if (currentPage <= 2) {
      // Se estiver no começo: [1, 2, 3, '...', total]
      pages.push(1, 2, 3, "...", totalPages);
    } else if (currentPage >= totalPages - 1) {
      // Se estiver no fim: [1, '...', total-2, total-1, total]
      pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
    } else {
      // Se estiver no meio: [1, '...', atual, '...', total]
      pages.push(1, "...", currentPage, "...", totalPages);
    }

    return pages;
  };

  return (
    <div className="mt-12 flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        {/* Voltar */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-3 rounded-xl border border-gray-200 bg-white disabled:opacity-20 disabled:cursor-not-allowed hover:border-black transition-all shadow-sm"
        >
          <FaChevronLeft size={12} />
        </button>

        {/* Números das Páginas */}
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
                  : "bg-white border border-gray-200 text-gray-500 hover:border-black hover:text-black shadow-sm"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Próximo */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-3 rounded-xl border border-gray-200 bg-white disabled:opacity-20 disabled:cursor-not-allowed hover:border-black transition-all shadow-sm"
        >
          <FaChevronRight size={12} />
        </button>
      </div>

      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
        Total de {totalItems} registros
      </p>
    </div>
  );
}