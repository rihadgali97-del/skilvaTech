const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3) return [1, 2, 3, 4, 5];
    if (page >= totalPages - 2) return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
    return [page - 2, page - 1, page, page + 1, page + 2];
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
          className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          ← Prev
        </button>
        {getVisiblePages().map((p) => (
          <button key={p} onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-sm transition-all font-medium
              ${p === page ? 'bg-[#00d4d4] text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}>
            {p}
          </button>
        ))}
        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
          className="px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
          Next →
        </button>
      </div>
    </div>
  );
};

export default Pagination;