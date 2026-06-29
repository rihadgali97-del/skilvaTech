import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BrandButton } from './ui';

const navLinks = [
  { label: 'Home',     href: '/' },
  { label: 'About',    href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Courses',  href: '/courses' },
  { label: 'Pricing',  href: '/pricing' },
  { label: 'FAQ',      href: '/faq' },
  { label: 'Contact',  href: '/contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const location = useLocation();

  // Change navbar style on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  const isActive = (href) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
                        ${scrolled
                          ? 'bg-[#0d1f2d]/95 backdrop-blur-md shadow-lg shadow-black/20'
                          : 'bg-transparent'
                        }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#00d4d4]/20 border border-[#00d4d4]/40 flex items-center justify-center text-[#00d4d4] font-bold text-base">
              S
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Skilva<span className="text-[#00d4d4]">Tech</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                            ${isActive(link.href)
                              ? 'text-[#00d4d4] bg-[#00d4d4]/10'
                              : 'text-white/70 hover:text-white hover:bg-white/10'
                            }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <BrandButton href="/contact" size="sm">Get Started</BrandButton>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 text-white"
          >
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden
                       ${menuOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="bg-[#0d1f2d]/98 backdrop-blur-md border-t border-white/10 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all
                          ${isActive(link.href)
                            ? 'text-[#00d4d4] bg-[#00d4d4]/10'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                          }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <Link to="/login" className="block px-4 py-3 text-sm font-medium text-white/70 hover:text-white">
              Sign In
            </Link>
            <BrandButton href="/contact" className="w-full justify-center">Get Started</BrandButton>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;