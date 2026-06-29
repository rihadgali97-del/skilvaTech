import { Link } from 'react-router-dom';

// ─── Section wrapper ──────────────────────────────────────────────────────────
export const Section = ({ children, className = '', dark = false, id }) => (
  <section
    id={id}
    className={`py-20 px-4 ${dark ? 'bg-[#0d1f2d]' : 'bg-white'} ${className}`}
  >
    <div className="max-w-7xl mx-auto">{children}</div>
  </section>
);

// ─── Section header ───────────────────────────────────────────────────────────
export const SectionHeader = ({ eyebrow, title, subtitle, center = true, dark = false }) => (
  <div className={`mb-14 ${center ? 'text-center' : ''}`}>
    {eyebrow && (
      <span className="inline-block text-sm font-semibold text-[#00d4d4] uppercase tracking-widest mb-3">
        {eyebrow}
      </span>
    )}
    <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${dark ? 'text-white' : 'text-gray-900'}`}>
      {title}
    </h2>
    {subtitle && (
      <p className={`text-lg max-w-2xl ${center ? 'mx-auto' : ''} ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
        {subtitle}
      </p>
    )}
  </div>
);

// ─── Brand button ─────────────────────────────────────────────────────────────
// Renders as <Link> when `href` is given, otherwise as a <button>.
// Pass `type="submit"` for form submission buttons.
export const BrandButton = ({
  children, href, onClick,
  variant = 'primary', size = 'md',
  type = 'button', disabled = false,
  className = '',
}) => {
  const sizes    = { sm: 'px-5 py-2.5 text-sm', md: 'px-7 py-3 text-base', lg: 'px-9 py-4 text-lg' };
  const variants = {
    primary:   'bg-[#00d4d4] hover:bg-[#00b3b3] text-white shadow-lg shadow-[#00d4d4]/20',
    secondary: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 shadow-sm',
    outline:   'border-2 border-[#00d4d4] text-[#00d4d4] hover:bg-[#00d4d4] hover:text-white',
    ghost:     'text-[#00d4d4] hover:text-[#00b3b3] underline-offset-4 hover:underline',
    dark:      'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm',
  };

  const cls = `inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200
               disabled:opacity-50 disabled:cursor-not-allowed
               ${sizes[size]} ${variants[variant]} ${className}`;

  if (href) return <Link to={href} className={cls}>{children}</Link>;
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
};

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, className = '', hover = true }) => (
  <div className={`bg-white border border-gray-200 rounded-2xl p-6 shadow-sm
                   ${hover ? 'hover:shadow-md hover:border-[#00d4d4]/30 transition-all duration-300' : ''}
                   ${className}`}>
    {children}
  </div>
);

// ─── Skeleton loader ──────────────────────────────────────────────────────────
export const Skeleton = ({ className = '' }) => (
  <div className={`bg-gray-200 rounded-xl animate-pulse ${className}`} />
);

export const CardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
    <Skeleton className="h-48 w-full" />
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
    <Skeleton className="h-10 w-32" />
  </div>
);

// ─── Badge ────────────────────────────────────────────────────────────────────
export const PublicBadge = ({ children, color = 'teal' }) => {
  const colors = {
    teal:   'bg-[#00d4d4]/10 text-[#008080] border-[#00d4d4]/20',
    blue:   'bg-blue-50 text-blue-700 border-blue-200',
    green:  'bg-emerald-50 text-emerald-700 border-emerald-200',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    gray:   'bg-gray-100 text-gray-600 border-gray-200',
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${colors[color]}`}>
      {children}
    </span>
  );
};

// ─── Stats number ─────────────────────────────────────────────────────────────
export const StatItem = ({ value, label, dark = false }) => (
  <div className="text-center">
    <p className={`text-4xl md:text-5xl font-bold mb-2 ${dark ? 'text-[#00d4d4]' : 'text-gray-900'}`}>
      {value}
    </p>
    <p className={`text-sm font-medium uppercase tracking-wider ${dark ? 'text-slate-400' : 'text-gray-500'}`}>
      {label}
    </p>
  </div>
);

// ─── Feature card ─────────────────────────────────────────────────────────────
export const FeatureCard = ({ icon, title, description, dark = false }) => (
  <div className={`p-6 rounded-2xl border transition-all duration-300 group
                   ${dark
                     ? 'border-white/10 hover:border-[#00d4d4]/30 hover:bg-white/5'
                     : 'border-gray-200 hover:border-[#00d4d4]/30 hover:shadow-md bg-white'
                   }`}>
    <div className="w-12 h-12 rounded-xl bg-[#00d4d4]/10 border border-[#00d4d4]/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className={`text-lg font-semibold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
    <p className={`text-sm leading-relaxed ${dark ? 'text-slate-400' : 'text-gray-500'}`}>{description}</p>
  </div>
);