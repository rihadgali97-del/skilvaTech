import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/apiClient';
import useDebounce from '../../hooks/useDebounce';

const typeColors = {
  user:   'bg-blue-50 text-blue-600',
  client: 'bg-[#00d4d4]/10 text-[#008080]',
  course: 'bg-emerald-50 text-emerald-600',
  ticket: 'bg-amber-50 text-amber-600',
  lead:   'bg-purple-50 text-purple-600',
};

const GlobalSearch = () => {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [open, setOpen]         = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const inputRef    = useRef(null);
  const containerRef = useRef(null);
  const navigate    = useNavigate();
  const debouncedQ  = useDebounce(query, 300);

  // ── Fetch results ──────────────────────────────────────────────────────────
  const search = useCallback(async (q) => {
    if (!q || q.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const { data } = await apiClient.get(`/search?q=${encodeURIComponent(q)}&limit=5`);
      setResults(data.data.results);
      setOpen(true);
      setActiveIdx(-1);
    } catch (_) { setResults([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { search(debouncedQ); }, [debouncedQ, search]);

  // ── Keyboard navigation ────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (!open || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      handleSelect(results[activeIdx]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  // ── Select result ──────────────────────────────────────────────────────────
  const handleSelect = (result) => {
    navigate(result.href);
    setQuery('');
    setResults([]);
    setOpen(false);
    inputRef.current?.blur();
  };

  // ── Close on outside click ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Keyboard shortcut (Cmd/Ctrl+K) ────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="relative w-72" ref={containerRef}>
      {/* Input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => { if (results.length > 0) setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Search... (⌘K)"
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-100 border border-transparent
                     text-gray-900 placeholder-gray-400 text-sm
                     focus:outline-none focus:bg-white focus:border-[#00d4d4]/40
                     focus:ring-2 focus:ring-[#00d4d4]/20 transition-all"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border-2 border-[#00d4d4] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
          {/* Group by type */}
          {['user','client','course','ticket','lead'].map((type) => {
            const group = results.filter((r) => r.type === type);
            if (group.length === 0) return null;

            return (
              <div key={type}>
                <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                  {type}s
                </p>
                {group.map((result, i) => {
                  const globalIdx = results.indexOf(result);
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleSelect(result)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-gray-50 last:border-0
                        ${globalIdx === activeIdx ? 'bg-[#00d4d4]/5' : 'hover:bg-gray-50'}`}
                    >
                      <span className="text-base flex-shrink-0">{result.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{result.title}</p>
                        <p className="text-xs text-gray-500 truncate">{result.subtitle}</p>
                      </div>
                      {result.badge && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${typeColors[result.type] || 'bg-gray-100 text-gray-500'}`}>
                          {result.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}

          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-400">{results.length} results for "{query}"</span>
            <span className="text-xs text-gray-400">↑↓ navigate · Enter select · Esc close</span>
          </div>
        </div>
      )}

      {/* No results */}
      {open && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-4 text-center">
          <p className="text-sm text-gray-400">No results for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;