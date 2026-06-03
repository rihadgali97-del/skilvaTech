// ─── Badge ────────────────────────────────────────────────────────────────────
// Usage: <Badge color="green">Active</Badge>
export const Badge = ({ children, color = 'gray' }) => {
  const colors = {
    green:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    red:    'bg-red-500/10 text-red-400 border-red-500/20',
    yellow: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    blue:   'bg-sky-500/10 text-sky-400 border-sky-500/20',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    gray:   'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
};

// ─── Button ───────────────────────────────────────────────────────────────────
// Usage: <Button variant="primary" size="sm" onClick={...}>Save</Button>
export const Button = ({
  children, onClick, type = 'button',
  variant = 'primary', size = 'md',
  disabled = false, loading = false,
  className = '',
}) => {
  const variants = {
    primary:  'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20',
    secondary:'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
    danger:   'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/20',
    ghost:    'hover:bg-slate-800 text-slate-400 hover:text-slate-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 font-medium rounded-xl transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading && (
        <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};

// ─── SearchInput ──────────────────────────────────────────────────────────────
// Usage: <SearchInput value={search} onChange={setSearch} placeholder="Search users..." />
export const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">🔍</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white
                 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500
                 focus:border-transparent transition-all text-sm"
    />
  </div>
);

// ─── FormField ────────────────────────────────────────────────────────────────
// Usage: <FormField label="Email" error={errors.email}><input .../></FormField>
export const FormField = ({ label, error, children, required }) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
    )}
    {children}
    {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
  </div>
);

// ─── Input ────────────────────────────────────────────────────────────────────
export const Input = ({ error, ...props }) => (
  <input
    {...props}
    className={`w-full px-4 py-2.5 rounded-xl bg-slate-800 border text-white placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                transition-all text-sm
                ${error ? 'border-red-500/50' : 'border-slate-700'}`}
  />
);

// ─── Select ───────────────────────────────────────────────────────────────────
export const Select = ({ children, error, ...props }) => (
  <select
    {...props}
    className={`w-full px-4 py-2.5 rounded-xl bg-slate-800 border text-white
                focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                transition-all text-sm
                ${error ? 'border-red-500/50' : 'border-slate-700'}`}
  >
    {children}
  </select>
);

// ─── ConfirmDialog ────────────────────────────────────────────────────────────
export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>Confirm</Button>
        </div>
      </div>
    </div>
  );
};