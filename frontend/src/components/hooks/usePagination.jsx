// src/hooks/usePagination.js
import { useState, useMemo } from "react";

export function usePagination(data, itemsPerPage = 6) {
  const [currentPage, setCurrentPage] = useState(1);

  const currentData = useMemo(() => {
    const begin = (currentPage - 1) * itemsPerPage;
    const end = begin + itemsPerPage;
    return data.slice(begin, end); // Garante que fatiamos a lista atualizada
  }, [data, currentPage, itemsPerPage]); // <--- 'data' DEVE estar aqui

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return { currentData, currentPage, totalPages, goToPage, totalItems: data.length };
}