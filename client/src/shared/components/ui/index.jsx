// ─── Badge ────────────────────────────────────────────────────────────────────
export const Badge = ({ children, color = 'gray' }) => {
  const colors = {
    green:  'bg-emerald-50 text-emerald-700 border-emerald-200',
    red:    'bg-red-50 text-red-700 border-red-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    blue:   'bg-sky-50 text-sky-700 border-sky-200',
    teal:   'bg-[#00d4d4]/10 text-[#008080] border-[#00d4d4]/30',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    gray:   'bg-gray-100 text-gray-600 border-gray-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium border ${colors[color] || colors.gray}`}>
      {children}
    </span>
  );
};

// ─── Button ───────────────────────────────────────────────────────────────────
export const Button = ({
  children, onClick, type = 'button',
  variant = 'primary', size = 'md',
  disabled = false, loading = false,
  className = '',
}) => {
  const variants = {
    primary:   'bg-[#00d4d4] hover:bg-[#00b3b3] text-white font-semibold shadow-sm',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm',
    danger:    'bg-white hover:bg-red-50 text-red-600 border border-red-300 shadow-sm',
    ghost:     'hover:bg-gray-100 text-gray-600',
    outline:   'border border-[#00d4d4] text-[#00b3b3] hover:bg-[#00d4d4]/5',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled || loading}
      className={`inline-flex items-center gap-2 font-medium rounded-xl transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${variants[variant]} ${sizes[size]} ${className}`}>
      {loading && <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
};

// ─── SearchInput ──────────────────────────────────────────────────────────────
export const SearchInput = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="relative">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-900
                 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/30
                 focus:border-[#00d4d4] transition-all text-sm shadow-sm"
    />
  </div>
);

// ─── FormField ────────────────────────────────────────────────────────────────
export const FormField = ({ label, error, children, required }) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// ─── Input ────────────────────────────────────────────────────────────────────
export const Input = ({ error, className = '', ...props }) => (
  <input
    {...props}
    className={`w-full px-4 py-2.5 rounded-xl bg-white border text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/30 focus:border-[#00d4d4]
                transition-all text-sm shadow-sm
                ${error ? 'border-red-400' : 'border-gray-300'} ${className}`}
  />
);

// ─── Textarea ─────────────────────────────────────────────────────────────────
export const Textarea = ({ error, className = '', ...props }) => (
  <textarea
    {...props}
    className={`w-full px-4 py-2.5 rounded-xl bg-white border text-gray-900 placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/30 focus:border-[#00d4d4]
                transition-all text-sm shadow-sm resize-none
                ${error ? 'border-red-400' : 'border-gray-300'} ${className}`}
  />
);

// ─── Select ───────────────────────────────────────────────────────────────────
// Uses a wrapper div with a custom arrow so the native select
// sits inside it with proper background and text colors.
export const Select = ({ children, error, className = '', ...props }) => (
  <div className="relative">
    <select
      {...props}
      className={`w-full px-4 py-2.5 pr-10 rounded-xl bg-white border text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-[#00d4d4]/30 focus:border-[#00d4d4]
                  transition-all text-sm shadow-sm appearance-none cursor-pointer
                  ${error ? 'border-red-400' : 'border-gray-300'} ${className}`}
    >
      {children}
    </select>
    {/* Custom chevron arrow */}
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
);

// ─── ConfirmDialog ────────────────────────────────────────────────────────────
export const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, loading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>Confirm</Button>
        </div>
      </div>
    </div>
  );
};